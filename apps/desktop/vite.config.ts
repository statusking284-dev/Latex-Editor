import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { spawn } from "node:child_process";

const host = process.env.TAURI_DEV_HOST;
const mupdfWasmFile = path.resolve(
  __dirname,
  "..",
  "..",
  "node_modules",
  "mupdf",
  "dist",
  "mupdf-wasm.wasm",
);

function tectonicCompilerPlugin() {
  return {
    name: "tectonic-compiler",
    configureServer(server: any) {
      server.middlewares.use("/api/compile", async (req: any, res: any) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end();
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "opal-tectonic-"));
          try {
            let rawBody = Buffer.concat(chunks).toString("utf-8");
            if (rawBody.charCodeAt(0) === 0xfeff) {
              rawBody = rawBody.slice(1);
            }
            const data = JSON.parse(rawBody.trim());
            let source = data.source || "";
            const mainFile = data.mainFile || "main.tex";
            const files = data.files || {};
            console.log(`[Compiler API] Compile requested for ${mainFile} (source length: ${source.length}, files: ${Object.keys(files).length})`);

            // Auto-heal common syntax typos in LaTeX code
            source = source.replace(/\\usepackage\[margin\s+([0-9.]+[a-zA-Z]+)\]\{geometry\}/g, "\\usepackage[margin=$1]{geometry}");
            if (!source.trim()) {
              source = "\\documentclass{article}\\begin{document}\\null\\end{document}";
            }

            for (const [relPath, content] of Object.entries(files)) {
              const fullP = path.join(tmpDir, relPath);
              fs.mkdirSync(path.dirname(fullP), { recursive: true });
              if (typeof content === "string") {
                fs.writeFileSync(fullP, content, "utf-8");
              } else if (Array.isArray(content)) {
                fs.writeFileSync(fullP, Buffer.from(content as number[]));
              }
            }

            const mainFilePath = path.join(tmpDir, mainFile);
            fs.mkdirSync(path.dirname(mainFilePath), { recursive: true });
            fs.writeFileSync(mainFilePath, source, "utf-8");

            // Provide placeholder image files for common icon references (phone, email, etc.)
            const fallbackImgPath = path.resolve(__dirname, "public", "tutorial", "sample-image.png");
            if (fs.existsSync(fallbackImgPath)) {
              const fallbackBuf = fs.readFileSync(fallbackImgPath);
              const commonIcons = [
                "phone", "email", "mail", "github", "linkedin", "location", "map-pin", "pin", "globe",
                "link", "web", "website", "calendar", "address", "user", "envelope", "code",
                "graduation-cap", "briefcase", "terminal", "book"
              ];
              const subdirs = ["ic", "icons", "images", "assets", "img"];
              for (const sub of subdirs) {
                fs.mkdirSync(path.join(tmpDir, sub), { recursive: true });
              }
              for (const icon of commonIcons) {
                const targetFiles = [
                  path.join(tmpDir, `${icon}.png`),
                  path.join(tmpDir, icon),
                ];
                for (const sub of subdirs) {
                  targetFiles.push(path.join(tmpDir, sub, `${icon}.png`));
                  targetFiles.push(path.join(tmpDir, sub, icon));
                }
                for (const tf of targetFiles) {
                  if (!fs.existsSync(tf)) {
                    fs.writeFileSync(tf, fallbackBuf);
                  }
                }
              }
            }

            const tectonicBin = path.resolve(__dirname, "..", "..", "bin", "tectonic.exe");

            const proc = spawn(
              tectonicBin,
              [mainFilePath, "--outdir", tmpDir, "--synctex", "--print"],
              { cwd: tmpDir },
            );

            let stdout = "";
            let stderr = "";
            proc.stdout.on("data", (d: Buffer) => {
              stdout += d.toString();
            });
            proc.stderr.on("data", (d: Buffer) => {
              stderr += d.toString();
            });

            proc.on("close", (code: number) => {
              const baseName = path.basename(mainFile, path.extname(mainFile));
              const pdfPath = path.join(tmpDir, `${baseName}.pdf`);

              if (code === 0 && fs.existsSync(pdfPath)) {
                const pdfBuffer = fs.readFileSync(pdfPath);
                console.log(`[Compiler API] Compile SUCCESS for ${mainFile} (${pdfBuffer.length} bytes)`);
                res.setHeader("Content-Type", "application/pdf");
                res.statusCode = 200;
                res.end(pdfBuffer);
              } else {
                console.error(`[Compiler API] Compile FAILED (exit code ${code}):`, stderr || stdout);
                res.statusCode = 400;
                res.setHeader("Content-Type", "text/plain");
                res.end(stderr || stdout || "Compilation failed");
              }

              try {
                fs.rmSync(tmpDir, { recursive: true, force: true });
              } catch {}
            });
          } catch (err: any) {
            try {
              fs.rmSync(tmpDir, { recursive: true, force: true });
            } catch {}
            res.statusCode = 500;
            res.end(String(err));
          }
        });
      });

      // ── DYNAMIC OLLAMA BRIDGE PROXY ──
      // Strictly connects to the exact user-specified endpoint.
      // Returns 502 if that exact IP/port is unreachable. Never falls back to hardcoded defaults.
      server.middlewares.use("/api/ollama-bridge", async (req: any, res: any) => {
        try {
          const parsedReqUrl = new URL(req.url, "http://localhost:1420");
          const targetEndpoint = req.headers["x-ollama-endpoint"] || parsedReqUrl.searchParams.get("endpoint");

          if (!targetEndpoint || typeof targetEndpoint !== "string") {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ error: "Missing required Ollama endpoint" }));
          }

          let parsedTarget: URL;
          try {
            const rawTarget = targetEndpoint.trim();
            parsedTarget = new URL(rawTarget.startsWith("http://") || rawTarget.startsWith("https://") ? rawTarget : `http://${rawTarget}`);
            if (parsedTarget.port) {
              const portNum = Number(parsedTarget.port);
              if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ error: `Invalid port ${parsedTarget.port}. Must be 1-65535.` }));
              }
            }
          } catch (e: any) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ error: `Invalid URL: ${targetEndpoint}` }));
          }

          const subPath = parsedReqUrl.pathname.replace(/^\/api\/ollama-bridge/, "") || "/api/tags";
          const destUrl = `${parsedTarget.origin}${subPath}`;

          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", async () => {
            const bodyData = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
            const httpModule = destUrl.startsWith("https:") ? await import("node:https") : await import("node:http");

            const fwdHeaders: Record<string, any> = {
              ...req.headers,
              host: parsedTarget.host,
            };
            delete fwdHeaders["x-ollama-endpoint"];
            if (bodyData) {
              fwdHeaders["content-length"] = bodyData.length;
            } else {
              delete fwdHeaders["content-length"];
            }

            const proxyReq = httpModule.request(
              destUrl,
              {
                method: req.method,
                headers: fwdHeaders,
                timeout: 30000,
              },
              (proxyRes) => {
                res.statusCode = proxyRes.statusCode || 200;
                for (const [k, v] of Object.entries(proxyRes.headers)) {
                  if (v) res.setHeader(k, v);
                }
                proxyRes.pipe(res);
              },
            );

            proxyReq.on("error", (err: any) => {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `Could not connect to Ollama at ${destUrl}: ${err.message}` }));
            });

            proxyReq.on("timeout", () => {
              proxyReq.destroy();
              res.statusCode = 504;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `Connection to ${destUrl} timed out.` }));
            });

            if (bodyData) {
              proxyReq.write(bodyData);
            }
            proxyReq.end();
          });
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), topLevelAwait(), tectonicCompilerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    __MUPDF_WASM_FS_PATH__: JSON.stringify(mupdfWasmFile.replace(/\\/g, "/")),
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["mupdf"],
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari14",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
