import { useState, useRef } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { mkdir, writeTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { homeDir, join } from "@tauri-apps/api/path";
import {
  ArrowRightIcon,
  FileArchiveIcon,
  GithubIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  importGitHubProject,
  importZipProject,
  type ProjectImportResult,
} from "@/lib/project-import";

type ImportKind = "zip" | "github";

interface ProjectImportDialogProps {
  open: boolean;
  defaultDestination?: string | null;
  onOpenChange: (open: boolean) => void;
  onImported: (projectPath: string) => Promise<void>;
}

/**
 * Extract an arrayBuffer representing a ZIP archive directly into project files.
 * Works seamlessly across both desktop Tauri and web browser runtime.
 */
async function extractZipArrayBuffer(
  arrayBuffer: ArrayBuffer,
  projectName: string,
  baseDestination?: string | null,
): Promise<ProjectImportResult> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(arrayBuffer);

  const cleanBaseName =
    projectName
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase() || "imported-project";

  let baseFolder = baseDestination;
  if (!baseFolder) {
    try {
      const home = await homeDir();
      if (home) baseFolder = await join(home, "Documents", "Opal");
    } catch {}
  }
  if (!baseFolder) {
    baseFolder = "/workspace/Documents/Opal";
  }

  await mkdir(baseFolder, { recursive: true });
  const projectPath = await join(baseFolder, cleanBaseName);
  await mkdir(projectPath, { recursive: true });

  let fileCount = 0;
  const entries = Object.entries(zip.files);
  const filePaths = entries.filter(([_, entry]) => !entry.dir).map(([p]) => p);

  // Check if all files are inside a common root directory (e.g. repo-main/...)
  let commonPrefix = "";
  if (filePaths.length > 0) {
    const firstSlash = filePaths[0].indexOf("/");
    if (firstSlash > 0) {
      const candidatePrefix = filePaths[0].slice(0, firstSlash + 1);
      if (filePaths.every((p) => p.startsWith(candidatePrefix))) {
        commonPrefix = candidatePrefix;
      }
    }
  }

  for (const [rawRelPath, entry] of entries) {
    if (entry.dir) continue;
    // Skip macOS metadata and dotfiles
    if (
      rawRelPath.startsWith("__MACOSX/") ||
      rawRelPath.includes("/.DS_Store") ||
      rawRelPath === ".DS_Store" ||
      rawRelPath.includes("Thumbs.db")
    ) {
      continue;
    }

    const relPath =
      commonPrefix && rawRelPath.startsWith(commonPrefix)
        ? rawRelPath.slice(commonPrefix.length)
        : rawRelPath;

    if (!relPath) continue;

    const fullFilePath = await join(projectPath, relPath);
    const pathParts = fullFilePath.split(/[/\\]/);
    pathParts.pop();
    const parentDir = pathParts.join(fullFilePath.includes("\\") ? "\\" : "/");
    if (parentDir) {
      await mkdir(parentDir, { recursive: true });
    }

    const isBinary =
      /\.(png|jpe?g|gif|webp|svg|pdf|eps|bmp|ico|ttf|otf|woff2?|eot|zip|tar|gz)$/i.test(
        relPath,
      );
    if (isBinary) {
      const bytes = await entry.async("uint8array");
      await writeFile(fullFilePath, bytes);
    } else {
      const text = await entry.async("string");
      await writeTextFile(fullFilePath, text);
    }
    fileCount++;
  }

  if (fileCount === 0) {
    throw new Error("No readable files were found inside the ZIP archive.");
  }

  return { projectPath, fileCount };
}

export function ProjectImportDialog({
  open: isOpen,
  defaultDestination,
  onOpenChange,
  onImported,
}: ProjectImportDialogProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [importing, setImporting] = useState<ImportKind | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const chooseDestination = async (): Promise<string | null> => {
    try {
      const destination = await open({
        directory: true,
        multiple: false,
        title: "Choose Where to Save the Imported Project",
        defaultPath: defaultDestination ?? undefined,
      });
      return typeof destination === "string" ? destination : null;
    } catch {
      return defaultDestination ?? "/workspace/Documents/Opal";
    }
  };

  const finishImport = async (
    importKind: ImportKind,
    operation: (destination: string) => Promise<ProjectImportResult>,
  ) => {
    const destination = await chooseDestination();
    if (!destination) return;

    setImporting(importKind);
    let result: ProjectImportResult;
    try {
      result = await operation(destination);
    } catch (error) {
      toast.error("Could not import project", {
        description: error instanceof Error ? error.message : String(error),
      });
      return;
    } finally {
      setImporting(null);
    }

    toast.success("Project imported", {
      description: `${result.fileCount} files saved to ${result.projectPath}`,
    });
    onOpenChange(false);
    try {
      await onImported(result.projectPath);
    } catch (error) {
      toast.error("The project was imported but could not be opened", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleZipImportClick = async () => {
    const isBrowserShim =
      typeof window !== "undefined" &&
      ((window as any).__TAURI_BROWSER_SHIM__ ||
        !(window as any).__TAURI_INTERNALS__);

    if (isBrowserShim) {
      fileInputRef.current?.click();
      return;
    }

    try {
      const archive = await open({
        directory: false,
        multiple: false,
        title: "Import LaTeX Project from ZIP",
        filters: [{ name: "ZIP archive", extensions: ["zip"] }],
      });
      if (typeof archive === "string") {
        await finishImport("zip", (destination) =>
          importZipProject(archive, destination),
        );
        return;
      }
    } catch (e) {
      console.warn("Desktop open dialog fallback:", e);
    }

    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setImporting("zip");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const rawName = file.name.replace(/\.zip$/i, "");
      const result = await extractZipArrayBuffer(
        arrayBuffer,
        rawName,
        defaultDestination,
      );

      toast.success("Project imported", {
        description: `${result.fileCount} files imported into ${result.projectPath}`,
      });
      onOpenChange(false);
      await onImported(result.projectPath);
    } catch (error) {
      console.error("ZIP import error:", error);
      toast.error("Could not import ZIP project", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setImporting(null);
    }
  };

  const handleGitHubImport = async (event: React.FormEvent) => {
    event.preventDefault();
    const repositoryUrl = githubUrl.trim();
    if (!repositoryUrl) return;

    const isBrowserShim =
      typeof window !== "undefined" &&
      ((window as any).__TAURI_BROWSER_SHIM__ ||
        !(window as any).__TAURI_INTERNALS__);

    if (!isBrowserShim) {
      await finishImport("github", (destination) =>
        importGitHubProject(repositoryUrl, destination),
      );
      return;
    }

    // Browser-based GitHub import
    setImporting("github");
    try {
      const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) throw new Error("Invalid GitHub repository URL format.");
      const [_, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/i, "");

      const zipUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/zipball`;
      const res = await fetch(zipUrl);
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? "Repository not found. Please ensure it is a public repository."
            : `GitHub responded with status ${res.status}: ${res.statusText}`,
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      const result = await extractZipArrayBuffer(
        arrayBuffer,
        cleanRepo,
        defaultDestination,
      );

      toast.success("Project imported from GitHub", {
        description: `${result.fileCount} files imported into ${result.projectPath}`,
      });
      onOpenChange(false);
      await onImported(result.projectPath);
    } catch (error) {
      console.error("GitHub import error:", error);
      toast.error("Could not import GitHub project", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setImporting(null);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!importing) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="rounded-2xl border-border/80 bg-card/98 p-6 shadow-xl backdrop-blur-md sm:max-w-lg">
        <DialogHeader className="space-y-1.5 pb-1">
          <DialogTitle className="font-serif text-2xl text-foreground tracking-tight">
            Import a Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
            Bring in an Overleaf export, a downloaded LaTeX template archive, or
            a public GitHub repository.
          </DialogDescription>
        </DialogHeader>

        {/* Hidden file input for browser file uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={handleFileInputChange}
          tabIndex={-1}
        />

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleZipImportClick}
            disabled={importing !== null}
            className="group flex w-full items-center gap-3.5 rounded-2xl border border-border/80 bg-background/50 p-4 text-left transition-all hover:border-primary/40 hover:bg-muted/60 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              {importing === "zip" ? (
                <Loader2Icon className="size-5 animate-spin text-primary" />
              ) : (
                <FileArchiveIcon className="size-5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-foreground text-sm">
                Choose ZIP file
              </span>
              <span className="mt-0.5 block text-muted-foreground text-xs">
                Overleaf exports, arXiv packages, and downloaded LaTeX templates
              </span>
            </span>
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </button>

          <div className="rounded-2xl border border-border/80 bg-background/30 p-4">
            <div className="mb-3 flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                {importing === "github" ? (
                  <Loader2Icon className="size-5 animate-spin text-primary" />
                ) : (
                  <GithubIcon className="size-5" />
                )}
              </span>
              <span>
                <span className="block font-medium text-foreground text-sm">
                  Import from GitHub
                </span>
                <span className="mt-0.5 block text-muted-foreground text-xs">
                  Downloads the default branch of a public repository
                </span>
              </span>
            </div>
            <form
              className="flex gap-2"
              onSubmit={handleGitHubImport}
              aria-label="Import public GitHub repository"
            >
              <Input
                type="url"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                placeholder="https://github.com/owner/repository"
                aria-label="GitHub repository URL"
                disabled={importing !== null}
                className="rounded-xl border-border/80 bg-background/80"
                required
                pattern="https://github\.com/[^/]+/[^/]+/?"
              />
              <Button
                type="submit"
                disabled={importing !== null || !githubUrl.trim()}
                className="rounded-xl"
              >
                Import
              </Button>
            </form>
          </div>

          <p className="px-1 text-[11px] text-muted-foreground leading-5">
            Your manuscript files remain 100% private and local on your machine.
            GitHub import currently supports public repositories.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
