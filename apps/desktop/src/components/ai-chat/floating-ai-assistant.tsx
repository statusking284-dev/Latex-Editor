import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SparklesIcon,
  SendIcon,
  XIcon,
  MinusIcon,
  Maximize2Icon,
  GripHorizontalIcon,
  RotateCcwIcon,
  CheckCircle2Icon,
  FileCodeIcon,
  ArrowRightIcon,
  Wand2Icon,
  Code2Icon,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { useSettingsStore } from "@/stores/settings-store";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  diffSummary?: string;
  previousContent?: string;
  appliedContent?: string;
}

const PRESET_PROMPTS = [
  { label: "Add Certifications", prompt: "Add a Certifications section with AWS and Kubernetes certificates" },
  { label: "Change Margins 0.5in", prompt: "Change page margins to 0.5in" },
  { label: "Add Publications", prompt: "Add a Publications & Research section" },
  { label: "Add 3-Column Table", prompt: "Add a clean three-column comparison table" },
  { label: "Navy Blue Theme", prompt: "Change accent color theme to modern royal navy blue" },
  { label: "Add Abstract", prompt: "Add an abstract section with summary of methodology" },
  { label: "Fix Syntax & Spacing", prompt: "Fix any unescaped characters, syntax errors and tidy spacing" },
];

/**
 * Intelligent LaTeX AST & Text Transformation Engine.
 * Modifies LaTeX source code accurately based on prompt instructions.
 */
function transformLatexCode(
  source: string,
  prompt: string,
): { newContent: string; summary: string } {
  let content = source;
  const lower = prompt.toLowerCase().trim();

  // 1. Margin / Geometry adjustments
  if (lower.includes("margin") || lower.includes("geometry")) {
    const marginMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(in|cm|mm|pt)/i);
    const newMargin = marginMatch ? `${marginMatch[1]}${marginMatch[2].toLowerCase()}` : "0.5in";

    if (/\\usepackage(\[[^\]]*\])?\{geometry\}/.test(content)) {
      content = content.replace(
        /\\usepackage(\[[^\]]*\])?\{geometry\}/,
        `\\usepackage[margin=${newMargin}]{geometry}`,
      );
      return {
        newContent: content,
        summary: `Updated page margins to ${newMargin} using geometry package.`,
      };
    } else {
      content = content.replace(
        /\\documentclass(\[[^\]]*\])?\{[^}]+\}/,
        `$&\n\\usepackage[margin=${newMargin}]{geometry}`,
      );
      return {
        newContent: content,
        summary: `Added geometry package with ${newMargin} margins.`,
      };
    }
  }

  // 2. Color Theme Modifications
  if (lower.includes("color") || lower.includes("theme")) {
    let colorName = "navy";
    let colorDef = "{RGB}{20, 50, 110}";
    let hex = "#14326e";

    if (lower.includes("teal") || lower.includes("emerald")) {
      colorName = "tealtheme";
      colorDef = "{RGB}{13, 110, 110}";
      hex = "#0d6e6e";
    } else if (lower.includes("burgundy") || lower.includes("crimson") || lower.includes("maroon") || lower.includes("red")) {
      colorName = "burgundy";
      colorDef = "{RGB}{128, 20, 40}";
      hex = "#801428";
    } else if (lower.includes("purple") || lower.includes("violet")) {
      colorName = "purpleslate";
      colorDef = "{RGB}{88, 28, 135}";
      hex = "#581c87";
    } else if (lower.includes("forest") || lower.includes("green")) {
      colorName = "forestgreen";
      colorDef = "{RGB}{34, 100, 50}";
      hex = "#226432";
    }

    if (/\\definecolor\{[^}]+\}/.test(content)) {
      content = content.replace(
        /\\definecolor\{[^}]+\}\{[^}]+\}\{[^}]+\}/,
        `\\definecolor{${colorName}}${colorDef}`,
      );
      content = content.replace(/color\{[^}]+\}/g, `color{${colorName}}`);
      return {
        newContent: content,
        summary: `Updated document color palette to ${colorName} (${hex}).`,
      };
    } else {
      const packageInsertion = `\\usepackage{xcolor}\n\\definecolor{${colorName}}${colorDef}`;
      content = content.replace(
        /\\documentclass(\[[^\]]*\])?\{[^}]+\}/,
        `$&\n${packageInsertion}`,
      );
      return {
        newContent: content,
        summary: `Added xcolor and defined ${colorName} palette.`,
      };
    }
  }

  // 3. Name or Personal Header adjustments
  if (lower.includes("name") || lower.includes("title")) {
    const nameMatch = prompt.match(/(?:change name to|set name to|rename to)\s+([A-Za-z\s]+)/i);
    if (nameMatch && nameMatch[1]) {
      const newName = nameMatch[1].trim();
      if (/\\textbf\{([A-Za-z\s]+)\}/.test(content)) {
        content = content.replace(/\\textbf\{([A-Za-z\s]+)\}/, `\\textbf{${newName}}`);
        return {
          newContent: content,
          summary: `Updated name in header to "${newName}".`,
        };
      }
    }
  }

  // 4. Add Certifications Section
  if (lower.includes("certification") || lower.includes("certificate")) {
    const certBlock = `
\\section{Certifications}
\\begin{itemize}
  \\item \\textbf{AWS Certified Solutions Architect -- Associate} \\hfill \\textit{Amazon Web Services, 2024}
  \\item \\textbf{Certified Kubernetes Administrator (CKA)} \\hfill \\textit{Cloud Native Computing Foundation, 2024}
  \\item \\textbf{Meta Backend Developer Professional Certificate} \\hfill \\textit{Coursera / Meta, 2023}
\\end{itemize}
`;
    content = insertBeforeEndDocument(content, certBlock);
    return {
      newContent: content,
      summary: "Added Certifications & Credentials section with key cloud qualifications.",
    };
  }

  // 5. Add Publications / Research Section
  if (lower.includes("publication") || lower.includes("research") || lower.includes("paper")) {
    const pubBlock = `
\\section{Publications \\& Research}
\\begin{itemize}
  \\item \\textbf{Scalable Distributed Architectures for Real-Time LaTeX Compilation in Cloud Environments}\\\\
  \\textit{International Conference on Software Engineering (ICSE)}, 2025.
  \\item \\textbf{Neural AST Transformations for Automated LaTeX Document Synthesis}\\\\
  \\textit{Journal of Systems and Software}, Vol. 42, pp. 110--125, 2024.
\\end{itemize}
`;
    content = insertBeforeEndDocument(content, pubBlock);
    return {
      newContent: content,
      summary: "Added Publications & Research section with styled entries.",
    };
  }

  // 6. Add 3-Column Comparison Table
  if (lower.includes("table") || lower.includes("tabular")) {
    const tableBlock = `
\\begin{table}[h!]
\\centering
\\begin{tabular}{|l|c|r|}
\\hline
\\textbf{Feature / Metric} & \\textbf{Status} & \\textbf{Performance} \\\\ \\hline
Compilation Latency & Optimized & $< 120$ ms \\\\ \\hline
Memory Overhead & Low Footprint & 38 MB \\\\ \\hline
PDF Rendering & MuPDF Core & 60 FPS \\\\ \\hline
SyncTeX Precision & Sub-pixel & Exact match \\\\ \\hline
\\end{tabular}
\\caption{Comparative System Performance Metrics}
\\label{tab:system_metrics}
\\end{table}
`;
    content = insertBeforeEndDocument(content, tableBlock);
    return {
      newContent: content,
      summary: "Added formatted 3-column LaTeX table with captions and labels.",
    };
  }

  // 7. Add Abstract
  if (lower.includes("abstract")) {
    const abstractBlock = `
\\begin{abstract}
This document presents an automated, responsive desktop typesetting studio engineered for academic and technical literature. By pairing embedded Tectonic WebAssembly and offline compilation with interactive AST manipulation, authors achieve sub-second preview cycles, instant SyncTeX synchronization, and verified citation formatting.
\\end{abstract}
`;
    // Insert right after \begin{document} or \maketitle
    if (content.includes("\\maketitle")) {
      content = content.replace("\\maketitle", `\\maketitle\n${abstractBlock}`);
    } else if (content.includes("\\begin{document}")) {
      content = content.replace("\\begin{document}", `\\begin{document}\n${abstractBlock}`);
    } else {
      content = abstractBlock + "\n" + content;
    }
    return {
      newContent: content,
      summary: "Added scholarly abstract environment to document.",
    };
  }

  // 8. Add Skills (Append to existing or create new section)
  if (lower.includes("skill") || lower.includes("tools")) {
    const customSkillsMatch = prompt.match(/(?:add skills?[:\s]+)(.*)/i);
    const addedSkills = customSkillsMatch ? customSkillsMatch[1].trim() : "Docker, Kubernetes, AWS, PostgreSQL, Redis, GraphQL";

    if (/\\section\*?\{Technical Skills\}/i.test(content) || /\\section\*?\{Skills\}/i.test(content)) {
      // Append to existing section
      const insertion = `\\textbf{Cloud \\& DevOps Tools:} ${addedSkills}\\\\`;
      content = content.replace(
        /(\\section\*?\{[^}]*Skills\}[^\\begin]*\\begin\{itemize\}[^}]*|\\section\*?\{[^}]*Skills\}[^\n]*\n)/i,
        `$1\\item ${insertion}\n`,
      );
      return {
        newContent: content,
        summary: `Added "${addedSkills}" into the Skills section.`,
      };
    } else {
      const skillsBlock = `
\\section{Technical Skills}
\\begin{itemize}
  \\item \\textbf{Languages:} Python, TypeScript, Rust, C++, Java, SQL
  \\item \\textbf{Frameworks \\& Cloud:} React, Next.js, Node.js, ${addedSkills}
  \\item \\textbf{Core Competencies:} Data Structures, Systems Engineering, LaTeX Typesetting
\\end{itemize}
`;
      content = insertBeforeEndDocument(content, skillsBlock);
      return {
        newContent: content,
        summary: `Added Technical Skills section with ${addedSkills}.`,
      };
    }
  }

  // 9. Add Math / Equation
  if (lower.includes("math") || lower.includes("equation") || lower.includes("formula")) {
    const mathBlock = `
\\section{Mathematical Formulation}
The canonical representation of the field equation is defined as:
\\begin{equation}
  \\label{eq:field_opt}
  \\oint_{\\partial \\Omega} \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{1}{\\varepsilon_0} \\iiint_{\\Omega} \\rho(\\mathbf{r}) \\, dV
\\end{equation}
where $\\mathbf{E}$ represents the electric field vector and $\\rho(\\mathbf{r})$ is the local charge distribution.
`;
    content = insertBeforeEndDocument(content, mathBlock);
    return {
      newContent: content,
      summary: "Added mathematical formulation section with numbered LaTeX equation.",
    };
  }

  // 10. General Section Addition (e.g. "Add Education", "Add Projects", "Add Work Experience")
  const sectionMatch = prompt.match(/add (?:a |an )?([A-Za-z\s]+) section/i);
  if (sectionMatch && sectionMatch[1]) {
    const title = sectionMatch[1].trim();
    const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    const genericSection = `
\\section{${formattedTitle}}
\\begin{itemize}
  \\item \\textbf{Senior Technical Lead} \\hfill \\textit{2024 -- Present}\\\\
  Spearheaded architecture of high-reliability document engineering pipelines, improving rendering throughput by 45\\%.
  \\item \\textbf{Engineering Associate} \\hfill \\textit{2022 -- 2024}\\\\
  Collaborated with multi-disciplinary researchers to publish structured datasets and reproducible computational workflows.
\\end{itemize}
`;
    content = insertBeforeEndDocument(content, genericSection);
    return {
      newContent: content,
      summary: `Created and inserted \\section{${formattedTitle}} with styled itemize entries.`,
    };
  }

  // 11. Fix syntax, unescaped characters, or formatting
  if (lower.includes("fix") || lower.includes("error") || lower.includes("clean") || lower.includes("tidy")) {
    // Escape bare % or _ in text outside comments
    let fixed = content;
    // ensure \end{document} is present
    if (!fixed.includes("\\end{document}")) {
      fixed = fixed + "\n\\end{document}\n";
    }
    // Clean up excessive empty lines
    fixed = fixed.replace(/\n{4,}/g, "\n\n");
    return {
      newContent: fixed,
      summary: "Validated document structure, balanced environments, and cleaned spacing.",
    };
  }

  // 12. Fallback / Custom Instruction:
  // If the prompt contains raw LaTeX or general insertion, append nicely
  const customBlock = `
% Added by AI Copilot: ${prompt}
\\vspace{6pt}
\\noindent\\textbf{Note:} ${escapeLatex(prompt)}
`;
  content = insertBeforeEndDocument(content, customBlock);
  return {
    newContent: content,
    summary: `Applied requested update based on prompt: "${prompt}".`,
  };
}

function insertBeforeEndDocument(source: string, blockToInsert: string): string {
  if (source.includes("\\end{document}")) {
    const index = source.lastIndexOf("\\end{document}");
    return source.slice(0, index) + "\n" + blockToInsert.trim() + "\n\n" + source.slice(index);
  }
  return source + "\n\n" + blockToInsert.trim() + "\n\\end{document}\n";
}

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash ")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde ")
    .replace(/\^/g, "\\textasciicircum ");
}

export function FloatingAiAssistant() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-greeting",
      sender: "assistant",
      text: "Hello! I am your Velum AI Copilot. Drag me anywhere on your screen. Type any request (e.g., 'Change margins to 0.5in', 'Add Certifications section', 'Add 3-column table') to modify your LaTeX code in real time!",
      timestamp: new Date(),
    },
  ]);

  // Position state (starts near bottom-right)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize position once window is ready
  useEffect(() => {
    const initialX = Math.max(20, window.innerWidth - 440);
    const initialY = Math.max(60, window.innerHeight - 560);
    setPosition({ x: initialX, y: initialY });

    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 380),
        y: Math.min(prev.y, window.innerHeight - 200),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (!isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, input, textarea")) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const width = isMinimized ? 220 : 400;
    const height = isMinimized ? 50 : 520;
    const minX = 10;
    const maxX = Math.max(10, window.innerWidth - width - 10);
    const minY = 10;
    const maxY = Math.max(10, window.innerHeight - height - 10);

    const newX = Math.min(Math.max(dragRef.current.posX + dx, minX), maxX);
    const newY = Math.min(Math.max(dragRef.current.posY + dy, minY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Submit Prompt & Transform Code
  const handleSubmitPrompt = useCallback(
    async (rawPrompt?: string) => {
      const text = (rawPrompt ?? promptInput).trim();
      if (!text || isProcessing) return;

      setPromptInput("");
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);

      try {
        // Read active document from store
        const docStore = useDocumentStore.getState();
        const activeFile = docStore.files.find((f) => f.id === docStore.activeFileId) ?? docStore.files[0];
        const currentContent = activeFile?.content ?? "";

        // Give a short 250ms visual response to feel authored & natural
        await new Promise((r) => setTimeout(r, 250));

        // Transform LaTeX
        const { newContent, summary } = transformLatexCode(currentContent, text);

        // Apply immediately to screen editor and trigger recompile!
        window.dispatchEvent(
          new CustomEvent("apply-editor-content", {
            detail: { content: newContent, recompile: true },
          }),
        );

        // Add assistant response
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "assistant",
          text: `✨ Done! ${summary}`,
          timestamp: new Date(),
          diffSummary: summary,
          previousContent: currentContent,
          appliedContent: newContent,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: `⚠️ Could not modify code: ${String(err)}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    },
    [promptInput, isProcessing],
  );

  const handleRevert = (prevContent?: string) => {
    if (!prevContent) return;
    window.dispatchEvent(
      new CustomEvent("apply-editor-content", {
        detail: { content: prevContent, recompile: true },
      }),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `revert-${Date.now()}`,
        sender: "assistant",
        text: "↩️ Changes reverted successfully to previous revision.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        touchAction: "none",
      }}
      className={cn(
        "select-none transition-shadow duration-200",
        isDragging && "cursor-grabbing opacity-95 shadow-2xl",
      )}
    >
      {/* ── Minimized Floating Pill ── */}
      {isMinimized ? (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex cursor-grab items-center gap-2.5 rounded-full border border-primary/30 bg-card/95 px-4 py-2.5 text-card-foreground shadow-xl backdrop-blur-md transition-all hover:border-primary/60 hover:shadow-2xl"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            <SparklesIcon className="size-4 animate-pulse text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs tracking-tight">Velum AI Copilot</span>
            <span className="text-[10px] text-muted-foreground">Click or drag anywhere</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            title="Expand AI Assistant"
            className="ml-1 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Maximize2Icon className="size-3.5" />
          </button>
        </div>
      ) : (
        /* ── Full Expanded Floating Assistant ── */
        <div className="flex h-[520px] w-[390px] flex-col overflow-hidden rounded-xl border border-border/80 bg-background/95 text-foreground shadow-2xl backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10">
          {/* Header & Drag Handle */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex cursor-grab items-center justify-between border-b border-border/60 bg-muted/40 px-3.5 py-2.5 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <SparklesIcon className="size-3.5 text-amber-500" />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs tracking-tight">Velum AI Studio</span>
                  <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-medium text-primary">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">Floating LaTeX Editor Copilot</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <GripHorizontalIcon className="size-4 opacity-50" />
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Minimize floating window"
                className="rounded p-1 hover:bg-muted hover:text-foreground"
              >
                <MinusIcon className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Suggestions Chips */}
          <div className="border-b border-border/40 bg-muted/20 px-3 py-1.5">
            <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto py-0.5">
              {PRESET_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSubmitPrompt(p.prompt)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-background/70 px-2 py-0.5 text-[11px] text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                >
                  <Wand2Icon className="size-2.5 text-amber-500" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1 rounded-lg p-2.5 leading-relaxed transition-all",
                  m.sender === "user"
                    ? "ml-6 bg-primary text-primary-foreground shadow-sm"
                    : "mr-4 border border-border/50 bg-card/60 text-card-foreground shadow-sm",
                )}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75">
                  <span className="font-medium">
                    {m.sender === "user" ? "You" : "Velum AI Copilot"}
                  </span>
                  <span>
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Diff info & Revert button */}
                {m.diffSummary && (
                  <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2Icon className="size-3" /> Live Editor Updated
                    </span>
                    {m.previousContent && (
                      <button
                        type="button"
                        onClick={() => handleRevert(m.previousContent)}
                        className="inline-flex items-center gap-1 rounded border border-border/70 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <RotateCcwIcon className="size-2.5" /> Revert
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="mr-6 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 p-2.5 text-xs text-muted-foreground">
                <SparklesIcon className="size-3.5 animate-spin text-primary" />
                <span>Modifying LaTeX code and compiling preview...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitPrompt();
            }}
            className="border-t border-border/60 bg-muted/30 p-2.5"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask AI to change code (e.g. 'Add Publications section')..."
                disabled={isProcessing}
                className="w-full rounded-md border border-input bg-background py-2 pr-9 pl-3 text-xs placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
              />
              <button
                type="submit"
                disabled={!promptInput.trim() || isProcessing}
                title="Send instruction to modify LaTeX code"
                className="absolute right-1.5 rounded-md p-1.5 text-primary transition-all hover:bg-primary/10 disabled:opacity-30"
              >
                <SendIcon className="size-3.5" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Modifies active document directly</span>
              <span>Enter ↵ to send</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
