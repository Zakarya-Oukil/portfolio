const PHOTO = {
  // Security & CTF
  secNids:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=90",
  secStuxnet:
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=90",
  secEjpt:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=90",
  secEbpf:
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1400&q=90",

  // Full Stack
  fsZakos:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=90",
  fsVoyage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90",
  fsTelemetry:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=90",
  fsRaft:
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=90",

  // Systems & OS
  sysMalloc:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=90",
  sysVault:
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1400&q=90",
  sysMesh:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=90",
  sysWasm:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=90",

  // Cloud & AI
  aiLlmRed:
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=90",
  aiSoc:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=90",
  aiBinDiff:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=90",
  aiContainer:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=90",

  // Avatars
  avatarOne:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85",
  avatarTwo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  avatarThree:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
};

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

export const PROJECTS = [
  /* -------------------------- SECURITY & CTF -------------------------- */
  {
    id: "sec-ml-ids",
    country: "Security & CTF",
    title: "ML Intrusion Detection",
    subtitle: "Random Forest & Streamlit",
    location: "Python / Scikit-Learn",
    image: PHOTO.secNids,
    duration: "99.4% ACC",
    distance: "0.4ms LAT",
    likes: 412,
    saves: 84,
    views: 1240,
    description:
      "Trained an ensemble ML classifier on packet telemetry to detect volumetric DoS/DDoS anomalies in real time.",
  },
  {
    id: "sec-stuxnet",
    country: "Security & CTF",
    title: "Stuxnet SCADA Analysis",
    subtitle: "Zero-Day Exploit Breakdown",
    location: "Assembly / Siemens PLC",
    image: PHOTO.secStuxnet,
    duration: "4 ZERO-DAYS",
    distance: "PLC MESH",
    likes: 541,
    saves: 112,
    views: 1680,
    description:
      "Decompiled and analyzed Siemens step-7 PLC rootkits, Windows kernel zero-days, and man-in-the-middle frequency attacks.",
  },
  {
    id: "sec-ejpt",
    country: "Security & CTF",
    title: "eJPT / HTB DMZ Suite",
    subtitle: "Active Directory Assessment",
    location: "Kali / Chisel / Kerberos",
    image: PHOTO.secEjpt,
    duration: "18 TARGETS",
    distance: "3 SUBNETS",
    likes: 487,
    saves: 96,
    views: 1420,
    description:
      "Automated lateral movement, bloodhound pivoting, Kerberoasting, and token impersonation pipelines for DMZ penetration testing.",
  },
  {
    id: "sec-ebpf",
    country: "Security & CTF",
    title: "eBPF Kernel Sandbox",
    subtitle: "Zero-Trust Security Monitor",
    location: "C / Linux Kernel / Go",
    image: PHOTO.secEbpf,
    duration: "0% RUNTIME DROP",
    distance: "RING-0",
    likes: 376,
    saves: 78,
    views: 1190,
    description:
      "Attached hook points to trace execve/connect syscalls in real time, stopping unauthorized privilege escalations.",
  },

  /* ---------------------------- FULL STACK ---------------------------- */
  {
    id: "fs-zakos",
    country: "Full Stack",
    title: "ZakOS Agentic OS",
    subtitle: "Interactive Agent Web Platform",
    location: "React / TypeScript / Tailwind",
    image: PHOTO.fsZakos,
    duration: "SUB-10MS",
    distance: "6 AGENTS",
    likes: 518,
    saves: 104,
    views: 1530,
    description:
      "Designed an agentic operating system interface with theme persistence, modular windows, and local model orchestration.",
  },
  {
    id: "fs-travel",
    country: "Full Stack",
    title: "Distributed Travel Platform",
    subtitle: "Real-Time Booking Mesh",
    location: "React Native / Node.js",
    image: PHOTO.fsVoyage,
    duration: "100K QPS",
    distance: "GLOBAL EDGE",
    likes: 426,
    saves: 91,
    views: 1310,
    description:
      "Full-stack travel booking application with real-time flight inventory aggregation, caching layers, and responsive UI physics.",
  },
  {
    id: "fs-telemetry",
    country: "Full Stack",
    title: "Real-Time Telemetry Canvas",
    subtitle: "High-Throughput Dashboard",
    location: "Next.js / WebSockets / Rust",
    image: PHOTO.fsTelemetry,
    duration: "60 FPS",
    distance: "LIVE BUS",
    likes: 334,
    saves: 65,
    views: 980,
    description:
      "Visualized thousands of concurrent IoT metrics using WebGL hardware-accelerated shaders and WebSocket streaming.",
  },
  {
    id: "fs-raft-kv",
    country: "Full Stack",
    title: "Decentralized KV Store",
    subtitle: "Raft Consensus Database",
    location: "Go / gRPC / Protobuf",
    image: PHOTO.fsRaft,
    duration: "3-NODE MESH",
    distance: "P99 2MS",
    likes: 455,
    saves: 89,
    views: 1420,
    description:
      "Implemented leader election, log compaction, and state replication guarantees following the Raft consensus paper.",
  },

  /* --------------------------- SYSTEMS & OS --------------------------- */
  {
    id: "sys-malloc",
    country: "Systems & OS",
    title: "Linux Memory Allocator",
    subtitle: "Custom malloc / free Engine",
    location: "C / POSIX / mmap",
    image: PHOTO.sysMalloc,
    duration: "O(1) BUCKET",
    distance: "ZERO LEAK",
    likes: 380,
    saves: 82,
    views: 1150,
    description:
      "Segregated-fit explicit free-list memory allocator outperforming glibc on micro-allocations with custom coalescing and heap fragmentation prevention.",
  },
  {
    id: "sys-vault",
    country: "Systems & OS",
    title: "Hardware Vault",
    subtitle: "Secure Element Cryptography",
    location: "C++ / ARM Cortex-M",
    image: PHOTO.sysVault,
    duration: "AES-256-GCM",
    distance: "HARDWARE RNG",
    likes: 298,
    saves: 64,
    views: 920,
    description:
      "Firmware implementation for an isolated cryptographic hardware security module managing ECDSA keypairs and air-gapped signature verification.",
  },
  {
    id: "sys-mesh",
    country: "Systems & OS",
    title: "BLE Tactical Radio",
    subtitle: "Low-Power Mesh Protocol",
    location: "Embedded C / Nordic nRF52",
    image: PHOTO.sysMesh,
    duration: "2.4 GHz MESH",
    distance: "1.2 KM RANGE",
    likes: 345,
    saves: 71,
    views: 1040,
    description:
      "Decentralized peer-to-peer radio communication mesh enabling encrypted text message broadcast across off-grid emergency sensor nodes.",
  },
  {
    id: "sys-wasm",
    country: "Systems & OS",
    title: "WASM Edge Runtime",
    subtitle: "Sandboxed Function Engine",
    location: "Rust / WebAssembly",
    image: PHOTO.sysWasm,
    duration: "1.2MS COLD",
    distance: "ISOLATED MEM",
    likes: 512,
    saves: 115,
    views: 1610,
    description:
      "Ultra-lightweight WebAssembly micro-runtime for executing untrusted serverless functions with strict memory and CPU instruction quotas.",
  },

  /* ---------------------------- CLOUD & AI ---------------------------- */
  {
    id: "ai-llm-red",
    country: "Cloud & AI",
    title: "LLM Red-Teaming Engine",
    subtitle: "Automated Jailbreak Scanner",
    location: "Python / PyTorch / Transformers",
    image: PHOTO.aiLlmRed,
    duration: "98% BYPASS",
    distance: "MULTI-MODEL",
    likes: 720,
    saves: 168,
    views: 2450,
    description:
      "Adversarial prompt injection suite employing genetic algorithms and automated gradient-guided mutations to evaluate LLM alignment guardrails.",
  },
  {
    id: "ai-soc-triager",
    country: "Cloud & AI",
    title: "Autonomous SOC Alert Triager",
    subtitle: "Multi-Agent Threat Classifier",
    location: "LangChain / FastAPI / Qdrant",
    image: PHOTO.aiSoc,
    duration: "85% AUTO-CLOSE",
    distance: "2.1S EVAL",
    likes: 604,
    saves: 142,
    views: 1980,
    description:
      "Agentic pipeline integrating SIEM alerts with vector memory to correlate multi-stage intrusion attempts and draft contextual incident reports.",
  },
  {
    id: "ai-bin-diff",
    country: "Cloud & AI",
    title: "Neural Binary Differ",
    subtitle: "Assembly Code Embedding Matcher",
    location: "PyTorch / Ghidra / Python",
    image: PHOTO.aiBinDiff,
    duration: "GNN EMBED",
    distance: "CROSS-ARCH",
    likes: 440,
    saves: 98,
    views: 1390,
    description:
      "Graph neural network mapping disassembled control flow graphs into geometric latent embeddings to detect identical patched vulnerabilities across x86 and ARM.",
  },
  {
    id: "ai-sandbox",
    country: "Cloud & AI",
    title: "Container Sandbox",
    subtitle: "Rootless Isolation Daemon",
    location: "Go / Linux Namespaces / cgroups v2",
    image: PHOTO.aiContainer,
    duration: "OCI COMPLIANT",
    distance: "GVISOR LEVEL",
    likes: 529,
    saves: 120,
    views: 1720,
    description:
      "Lightweight container runtime leveraging user namespaces, seccomp filters, and cgroups v2 to execute untrusted binaries without root privileges.",
  },
];

export const CATEGORIES = ["Security & CTF", "Full Stack", "Systems & OS", "Cloud & AI"];

