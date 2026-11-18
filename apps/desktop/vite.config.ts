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
