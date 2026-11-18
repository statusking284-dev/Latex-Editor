import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { open } from "@tauri-apps/plugin-dialog";
import { mkdir, writeTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { homeDir } from "@tauri-apps/api/path";
import { toast } from "sonner";
import {
  FolderOpenIcon,
  FolderPlusIcon,
  ClockIcon,
  XIcon,
  FileTextIcon,
  SparklesIcon,
  CheckCircle2Icon,
  SettingsIcon,
  Loader2Icon,
  RefreshCwIcon,
  ArrowUpCircleIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  ShieldCheckIcon,
  WifiOffIcon,
  ImportIcon,
} from "lucide-react";
import { useProjectStore } from "@/stores/project-store";
import { useDocumentStore } from "@/stores/document-store";
import { useUpdater } from "@/hooks/use-updater";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProjectWizard, type CreationMode } from "./project-wizard";
import { SettingsDialog } from "./settings-dialog";
import { exists, join } from "@/lib/tauri/fs";
import { cn } from "@/lib/utils";
import { getTemplateById, getTemplateSkeleton } from "@/lib/template-registry";
import { VelumMark, VelumWordmark } from "@/components/brand/velum-brand";
import { DEFAULT_AI_PROJECT_GUIDE } from "@/lib/default-ai-project-guide";
import { OnboardingPrompt } from "@/components/onboarding-prompt";
import { useOnboardingStore } from "@/stores/onboarding-store";
import {
  TUTORIAL_BIB,
  TUTORIAL_MAIN_TEX,
  TUTORIAL_SAMPLE_IMAGE_NAME,
  TUTORIAL_SAMPLE_IMAGE_URL,
} from "@/lib/tutorial-project";
import { ProjectImportDialog } from "./project-import-dialog";

function randomProjectName(): string {
  const adjectives = ["swift", "bright", "calm", "bold", "keen"];
  const nouns = ["paper", "draft", "note", "study", "folio"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const id = Math.random().toString(36).slice(2, 6);
  return `${adj}-${noun}-${id}`;
}

export function ProjectPicker() {
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [wizardMode, setWizardMode] = useState<CreationMode | null>(null);
  const [appVersion, setAppVersion] = useState("");
  const [isCreatingBlank, setIsCreatingBlank] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreatingTutorial, setIsCreatingTutorial] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [openingPath, setOpeningPath] = useState<string | null>(null);
  const { status: updateStatus, checkForUpdate, installUpdate } = useUpdater();

  const recentProjects = useProjectStore((s) => s.recentProjects);
  const addRecentProject = useProjectStore((s) => s.addRecentProject);
  const removeRecentProject = useProjectStore((s) => s.removeRecentProject);
  const lastProjectFolder = useProjectStore((s) => s.lastProjectFolder);
  const setLastProjectFolder = useProjectStore((s) => s.setLastProjectFolder);
  const openProject = useDocumentStore((s) => s.openProject);
  const hasSeenOffer = useOnboardingStore((s) => s.hasSeenOffer);
  const markOfferSeen = useOnboardingStore((s) => s.markOfferSeen);
  const startTutorial = useOnboardingStore((s) => s.startTutorial);

  useEffect(() => {
    getVersion().then(setAppVersion);
  }, []);

  useEffect(() => {
    if (!hasSeenOffer && recentProjects.length > 0) markOfferSeen();
  }, [hasSeenOffer, markOfferSeen, recentProjects.length]);

  // Allow the command palette to open Settings from the launch screen.
  useEffect(() => {
    const handler = () => setShowSettings(true);
    window.addEventListener("open-settings", handler);
    return () => window.removeEventListener("open-settings", handler);
  }, []);

  const handleOpenFolder = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Open Project Folder",
    });
    if (selected) {
      setOpeningPath(selected);
      try {
        await openProject(selected);
        addRecentProject(selected);
      } catch (err) {
        toast.error("Failed to open project", {
          description: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setOpeningPath(null);
      }
    }
  };

  // Reorder the recent-projects list only once the project has actually
  // finished loading, so the list doesn't shift under the user's cursor
  // while `openProject` is still scanning/reading files.
  const handleOpenRecent = async (path: string) => {
    if (openingPath) return;
    setOpeningPath(path);
    try {
      await openProject(path);
      addRecentProject(path);
    } catch (err) {
      toast.error("Failed to open project", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setOpeningPath(null);
    }
  };

  const handleImportedProject = async (path: string) => {
    const pathParts = path.split(/[/\\]/);
    pathParts.pop();
    const parent = pathParts.join(path.includes("\\") ? "\\" : "/");
    if (parent) setLastProjectFolder(parent);
    setOpeningPath(path);
    try {
      await openProject(path);
      addRecentProject(path);
    } catch (err) {
      toast.error("Failed to open project", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setOpeningPath(null);
    }
  };

  const handleSelectMode = (mode: CreationMode) => {
    setShowModeDialog(false);
    setWizardMode(mode);
  };

  const handleCreateBlankDocument = async () => {
    setIsCreatingBlank(true);
    try {
      const template = getTemplateById("blank");
      if (!template) throw new Error("Blank template is not available");

      let baseFolder = lastProjectFolder;
      if (!baseFolder) {
        const home = await homeDir();
        if (!home) throw new Error("Could not find your home directory");
        baseFolder = await join(home, "Documents", "Opal");
      }
      await mkdir(baseFolder, { recursive: true });

      const projectPath = await join(baseFolder, randomProjectName());
      await mkdir(projectPath, { recursive: true });

      const aiGuidePath = await join(projectPath, "AGENTS.md");
      if (!(await exists(aiGuidePath))) {
        await writeTextFile(aiGuidePath, DEFAULT_AI_PROJECT_GUIDE);
      }

      const mainTexPath = await join(projectPath, template.mainFileName);
      if (!(await exists(mainTexPath))) {
        await writeTextFile(mainTexPath, getTemplateSkeleton(template));
      }

      setShowModeDialog(false);
      setLastProjectFolder(baseFolder);
      await openProject(projectPath);
      addRecentProject(projectPath);
    } catch (err) {
      toast.error("Failed to create blank document", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsCreatingBlank(false);
    }
  };

  const handleCreateTutorial = async () => {
    setIsCreatingTutorial(true);
    try {
      let baseFolder = lastProjectFolder;
      if (!baseFolder) {
        const home = await homeDir();
        baseFolder = await join(home, "Documents", "Opal");
      }
      await mkdir(baseFolder, { recursive: true });
      const projectPath = await join(baseFolder, "Learn-LaTeX");
      await mkdir(projectPath, { recursive: true });
      const mainPath = await join(projectPath, "main.tex");
      const bibPath = await join(projectPath, "references.bib");
      if (!(await exists(mainPath)))
        await writeTextFile(mainPath, TUTORIAL_MAIN_TEX);
      if (!(await exists(bibPath))) await writeTextFile(bibPath, TUTORIAL_BIB);
      const imagePath = await join(projectPath, TUTORIAL_SAMPLE_IMAGE_NAME);
      if (!(await exists(imagePath))) {
        try {
          const response = await fetch(TUTORIAL_SAMPLE_IMAGE_URL);
          const bytes = new Uint8Array(await response.arrayBuffer());
          await writeFile(imagePath, bytes);
        } catch {
          // The figure step still teaches the syntax if the sample image can't
          // be copied; the learner can point it at their own image instead.
        }
      }
      setLastProjectFolder(baseFolder);
      startTutorial(projectPath);
      await openProject(projectPath);
      addRecentProject(projectPath);
    } catch (error) {
      toast.error("Failed to create tutorial", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsCreatingTutorial(false);
    }
  };

  if (wizardMode) {
    return (
      <ProjectWizard mode={wizardMode} onBack={() => setWizardMode(null)} />
    );
  }

  return (
    <div className="welcome-stage relative flex h-full items-center justify-center overflow-hidden bg-background">
      <OnboardingPrompt
        open={!hasSeenOffer && recentProjects.length === 0}
        isCreating={isCreatingTutorial}
        onLearn={handleCreateTutorial}
        onSkip={markOfferSeen}
      />
      <button
        type="button"
        className="absolute top-6 right-6 z-20 flex size-9 items-center justify-center rounded-xl border border-border/80 bg-card/75 text-muted-foreground shadow-xs backdrop-blur-md transition-all hover:border-border hover:bg-card hover:text-foreground hover:shadow-sm active:scale-95"
        title="Settings & Preferences"
        aria-label="Open settings"
        onClick={() => setShowSettings(true)}
      >
        <SettingsIcon className="size-4 transition-transform group-hover:rotate-45" />
      </button>
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <ProjectImportDialog
        open={showImportDialog}
        defaultDestination={lastProjectFolder}
        onOpenChange={setShowImportDialog}
        onImported={handleImportedProject}
      />

      <main className="relative z-[1] grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:items-center">
        {/* Left Column: Branding, Hero, Capabilities */}
        <section className="max-w-xl">
          {/* Brand header */}
          <div className="mb-7 flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs ring-1 ring-primary/5">
              <VelumMark className="size-7" />
            </div>
            <div className="flex flex-col gap-1">
              <VelumWordmark showTagline={false} />
              <VersionBadge
                version={appVersion}
                updateStatus={updateStatus}
                onCheck={checkForUpdate}
                onInstall={installUpdate}
              />
            </div>
          </div>

          {/* Eyebrow badge */}
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 font-mono font-medium text-primary text-[10.5px] uppercase tracking-[0.16em]">
            <span className="size-1.5 rounded-full bg-primary/80" />
            Scholarly Manuscript Studio
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.08] tracking-[-0.03em] text-foreground">
            Where research becomes{" "}
            <span className="block font-normal italic text-primary/95 mt-1 sm:inline sm:mt-0">
              timeless literature.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-muted-foreground text-[14.5px] leading-relaxed font-sans">
            A tactile, distraction-free environment crafted for academic papers, theses, and books. Featuring instant offline Tectonic typesetting, rich bibliography tools, and live synchronized PDF review beside your source.
          </p>

          {/* Feature indicators */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card">
              <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                <WifiOffIcon className="size-3" />
              </span>
              <span className="font-medium text-foreground/90">Embedded offline compiler</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card">
              <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheckIcon className="size-3" />
              </span>
              <span className="font-medium text-foreground/90">Private & local storage</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card">
              <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                <SparklesIcon className="size-3" />
              </span>
              <span className="font-medium text-foreground/90">SyncTeX bidirectional jump</span>
            </div>
          </div>
        </section>

        {/* Right Column: Manuscript Actions & Recent Work */}
        <section
          aria-label="Start writing"
          className="rounded-[1.75rem] border border-border/80 bg-card/95 p-3 sm:p-3.5 shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--foreground)_18%,transparent),0_1px_3px_color-mix(in_oklab,var(--foreground)_5%,transparent)] backdrop-blur-md"
        >
          {/* Top row actions: New manuscript & Open project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5">
            <button
              type="button"
              onClick={() => setShowModeDialog(true)}
              className="group relative flex h-[52px] items-center justify-between rounded-xl bg-primary px-4 font-medium text-primary-foreground text-sm shadow-[0_4px_16px_-2px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-all hover:bg-primary/92 hover:shadow-[0_6px_20px_-2px_color-mix(in_oklab,var(--primary)_50%,transparent)] active:scale-[0.99]"
            >
              <span className="flex items-center gap-2.5 font-medium tracking-tight">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <FolderPlusIcon className="size-4" />
                </span>
                New manuscript
              </span>
              <ArrowRightIcon className="size-4 opacity-80 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleOpenFolder}
              className="group flex h-[52px] items-center justify-between rounded-xl border border-border/80 bg-secondary/50 px-4 font-medium text-foreground text-sm transition-all hover:border-border hover:bg-secondary/80 active:scale-[0.99]"
            >
              <span className="flex items-center gap-2.5 font-medium tracking-tight">
                <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                  <FolderOpenIcon className="size-4" />
                </span>
                Open project
              </span>
              <span className="text-[11px] font-mono text-muted-foreground opacity-60">Folder</span>
            </button>
          </div>

          {/* Import project card */}
          <button
            type="button"
            onClick={() => setShowImportDialog(true)}
            className="group mx-1.5 my-1.5 flex w-[calc(100%-0.75rem)] items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-3 text-left transition-all hover:border-border hover:bg-muted/60 active:scale-[0.995]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
              <ImportIcon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-sm text-foreground">
                Import a project
              </span>
              <span className="block text-muted-foreground text-xs">
                ZIP archive or public GitHub repository
              </span>
            </span>
            <ArrowRightIcon className="size-4 text-muted-foreground/70 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
          </button>

          {/* Tutorial / Onboarding card */}
          <button
            type="button"
            onClick={handleCreateTutorial}
            disabled={isCreatingTutorial}
            className="group mx-1.5 mb-2 flex w-[calc(100%-0.75rem)] items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.07] p-3 text-left transition-all hover:border-primary/35 hover:bg-primary/[0.11] active:scale-[0.995] disabled:opacity-60"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              {isCreatingTutorial ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <BookOpenCheckIcon className="size-4" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-sm text-foreground">
                New to LaTeX? Start here
              </span>
              <span className="mt-0.5 block text-muted-foreground text-xs">
                Interactive guide · Build a first paper in five minutes
              </span>
            </span>
            <ArrowRightIcon className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Recent work list */}
          <div className="border-border/70 border-t mx-1.5 pt-3 pb-1">
            <div className="mb-2.5 flex items-center justify-between px-1.5 text-muted-foreground text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <ClockIcon className="size-3.5 text-muted-foreground" />
                Recent work
                {recentProjects.length > 0 && (
                  <span className="rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                    {recentProjects.length}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <kbd className="rounded border border-border/80 bg-muted/80 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                  ⌘K
                </kbd>
                <span>commands</span>
              </span>
            </div>

            {recentProjects.length > 0 ? (
              <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                {recentProjects.map((project) => {
                  const isOpeningThis = openingPath === project.path;
                  const isBlocked = openingPath !== null && !isOpeningThis;
                  return (
                    <div
                      key={project.path}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all",
                        isOpeningThis && "bg-muted",
                        !isBlocked && "hover:bg-muted/70 hover:shadow-2xs",
                        isBlocked && "opacity-50",
                      )}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        {isOpeningThis ? (
                          <Loader2Icon className="size-4 animate-spin text-primary" />
                        ) : (
                          <FileTextIcon className="size-4" />
                        )}
                      </div>
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 flex-col items-start text-left disabled:cursor-not-allowed"
                        disabled={openingPath !== null}
                        onClick={() => handleOpenRecent(project.path)}
                      >
                        <span className="w-full truncate font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </span>
                        <span className="w-full truncate font-mono text-[10.5px] text-muted-foreground">
                          {isOpeningThis ? "Opening manuscript…" : project.path}
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 rounded-lg opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        disabled={openingPath !== null}
                        aria-label={`Remove ${project.name} from recent projects`}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeRecentProject(project.path);
                        }}
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 p-6 text-center text-muted-foreground">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/60">
                  <FileTextIcon className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground/80 text-xs">No recent manuscripts yet</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Create a new manuscript or open an existing folder to begin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* New Project mode selection dialog */}
      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent showCloseButton={true} className="sm:max-w-lg border-border/80 bg-card/98 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <DialogHeader className="space-y-1.5 pb-2">
            <DialogTitle className="font-serif text-2xl tracking-tight text-foreground">
              Create New Manuscript
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Choose how you would like to initiate your document workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSelectMode("template")}
              className="group relative flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 text-left transition-all hover:border-primary/40 hover:bg-primary/[0.08] hover:shadow-xs active:scale-[0.99]"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-105">
                <SparklesIcon className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                  <span>Guided Setup</span>
                  <span className="rounded-full bg-primary/12 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-primary uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                  Select from academic templates with intelligent structure and sample figures.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
                <span>Browse templates</span>
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={handleCreateBlankDocument}
              disabled={isCreatingBlank}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border/80 bg-background/50 p-5 text-left transition-all hover:border-foreground/20 hover:bg-muted/50 hover:shadow-xs active:scale-[0.99] disabled:opacity-60"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-transform group-hover:scale-105 group-hover:text-foreground">
                {isCreatingBlank ? (
                  <Loader2Icon className="size-5 animate-spin text-primary" />
                ) : (
                  <FileTextIcon className="size-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">
                  Blank Document
                </div>
                <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                  Start fresh with a minimal scholarly LaTeX document and clean preamble.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                <span>Quick blank start</span>
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Version Badge with Update Status ───

function VersionBadge({
  version,
  updateStatus,
  onCheck,
  onInstall,
}: {
  version: string;
  updateStatus: import("@/hooks/use-updater").UpdateStatus;
  onCheck: () => void;
  onInstall: () => void;
}) {
  if (!version) return null;

  switch (updateStatus.state) {
    case "available":
      return (
        <button
          onClick={onInstall}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-0.5 text-primary text-[11px] font-medium transition-all hover:bg-primary/20 hover:scale-[1.02]"
        >
          <ArrowUpCircleIcon className="size-3" />
          <span>v{updateStatus.version} available · Click to update</span>
        </button>
      );

    case "downloading":
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-2.5 py-0.5 text-muted-foreground text-[11px]">
          <Loader2Icon className="size-3 animate-spin text-primary" />
          <span>Downloading update {updateStatus.percent}%</span>
        </div>
      );

    case "installing":
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-2.5 py-0.5 text-muted-foreground text-[11px]">
          <Loader2Icon className="size-3 animate-spin text-primary" />
          <span>Installing update…</span>
        </div>
      );

    case "ready":
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-emerald-700 text-[11px] font-medium">
          <CheckCircle2Icon className="size-3 text-emerald-600" />
          <span>Update complete · Restarting</span>
        </div>
      );

    case "checking":
      return (
        <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
          <Loader2Icon className="size-3 animate-spin text-muted-foreground" />
          <span>v{version} · checking updates…</span>
        </div>
      );

    case "error":
      return (
        <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
          <span>v{version}</span>
          <span className="opacity-40">·</span>
          <button
            onClick={onCheck}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCwIcon className="size-3" />
            <span>Retry</span>
          </button>
        </div>
      );

    case "up-to-date":
      return (
        <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
          <span>v{version}</span>
          <span className="opacity-40">·</span>
          <button
            onClick={onCheck}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Click to check again"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Up to date</span>
          </button>
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
          <span>v{version}</span>
          <span className="opacity-40">·</span>
          <button
            onClick={onCheck}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCwIcon className="size-3 opacity-70" />
            <span>Check for updates</span>
          </button>
        </div>
      );
  }
}
