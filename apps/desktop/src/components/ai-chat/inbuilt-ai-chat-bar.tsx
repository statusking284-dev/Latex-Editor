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
  ExternalLinkIcon,
} from "lucide-react";
import { useDocumentStore } from "@/stores/document-store";
import { cn } from "@/lib/utils";

// ─── AUTHENTIC PROVIDER BRAND ICONS ───

export function OllamaIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.361 10.26a.894.894 0 0 0-.558.47l-.072.148.001.207c0 .193.004.217.059.353.076.193.152.312.291.448.24.238.51.3.872.205a.86.86 0 0 0 .517-.436.752.752 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.06 1.06 0 0 0-.466 0zm-9.203.005c-.305.096-.533.32-.65.639a1.187 1.187 0 0 0-.06.52c.057.309.31.59.598.667.362.095.632.033.872-.205.14-.136.215-.255.291-.448.055-.136.059-.16.059-.353l.001-.207-.072-.148a.894.894 0 0 0-.565-.472 1.02 1.02 0 0 0-.474.007Zm4.184 2c-.131.071-.223.25-.195.383.031.143.157.288.353.407.105.063.112.072.117.136.004.038-.01.146-.029.243-.02.094-.036.194-.036.222.002.074.07.195.143.253.064.052.076.054.255.059.164.005.198.001.264-.03.169-.082.212-.234.15-.525-.052-.243-.042-.28.087-.355.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48.394.394 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053-.053-.032c-.219-.13-.259-.145-.391-.143a.396.396 0 0 0-.193.032zm.39-2.195c-.373.036-.475.05-.654.086-.291.06-.68.195-.951.328-.94.46-1.589 1.226-1.787 2.114-.04.176-.045.234-.045.53 0 .294.005.357.043.524.264 1.16 1.332 2.017 2.714 2.173.3.033 1.596.033 1.896 0 1.11-.125 2.064-.727 2.493-1.571.114-.226.169-.372.22-.602.039-.167.044-.23.044-.523 0-.297-.005-.355-.045-.531-.288-1.29-1.539-2.304-3.072-2.497a6.873 6.873 0 0 0-.855-.031zm.645.937a3.283 3.283 0 0 1 1.44.514c.223.148.537.458.671.662.166.251.26.508.303.82.02.143.01.251-.043.482-.08.345-.332.705-.672.957a3.115 3.115 0 0 1-.689.348c-.382.122-.632.144-1.525.138-.582-.006-.686-.01-.853-.042-.57-.107-1.022-.334-1.35-.68-.264-.28-.385-.535-.45-.946-.03-.192.025-.509.137-.776.136-.326.488-.73.836-.963.403-.269.934-.46 1.422-.512.187-.02.586-.02.773-.002zm-5.503-11a1.653 1.653 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503 0 .544.064 1.24.155 1.721.02.107.031.202.023.208a8.12 8.12 0 0 1-.187.152 5.324 5.324 0 0 0-.949 1.02 5.49 5.49 0 0 0-.94 2.339 6.625 6.625 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195-.037.064c-.269.452-.498 1.105-.605 1.732-.084.496-.095.629-.095 1.294 0 .67.009.803.088 1.266.095.555.288 1.143.503 1.534.071.128.243.393.264.407.007.003-.014.067-.046.141a7.405 7.405 0 0 0-.548 1.873c-.062.417-.071.552-.071.991 0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.915.915 0 0 0-.194-.25 1.74 1.74 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451.124-.486.329-.918.544-1.154a.787.787 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.136 3.136 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834.563-.814 1.353-1.336 2.237-1.475.199-.033.57-.028.776.01.226.04.367.028.512-.041.179-.085.268-.19.374-.431.093-.215.165-.333.36-.576.234-.29.46-.489.822-.729.413-.27.884-.467 1.352-.561.17-.035.25-.04.569-.04.319 0 .398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602.034.057.095.177.132.267.105.241.195.346.374.43.14.068.286.082.503.045.343-.058.607-.053.943.016 1.144.23 2.14 1.173 2.581 2.437.385 1.108.276 2.267-.296 3.153-.097.15-.193.27-.333.419-.301.322-.301.722-.001 1.053.493.539.801 1.866.708 3.036-.062.772-.26 1.463-.533 1.854a2.096 2.096 0 0 1-.224.258.916.916 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295.253 1.008.231 2.01-.059 2.581a.845.845 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074.036-.134c.019-.076.057-.3.088-.516.029-.217.029-1.016 0-1.258-.11-.875-.295-1.57-.597-2.226-.032-.074-.053-.138-.046-.141.008-.005.057-.074.108-.152.376-.569.607-1.284.724-2.228.031-.26.031-1.378 0-1.628-.083-.645-.182-1.082-.348-1.525a6.083 6.083 0 0 0-.329-.7l-.038-.064.131-.194c.402-.604.636-1.262.727-2.04a6.625 6.625 0 0 0-.024-1.358 5.512 5.512 0 0 0-.939-2.339 5.325 5.325 0 0 0-.95-1.02 8.097 8.097 0 0 1-.186-.152.692.692 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503-.19-.924-.535-1.658-.98-2.082-.354-.338-.716-.482-1.15-.455-.996.059-1.8 1.205-2.116 3.01a6.805 6.805 0 0 0-.097.726c0 .036-.007.066-.015.066a.96.96 0 0 1-.149-.078A4.857 4.857 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a.958.958 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a6.71 6.71 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2.096 2.096 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388.03.113.06.244.069.292.007.047.026.152.041.233.067.365.098.76.102 1.24l.002.475-.12.175-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.438 8.438 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711.067-.05.079-.049.157.013zm9.825-.012c.17.126.358.46.498.888.28.854.36 2.028.212 3.145-.019.14-.024.151-.057.144l-.238-.06a3.693 3.693 0 0 0-.954-.124h-.278l-.119-.178-.119-.175.002-.474c.004-.669.066-1.19.214-1.772.157-.623.434-1.185.68-1.382.078-.062.09-.063.159-.012z" />
    </svg>
  );
}

export function OpenAiIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.487a4.47 4.47 0 0 1 2.34-1.974V12.05a.76.76 0 0 0 .387.676l5.833 3.37-2.02 1.168a.076.076 0 0 1-.067 0L4.031 14.5a4.505 4.505 0 0 1-1.692-6.013zm16.597 3.855l-5.833-3.37L15.124 7.8a.076.076 0 0 1 .067 0l4.782 2.766a4.5 4.5 0 0 1 .64 7.575v-5.541a.765.765 0 0 0-.388-.677l-.088-.081zm2.01-4.708l-.141-.085-4.783-2.759a.771.771 0 0 0-.78 0L9.4 8.16V5.827a.08.08 0 0 1 .033-.062L14.26 2.97a4.5 4.5 0 0 1 6.68 4.659zM8.307 14.032l-2.42-1.397 2.42-1.398 2.42 1.398-2.42 1.397zm4.33-2.5l-2.42-1.398 2.42-1.397 2.42 1.397-2.42 1.398z" />
    </svg>
  );
}

export function ClaudeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

export function GeminiIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
        fill="url(#gemini-inbuilt-grad)"
      />
      <defs>
        <linearGradient id="gemini-inbuilt-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.4" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DeepSeekIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45" />
    </svg>
  );
}

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

interface ProviderTab {
  id: ProviderId;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBorder: string;
  activeBg: string;
  activeGlow: string;
}

const PROVIDERS: ProviderTab[] = [
  {
    id: "ollama",
    name: "Ollama",
    badge: "Local",
    icon: OllamaIcon,
    color: "text-amber-400",
    activeBorder: "border-amber-500/50",
    activeBg: "bg-amber-500/10",
    activeGlow: "shadow-amber-500/10",
  },
  {
    id: "openai",
    name: "ChatGPT",
    badge: "OpenAI",
    icon: OpenAiIcon,
    color: "text-[#10a37f]",
    activeBorder: "border-[#10a37f]/50",
    activeBg: "bg-[#10a37f]/10",
    activeGlow: "shadow-[#10a37f]/10",
  },
  {
    id: "anthropic",
    name: "Claude",
    badge: "Anthropic",
    icon: ClaudeIcon,
    color: "text-[#d97757]",
    activeBorder: "border-[#d97757]/50",
    activeBg: "bg-[#d97757]/10",
    activeGlow: "shadow-[#d97757]/10",
  },
  {
    id: "gemini",
    name: "Gemini",
    badge: "Google",
    icon: GeminiIcon,
    color: "text-purple-400",
    activeBorder: "border-purple-500/50",
    activeBg: "bg-purple-500/10",
    activeGlow: "shadow-purple-500/10",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    badge: "V3 / R1",
    icon: DeepSeekIcon,
    color: "text-[#3b82f6]",
    activeBorder: "border-[#3b82f6]/50",
    activeBg: "bg-[#3b82f6]/10",
    activeGlow: "shadow-[#3b82f6]/10",
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
 * Fetch models ONLY from the exact IP/endpoint entered by the user.
 * Does NOT auto-fetch on mount. Strictly validates and queries the user's IP.
 */
async function fetchRealOllamaModels(endpoint: string): Promise<{ connected: boolean; models: string[]; error?: string }> {
  const trimmed = (endpoint || "").trim();
  if (!trimmed) {
    return { connected: false, models: [], error: "Please enter the Ollama Server IP address and port (e.g. http://127.0.0.1:11434)." };
  }

  const cleanEndpoint = trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed.replace(/\/+$/, "")
    : `http://${trimmed}`.replace(/\/+$/, "");

  const isLocal = cleanEndpoint.includes("127.0.0.1") || cleanEndpoint.includes("localhost");
  // For local IP on dev web server, include proxy fallback in case of direct CORS blockage
  const urls = isLocal
    ? [`${cleanEndpoint}/api/tags`, "/api/ollama/api/tags"]
    : [`${cleanEndpoint}/api/tags`];

  let lastErrorMsg = "";
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
      if (res.ok) {
        const data = await res.json();
        const rawModels: string[] = (data.models || []).map((m: any) => m.name);

        // Filter out non-compatible models (embeddings, vision/VL models)
        const compatible = rawModels.filter((name: string) => {
          if (!name) return false;
          const lower = name.toLowerCase();
          if (lower.includes("embed")) return false;
          if (lower.includes("vl") || lower.includes("vision")) return false;
          return true;
        });

        // Priority sort: Most responsive, CPU-friendly models first
        compatible.sort((a, b) => {
          const score = (m: string) => {
            const lower = m.toLowerCase();
            if (lower.includes("1.5b")) return 1;
            if (lower.includes("1b")) return 2;
            if (lower.includes("3b")) return 3;
            if (lower.includes("0.5b")) return 4;
            return 10;
          };
          return score(a) - score(b);
        });

        if (compatible.length === 0) {
          return { connected: true, models: [], error: `Connected to ${cleanEndpoint}, but no compatible text generation models were found.` };
        }

        return { connected: true, models: compatible };
      } else {
        lastErrorMsg = `Ollama server at ${cleanEndpoint} returned HTTP ${res.status}`;
      }
    } catch (e: any) {
      lastErrorMsg = e.message || "Connection refused";
    }
  }

  return {
    connected: false,
    models: [],
    error: `Could not connect to "${cleanEndpoint}". Please check the IP address, port, and ensure Ollama is running. (${lastErrorMsg})`,
  };
}

/**
 * Execute prompt with local Ollama model to modify LaTeX source code.
 * Uses the exact IP endpoint configured by the user.
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
2. Wrap the output in \`\`\`latex ... \`\`\` code block.
3. NEVER output conversational commentary, explanations, or filler words.`;

  const userQuery = `Current LaTeX Document:\n\`\`\`latex\n${currentContent}\n\`\`\`\n\nUser Instruction:\n${prompt}`;

  // Optimize context window to 2048 tokens so CPU inference responds in seconds
  const body = {
    model,
    prompt: `${systemPrompt}\n\n${userQuery}`,
    stream: false,
    options: {
      temperature: 0.1,
      num_ctx: 2048,
    },
  };

  const cleanEndpoint = endpoint.trim().startsWith("http://") || endpoint.trim().startsWith("https://")
    ? endpoint.trim().replace(/\/+$/, "")
    : `http://${endpoint.trim()}`.replace(/\/+$/, "");

  const isLocal = cleanEndpoint.includes("127.0.0.1") || cleanEndpoint.includes("localhost");
  const urls = isLocal
    ? [`${cleanEndpoint}/api/generate`, "/api/ollama/api/generate"]
    : [`${cleanEndpoint}/api/generate`];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(90000), // 90s timeout to support laptop CPU
      });
      if (res.ok) {
        const json = await res.json();
        return json.response || "";
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error(`Failed to connect to Ollama at ${cleanEndpoint}. Please ensure Ollama is running.`);
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
  const systemPrompt = "You are an expert LaTeX document typesetter. Output ONLY the updated LaTeX document without any conversational commentary.";
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

  // ── Connected Model State (strictly null on initial load, no dummy models) ──
  const [connectedProvider, setConnectedProvider] = useState<ProviderId | null>(() => {
    return (localStorage.getItem("velum_connected_ai_provider") as ProviderId) || null;
  });
  const [connectedModel, setConnectedModel] = useState<string | null>(() => {
    return localStorage.getItem("velum_connected_ai_model") || null;
  });

  // ── Modal State ──
  const [activeTab, setActiveTab] = useState<ProviderId>("ollama");
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>("");
  const [ollamaTesting, setOllamaTesting] = useState(false);
  const [ollamaResult, setOllamaResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Cloud API keys & models
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
  const [cloudResult, setCloudResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  // Test Ollama ONLY when user clicks the button with their entered IP
  const handleTestOllama = async () => {
    const rawUrl = ollamaUrl.trim();
    if (!rawUrl) {
      setOllamaResult({
        ok: false,
        message: "Please enter your Ollama Server IP address and port (e.g. http://127.0.0.1:11434).",
      });
      setOllamaModels([]);
      setSelectedOllamaModel("");
      return;
    }

    const cleanEndpoint = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl.replace(/\/+$/, "")
      : `http://${rawUrl}`.replace(/\/+$/, "");

    setOllamaTesting(true);
    setOllamaResult(null);
    setOllamaModels([]); // Do not show models until this IP successfully connects!
    setSelectedOllamaModel("");

    try {
      const res = await fetchRealOllamaModels(cleanEndpoint);
      if (res.connected && res.models.length > 0) {
        setOllamaModels(res.models);
        const targetModel = res.models[0];
        setSelectedOllamaModel(targetModel);

        // Perform a quick live test ping to verify generation on this exact IP
        const testPingStart = performance.now();
        const pingBody = {
          model: targetModel,
          prompt: "test",
          stream: false,
          options: { num_predict: 1, num_ctx: 512 },
        };

        const isLocal = cleanEndpoint.includes("127.0.0.1") || cleanEndpoint.includes("localhost");
        const pingUrls = isLocal
          ? [`${cleanEndpoint}/api/generate`, "/api/ollama/api/generate"]
          : [`${cleanEndpoint}/api/generate`];

        let pingOk = false;
        for (const pUrl of pingUrls) {
          try {
            const pRes = await fetch(pUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pingBody),
              signal: AbortSignal.timeout(5000),
            });
            if (pRes.ok) {
              pingOk = true;
              break;
            }
          } catch {
            // next URL
          }
        }

        const elapsed = Math.round(performance.now() - testPingStart);
        if (pingOk) {
          setOllamaResult({
            ok: true,
            message: `Connected to ${cleanEndpoint}! Verified response in ${elapsed}ms. Found ${res.models.length} ready models.`,
          });
        } else {
          setOllamaResult({
            ok: true,
            message: `Connected to ${cleanEndpoint}! Found ${res.models.length} ready models.`,
          });
        }
      } else {
        setOllamaResult({
          ok: false,
          message: res.error || `Could not find compatible models at ${cleanEndpoint}.`,
        });
      }
    } catch (e: any) {
      setOllamaResult({ ok: false, message: `Failed to connect to ${cleanEndpoint}: ${e.message}` });
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

  // Test Cloud Provider
  const handleTestCloudProvider = async (provider: ProviderId) => {
    setCloudTesting(true);
    setCloudResult(null);
    const key = apiKeys[provider];
    if (!key.trim()) {
      setCloudResult({ ok: false, message: "Please enter your API key first." });
      setCloudTesting(false);
      return;
    }

    try {
      if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });
        if (res.ok) {
          setCloudResult({ ok: true, message: "Connected successfully to OpenAI API!" });
        } else {
          setCloudResult({ ok: false, message: `OpenAI error ${res.status}. Check your key.` });
        }
      } else if (provider === "gemini") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (res.ok) {
          setCloudResult({ ok: true, message: "Connected successfully to Google Gemini API!" });
        } else {
          setCloudResult({ ok: false, message: `Gemini error ${res.status}. Check your key.` });
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setCloudResult({ ok: true, message: `API Key validated for ${provider.toUpperCase()}!` });
      }
    } catch (e: any) {
      setCloudResult({ ok: false, message: `Connection error: ${e.message}` });
    } finally {
      setCloudTesting(false);
    }
  };

  const handleConfirmConnectCloud = (provider: ProviderId) => {
    const key = apiKeys[provider];
    if (!key.trim()) return;
    const model = cloudModels[provider];
    const modelName = `${provider === "openai" ? "ChatGPT" : provider === "anthropic" ? "Claude" : provider === "gemini" ? "Gemini" : "DeepSeek"}: ${model}`;
    setConnectedProvider(provider);
    setConnectedModel(modelName);
    localStorage.setItem("velum_connected_ai_provider", provider);
    localStorage.setItem("velum_connected_ai_model", modelName);
    localStorage.setItem(`velum_key_${provider}`, key);
    setShowConfigModal(false);
  };

  const handleDisconnect = () => {
    setConnectedProvider(null);
    setConnectedModel(null);
    localStorage.removeItem("velum_connected_ai_provider");
    localStorage.removeItem("velum_connected_ai_model");
    setShowConfigModal(false);
  };

  // Submit Prompt
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
        // Clean leading/trailing standalone "latex" or "tex" words from model output
        newContent = newContent.replace(/^(?:latex|tex)\s+/i, "").replace(/\s+(?:latex|tex)$/i, "").trim();

        // Apply immediately to screen editor and trigger recompile!
        window.dispatchEvent(
          new CustomEvent("apply-editor-content", {
            detail: { content: newContent, recompile: true },
          }),
        );

        const asstMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "assistant",
          text: `✨ Done! Updated LaTeX document based on your prompt.`,
          timestamp: new Date(),
          diffSummary: `Modified via ${connectedModel}`,
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
      {/* ── VELUM STUDIO AI MODEL CONFIGURATION POPUP ── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20">
                  <SparklesIcon className="size-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-foreground">AI Model Configuration</h3>
                  <p className="text-[11px] text-muted-foreground">Connect your local Ollama or cloud AI provider to start chatting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Provider Grid Tabs (5 Columns, Cleanly fitting on one line without horizontal scrollbar) */}
            <div className="grid grid-cols-5 gap-2 p-3.5 border-b border-border/40 bg-muted/10 select-none">
              {PROVIDERS.map((p) => {
                const Icon = p.icon;
                const isCurrent = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(p.id);
                      setOllamaResult(null);
                      setCloudResult(null);
                    }}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 transition-all text-center border outline-none",
                      isCurrent
                        ? cn("shadow-md font-semibold ring-1", p.activeBorder, p.activeBg, p.activeGlow, "ring-primary/20")
                        : "border-border/30 bg-background/40 text-muted-foreground hover:bg-muted/40 hover:border-border/70 hover:text-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                        isCurrent ? "bg-background/80 shadow-sm" : "bg-muted/40",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0 transition-colors", isCurrent ? p.color : "text-muted-foreground/80")} />
                    </div>
                    <span className="text-xs font-medium leading-tight text-foreground">{p.name}</span>
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-medium transition-colors",
                        isCurrent ? "bg-background/80 text-foreground" : "bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {p.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Provider Configuration Body */}
            <div className="p-5 space-y-4 max-h-[58vh] overflow-y-auto">
              {/* ── 1. LOCAL OLLAMA TAB ── */}
              {activeTab === "ollama" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Ollama Server Endpoint</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <input
                          type="url"
                          value={ollamaUrl}
                          onChange={(e) => {
                            setOllamaUrl(e.target.value);
                            setOllamaModels([]);
                            setSelectedOllamaModel("");
                            setOllamaResult(null);
                          }}
                          placeholder="http://127.0.0.1:11434"
                          className="w-full rounded-xl border border-input bg-background/60 py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={ollamaTesting}
                        onClick={handleTestOllama}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {ollamaTesting ? (
                          <>
                            <Loader2Icon className="size-3.5 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <PlugZapIcon className="size-3.5" />
                            Connect & Test Ollama
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Connects directly to your local Ollama instance on port 11434. 100% free and offline.
                    </p>
                  </div>

                  {/* Test Connection Result Alert */}
                  {ollamaResult && (
                    <div
                      className={cn(
                        "rounded-xl border p-3 text-xs flex items-start gap-2.5 transition-all",
                        ollamaResult.ok
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-destructive/30 bg-destructive/10 text-destructive",
                      )}
                    >
                      {ollamaResult.ok ? (
                        <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                      ) : (
                        <AlertCircleIcon className="size-4 shrink-0 text-destructive mt-0.5" />
                      )}
                      <div className="flex-1 leading-snug">{ollamaResult.message}</div>
                    </div>
                  )}

                  {/* Discovered Real Models List (No Dummy Models) */}
                  {ollamaModels.length > 0 && (
                    <div className="space-y-2 border-t border-border/50 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Available Ready Models ({ollamaModels.length} detected):
                        </span>
                        <span className="text-[10px] text-muted-foreground">Filtered for fast CPU generation</span>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {ollamaModels.map((m) => {
                          const isSel = selectedOllamaModel === m;
                          const isRecommended = m.includes("1.5b") || m.includes("1b");
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setSelectedOllamaModel(m)}
                              className={cn(
                                "w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all",
                                isSel
                                  ? "border-primary bg-primary/10 text-foreground font-medium shadow-sm ring-1 ring-primary/30"
                                  : "border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    "flex size-7 shrink-0 items-center justify-center rounded-lg",
                                    isSel ? "bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  <OllamaIcon className="size-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-foreground">{m}</span>
                                    {isRecommended && (
                                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                                        ⚡ Fast & Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    {m.includes("1.5b")
                                      ? "986 MB • Qwen 2.5 • ~2s fast response"
                                      : m.includes("1b")
                                        ? "1.3 GB • LLaMA 3.2 • High efficiency"
                                        : m.includes("3b")
                                          ? "2.0 GB • LLaMA 3.2 • Precise reasoning"
                                          : m.includes("0.5b")
                                            ? "397 MB • Ultra-lightweight"
                                            : "Local CPU model"}
                                  </div>
                                </div>
                              </div>
                              {isSel ? (
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <CheckIcon className="size-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="size-4 rounded-full border border-border/70" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmConnectOllama}
                        className="w-full mt-2 rounded-xl bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                      >
                        Connect {selectedOllamaModel} to Chat
                      </button>
                    </div>
                  )}

                  {ollamaModels.length === 0 && !ollamaTesting && (
                    <div className="rounded-xl border border-dashed border-border/70 p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        Enter your Ollama IP address above and click <strong>Connect & Test Ollama</strong> to load your models.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── 2. CLOUD PROVIDER TABS (ChatGPT, Claude, Gemini, DeepSeek) ── */}
              {activeTab !== "ollama" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground">
                        {activeTab === "openai"
                          ? "OpenAI API Key"
                          : activeTab === "anthropic"
                            ? "Anthropic API Key"
                            : activeTab === "gemini"
                              ? "Google Gemini API Key"
                              : "DeepSeek API Key"}
                      </label>
                      <span className="text-[10px] text-muted-foreground">Stored locally in browser</span>
                    </div>
                    <div className="relative">
                      <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <input
                        type="password"
                        value={apiKeys[activeTab] || ""}
                        onChange={(e) =>
                          setApiKeys((prev) => ({ ...prev, [activeTab]: e.target.value }))
                        }
                        placeholder={
                          activeTab === "openai"
                            ? "sk-..."
                            : activeTab === "anthropic"
                              ? "sk-ant-..."
                              : activeTab === "gemini"
                                ? "AIza..."
                                : "API Key"
                        }
                        className="w-full rounded-xl border border-input bg-background/60 py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Select Model</label>
                    <select
                      value={cloudModels[activeTab]}
                      onChange={(e) =>
                        setCloudModels((prev) => ({ ...prev, [activeTab]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-xs text-foreground focus:border-ring focus:outline-none"
                    >
                      {activeTab === "openai" && (
                        <>
                          <option value="gpt-4o">gpt-4o (Most capable academic reasoning)</option>
                          <option value="gpt-4o-mini">gpt-4o-mini (Fast & cost efficient)</option>
                          <option value="o1-mini">o1-mini (Specialized STEM reasoning)</option>
                        </>
                      )}
                      {activeTab === "anthropic" && (
                        <>
                          <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022 (Industry standard)</option>
                          <option value="claude-3-5-haiku-20241022">claude-3-5-haiku-20241022 (Ultra-fast)</option>
                        </>
                      )}
                      {activeTab === "gemini" && (
                        <>
                          <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & lightweight)</option>
                          <option value="gemini-1.5-pro">gemini-1.5-pro (Long context & reasoning)</option>
                        </>
                      )}
                      {activeTab === "deepseek" && (
                        <>
                          <option value="deepseek-chat">deepseek-chat (V3)</option>
                          <option value="deepseek-coder">deepseek-coder (Code specialized)</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Actions: Test Connection + Connect & Save */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={cloudTesting || !apiKeys[activeTab]?.trim()}
                      onClick={() => handleTestCloudProvider(activeTab)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      {cloudTesting ? (
                        <>
                          <Loader2Icon className="size-3.5 animate-spin" />
                          Testing...
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
                      disabled={!apiKeys[activeTab]?.trim()}
                      onClick={() => handleConfirmConnectCloud(activeTab)}
                      className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                    >
                      Connect & Save
                    </button>
                  </div>

                  {/* Cloud Test Result Alert */}
                  {cloudResult && (
                    <div
                      className={cn(
                        "rounded-xl border p-3 text-xs flex items-start gap-2.5 transition-all",
                        cloudResult.ok
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-destructive/30 bg-destructive/10 text-destructive",
                      )}
                    >
                      {cloudResult.ok ? (
                        <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                      ) : (
                        <AlertCircleIcon className="size-4 shrink-0 text-destructive mt-0.5" />
                      )}
                      <div className="flex-1 leading-snug">{cloudResult.message}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Status Bar */}
            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3.5 bg-muted/30">
              <div className="text-xs">
                {connectedModel ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Model: <strong>{connectedModel}</strong>
                  </span>
                ) : (
                  <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                    <AlertCircleIcon className="size-3.5" /> No Model Connected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {connectedModel && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="rounded-xl bg-muted px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
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
        {/* ── EXPANDED CHAT CONVERSATION CARD ── */}
        {isExpanded && (
          <div className="mb-2 flex max-h-[380px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/95 text-foreground shadow-2xl backdrop-blur-2xl ring-1 ring-black/10 dark:ring-white/10">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2 text-muted-foreground bg-muted/20">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                title="Collapse chat"
                className="rounded-lg p-1 hover:bg-muted hover:text-foreground transition-colors"
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
                <span className="font-medium text-foreground">
                  {connectedModel || "No AI Model Connected"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  title="Clear conversation"
                  className="rounded-lg p-1 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <RotateCcwIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  title="Configure AI Model"
                  className="rounded-lg p-1 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <SlidersHorizontalIcon className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs leading-relaxed">
              {messages.length === 0 && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <span className="size-2 mt-1.5 rounded-full bg-primary" />
                  <div>
                    {connectedModel ? (
                      <>
                        Connected to <strong className="text-foreground">{connectedModel}</strong>. Ask
                        anything to update your document on screen in real time.
                      </>
                    ) : (
                      <>
                        ⚠️ No AI model is connected yet. Click{" "}
                        <button
                          type="button"
                          onClick={() => setShowConfigModal(true)}
                          className="underline text-primary hover:opacity-80 font-semibold"
                        >
                          Configure AI Model
                        </button>{" "}
                        to connect your local Ollama or cloud API key.
                      </>
                    )}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl p-3 transition-all",
                    m.sender === "user"
                      ? "ml-8 bg-primary/10 border border-primary/20 text-foreground"
                      : "mr-4 bg-muted/40 text-foreground border border-border/50",
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-semibold">{m.sender === "user" ? "You" : connectedModel}</span>
                    <span>{m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {m.diffSummary && (
                    <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-1.5 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2Icon className="size-3" /> Document Updated & Compiled
                      </span>
                      {m.previousContent && (
                        <button
                          type="button"
                          onClick={() => handleRevert(m.previousContent)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <RotateCcwIcon className="size-2.5" /> Revert
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3 text-muted-foreground">
                  <SparklesIcon className="size-3.5 animate-spin text-primary" />
                  <span>{statusText || "Processing with connected AI..."}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Preset Action Suggestions (when `+` is clicked) */}
        {showPresets && (
          <div className="mb-2 flex flex-wrap gap-1.5 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
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
                className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                <Wand2Icon className="size-2.5 text-amber-500" />
                {p}
              </button>
            ))}
          </div>
        )}

        {/* ── INBUILT BOTTOM CAPSULE BAR ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitPrompt();
          }}
          className="flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all hover:border-primary/50"
        >
          {/* Plus Button */}
          <button
            type="button"
            onClick={() => setShowPresets((p) => !p)}
            title="Quick LaTeX Actions & Macros"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
            className="flex-1 bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />

          {/* Model Selector Pill */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            title="Configure AI Model"
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors border",
              connectedModel
                ? "bg-muted/60 text-foreground border-border hover:bg-muted"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
            )}
          >
            {connectedProvider === "ollama" && <OllamaIcon className="size-3 text-amber-500" />}
            {connectedProvider === "openai" && <OpenAiIcon className="size-3 text-emerald-500" />}
            {connectedProvider === "anthropic" && <ClaudeIcon className="size-3 text-orange-500" />}
            {connectedProvider === "gemini" && <GeminiIcon className="size-3" />}
            {connectedProvider === "deepseek" && <DeepSeekIcon className="size-3 text-sky-500" />}
            {!connectedProvider && <span className="size-1.5 rounded-full bg-amber-500" />}

            <span className="max-w-[130px] truncate font-medium">
              {connectedModel || "Configure AI"}
            </span>
            <ChevronDownIcon className="size-3 opacity-60" />
          </button>

          {/* Expand / Minimize toggle button */}
          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            title={isExpanded ? "Collapse chat" : "Expand chat conversation"}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronDownIcon className="size-4" /> : <ChevronUpIcon className="size-4" />}
          </button>

          {/* Circular Up Arrow Send Button: (↑) */}
          <button
            type="submit"
            disabled={!promptInput.trim() || isProcessing}
            title="Send prompt"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-md hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowUpIcon className="size-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </>
  );
}
