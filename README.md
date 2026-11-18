# LaTeX Editor Studio

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tauri 2](https://img.shields.io/badge/Tauri_2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Local_AI-FF6B6B?style=for-the-badge&logo=ollama&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A high-performance, offline-first desktop LaTeX editor featuring embedded Tectonic compilation and a built-in AI copilot with multi-provider intelligence.**

[Key Features](#key-features) • [AI Providers](#ai-copilot--model-configuration) • [Getting Started](#getting-started) • [Architecture](#architecture) • [License](#license)

</div>

---

## 🌟 Key Features

- **⚡ Zero-Setup Compilation**: Embedded native [Tectonic](https://tectonic-typesetting.github.io/) engine downloads required TeX packages automatically on-the-fly. No full TeX Live or MiKTeX installation required.
- **🤖 Built-in AI Copilot**: Docked bottom conversational agent powered by local offline LLMs (via Ollama) or leading cloud intelligence (OpenAI ChatGPT, Anthropic Claude, Google Gemini, DeepSeek).
- **📝 Real-Time Code Modification**: Prompt the AI to insert complex mathematical tables, format bibliographies, adjust document margins, or write sections—applied directly to CodeMirror with diff tracking.
- **🔍 Instant SyncTeX**: Bidirectional synchronization between LaTeX source code and the interactive PDF preview. Click anywhere in the PDF to jump straight to the exact line in code.
- **🎨 Sleek Studio Theme**: Distraction-free, dark-mode first design crafted for researchers, academics, engineers, and technical authors.
- **🔒 Privacy & Offline First**: Works 100% offline without mandatory internet connectivity. Local Ollama runs fully on your machine with zero data leaves your device.

---

## 🤖 AI Copilot & Model Configuration

LaTeX Editor features a floating model configuration center supporting both offline local models and cloud APIs:

| Provider | Supported Models | Connectivity |
| :--- | :--- | :--- |
| **🦙 Local Ollama** | `llama3.2`, `qwen2.5`, `mistral`, `deepseek-r1` | 100% Offline & Free (`http://127.0.0.1:11434`) |
| **⚡ OpenAI** | `gpt-4o`, `gpt-4o-mini`, `o1-mini` | Official Cloud API (`api.openai.com`) |
| **🧡 Anthropic** | `claude-3-5-sonnet`, `claude-3-5-haiku` | Official Cloud API (`api.anthropic.com`) |
| **✨ Google Gemini** | `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0` | Official Cloud API (`generativelanguage.googleapis.com`) |
| **🐋 DeepSeek** | `deepseek-chat` (V3), `deepseek-reasoner` (R1) | Official Cloud API (`api.deepseek.com`) |

> **Note**: No dummy or mocked models are connected by default. The editor automatically probes your local Ollama port and lists real installed models with one-click connection testing.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20+` or `v22+`
- **Package Manager**: `pnpm v10+` (`corepack enable pnpm`)
- **Rust Toolchain**: `rustc` and `cargo` (for Tauri desktop builds)
- *(Optional)* **Ollama**: For free local AI copilot execution

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/statusking284-dev/Latex-Editor.git
   cd Latex-Editor
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development server**:
   ```bash
   # Run frontend web app with embedded compiler API
   pnpm dev:desktop
   ```
   Open your browser at `http://localhost:1420`.

4. **Build desktop application**:
   ```bash
   pnpm build:desktop
   ```

---

## 🛠️ Architecture

```
Latex-Editor/
├── apps/
│   └── desktop/                  # Tauri 2 Desktop App
│       ├── src/
│       │   ├── components/
│       │   │   ├── ai-chat/      # Inbuilt AI Chat Bar & Configuration Modal
│       │   │   ├── workspace/    # Editor, PDF Viewer, Split Panels
│       │   │   └── ui/           # Design system components
│       │   ├── stores/           # Zustand state management (document, settings, AI)
│       │   └── styles/           # Tailwind CSS & custom studio themes
│       └── src-tauri/            # Rust Backend (Tectonic IPC, File System, SyncTeX)
├── packages/                     # Shared utilities & modules
└── scripts/                      # Build, packaging, and CI verification scripts
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
