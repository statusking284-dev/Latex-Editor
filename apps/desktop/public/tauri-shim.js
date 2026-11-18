// Browser compatibility shim for running Opal Editor in standard web browsers (localhost)
(function () {
  if (typeof window === "undefined" || window.__TAURI_INTERNALS__) {
    return;
  }

  console.info("[Opal Browser Shim] Activating Tauri browser compatibility layer...");

  const callbacks = new Map();
  let nextCallbackId = 1;
  const eventListeners = new Map();
  let nextListenerId = 1;

  function normalizePath(p) {
    if (!p) return "/";
    return p.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "");
  }

  function valueToString(val) {
    if (typeof val === "string") return val;
    if (!val) return "";
    if (val instanceof Uint8Array || Array.isArray(val)) {
      try {
        return new TextDecoder().decode(new Uint8Array(val));
      } catch {}
    }
    if (typeof val === "object") {
      const keys = Object.keys(val).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      if (keys.length > 0) {
        const arr = new Uint8Array(keys.length);
        for (let i = 0; i < keys.length; i++) arr[i] = val[keys[i]];
        try {
          return new TextDecoder().decode(arr);
        } catch {}
      }
    }
    return String(val);
  }

  // Persistent Virtual File System backed by localStorage
  const VFS_STORAGE_KEY = "opal_browser_vfs";
  const VFS_DIRS_KEY = "opal_browser_vfs_dirs";

  const vfs = new Map();
  const vfsDirs = new Set(["/workspace", "/workspace/Documents", "/workspace/Documents/Opal"]);

  try {
    const savedDirs = localStorage.getItem(VFS_DIRS_KEY);
    if (savedDirs) {
      JSON.parse(savedDirs).forEach((d) => vfsDirs.add(d));
    }
    const savedFiles = localStorage.getItem(VFS_STORAGE_KEY);
    if (savedFiles) {
      const parsed = JSON.parse(savedFiles);
      for (const [k, v] of Object.entries(parsed)) {
        vfs.set(k, valueToString(v));
      }
    }
  } catch (e) {
    console.warn("[Opal Browser Shim] Failed to load persisted VFS", e);
  }

  function saveVfs() {
    try {
      const obj = {};
      for (const [k, v] of vfs.entries()) {
        obj[k] = v;
      }
      localStorage.setItem(VFS_STORAGE_KEY, JSON.stringify(obj));
      localStorage.setItem(VFS_DIRS_KEY, JSON.stringify(Array.from(vfsDirs)));
    } catch (e) {
      // ignore storage quota error
    }
  }

  window.__TAURI_INTERNALS__ = {
    transformCallback: function (callback, once) {
      const id = nextCallbackId++;
      callbacks.set(id, function (data) {
        if (once) callbacks.delete(id);
        return callback(data);
      });
      return id;
    },
    unregisterCallback: function (id) {
      callbacks.delete(id);
    },
    runCallback: function (id, data) {
      const cb = callbacks.get(id);
      if (cb) return cb(data);
    },
    callbacks: callbacks,
    metadata: {
      currentWindow: { label: "main" },
      currentWebview: { windowLabel: "main", label: "main" },
    },
    convertFileSrc: function (filePath, protocol) {
      const p = protocol || "asset";
      return "http://" + p + ".localhost/" + encodeURIComponent(filePath);
    },
    invoke: async function (cmd, args, options) {
      // Event plugin
      if (cmd === "plugin:event|listen") {
        const id = nextListenerId++;
        const eventName = args && args.event;
        const handlerId = args && args.handler;
        if (!eventListeners.has(eventName)) {
          eventListeners.set(eventName, new Set());
        }
        eventListeners.get(eventName).add(handlerId);
        return id;
      }
      if (cmd === "plugin:event|unlisten") {
        return null;
      }
      if (cmd === "plugin:event|emit") {
        const eventName = args && args.event;
        const payload = args && args.payload;
        const listeners = eventListeners.get(eventName);
        if (listeners) {
          for (const hid of listeners) {
            const cb = callbacks.get(hid);
            if (cb) cb({ event: eventName, payload: payload });
          }
        }
        return null;
      }

      // Window & Webview
      if (
        cmd === "plugin:window|show" ||
        cmd === "plugin:window|hide" ||
        cmd === "plugin:window|set_title" ||
        cmd === "plugin:webview|set_zoom" ||
        cmd === "plugin:webview|set_webview_zoom"
      ) {
        if (cmd === "plugin:window|set_title" && args && args.title) {
          document.title = args.title;
        }
        return null;
      }

      // App metadata
      if (cmd === "plugin:app|version" || cmd === "get_app_version") {
        return "1.5.0";
      }
      if (cmd === "plugin:app|name") {
        return "Opal";
      }
      if (cmd === "plugin:updater|check") {
        return null;
      }

      // Path plugin
      if (cmd === "plugin:path|resolve_directory") {
        return "/workspace/Documents/Opal";
      }
      if (cmd === "plugin:path|join") {
        const paths = (args && args.paths) || [];
        return normalizePath(paths.join("/"));
      }
      if (cmd === "plugin:path|normalize") {
        return normalizePath(args && args.path);
      }
      if (cmd === "plugin:path|resolve") {
        const paths = (args && args.paths) || [];
        return normalizePath(paths.join("/"));
      }
      if (cmd === "plugin:path|dirname") {
        const p = normalizePath(args && args.path);
        const parts = p.split("/");
        parts.pop();
        return parts.join("/") || "/";
      }
      if (cmd === "plugin:path|basename") {
        const p = normalizePath(args && args.path);
        return p.split("/").pop() || "";
      }
      if (cmd === "plugin:path|extname") {
        const p = normalizePath(args && args.path);
        const match = p.match(/\.[^.]+$/);
        return match ? match[0] : "";
      }
      if (cmd === "plugin:path|is_absolute") {
        const p = (args && args.path) || "";
        return p.startsWith("/") || /^[a-zA-Z]:/.test(p);
      }

      // Dialog plugin
      if (cmd === "plugin:dialog|open") {
        return null;
      }
      if (cmd === "plugin:dialog|save") {
        const defaultName =
          args && args.defaultPath
            ? args.defaultPath.split(/[/\\]/).pop() || "document.pdf"
            : "document.pdf";
        return "/downloads/" + defaultName;
      }
      if (cmd === "plugin:dialog|message" || cmd === "plugin:dialog|ask") {
        return true;
      }

      // Filesystem plugin
      if (cmd === "plugin:fs|exists") {
        const p = normalizePath(args && args.path);
        return vfs.has(p) || vfsDirs.has(p);
      }
      if (cmd === "plugin:fs|mkdir") {
        const p = normalizePath(args && args.path);
        vfsDirs.add(p);
        const parts = p.split("/");
        for (let i = 1; i < parts.length; i++) {
          vfsDirs.add(parts.slice(0, i).join("/") || "/");
        }
        saveVfs();
        return null;
      }
      if (cmd === "plugin:fs|write_file" || cmd === "plugin:fs|write_text_file") {
        let p = "";
        if (options && options.headers && options.headers.path) {
          p = decodeURIComponent(options.headers.path);
        } else if (args && args.path) {
          p = args.path;
        }
        p = normalizePath(p);

        let contentStr = "";
        let rawBytes = null;
        if (args instanceof Uint8Array) {
          rawBytes = args;
          try {
            contentStr = new TextDecoder().decode(args);
          } catch {}
        } else if (Array.isArray(args)) {
          rawBytes = new Uint8Array(args);
          try {
            contentStr = new TextDecoder().decode(rawBytes);
          } catch {}
        } else if (typeof args === "string") {
          contentStr = args;
        } else if (args && typeof args.contents === "string") {
          contentStr = args.contents;
        } else if (args && args.data) {
          if (typeof args.data === "string") {
            contentStr = args.data;
          } else if (args.data instanceof Uint8Array) {
            rawBytes = args.data;
            try {
              contentStr = new TextDecoder().decode(rawBytes);
            } catch {}
          } else if (Array.isArray(args.data)) {
            rawBytes = new Uint8Array(args.data);
            try {
              contentStr = new TextDecoder().decode(rawBytes);
            } catch {}
          }
        }

        // Store clean string in VFS for text files
        vfs.set(p, contentStr || rawBytes || "");
        // Ensure parent dirs
        const parts = p.split("/");
        for (let i = 1; i < parts.length; i++) {
          vfsDirs.add(parts.slice(0, i).join("/") || "/");
        }
        saveVfs();

        // Browser Download Trigger: ONLY when explicitly saving/exporting to /downloads/
        if (p.startsWith("/downloads/")) {
          try {
            const fileName = p.split("/").pop() || "document.pdf";
            let blob;
            if (p.endsWith(".pdf") || (rawBytes && !contentStr)) {
              const bytes = rawBytes || new TextEncoder().encode(contentStr);
              blob = new Blob([bytes], { type: "application/pdf" });
            } else if (p.endsWith(".zip")) {
              const bytes = rawBytes || new TextEncoder().encode(contentStr);
              blob = new Blob([bytes], { type: "application/zip" });
            } else {
              blob = new Blob([contentStr], { type: "text/plain;charset=utf-8" });
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 10000);
            console.info("[Opal Browser Shim] Download triggered for:", fileName);
          } catch (e) {
            console.error("[Opal Browser Shim] Download trigger failed:", e);
          }
        }

        return null;
      }
      if (cmd === "plugin:fs|read_text_file") {
        const p = normalizePath(args && args.path);
        if (vfs.has(p)) {
          const str = valueToString(vfs.get(p));
          return Array.from(new TextEncoder().encode(str));
        }
        throw new Error("File not found: " + p);
      }
      if (cmd === "plugin:fs|read_file") {
        const p = normalizePath(args && args.path);
        if (vfs.has(p)) {
          const val = vfs.get(p);
          if (val instanceof Uint8Array) return Array.from(val);
          if (Array.isArray(val)) return val;
          const str = valueToString(val);
          return Array.from(new TextEncoder().encode(str));
        }
        throw new Error("File not found: " + p);
      }
      if (cmd === "plugin:fs|read_dir") {
        const dirPath = normalizePath(args && args.path);
        const results = [];
        const seen = new Set();
        const prefix = dirPath === "/" ? "/" : dirPath + "/";
        for (const [fPath] of vfs.entries()) {
          if (fPath.startsWith(prefix)) {
            const rel = fPath.slice(prefix.length);
            const firstSegment = rel.split("/")[0];
            if (!seen.has(firstSegment)) {
              seen.add(firstSegment);
              const isDir = rel.includes("/");
              results.push({ name: firstSegment, isDirectory: isDir, isFile: !isDir, isSymlink: false });
            }
          }
        }
        for (const dPath of vfsDirs) {
          if (dPath.startsWith(prefix)) {
            const rel = dPath.slice(prefix.length);
            const firstSegment = rel.split("/")[0];
            if (firstSegment && !seen.has(firstSegment)) {
              seen.add(firstSegment);
              results.push({ name: firstSegment, isDirectory: true, isFile: false, isSymlink: false });
            }
          }
        }
        return results;
      }
      if (cmd === "plugin:fs|stat") {
        const p = normalizePath(args && args.path);
        const isDir = vfsDirs.has(p);
        const content = vfs.get(p);
        if (isDir || content !== undefined) {
          return {
            isFile: !isDir,
            isDirectory: isDir,
            isSymlink: false,
            size: isDir ? 0 : (content ? (typeof content === "string" ? new TextEncoder().encode(content).length : content.length) : 0),
            mtime: Date.now(),
            atime: Date.now(),
            birthtime: Date.now(),
          };
        }
        throw new Error("Path not found: " + p);
      }
      if (cmd === "plugin:fs|remove") {
        const p = normalizePath(args && args.path);
        vfs.delete(p);
        vfsDirs.delete(p);
        saveVfs();
        return null;
      }
      if (cmd === "plugin:fs|rename") {
        const from = normalizePath(args && (args.oldPath || args.from));
        const to = normalizePath(args && (args.newPath || args.to));
        if (vfs.has(from)) {
          vfs.set(to, vfs.get(from));
          vfs.delete(from);
          saveVfs();
        }
        return null;
      }
      if (cmd === "plugin:fs|copy_file") {
        const from = normalizePath(args && args.from);
        const to = normalizePath(args && args.to);
        if (vfs.has(from)) {
          vfs.set(to, vfs.get(from));
          saveVfs();
        }
        return null;
      }

      // Opal custom commands
      if (cmd === "allow_project_directory") {
        return null;
      }
      if (cmd === "detect_editors") {
        return [];
      }
      if (cmd === "ai_list_providers") {
        return [];
      }
      if (cmd === "ai_list_models") {
        return [];
      }
      if (cmd === "ai_set_active_provider") {
        return null;
      }
      if (cmd === "read_clipboard_file_paths") {
        return [];
      }
      if (cmd === "search_references") {
        return [];
      }
      if (cmd === "history_list") {
        return [];
      }
      if (cmd === "history_diff") {
        return [];
      }
      if (cmd === "get_system_info") {
        return { os: "browser", arch: "wasm", memory: "16GB" };
      }
      if (cmd === "detect_texlive") {
        return { installed: false, version: null };
      }
      if (cmd === "check_uv_status" || cmd === "check_uv_installed") {
        return { installed: false, path: null };
      }
      if (cmd === "get_default_reviewer_name") {
        return "Reviewer";
      }
      if (cmd === "format_latex") {
        return (args && args.source) || "";
      }
      if (cmd === "synctex_edit") {
        return { file: "main.tex", line: 1 };
      }
      if (cmd === "synctex_view") {
        return { page: 1, x: 100, y: 100, width: 200, height: 20 };
      }
      if (cmd === "synctex_view_batch") {
        const targets = (args && args.targets) || [];
        return targets.map(() => null);
      }
      if (cmd === "export_project_zip") {
        const dest = (args && args.destination) || "/downloads/project.zip";
        return { fileCount: 1, zipPath: dest };
      }
      // LIVE REAL-TIME LATEX COMPILATION
      if (cmd === "compile_latex") {
        const projectDir = normalizePath(args && args.projectDir);
        const mainFile = (args && args.mainFile) || "main.tex";
        const mainPath = normalizePath(projectDir + "/" + mainFile);
        let source = "";
        const projectFiles = {};

        // 1. Try reading directly from active Zustand documentStore in memory
        if (window.__opal_documentStore) {
          try {
            const docState = window.__opal_documentStore.getState();
            if (docState && docState.files) {
              for (const f of docState.files) {
                const rel = f.relativePath || f.name;
                if (f.content != null) {
                  projectFiles[rel] = f.content;
                }
                if (f.name === mainFile || f.relativePath === mainFile) {
                  source = f.content || "";
                }
              }
              if (!source && docState.activeFileId) {
                const active = docState.files.find((f) => f.id === docState.activeFileId);
                if (active && active.content) {
                  source = active.content;
                }
              }
            }
          } catch (e) {
            console.warn("[Opal Browser Shim] Reading from documentStore:", e);
          }
        }

        // 2. Fallback to VFS
        if (!source) {
          source = valueToString(vfs.get(mainPath));
        }
        source = valueToString(source);
        if (!source.trim()) {
          for (const [k, v] of vfs.entries()) {
            const strVal = valueToString(v);
            if (strVal.trim() && (k.endsWith("/" + mainFile) || k === mainFile || k.endsWith(".tex"))) {
              source = strVal;
              break;
            }
          }
        }

        // 3. Merge VFS files for any images or secondary files
        const prefix = projectDir === "/" ? "/" : projectDir + "/";
        for (const [fPath, fContent] of vfs.entries()) {
          const rel = fPath.startsWith(prefix) ? fPath.slice(prefix.length) : fPath.split("/").pop();
          if (rel && !projectFiles[rel]) {
            projectFiles[rel] = valueToString(fContent);
          }
        }

        console.info(`[Opal Compiler] Compiling ${mainFile} (source length: ${(source || "").length})`);

        try {
          const resp = await fetch("/api/compile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: source || "",
              mainFile: mainFile,
              files: projectFiles,
            }),
          });

          if (resp.ok) {
            return await resp.arrayBuffer();
          } else {
            const errMsg = await resp.text();
            throw new Error(errMsg || "Compilation failed");
          }
        } catch (e) {
          console.error("[Opal Compiler]", e);
          throw e;
        }
      }

      console.debug("[Opal Browser Shim] Unhandled Tauri command:", cmd, args);
      if (cmd.includes("list") || cmd.includes("search") || cmd.includes("detect")) {
        return [];
      }
      return null;
    },
  };

  window.__TAURI_EVENT_PLUGIN_INTERNALS__ = {
    unregisterListener: function (event, id) {
      callbacks.delete(id);
    },
  };
})();
