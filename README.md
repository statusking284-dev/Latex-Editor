# UI Redesign Prompt for This LaTeX Editor

> **Use this document as the implementation prompt for a coding agent.**
>
> The goal is to create a personal visual identity for this existing desktop
> LaTeX editor without removing, weakening, or silently changing any current
> capability. This is a redesign of the interface, iconography, branding, and
> visual polish - not a rewrite of the editor.

## Copy/paste prompt

```text
You are redesigning the UI and visual identity of an existing cross-platform
desktop LaTeX editor. The current application is a Tauri 2 desktop app with a
React 19 + TypeScript frontend and a Rust backend. It is an offline-first
editor with embedded Tectonic compilation and optional AI assistance.

I want to make this application visually mine. Keep the product's complete
functionality and data behavior, but replace the existing visual language,
icons, colors, typography, spacing, surfaces, branding, and empty states with
a cohesive new design system. Do not copy the original developer's name,
logo, exact palette, marketing language, or visual identity. Preserve required
license and third-party attribution notices.

## Non-negotiable rules

1. Do not remove any existing feature, command, keyboard shortcut, setting,
   backend integration, file format, persistence behavior, error state, or
   accessibility label.
2. Do not change LaTeX compilation semantics, SyncTeX mappings, PDF rendering,
   project file operations, Git history behavior, AI approval behavior,
   reference import behavior, Zotero behavior, Python approval behavior, or
   updater behavior.
3. Do not replace working functionality with mock data, placeholder buttons,
   static screenshots, fake success states, or disabled controls.
4. Do not make network access mandatory. The editor must remain useful with AI
   disabled and while offline.
5. Do not expose API keys, source files, private project content, or review
   notes in logs or UI telemetry.
6. Preserve existing Tauri IPC command names and payload contracts unless a
   change is strictly required by the visual redesign. If a contract must
   change, update every caller and add focused tests.
7. Prefer small, composable visual components and existing UI primitives.
   Reuse existing state stores and hooks instead of duplicating behavior.
8. Keep the application responsive at the current minimum window size
   (800 x 600), usable at 1400 x 900, and comfortable on large displays.
9. Keep keyboard navigation, focus-visible states, screen-reader labels,
   tooltips, reduced-motion support, high contrast, and color-blind-safe
   status indicators.
10. Never use color alone to communicate compile errors, warnings, review
    states, approval states, or active navigation.

## Product direction

Create a distinctive, calm, professional workspace for researchers, students,
technical writers, and academics. The visual personality should feel authored
and memorable without becoming decorative or distracting from writing.

Use the following direction as a starting point, but refine it into a
consistent system:

- Brand personality: focused, intelligent, precise, warm, and dependable.
- Visual metaphor: a private writing studio or research desk, not a generic
  developer dashboard.
- Surfaces: clear hierarchy between canvas, editor, navigation, inspector,
  dialogs, and transient notifications.
- Density: information-rich but breathable. Avoid excessive rounded cards,
  oversized empty space, and nested borders.
- Typography: choose a distinctive display face for branding only, a highly
  readable UI sans-serif, and a coding-appropriate monospace font. Use local
  system fallbacks so the app remains usable offline.
- Color: define semantic tokens for background, foreground, muted text,
  border, accent, success, warning, destructive, info, selection, focus,
  compile status, review status, and AI status. Include light, dark, and
  high-contrast variants.
- Motion: use short, purposeful transitions for panels, drawers, selection,
  compile progress, and dialogs. Respect prefers-reduced-motion and avoid
  motion during typing or PDF reading.

Before implementing, write a short internal visual inventory of the current
screens and identify which existing behavior each redesigned control invokes.
Do not redesign by changing only a few colors; make the whole system coherent.

## Icon and branding redesign

Replace the current generic icon treatment with a new, consistent icon system.

- Design a new app mark and wordmark that are original and do not imitate the
  current logo or another product's identity.
- Update the desktop app icon assets, browser/favicon assets, welcome-screen
  mark, window branding, empty states, template thumbnails, and documentation
  branding consistently.
- Keep icons optically balanced at 12 px, 16 px, 20 px, 24 px, and 32 px.
- Use one icon family and one stroke/weight language. Do not mix unrelated
  outline, filled, emoji, and platform-specific styles.
- Keep familiar meanings for actions such as save, compile, search, files,
  outline, references, grammar, project health, settings, appearance,
  history, reader mode, comments, AI, import, export, and external editor.
- Use text labels or tooltips for unfamiliar actions. Icon-only controls must
  retain an accessible name and a visible tooltip on hover/focus.
- Do not use icons as decoration when they compete with source text or PDF
  content.
- Preserve semantic status icons and pair them with text, badges, or patterns.
- Do not remove the existing legal/license identity from package metadata or
  attribution pages merely because the UI brand changes.

## Screens and workflows that must remain complete

### Launch, onboarding, and projects

Redesign the launch screen, onboarding prompt, recent-project list, settings
entry point, update state, and project creation flow. Preserve:

- Open an existing project folder.
- Create a blank project.
- Create a guided Learn LaTeX project.
- Choose a template from the template gallery.
- Import Overleaf and other LaTeX ZIP archives.
- Import the default branch of a public GitHub repository.
- Reopen and remove recent projects.
- Remember the last project folder.
- Show clear loading, empty, unavailable, and failure states.
- Keep the built-in onboarding path discoverable without forcing AI.

Template categories and examples must remain available: academic papers,
theses, presentations, posters, CVs/resumes, letters, reports, books,
newsletters, and blank projects.

### Main workspace

Preserve the current resizable workspace architecture:

- Activity rail.
- Optional project/sidebar panel.
- Multi-file editor pane.
- Optional PDF preview pane.
- Problems drawer and status bar.
- Resizable AI chat drawer.
- Focus mode.
- Reader mode.
- PDF review mode.

The redesign may change layout styling and hierarchy, but it must not make
these modes harder to discover or accidentally hide their exit controls.

### Project sidebar and navigation

Keep all current sidebar behavior:

- File and folder tree.
- New file and folder creation.
- Rename, delete, move, drag-and-drop, refresh, and import files.
- Reveal in the operating-system file manager.
- Open files with their default application.
- Open files in VS Code, Cursor, Zed, or Sublime Text when detected.
- Source outline with sections and subsections.
- Figure, table, equation, and bibliography outline entries.
- PDF outline with page navigation.
- Project-wide search with match case, whole word, and regular expression
  controls.
- References, grammar, project health, and Learn LaTeX panels.
- Project export as a ZIP containing sources, review data, and compiled PDF.

Keep file-type distinctions visible and understandable for TeX, BibTeX,
images, PDFs, styles, and other files.

### LaTeX and BibTeX editor

Preserve CodeMirror editing behavior and all existing editor workflows:

- LaTeX and BibTeX syntax highlighting.
- Lint diagnostics with source navigation.
- Code folding for sections, environments, comments, and BibTeX entries.
- Bracket matching and auto-closing brackets.
- Multi-file tabs.
- Search and replace, including project search.
- Vim mode.
- Multiple selection and rectangular selection.
- Inline completion and semantic assistance.
- Source Lens experimental mode.
- Style suggestions with one-click fixes.
- Formatting on save and explicit document formatting.
- Font-size controls and editor highlight themes.
- Auto-save and compile shortcuts.
- Open in an external editor at the selected source line.

Preserve the toolbar actions for text formatting, headings, lists, code,
quotes, links, figures, citations, cross-references, environments, equations,
tables, cleanup/formatting, zoom, editor mode, and additional actions. The
redesigned toolbar must still support compact and wide layouts without
silently moving important actions into an inaccessible overflow menu.

Structured editors must remain functional:

- Table editor with row/column creation, deletion, alignment, reordering, and
  cell editing.
- Equation/math editor with symbols, structure, and source editing.
- Figure picker and figure editor.
- Citation picker and citation inline editor.
- Cross-reference picker and editor.
- Environment picker and editor.
- BibTeX entry inline editor.
- Image preview and crop workflow.

### Compilation and diagnostics

Keep the embedded Tectonic backend as the default offline compiler and retain
the optional TeX Live backend. Preserve:

- Compile target detection.
- Full, single-pass, draft, and current-chapter/fast compile profiles.
- Compile progress and stale-PDF states.
- Structured diagnostics with backend, category, source file, source line,
  summary, related diagnostics, and raw engine output.
- Retry, source navigation, and actionable error guidance.
- Optional AI explanation and AI fix actions only when an AI provider is
  configured.
- The existing concurrency protections and isolated Tectonic subprocess
  behavior.

Compile states must be visually obvious without overwhelming the editor:
idle, compiling, successful, stale, warning, failed, and unavailable.

### PDF preview and reader experience

Preserve the MuPDF-based preview and SyncTeX workflows:

- Page rendering and page navigation.
- Zoom levels and fit modes.
- Text selection and copy.
- Search across the PDF with result navigation and match count.
- Source-to-PDF and PDF-to-source SyncTeX navigation.
- Back/forward PDF reading history.
- PDF outline navigation.
- PDF word count and source word count.
- Export the PDF.
- Capture selected PDF regions and send them to the AI assistant.
- Lightweight PDF preview mode for lower-power machines.
- Reader mode with the editor hidden and the PDF/outline emphasized.

Keep PDF controls grouped by reading, navigation, review, and export. Avoid
placing destructive or mode-changing controls next to frequent page controls
without clear separation.

### PDF review and collaboration

Preserve the complete review system:

- Text highlights with selectable colors.
- Pinned comments and threaded replies.
- Markdown and KaTeX in review content.
- Freehand, line, arrow, box, and ellipse drawings.
- Review tags, tag editing, tag filtering, and annotation search.
- Search across notes, quoted text, authors, replies, and tags.
- Gutter markers mapped back to source lines.
- SyncTeX-aware annotation anchors.
- Post-compile anchor checks with ok, shifted, drifted, and unverified states.
- Filters for moved or unresolved annotations.
- Annotation deletion and editing.
- Export the visible review annotations as Markdown.
- Reviewer identity and suggested tags in Settings.

Review annotations must be visually distinguishable from ordinary PDF
selection and must never be moved automatically without explicit user action.

### References and bibliography

Preserve the references panel and every import route:

- Search project references.
- Detect missing citations and bibliography issues.
- Add and edit BibTeX entries.
- Paste raw BibTeX.
- Detect and resolve duplicate bibliography entries.
- Import metadata from DOI/Crossref, arXiv, ISBN/Open Library, and other
  configured external sources.
- Import or link external bibliography files.
- Zotero authentication/settings.
- Browse Zotero collections and items.
- Filter Zotero collections and search the Zotero library.
- Import individual Zotero items or sync a collection.
- Preserve the project's citation key conventions and avoid duplicate imports.

Make source-of-truth and provenance clear. Keep warnings for metadata that was
not verified by the reference resolver.

### Grammar, project health, and learning

Preserve:

- LanguageTool grammar/style panel.
- Configurable LanguageTool endpoint, language, and picky mode.
- Jump-to-source, replace, dismiss, and issue counts.
- Project health checks.
- Learn LaTeX's guided sequence, progress, pane highlighting, and insertable
  examples for document structure, figures, tables, math, and citations.
- The ability to hide and reopen the guide.

These features should feel like integrated tools, not unrelated screens.

### AI assistant and skills

AI is optional. With no provider configured, the application must remain a
complete LaTeX editor.

Preserve:

- Anthropic and OpenAI/OpenAI-compatible provider configuration.
- Provider selection and API key management.
- Selection, file, chapter, and project scopes.
- Chat, proofread, fix, complete, explain, and related actions.
- Streaming messages and multiple chat tabs.
- Chat drawer resize, collapse, and expanded mode.
- Attachments and captured PDF context.
- Proposed changes as reviewable diffs.
- Explicit accept/reject approval flow.
- Compile-error explanation and fix-with-chat actions.
- Skills invoked with `/`.
- Built-in editing skills and research skills.
- Skill gallery with instructions and tool permissions.
- Project-local and user-level Markdown skills.
- Skill validation and clear load-failure messages.
- Approval prompts for Python scripts and package installation.

Do not make AI controls visually dominate the editor. The UI should clearly
communicate what context is being sent, what the assistant proposes, what tools
it used, and what the user must approve. Never make an AI-generated edit look
like an already-accepted source change.

### Python environment

Keep the optional uv-managed project environment:

- One-click setup from Settings.
- Clear environment status and setup progress.
- Run approved scripts for analysis and figure generation.
- Show the complete script before execution.
- Require approval for every package installation.
- Keep the existing timeout, output cap, and stop behavior.
- Clearly state that approved scripts use the user's account permissions and
  are not a security sandbox.

### Settings and appearance

Keep existing settings and make them easier to understand:

- Compiler backend.
- Vim mode.
- Source Lens.
- Auto-compile.
- Structured editors on click.
- Format LaTeX on save.
- LaTeX style suggestions.
- Lightweight PDF preview.
- PDF review name, color, and tags.
- LanguageTool endpoint, language, and picky rules.
- AI provider and API keys.
- Python environment.
- About and metadata attribution.

Create a first-class appearance area for the new visual identity, including:

- Light, dark, system, and high-contrast themes.
- Workspace palette.
- Editor syntax/highlight theme.
- Editor font size.
- Optional compact/comfortable density if it does not affect usability.
- Reduced-motion preference.

Persist appearance preferences using the existing settings pattern and migrate
old values safely. Do not invalidate users' existing settings.

## Implementation guidance

1. Start by auditing the existing component tree, stores, hooks, tests, and
   Tauri commands. Identify behavior boundaries before touching styles.
2. Establish design tokens first: colors, typography, radii, shadows,
   spacing, borders, focus rings, status colors, and z-index layers.
3. Build or update shared primitives for buttons, icon buttons, badges,
   tooltips, tabs, menus, dialogs, popovers, inputs, toggles, panels, and
   empty states. Avoid one-off styles where a shared primitive is appropriate.
4. Introduce a single icon registry or mapping for product actions so icon
   replacement is consistent and future icon changes do not require hunting
   through unrelated components.
5. Keep labels and accessible names stable unless an intentional product rename
   is required. If a label changes, preserve a clear tooltip and test it.
6. Keep layout changes incremental. Check the welcome screen, project picker,
   editor, sidebar, PDF preview, review mode, settings, AI drawer, dialogs,
   errors, and empty states at every responsive breakpoint.
7. Do not change business logic merely to make a component easier to style.
8. Avoid global CSS selectors that leak into CodeMirror, MuPDF, dialogs, or
   third-party widgets without testing those surfaces.
9. Preserve native title-bar behavior, Tauri window controls, OS file dialogs,
   updater surfaces, and platform-specific icon packaging.
10. Preserve the existing release contract. Builds must continue to be
    verifiable on Windows, Linux, and unsigned macOS; do not add a release
    signing requirement as part of a UI redesign.

## Required visual quality bar

- Every interactive control has a clear hover, pressed, disabled, focus, and
  loading state where applicable.
- Every icon-only control has a tooltip and accessible label.
- Long filenames, project paths, citation keys, errors, and AI messages do not
  break the layout.
- Dense panels remain scannable with headings, grouping, and consistent
  alignment.
- Dialogs have predictable focus handling and keyboard escape behavior.
- Text and icons meet accessible contrast in all themes.
- Destructive actions use confirmation where the current behavior requires it.
- Compile errors, review annotations, pending approvals, and unsaved/stale
  document states are impossible to confuse.
- Empty states explain the next useful action.
- The application still feels fast while editing, compiling, switching files,
  scrolling PDFs, and streaming AI responses.

## Validation checklist

After implementation, run the smallest relevant checks and then the full
frontend checks:

- TypeScript build and Vite production build.
- Biome lint/format check.
- Focused component and store tests for modified behavior.
- Full desktop Vitest suite.
- Playwright end-to-end tests when workspace or onboarding flows change.
- Rust tests when Tauri-facing code or command registration changes.

Manually verify at minimum:

1. Launch screen, blank project, template project, tutorial project, recent
   project, ZIP import, and GitHub import.
2. Open a multi-file project, edit `.tex` and `.bib`, use tabs, search, outline,
   Vim mode, structured editors, and external-editor opening.
3. Compile a bundled LaTeX example, inspect success and failure states, and
   use SyncTeX in both directions.
4. Search, select, copy, zoom, navigate, and enter reader mode in the PDF.
5. Add, edit, search, tag, draw, reanchor-check, and export PDF review notes.
6. Import references from project files, external sources, and Zotero.
7. Use grammar, project health, Learn LaTeX, settings, themes, and
   high-contrast mode.
8. Use AI disabled, then with a configured provider: chat, scope selection,
   proposed changes, approval, skills, and compile-error assistance.
9. Approve a Python script and package request, confirming the warning and
   approval states remain explicit.
10. Test keyboard navigation and screen-reader labels for the activity rail,
    editor toolbar, PDF toolbar, dialogs, menus, drawers, and review controls.
11. Test light, dark, system, high contrast, reduced motion, narrow windows,
    large text, and long content.
12. Confirm that no feature is reachable only through an icon with no tooltip,
    label, or keyboard alternative.

## Definition of done

The redesign is complete only when the application looks unmistakably
different and personally branded, while every pre-existing workflow remains
available, understandable, keyboard-accessible, and operational. The result
must look like one deliberate product rather than a collection of recolored
components.
```

## Repository context for the coding agent

The prompt above is based on the current repository structure:

- Frontend: `apps/desktop/src/` - React, TypeScript, CodeMirror, Zustand,
  MuPDF, Radix-style UI primitives, and Lucide-based controls.
- Backend: `apps/desktop/src-tauri/src/` - Rust/Tauri commands, Tectonic,
  SyncTeX, history, imports, references, Zotero, LanguageTool, uv, export,
  and AI providers.
- Tests: `apps/desktop/src/__tests__/` - Vitest component, store, hook, and
  library coverage plus Playwright end-to-end coverage.
- Design foundations: `apps/desktop/src/styles/globals.css`,
  `apps/desktop/src/lib/appearance.ts`, and the shared components under
  `apps/desktop/src/components/ui/`.
- Existing screens include the project picker, project wizard, template
  gallery, workspace layout, activity rail, sidebar, editor, PDF preview,
  history, review, references, grammar, health, tutorial, settings, AI chat,
  skills gallery, and Python setup.

## Project safeguards

Keep the repository's MIT license, dependency notices, contributor guidance,
and release-pipeline requirements. A visual redesign must not be used to
remove attribution, weaken security boundaries, expose secrets, or bypass the
gated build and verification process documented in the repository guidance.
