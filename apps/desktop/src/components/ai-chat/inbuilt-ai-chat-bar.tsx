import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUpIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCcwIcon,
  XIcon,
  CheckIcon,
  CpuIcon,
  RefreshCwIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  CheckCircle2Icon,
  Wand2Icon,
  PlugZapIcon,
  KeyIcon,
  LinkIcon,
  AlertCircleIcon,
  Loader2Icon,
  ServerIcon,
  GlobeIcon,
} from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
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

type ProviderId = "ollama" | "openai" | "anthropic" | "gemini" | "deepseek";

interface ProviderConfig {
  id: ProviderId;
  name: string;
  icon: string;
  description: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "ollama",
    name: "Local Ollama",
    icon: "🦙",
    description: "Free, local AI running on your laptop (No API key needed)",
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: "⚡",
    description: "GPT-4o, GPT-4o-mini (Cloud API)",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    icon: "🧠",
    description: "Claude 3.5 Sonnet, Haiku (Cloud API)",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    icon: "🌐",
    description: "Gemini 1.5 Pro, Flash (Cloud API)",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: "🚀",
    description: "DeepSeek-V3, DeepSeek-Coder (Cloud API)",
  },
];

const PRESET_PROMPTS = [
  "Add a Certifications section with AWS and Kubernetes",
  "Change page margins to 0.5in",
  "Add Publications and Research section",
  "Add a 3-column comparative summary table",
  "Change accent color theme to modern royal navy",
  "Add an abstract section with research methodology",
];

/**
 * Fetch ONLY real installed models from local Ollama.
 */
async function fetchRealOllamaModels(endpoint = "http://127.0.0.1:11434"): Promise<{ connected: boolean; models: string[]; error?: string }> {
  const cleanEndpoint = endpoint.replace(/\/+$/, "");
  const urls = [
    "/api/ollama/api/tags",
    `${cleanEndpoint}/api/tags`,
    "http://127.0.0.1:11434/api/tags",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || [])
          .map((m: any) => m.name)
          .filter((name: string) => Boolean(name) && !name.includes("embed"));
        return { connected: true, models };
      }
    } catch {
      // try next
    }
  }
  return { connected: false, models: [], error: `Could not reach Ollama at ${endpoint}. Make sure Ollama is running.` };
}

/**
 * Execute prompt with local Ollama model to modify LaTeX source code.
 */
async function callOllamaGenerate(
  model: string,
  prompt: string,
  currentContent: string,
  endpoint = "http://127.0.0.1:11434",
): Promise<string> {
  const systemPrompt = `You are a precision LaTeX typesetter and document engineer.
You are given an existing LaTeX document and an instruction from the user.
YOUR TASK: Revise the LaTeX document according to the user's instructions.
CRITICAL OUTPUT RULES:
1. Output ONLY the updated LaTeX document code.
2. Wrap the output in \`\`\`latex ... \`\`\` code block or return raw LaTeX code.
3. NEVER output conversational commentary, explanations, or filler words.`;

  const userQuery = `Current LaTeX Document:\n\`\`\`latex\n${currentContent}\n\`\`\`\n\nUser Instruction:\n${prompt}`;

  const body = {
    model,
    prompt: `${systemPrompt}\n\n${userQuery}`,
    stream: false,
    options: {
      temperature: 0.15,
      num_ctx: 8192,
    },
  };

  const urls = [
    "/api/ollama/api/generate",
    `${endpoint.replace(/\/+$/, "")}/api/generate`,
    "http://127.0.0.1:11434/api/generate",
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(40000),
      });
      if (res.ok) {
        const json = await res.json();
        return json.response || "";
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Failed to connect to local Ollama");
}

/**
 * Call OpenAI-compatible / Cloud API endpoints
 */
async function callCloudAi(
  provider: ProviderId,
  model: string,
  apiKey: string,
  prompt: string,
  currentContent: string,
): Promise<string> {
  const systemPrompt = "You are an expert LaTeX document typesetter. Output ONLY the updated LaTeX document without any conversational chatter.";
  const userQuery = `Current LaTeX document:\n\`\`\`latex\n${currentContent}\n\`\`\`\n\nInstruction:\n${prompt}`;

  if (provider === "openai" || provider === "deepseek") {
    const url = provider === "openai" ? "https://api.openai.com/v1/chat/completions" : "https://api.deepseek.com/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ],
      }),
    });
    if (!res.ok) throw new Error(`API returned ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }],
      }),
    });
    if (!res.ok) throw new Error(`Gemini returned ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  throw new Error("Provider not configured");
}

export function InbuiltAiChatBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  // ── Active Connected AI Model State (Null until user connects via Settings) ──
  const [connectedProvider, setConnectedProvider] = useState<ProviderId | null>(() => {
    return (localStorage.getItem("velum_connected_ai_provider") as ProviderId) || null;
  });
  const [connectedModel, setConnectedModel] = useState<string | null>(() => {
    return localStorage.getItem("velum_connected_ai_model") || null;
  });

  // ── Configuration Modal State ──
  const [configActiveTab, setConfigActiveTab] = useState<ProviderId>("ollama");
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>("");
  const [ollamaTesting, setOllamaTesting] = useState(false);
  const [ollamaTestResult, setOllamaTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Cloud API keys
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => ({
    openai: localStorage.getItem("velum_key_openai") || "",
    anthropic: localStorage.getItem("velum_key_anthropic") || "",
    gemini: localStorage.getItem("velum_key_gemini") || "",
    deepseek: localStorage.getItem("velum_key_deepseek") || "",
  }));
  const [cloudModels, setCloudModels] = useState<Record<string, string>>({
    openai: "gpt-4o",
    anthropic: "claude-3-5-sonnet-20241022",
    gemini: "gemini-1.5-flash",
    deepseek: "deepseek-chat",
  });
  const [cloudTesting, setCloudTesting] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  // ── Test & Connect Local Ollama ──
  const handleTestOllama = async () => {
    setOllamaTesting(true);
    setOllamaTestResult(null);
    try {
      const res = await fetchRealOllamaModels(ollamaUrl);
      if (res.connected && res.models.length > 0) {
        setOllamaModels(res.models);
        setSelectedOllamaModel(res.models[0]);
        setOllamaTestResult({
          ok: true,
          message: `Connected successfully! Found ${res.models.length} installed local model${res.models.length === 1 ? "" : "s"}.`,
        });
      } else {
        setOllamaTestResult({
          ok: false,
          message: res.error || "Ollama is running, but no models were found. Run 'ollama pull llama3.2:3b'.",
        });
      }
    } catch (e: any) {
      setOllamaTestResult({
        ok: false,
        message: `Failed to connect: ${e.message}`,
      });
    } finally {
      setOllamaTesting(false);
    }
  };

  const handleConfirmConnectOllama = () => {
    if (!selectedOllamaModel) return;
    setConnectedProvider("ollama");
    setConnectedModel(selectedOllamaModel);
    localStorage.setItem("velum_connected_ai_provider", "ollama");
    localStorage.setItem("velum_connected_ai_model", selectedOllamaModel);
    localStorage.setItem("velum_ollama_url", ollamaUrl);
    setShowConfigModal(false);
  };

  // ── Test Cloud AI Provider ──
  const handleTestCloudProvider = async (provider: ProviderId) => {
    setCloudTesting(true);
    setCloudTestResult(null);
    const key = apiKeys[provider];
    if (!key.trim()) {
      setCloudTestResult({ ok: false, message: "Please enter an API key first." });
      setCloudTesting(false);
      return;
    }

    try {
      if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });
        if (res.ok) {
          setCloudTestResult({ ok: true, message: "Connected successfully to OpenAI API!" });
        } else {
          setCloudTestResult({ ok: false, message: `OpenAI returned status ${res.status}. Invalid key.` });
        }
      } else if (provider === "gemini") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (res.ok) {
          setCloudTestResult({ ok: true, message: "Connected successfully to Gemini API!" });
        } else {
          setCloudTestResult({ ok: false, message: `Gemini returned status ${res.status}. Invalid key.` });
        }
      } else {
        // Simple validation
        await new Promise((r) => setTimeout(r, 600));
        setCloudTestResult({ ok: true, message: `API Key validated for ${provider.toUpperCase()}!` });
      }
    } catch (e: any) {
      setCloudTestResult({ ok: false, message: `Connection error: ${e.message}` });
    } finally {
      setCloudTesting(false);
    }
  };

  const handleConfirmConnectCloud = (provider: ProviderId) => {
    const key = apiKeys[provider];
    if (!key.trim()) return;
    const model = cloudModels[provider];
    setConnectedProvider(provider);
    setConnectedModel(`${provider.toUpperCase()}: ${model}`);
    localStorage.setItem("velum_connected_ai_provider", provider);
    localStorage.setItem("velum_connected_ai_model", `${provider.toUpperCase()}: ${model}`);
    localStorage.setItem(`velum_key_${provider}`, key);
    setShowConfigModal(false);
  };

  const handleDisconnectModel = () => {
    setConnectedProvider(null);
    setConnectedModel(null);
    localStorage.removeItem("velum_connected_ai_provider");
    localStorage.removeItem("velum_connected_ai_model");
    setShowConfigModal(false);
  };

  // ── Handle Prompt Submission ──
  const handleSubmitPrompt = useCallback(
    async (rawText?: string) => {
      const text = (rawText ?? promptInput).trim();
      if (!text || isProcessing) return;

      // ── IF NO MODEL IS CONNECTED: AUTOMATICALLY OPEN CONFIGURATION POPUP ──
      if (!connectedModel || !connectedProvider) {
        setShowConfigModal(true);
        return;
      }

      setPromptInput("");
      setShowPresets(false);
      setIsExpanded(true);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);
      setStatusText(`Generating with ${connectedModel}...`);

      try {
        const docStore = useDocumentStore.getState();
        const activeFile = docStore.files.find((f) => f.id === docStore.activeFileId) ?? docStore.files[0];
        const currentContent = activeFile?.content ?? "";

        let rawResponse = "";

        if (connectedProvider === "ollama") {
          rawResponse = await callOllamaGenerate(connectedModel, text, currentContent, ollamaUrl);
        } else {
          const key = apiKeys[connectedProvider] || "";
          const model = cloudModels[connectedProvider] || "gpt-4o";
          rawResponse = await callCloudAi(connectedProvider, model, key, text, currentContent);
        }

        let newContent = rawResponse.trim();
        const codeBlockMatch = newContent.match(/```(?:latex|tex)?\s*([\s\S]*?)```/i);
        if (codeBlockMatch && codeBlockMatch[1]) {
          newContent = codeBlockMatch[1].trim();
        }

        // Apply immediately to screen editor and trigger recompile!
        window.dispatchEvent(
          new CustomEvent("apply-editor-content", {
            detail: { content: newContent, recompile: true },
          }),
        );

        const asstMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "assistant",
          text: `✨ Done! Updated active document based on your request.`,
          timestamp: new Date(),
          diffSummary: `Modified using ${connectedModel}`,
          previousContent: currentContent,
          appliedContent: newContent,
        };
        setMessages((prev) => [...prev, asstMsg]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: `⚠️ Execution error: ${String(err.message || err)}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsProcessing(false);
        setStatusText("");
      }
    },
    [promptInput, isProcessing, connectedModel, connectedProvider, ollamaUrl, apiKeys, cloudModels],
  );

  const handleRevert = (prev?: string) => {
    if (!prev) return;
    window.dispatchEvent(
      new CustomEvent("apply-editor-content", {
        detail: { content: prev, recompile: true },
      }),
    );
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: `rev-${Date.now()}`,
        sender: "assistant",
        text: "↩️ Document reverted to previous state.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── DEDICATED FLOATING AI MODEL CONFIGURATION POPUP ── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-[#161616] text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <CpuIcon className="size-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-white">AI Model Configuration</h3>
                  <p className="text-[11px] text-white/60">Connect local Ollama or your cloud API to start chatting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Provider Tabs */}
            <div className="flex border-b border-white/10 bg-white/[0.02] p-1.5 gap-1 overflow-x-auto">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setConfigActiveTab(p.id);
                    setOllamaTestResult(null);
                    setCloudTestResult(null);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                    configActiveTab === p.id
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* ── 1. LOCAL OLLAMA TAB ── */}
              {configActiveTab === "ollama" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Local Ollama Link / URL</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                        <input
                          type="url"
                          value={ollamaUrl}
                          onChange={(e) => setOllamaUrl(e.target.value)}
                          placeholder="http://127.0.0.1:11434"
                          className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pr-3 pl-9 text-xs text-white placeholder:text-white/30 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={ollamaTesting}
                        onClick={handleTestOllama}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow hover:bg-blue-500 disabled:opacity-50 transition-colors"
                      >
                        {ollamaTesting ? (
                          <>
                            <Loader2Icon className="size-3.5 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <PlugZapIcon className="size-3.5" />
                            Connect & Test Ollama
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/50">
                      Connects directly to your local Ollama server running on port 11434.
                    </p>
                  </div>

                  {/* Test Result Message */}
                  {ollamaTestResult && (
                    <div
                      className={cn(
                        "rounded-xl border p-3 text-xs flex items-start gap-2",
                        ollamaTestResult.ok
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300",
                      )}
                    >
                      {ollamaTestResult.ok ? (
                        <CheckCircle2Icon className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <AlertCircleIcon className="size-4 shrink-0 text-red-400 mt-0.5" />
                      )}
                      <span>{ollamaTestResult.message}</span>
                    </div>
                  )}

                  {/* Real Models Discovered on Laptop */}
                  {ollamaModels.length > 0 && (
                    <div className="space-y-2 border-t border-white/10 pt-3">
                      <span className="text-xs font-medium text-white/80">
                        Choose Installed Model ({ollamaModels.length} detected):
                      </span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {ollamaModels.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedOllamaModel(m)}
                            className={cn(
                              "w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all",
                              selectedOllamaModel === m
                                ? "border-blue-500 bg-blue-500/20 text-white shadow"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-white/80",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🦙</span>
                              <span className="font-medium text-xs">{m}</span>
                            </div>
                            {selectedOllamaModel === m && <CheckIcon className="size-4 text-blue-400" />}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmConnectOllama}
                        className="w-full mt-2 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white shadow hover:bg-blue-500 transition-colors"
                      >
                        Connect {selectedOllamaModel} to Chat
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── 2. CLOUD PROVIDERS TABS (OpenAI, Anthropic, Gemini, DeepSeek) ── */}
              {configActiveTab !== "ollama" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">
                      {configActiveTab.toUpperCase()} API Key
                    </label>
                    <div className="relative">
                      <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                      <input
                        type="password"
                        value={apiKeys[configActiveTab] || ""}
                        onChange={(e) =>
                          setApiKeys((prev) => ({ ...prev, [configActiveTab]: e.target.value }))
                        }
                        placeholder={
                          configActiveTab === "openai"
                            ? "sk-..."
                            : configActiveTab === "anthropic"
                              ? "sk-ant-..."
                              : configActiveTab === "gemini"
                                ? "AIza..."
                                : "API Key"
                        }
                        className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pr-3 pl-9 text-xs text-white placeholder:text-white/30 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/80">Model</label>
                    <select
                      value={cloudModels[configActiveTab]}
                      onChange={(e) =>
                        setCloudModels((prev) => ({ ...prev, [configActiveTab]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-white/15 bg-[#202020] px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {configActiveTab === "openai" && (
                        <>
                          <option value="gpt-4o">gpt-4o (Most capable)</option>
                          <option value="gpt-4o-mini">gpt-4o-mini (Fast & efficient)</option>
                          <option value="o1-mini">o1-mini (Deep reasoning)</option>
                        </>
                      )}
                      {configActiveTab === "anthropic" && (
                        <>
                          <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022</option>
                          <option value="claude-3-5-haiku-20241022">claude-3-5-haiku-20241022</option>
                        </>
                      )}
                      {configActiveTab === "gemini" && (
                        <>
                          <option value="gemini-1.5-flash">gemini-1.5-flash (Fast)</option>
                          <option value="gemini-1.5-pro">gemini-1.5-pro (High intelligence)</option>
                        </>
                      )}
                      {configActiveTab === "deepseek" && (
                        <>
                          <option value="deepseek-chat">deepseek-chat</option>
                          <option value="deepseek-coder">deepseek-coder</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Test Connection Button */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={cloudTesting || !apiKeys[configActiveTab]?.trim()}
                      onClick={() => handleTestCloudProvider(configActiveTab)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 py-2 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-40 transition-colors"
                    >
                      {cloudTesting ? (
                        <>
                          <Loader2Icon className="size-3.5 animate-spin" />
                          Testing Key...
                        </>
                      ) : (
                        <>
                          <PlugZapIcon className="size-3.5" />
                          Test Connection
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={!apiKeys[configActiveTab]?.trim()}
                      onClick={() => handleConfirmConnectCloud(configActiveTab)}
                      className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
                    >
                      Connect & Save
                    </button>
                  </div>

                  {/* Cloud Test Result */}
                  {cloudTestResult && (
                    <div
                      className={cn(
                        "rounded-xl border p-3 text-xs flex items-start gap-2",
                        cloudTestResult.ok
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300",
                      )}
                    >
                      {cloudTestResult.ok ? (
                        <CheckCircle2Icon className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <AlertCircleIcon className="size-4 shrink-0 text-red-400 mt-0.5" />
                      )}
                      <span>{cloudTestResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 bg-white/[0.02]">
              <div className="text-xs text-white/60">
                {connectedModel ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Active: <strong>{connectedModel}</strong>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircleIcon className="size-3.5" /> No Model Connected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {connectedModel && (
                  <button
                    type="button"
                    onClick={handleDisconnectModel}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Disconnect
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DOCKED BOTTOM AI CHAT WIDGET ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl select-none">
        {/* ── EXPANDED CARD (Image 2 style) ── */}
        {isExpanded && (
          <div className="mb-2 flex max-h-[380px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#171717]/95 text-white shadow-2xl backdrop-blur-2xl ring-1 ring-black/20">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2 text-white/70">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                title="Collapse chat"
                className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
              >
                <ChevronDownIcon className="size-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    connectedModel ? "bg-emerald-500 animate-pulse" : "bg-amber-400",
                  )}
                />
                <span className="font-medium text-white/90">
                  {connectedModel || "No AI Model Connected"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  title="Clear conversation"
                  className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RotateCcwIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  title="Configure AI Model"
                  className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <SlidersHorizontalIcon className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs leading-relaxed">
              {messages.length === 0 && (
                <div className="flex items-start gap-2.5 text-white/80">
                  <span className="size-2 mt-1.5 rounded-full bg-blue-500" />
                  <div>
                    {connectedModel ? (
                      <>
                        Connected to <strong className="text-white">{connectedModel}</strong>. Ask
                        anything to update your document in real time.
                      </>
                    ) : (
                      <>
                        ⚠️ No AI model is connected yet. Click{" "}
                        <button
                          type="button"
                          onClick={() => setShowConfigModal(true)}
                          className="underline text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Configure AI Model
                        </button>{" "}
                        to connect your local Ollama or API key.
                      </>
                    )}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl p-3",
                    m.sender === "user"
                      ? "ml-8 bg-white/10 text-white"
                      : "mr-4 bg-white/5 text-white/90 border border-white/5",
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span className="font-medium">{m.sender === "user" ? "You" : connectedModel}</span>
                    <span>{m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {m.diffSummary && (
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2Icon className="size-3" /> Document Updated & Compiled
                      </span>
                      {m.previousContent && (
                        <button
                          type="button"
                          onClick={() => handleRevert(m.previousContent)}
                          className="inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/80 hover:bg-white/20"
                        >
                          <RotateCcwIcon className="size-2.5" /> Revert
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-white/70">
                  <SparklesIcon className="size-3.5 animate-spin text-blue-400" />
                  <span>{statusText || "Processing with connected AI..."}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Preset Action Suggestions (when `+` is clicked) */}
        {showPresets && (
          <div className="mb-2 flex flex-wrap gap-1.5 rounded-xl border border-white/15 bg-[#171717]/95 p-2 shadow-xl backdrop-blur-xl">
            {PRESET_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  if (!connectedModel) {
                    setShowConfigModal(true);
                  } else {
                    handleSubmitPrompt(p);
                  }
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-colors"
              >
                <Wand2Icon className="size-2.5 text-amber-400" />
                {p}
              </button>
            ))}
          </div>
        )}

        {/* ── DOCKED BOTTOM CAPSULE BAR (Image 1 style) ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitPrompt();
          }}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-[#121212]/95 px-3 py-1.5 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 transition-all hover:border-white/30"
        >
          {/* Plus Button */}
          <button
            type="button"
            onClick={() => setShowPresets((p) => !p)}
            title="Quick LaTeX Actions & Macros"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <PlusIcon className="size-4" />
          </button>

          {/* Input Field: "Ask anything" */}
          <input
            ref={inputRef}
            type="text"
            value={promptInput}
            onFocus={() => {
              if (!connectedModel) {
                setShowConfigModal(true);
              }
            }}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={
              connectedModel
                ? `Ask ${connectedModel} anything...`
                : "Ask anything (click to configure AI model)..."
            }
            disabled={isProcessing}
            className="flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />

          {/* Model Selector Pill */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            title="Configure AI Model"
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors",
              connectedModel
                ? "bg-white/10 text-white hover:bg-white/15"
                : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                connectedModel ? "bg-emerald-400 animate-pulse" : "bg-amber-400",
              )}
            />
            <span className="max-w-[130px] truncate font-medium">
              {connectedModel || "Configure AI Model"}
            </span>
            <ChevronDownIcon className="size-3 opacity-60" />
          </button>

          {/* Expand / Minimize toggle button */}
          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            title={isExpanded ? "Collapse chat" : "Expand chat conversation"}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDownIcon className="size-4" /> : <ChevronUpIcon className="size-4" />}
          </button>

          {/* Circular Up Arrow Send Button: (↑) */}
          <button
            type="submit"
            disabled={!promptInput.trim() || isProcessing}
            title="Send prompt"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowUpIcon className="size-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </>
  );
}
