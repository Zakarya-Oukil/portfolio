import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

/* -------------------------------------------------------------------------- */
/*                                   ASSETS                                   */
/* -------------------------------------------------------------------------- */

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
  fsCollab:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=90",

  // Systems & OS
  sysRaft:
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=90",
  sysMalloc:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=90",
  sysVault:
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1400&q=90",
  sysMesh:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=90",

  // Cloud & AI
  aiLlmRed:
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=90",
  aiSoc:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=90",
  aiBinDiff:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=90",
  aiEdge:
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

const PROJECTS = [
  /* -------------------------- SECURITY & CTF -------------------------- */
  {
    id: "sec-nids",
    country: "Security & CTF",
    title: "NIDS with Machine Learning",
    subtitle: "ML Network Intrusion Detection Engine",
    location: "Python • Scapy • Random Forest • Streamlit",
    image: PHOTO.secNids,
    duration: "4 MOS",
    distance: "99.4% ACC",
    likes: 542,
    saves: 118,
    views: 1890,
    description:
      "Production-grade network intrusion detection system evaluating real-time PCAP traffic flows. Employs Random Forest and XGBoost ensembles trained on CIC-IDS2017 & NSL-KDD datasets with sub-10ms classification latency and zero false positives.",
    techStack: ["Python 3.11", "Scapy", "Random Forest", "Streamlit", "Redis", "Docker"],
    architectureNotes: "Packet capture hook -> Flow feature extractor (flags, IAT, length) -> ONNX classifier -> Redis Pub/Sub -> Streamlit SIEM dashboard.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sec-stuxnet",
    country: "Security & CTF",
    title: "Stuxnet SCADA Dissection",
    subtitle: "ICS Exploit & Malware Architecture Analysis",
    location: "Ghidra • x86 Asm • Step 7 PLC • C++",
    image: PHOTO.secStuxnet,
    duration: "2 MOS",
    distance: "4 ZERO-DAYS",
    likes: 780,
    saves: 164,
    views: 3120,
    description:
      "Deep static and dynamic reverse-engineering breakdown of Stuxnet. Includes isolated emulation of the 4 zero-day vulnerability chains (CVE-2010-2568 LNK parsing, print spooler elevation), driver signing bypasses, and Step 7 PLC payload frequency manipulation.",
    techStack: ["Ghidra", "x86 Asm", "C/C++", "Volatility 3", "Snap7", "Yara"],
    architectureNotes: "Snap7 simulated Siemens S7-300 PLC -> Memory dump reconstruction via Volatility 3 -> Annotated Ghidra CFG graphs.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sec-ejpt",
    country: "Security & CTF",
    title: "eJPT / HTB Assessment Suite",
    subtitle: "Automated Multi-Tier Pivoting Framework",
    location: "Go • Impacket • Chisel • Kerberos",
    image: PHOTO.secEjpt,
    duration: "3 MOS",
    distance: "10X PIVOT",
    likes: 620,
    saves: 142,
    views: 2450,
    description:
      "Offensive security penetration testing harness designed for nested DMZ environments. Integrates automated Chisel/SOCKS5 multi-hop tunneling, double-pivot port sweeps, AS-REP roasting, Kerberoasting, and BloodHound Cypher graph ingestion.",
    techStack: ["Go", "Python", "Impacket", "Chisel", "Kerberos", "BloodHound"],
    architectureNotes: "Async socket discovery daemon -> Nested SOCKS5 relays -> Automated credential harvester -> BloodHound attack pathing.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sec-ebpf",
    country: "Security & CTF",
    title: "Zero-Trust Kernel Sandbox",
    subtitle: "eBPF Syscall Monitor & mTLS Identity Broker",
    location: "C • eBPF • Go • Linux Kernel",
    image: PHOTO.secEbpf,
    duration: "5 MOS",
    distance: "< 42μs LAT",
    likes: 490,
    saves: 98,
    views: 1680,
    description:
      "High-performance host security enclave using eBPF probes attached to Linux kernel syscalls (sys_enter_execve, sys_enter_connect). Enforces micro-segmentation and kills unauthorized reverse shells in under 42 microseconds while enforcing SPIFFE mTLS.",
    techStack: ["C", "eBPF", "Go (Cilium)", "Linux Kernel 6.x", "SPIFFE/SPIRE"],
    architectureNotes: "Kernel C probes -> Ring buffer event dispatcher -> Go userspace enforcement daemon -> Seccomp profile isolator.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },

  /* -------------------------- FULL STACK -------------------------- */
  {
    id: "fs-zakos",
    country: "Full Stack",
    title: "ZakOS Agentic Web Interface",
    subtitle: "Multi-OS Device & Agent Platform",
    location: "React Native Web • TypeScript • Animated",
    image: PHOTO.fsZakos,
    duration: "3 MOS",
    distance: "60 FPS",
    likes: 940,
    saves: 230,
    views: 4200,
    description:
      "Interactive Web-based Operating System capable of simulating native iOS, Android (Material You), and Desktop environments with dynamic frame re-skinning, WebAssembly CLI terminal runtime, autonomous agent tool calling, and fluid gesture physics.",
    techStack: ["React Native Web", "TypeScript", "Vite", "Animated API", "Tailwind CSS"],
    architectureNotes: "Universal component engine -> PanResponder cursor physics -> Zero-flash overwrite crossfader -> Central reactive context.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "fs-voyage",
    country: "Full Stack",
    title: "Distributed Travel Platform",
    subtitle: "Event-Driven Booking & Discovery Engine",
    location: "Next.js 14 • Go • Kafka • Redis",
    image: PHOTO.fsVoyage,
    duration: "4 MOS",
    distance: "25K REQ/S",
    likes: 610,
    saves: 135,
    views: 2890,
    description:
      "High-concurrency global travel platform supporting instant destination reservations, dynamic currency pricing, and zero-flash fluid image crossfading. Built with distributed idempotency keys, optimistic UI updates, and Kafka transaction logs.",
    techStack: ["Next.js 14", "Go (gRPC)", "Apache Kafka", "Redis Cluster", "PostgreSQL"],
    architectureNotes: "App Router SSR -> gRPC microservices -> Kafka distributed event log -> Redis distributed locking -> Partitioned Postgres.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "fs-telemetry",
    country: "Full Stack",
    title: "High-Throughput Telemetry",
    subtitle: "ClickHouse & OpenTelemetry Pipeline",
    location: "Vector (Rust) • ClickHouse • Kafka",
    image: PHOTO.fsTelemetry,
    duration: "3 MOS",
    distance: "20M EV/M",
    likes: 520,
    saves: 112,
    views: 2100,
    description:
      "Enterprise telemetry aggregation mesh handling 20 million events per minute across Kubernetes clusters. Uses Vector collector agents, ClickHouse columnar database for sub-second analytical queries, and real-time anomaly alerting via Slack/PagerDuty.",
    techStack: ["ClickHouse", "Vector (Rust)", "Kafka", "Kubernetes", "Grafana"],
    architectureNotes: "DaemonSet collectors -> Kafka ingestion buffer -> ClickHouse streaming tables -> Grafana SQL telemetry visualizations.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "fs-collab",
    country: "Full Stack",
    title: "Real-Time Collab Canvas",
    subtitle: "CRDT Infinite Canvas Architecture",
    location: "TypeScript • WebRTC • Yjs • Canvas API",
    image: PHOTO.fsCollab,
    duration: "2 MOS",
    distance: "16ms SYNC",
    likes: 475,
    saves: 95,
    views: 1980,
    description:
      "Ultra-low latency infinite design canvas supporting multiplayer drawing, gesture zooming, and shape manipulation. Uses Yjs Conflict-Free Replicated Data Types (CRDTs) over WebRTC mesh connections with zero server state latency.",
    techStack: ["TypeScript", "Canvas API", "Yjs CRDT", "WebRTC", "WebSockets"],
    architectureNotes: "WebGL hardware acceleration -> Yjs delta synchronization -> WebRTC P2P mesh relay -> Local IndexedDB snapshotting.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },

  /* -------------------------- SYSTEMS & OS -------------------------- */
  {
    id: "sys-raft",
    country: "Systems & OS",
    title: "Raft Distributed KV Store",
    subtitle: "Log-Structured Consensus Database Engine",
    location: "Go • Raft • Protobuf • LSM-Tree",
    image: PHOTO.sysRaft,
    duration: "6 MOS",
    distance: "180K OPS",
    likes: 870,
    saves: 210,
    views: 3900,
    description:
      "Distributed fault-tolerant Key-Value store implementing the Raft consensus algorithm from scratch in Go. Features an LSM-Tree (Log-Structured Merge-Tree) storage engine with SSTables, memtables, Bloom filters, Write-Ahead Logging (WAL), and dynamic leader election.",
    techStack: ["Go 1.22", "Raft Protocol", "LSM-Tree", "Protobuf", "gRPC", "Linux"],
    architectureNotes: "Custom RPC transport layer -> WAL commit log -> LSM-Tree MemTable flush -> SSTable compaction with Bloom filters.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sys-malloc",
    country: "Systems & OS",
    title: "Custom Linux Memory Allocator",
    subtitle: "Thread-Safe Segregated Free List Allocator",
    location: "C17 • Syscall mmap • Pthreads",
    image: PHOTO.sysMalloc,
    duration: "2 MOS",
    distance: "3.2x SPEED",
    likes: 640,
    saves: 140,
    views: 2600,
    description:
      "High-efficiency replacement for malloc/free utilizing segregated size-class free lists, thread-local caching, and direct OS virtual memory management via mmap and madvise. Minimizes heap fragmentation and eliminates global lock contention.",
    techStack: ["C17", "mmap / sbrk", "Pthreads", "Valgrind", "GDB", "Benchmarking"],
    architectureNotes: "Thread-local arenas -> Segregated size bins -> Coalescing boundary tags -> Syscall virtual memory paging.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sys-vault",
    country: "Systems & OS",
    title: "Hardware Biometric Vault",
    subtitle: "Secure Enclave & StrongBox Password Manager",
    location: "React Native • Swift • Kotlin • AES-256",
    image: PHOTO.sysVault,
    duration: "3 MOS",
    distance: "QUANTUM RES",
    likes: 710,
    saves: 175,
    views: 2980,
    description:
      "Zero-knowledge encrypted mobile credential manager. Leverages Apple Secure Enclave (FaceID) on iOS and Android KeyStore StrongBox (Fingerprint) hardware to derive ephemeral AES-256-GCM keys. Master keys never touch RAM in plaintext.",
    techStack: ["React Native", "Swift", "Kotlin", "Secure Enclave", "AES-256-GCM", "Argon2id"],
    architectureNotes: "Argon2id key derivation -> Hardware-backed biometric signing -> Encrypted SQLite storage -> Zero-knowledge sync.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "sys-mesh",
    country: "Systems & OS",
    title: "Tactical P2P Field Mesh",
    subtitle: "CRDT Offline Tactical Field Network",
    location: "React Native • BLE • WebRTC • SQLite",
    image: PHOTO.sysMesh,
    duration: "4 MOS",
    distance: "120M MESH",
    likes: 670,
    saves: 155,
    views: 2750,
    description:
      "Tactical mobile communication application engineered for zero-connectivity environments. Synchronizes geospatial maps, tactical pins, and mission logs across devices using Yjs Conflict-Free Replicated Data Types (CRDTs) over Bluetooth Low Energy (BLE) and Wi-Fi Direct.",
    techStack: ["React Native", "TypeScript", "CRDTs", "BLE Peripheral", "WebRTC", "SQLite"],
    architectureNotes: "WatermelonDB local SQLite -> Yjs CRDT synchronization -> Bluetooth Central/Peripheral mesh routing.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },

  /* -------------------------- CLOUD & AI -------------------------- */
  {
    id: "ai-llmred",
    country: "Cloud & AI",
    title: "LLM Red-Team Benchmark",
    subtitle: "Automated Adversarial Security Harness",
    location: "Python • PyTorch • vLLM • LangChain",
    image: PHOTO.aiLlmRed,
    duration: "3 MOS",
    distance: "3.8K ATTACKS",
    likes: 890,
    saves: 245,
    views: 3800,
    description:
      "Autonomous red-teaming harness testing LLMs and multi-agent frameworks against prompt injections, token smuggling, jailbreaks, data exfiltration via indirect injections, and RAG poisoning. Automated fuzzing generates thousands of semantic payload variations.",
    techStack: ["Python", "PyTorch", "vLLM", "LangChain", "pgvector", "Docker"],
    architectureNotes: "Genetic prompt mutator -> Multi-vector judge evaluation -> OWASP LLM Top 10 scoring -> Vulnerability report export.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "ai-soc",
    country: "Cloud & AI",
    title: "Autonomous SOC Triager",
    subtitle: "Graph Neural Network for SIEM Anomalies",
    location: "PyTorch Geometric • Neo4j • FastAPI",
    image: PHOTO.aiSoc,
    duration: "4 MOS",
    distance: "88% FEWER PINGS",
    likes: 760,
    saves: 180,
    views: 3100,
    description:
      "Autonomous Tier-1 Security Operations Center triage bot. Parses millions of Windows Event Logs, Sysmon telemetry, and Zeek network traces, structuring them into a heterogeneous attack graph. Graph Convolutional Networks (GCN) identify lateral movement chains in minutes.",
    techStack: ["PyTorch Geometric", "Neo4j", "FastAPI", "Elasticsearch", "MITRE ATT&CK"],
    architectureNotes: "Sysmon log parser -> Heterogeneous attack graph in Neo4j -> GCN lateral movement classifier -> Sigma rule generator.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "ai-bindiff",
    country: "Cloud & AI",
    title: "Neural Binary Diffing Engine",
    subtitle: "Embedding-Based Vulnerability Matcher",
    location: "Ghidra • Python • PyTorch • FAISS",
    image: PHOTO.aiBinDiff,
    duration: "3 MOS",
    distance: "94.2% ACC",
    likes: 640,
    saves: 138,
    views: 2600,
    description:
      "Deep-learning based cross-architecture binary diffing tool. Extracts Control Flow Graphs (CFGs) from compiled binaries (ELF/PE) across x86, ARM, and MIPS, generating dense vector embeddings with Graph Attention Networks (GAT) to identify 1-day vulnerabilities across architectures.",
    techStack: ["Ghidra Headless", "Python", "PyTorch", "FAISS", "Assembly", "C"],
    architectureNotes: "Headless Ghidra P-Code extractor -> Graph Attention Network embedding model -> FAISS cosine similarity index.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
  {
    id: "ai-edge",
    country: "Cloud & AI",
    title: "Edge WASM Image Synthesizer",
    subtitle: "Sub-Millisecond Asset Compression at Edge",
    location: "Rust • WebAssembly • Cloudflare Workers",
    image: PHOTO.aiEdge,
    duration: "2 MOS",
    distance: "14ms TTFB",
    likes: 580,
    saves: 124,
    views: 2200,
    description:
      "Cloudflare Workers edge service executing WebAssembly-compiled image optimization libraries (libvips / mozjpeg / libwebp). Dynamically detects client device capabilities, screen DPR, and network speed to transcode assets into AVIF/WebP on the fly.",
    techStack: ["Rust", "WebAssembly", "Cloudflare Workers", "AVIF", "HTTP/3"],
    architectureNotes: "Rust wasm32 compilation -> V8 isolate binding -> Dynamic DPR/format negotiation -> Anycast edge caching.",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
  },
];

const FILTERS = ["Security & CTF", "Full Stack", "Systems & OS", "Cloud & AI"];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function detectInitialOS(): "ios" | "android" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (window.innerWidth <= 768) return "ios";
  return "desktop";
}

function Glyph({
  children,
  size = 18,
  color = "#111827",
  weight = "600",
  style,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: any;
  style?: any;
}) {
  return (
    <Text
      style={[
        {
          fontSize: size,
          color,
          fontWeight: weight,
          textAlign: "center",
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function ImageWithFallback({
  source,
  style,
  resizeMode = "cover",
  children,
}: {
  source: string;
  style?: any;
  resizeMode?: any;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [source]);

  return (
    <View style={[style, styles.imageFallback]}>
      {!failed ? (
        <Image
          source={{ uri: source }}
          resizeMode={resizeMode}
          style={StyleSheet.absoluteFill}
          onError={() => setFailed(true)}
          fadeDuration={180}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.failedImage]}>
          <Glyph size={28} color="#6B7280">
            ◇
          </Glyph>
          <Text style={styles.failedImageText}>Image unavailable</Text>
        </View>
      )}

      {children}
    </View>
  );
}

function SoftIconButton({
  children,
  onPress,
  size = 42,
  style,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  style?: any;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.softIconButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: pressed ? 0.65 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                            DYNAMIC SYSTEM CHROME                           */
/* -------------------------------------------------------------------------- */

function SystemTopChrome({
  osMode,
  onSwitchOS,
  onOpenControlCenter,
  isIslandExpanded,
  onToggleIsland,
  isDark,
}: {
  osMode: "ios" | "android" | "desktop";
  onSwitchOS: (mode: "ios" | "android" | "desktop") => void;
  onOpenControlCenter: () => void;
  isIslandExpanded: boolean;
  onToggleIsland: () => void;
  isDark?: boolean;
}) {
  const [time, setTime] = useState("09:41");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
    };
    update();
    const iv = setInterval(update, 10000);
    return () => clearInterval(iv);
  }, []);

  const topPanResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        return gs.dy > 12 && gs.dy > Math.abs(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 25 || gs.vy > 0.35) {
          onOpenControlCenter();
        }
      },
    });
  }, [onOpenControlCenter]);

  if (osMode === "ios") {
    return (
      <View style={styles.systemTopChromeWrapper} pointerEvents="box-none">
        <View {...topPanResponder.panHandlers} style={styles.iosTopChrome}>
          <Pressable onPress={onOpenControlCenter} style={{ cursor: "pointer" }}>
            <Text style={[styles.iosClockText, isDark && { color: "#FFFFFF" }]}>
              {time}
            </Text>
          </Pressable>

          <Pressable
            onPress={onToggleIsland}
            onLongPress={onOpenControlCenter}
            accessibilityRole="button"
            accessibilityLabel="Dynamic Island - Tap to expand, drag down for Control Center"
            style={styles.dynamicIsland}
          >
            <View style={styles.dynamicIslandLens} />
            <View style={styles.dynamicIslandDot} />
          </Pressable>

          <Pressable
            onPress={onOpenControlCenter}
            style={[styles.iosRightStatus, { cursor: "pointer" }]}
            hitSlop={10}
          >
            <Text style={[styles.iosStatusGlyph, isDark && { color: "#FFFFFF" }]}>
              5G
            </Text>
            <Text style={[styles.iosStatusGlyph, isDark && { color: "#FFFFFF" }]}>
              🔋
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (osMode === "android") {
    return (
      <View style={styles.systemTopChromeWrapper} pointerEvents="box-none">
        <View {...topPanResponder.panHandlers} style={styles.androidTopChrome}>
          <Pressable onPress={onOpenControlCenter} style={[styles.androidLeftStatus, { cursor: "pointer" }]}>
            <Text style={[styles.androidClockText, isDark && { color: "#FFFFFF" }]}>
              {time}
            </Text>
            <Text style={styles.androidNotifGlyph}>🛡</Text>
            <Text style={styles.androidNotifGlyph}>⚡</Text>
          </Pressable>

          <Pressable onPress={onOpenControlCenter} style={[styles.punchHoleCutout, { cursor: "pointer" }]} />

          <Pressable onPress={onOpenControlCenter} style={[styles.androidRightStatus, { cursor: "pointer" }]}>
            <Text style={[styles.androidStatusGlyph, isDark && { color: "#FFFFFF" }]}>
              📶
            </Text>
            <Text style={[styles.androidStatusGlyph, isDark && { color: "#FFFFFF" }]}>
              88%
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Desktop Ribbon
  return (
    <View style={styles.systemTopChromeWrapper} pointerEvents="box-none">
      <View style={styles.desktopTopChrome}>
        <View style={styles.desktopWindowControls}>
          <Pressable
            onPress={onOpenControlCenter}
            accessibilityLabel="Control Center"
            style={[styles.windowDot, { backgroundColor: "#EF4444", cursor: "pointer" }]}
          />
          <Pressable
            onPress={() => onSwitchOS("ios")}
            accessibilityLabel="Toggle Mobile Mode"
            style={[styles.windowDot, { backgroundColor: "#F59E0B", cursor: "pointer" }]}
          />
          <Pressable
            onPress={onOpenControlCenter}
            accessibilityLabel="Maximize System"
            style={[styles.windowDot, { backgroundColor: "#10B981", cursor: "pointer" }]}
          />
        </View>
        <Text style={styles.desktopTitleText}>ZakOS Desktop Web • Portfolio</Text>
        <Pressable
          onPress={onOpenControlCenter}
          style={[styles.desktopRightStatus, { cursor: "pointer" }]}
        >
          <Text style={styles.desktopStatusGlyph}>⚡ 88%</Text>
          <Text style={styles.desktopStatusGlyph}>📶</Text>
          <Text style={styles.desktopStatusTime}>{time}</Text>
          <Text style={[styles.desktopStatusGlyph, { marginLeft: 4 }]}>⚙ Control</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DynamicIslandOverlay({
  onClose,
  onOpenControlCenter,
  currentProject,
}: {
  onClose: () => void;
  onOpenControlCenter: () => void;
  currentProject?: any;
}) {
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: 1,
      friction: 7,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [expandAnim]);

  return (
    <View style={styles.islandOverlayWrapper} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.islandExpandedContainer,
          {
            transform: [
              {
                scale: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
              {
                translateY: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-15, 0],
                }),
              },
            ],
            opacity: expandAnim,
          },
        ]}
      >
        <View style={styles.islandExpandedLeft}>
          <View style={styles.islandPulseDot} />
          <View>
            <Text style={styles.islandExpandedTitle}>
              {currentProject ? currentProject.title : "ZakOS Sentinel Active"}
            </Text>
            <Text style={styles.islandExpandedSubtitle}>
              {currentProject
                ? currentProject.distance
                : "Real-time NIDS Engine • 99.4% Accuracy"}
            </Text>
          </View>
        </View>

        <View style={styles.islandExpandedActions}>
          <Pressable
            onPress={onOpenControlCenter}
            style={styles.islandActionPill}
          >
            <Text style={styles.islandActionText}>Control</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.islandCloseBtn}>
            <Text style={styles.islandCloseText}>✕</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function SystemBottomChrome({
  osMode,
  onHome,
  onBack,
  onRecents,
  isDark,
  homeSwipeY,
}: {
  osMode: "ios" | "android" | "desktop";
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
  isDark?: boolean;
  homeSwipeY?: Animated.Value;
}) {
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        return Math.abs(gs.dy) > 4 && Math.abs(gs.dy) > Math.abs(gs.dx);
      },
      onMoveShouldSetPanResponderCapture: (_, gs) => {
        return Math.abs(gs.dy) > 4 && Math.abs(gs.dy) > Math.abs(gs.dx);
      },
      onPanResponderGrant: () => {
        if (homeSwipeY) {
          homeSwipeY.stopAnimation();
        }
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dy < 0 && homeSwipeY) {
          homeSwipeY.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -40 || gs.vy < -0.4) {
          if (homeSwipeY) {
            Animated.timing(homeSwipeY, {
              toValue: -180,
              duration: 160,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start(() => {
              onHome();
              homeSwipeY.setValue(0);
            });
          } else {
            onHome();
          }
        } else if (Math.abs(gs.dy) < 5 && Math.abs(gs.dx) < 5) {
          // Single tap/click
          onHome();
        } else {
          if (homeSwipeY) {
            Animated.spring(homeSwipeY, {
              toValue: 0,
              friction: 6,
              tension: 60,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      onPanResponderTerminate: () => {
        if (homeSwipeY) {
          Animated.spring(homeSwipeY, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }, [onHome, homeSwipeY]);

  if (osMode === "ios") {
    return (
      <View style={styles.iosBottomBarArea} pointerEvents="box-none">
        <View
          {...panResponder.panHandlers}
          style={styles.iosHomeIndicatorHitZone}
        >
          <Pressable
            onPress={onHome}
            accessibilityRole="button"
            accessibilityLabel="iOS Home Bar - Return to Home"
            hitSlop={{ top: 25, bottom: 25, left: 80, right: 80 }}
            style={({ pressed }) => [
              styles.iosHomeIndicatorTouchArea,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View
              style={[
                styles.iosHomeIndicator,
                isDark && { backgroundColor: "#FFFFFF" },
              ]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  if (osMode === "android") {
    return (
      <View style={styles.androidBottomBarArea} pointerEvents="auto">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Android Back Button"
          hitSlop={{ top: 12, bottom: 12, left: 18, right: 18 }}
          style={({ pressed }) => [
            styles.androidNavBtn,
            pressed && styles.androidNavBtnPressed,
          ]}
        >
          <Text style={[styles.androidNavIcon, isDark && { color: "#F1F5F9" }]}>◀</Text>
        </Pressable>

        <Pressable
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel="Android Home Button"
          hitSlop={{ top: 12, bottom: 12, left: 18, right: 18 }}
          style={({ pressed }) => [
            styles.androidNavBtn,
            pressed && styles.androidNavBtnPressed,
          ]}
        >
          <View
            style={[
              styles.androidHomeCircle,
              isDark && { borderColor: "#F1F5F9" },
            ]}
          />
        </Pressable>

        <Pressable
          onPress={onRecents}
          accessibilityRole="button"
          accessibilityLabel="Android Recents Button"
          hitSlop={{ top: 12, bottom: 12, left: 18, right: 18 }}
          style={({ pressed }) => [
            styles.androidNavBtn,
            pressed && styles.androidNavBtnPressed,
          ]}
        >
          <View
            style={[
              styles.androidRecentsSquare,
              isDark && { borderColor: "#F1F5F9" },
            ]}
          />
        </Pressable>
      </View>
    );
  }

  return null;
}

function ControlCenterModal({
  visible,
  onClose,
  osMode,
  onSwitchOS,
  theme,
  onSwitchTheme,
}: {
  visible: boolean;
  onClose: () => void;
  osMode: "ios" | "android" | "desktop";
  onSwitchOS: (m: "ios" | "android" | "desktop") => void;
  theme: "light" | "dark" | "cyberpunk";
  onSwitchTheme: (t: "light" | "dark" | "cyberpunk") => void;
}) {
  const slideAnim = useRef(new Animated.Value(-600)).current;
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [cellular, setCellular] = useState(true);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(-600);
    }
  }, [visible, slideAnim]);

  const closeWithAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: -600,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        return gs.dy < -12 && Math.abs(gs.dy) > Math.abs(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -25 || gs.vy < -0.35) {
          closeWithAnimation();
        }
      },
    });
  }, []);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 10000 }]}>
      <Pressable onPress={closeWithAnimation} style={StyleSheet.absoluteFill}>
        <View style={styles.modalBackdrop} />
      </Pressable>

      <Animated.View
        style={[
          styles.controlCenterSheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View style={styles.controlCenterHeader}>
          <View>
            <Text style={styles.controlCenterEyebrow}>SYSTEM CONTROL & NOTIFICATIONS</Text>
            <Text style={styles.controlCenterTitle}>Control Center</Text>
          </View>
          <Pressable onPress={closeWithAnimation} style={styles.bookingCloseButton}>
            <Text style={{ fontSize: 18, color: "#94A3B8" }}>✕</Text>
          </Pressable>
        </View>

        {/* Connectivity Toggles Row */}
        <View style={styles.controlTogglesGrid}>
          <Pressable
            onPress={() => setWifi(!wifi)}
            style={[styles.controlToggleCard, wifi && styles.controlToggleCardActive]}
          >
            <Text style={styles.controlToggleIcon}>📶</Text>
            <Text style={styles.controlToggleLabel}>Wi-Fi</Text>
            <Text style={styles.controlToggleSubtext}>{wifi ? "ZakOS-Net" : "Off"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setBluetooth(!bluetooth)}
            style={[styles.controlToggleCard, bluetooth && styles.controlToggleCardActive]}
          >
            <Text style={styles.controlToggleIcon}>🎧</Text>
            <Text style={styles.controlToggleLabel}>Bluetooth</Text>
            <Text style={styles.controlToggleSubtext}>{bluetooth ? "Connected" : "Off"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setAirplane(!airplane)}
            style={[styles.controlToggleCard, airplane && styles.controlToggleCardWarning]}
          >
            <Text style={styles.controlToggleIcon}>✈</Text>
            <Text style={styles.controlToggleLabel}>Airplane</Text>
            <Text style={styles.controlToggleSubtext}>{airplane ? "On" : "Off"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setCellular(!cellular)}
            style={[styles.controlToggleCard, cellular && styles.controlToggleCardActive]}
          >
            <Text style={styles.controlToggleIcon}>📡</Text>
            <Text style={styles.controlToggleLabel}>5G Ultra</Text>
            <Text style={styles.controlToggleSubtext}>{cellular ? "Active" : "Off"}</Text>
          </Pressable>
        </View>

        {/* OS Switcher Segment */}
        <View style={styles.controlSection}>
          <Text style={styles.controlSectionTitle}>OPERATING SYSTEM EMULATOR</Text>
          <View style={styles.controlSegmentedRow}>
            {(["ios", "android", "desktop"] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => onSwitchOS(mode)}
                style={[
                  styles.controlSegmentBtn,
                  osMode === mode && styles.controlSegmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.controlSegmentText,
                    osMode === mode && styles.controlSegmentTextActive,
                  ]}
                >
                  {mode === "ios" ? " iOS 18" : mode === "android" ? "🤖 Android 15" : "🖥 Desktop"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Theme Switcher Segment */}
        <View style={styles.controlSection}>
          <Text style={styles.controlSectionTitle}>COLOR THEME</Text>
          <View style={styles.controlSegmentedRow}>
            {(["light", "dark", "cyberpunk"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => onSwitchTheme(t)}
                style={[
                  styles.controlSegmentBtn,
                  theme === t && styles.controlSegmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.controlSegmentText,
                    theme === t && styles.controlSegmentTextActive,
                  ]}
                >
                  {t === "light" ? "☀️ Light" : t === "dark" ? "🌙 Dark OLED" : "⚡ Cyberpunk"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* System Telemetry */}
        <View style={styles.controlTelemetryCard}>
          <View style={styles.controlTelemetryItem}>
            <Text style={styles.controlTelemetryLabel}>Uptime</Text>
            <Text style={styles.controlTelemetryValue}>14h 34m</Text>
          </View>
          <View style={styles.controlTelemetryItem}>
            <Text style={styles.controlTelemetryLabel}>RAM Load</Text>
            <Text style={styles.controlTelemetryValue}>15.8 GB (49%)</Text>
          </View>
          <View style={styles.controlTelemetryItem}>
            <Text style={styles.controlTelemetryLabel}>Battery</Text>
            <Text style={styles.controlTelemetryValue}>88% [AC]</Text>
          </View>
          <View style={styles.controlTelemetryItem}>
            <Text style={styles.controlTelemetryLabel}>Architecture</Text>
            <Text style={styles.controlTelemetryValue}>x86_64 Core</Text>
          </View>
        </View>

        {/* Dismiss Handle */}
        <Pressable onPress={closeWithAnimation} style={styles.controlHandleZone}>
          <View style={styles.controlDismissBar} />
          <Text style={styles.controlDismissText}>Swipe up or tap to dismiss</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function RecentsModal({
  visible,
  onClose,
  onOpenApp,
}: {
  visible: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}) {
  if (!visible) return null;

  const apps = [
    {
      id: "projects",
      name: "Projects & Architecture",
      icon: "📁",
      subtitle: "16 Projects across 4 Domains",
      badge: "Running",
      color: "#075CF5",
    },
    {
      id: "terminal",
      name: "Bash CLI Terminal",
      icon: "💻",
      subtitle: "visitor@zak-portfolio:~$ [Idle]",
      badge: "Standby",
      color: "#10B981",
    },
    {
      id: "contact",
      name: "Direct Transmission",
      icon: "👤",
      subtitle: "Zakarya Oukil • Email & Links",
      badge: "Ready",
      color: "#8E79F5",
    },
    {
      id: "settings",
      name: "System Configuration",
      icon: "⚙",
      subtitle: "OS Switcher & Display Modes",
      badge: "Ready",
      color: "#F59E0B",
    },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <View style={styles.modalBackdrop} />
      </Pressable>

      <View style={styles.recentsContainer}>
        <View style={styles.recentsHeader}>
          <Text style={styles.recentsTitle}>Active Applications</Text>
          <Pressable onPress={onClose} style={styles.recentsCloseBtn}>
            <Text style={styles.recentsCloseText}>Close All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentsScrollContent}
        >
          {apps.map((app) => (
            <Pressable
              key={app.id}
              onPress={() => onOpenApp(app.id)}
              style={({ pressed }) => [
                styles.recentsCard,
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
            >
              <View style={[styles.recentsCardTop, { backgroundColor: app.color }]}>
                <Text style={styles.recentsAppIcon}>{app.icon}</Text>
                <Text style={styles.recentsCardBadge}>{app.badge}</Text>
              </View>
              <View style={styles.recentsCardBody}>
                <Text numberOfLines={1} style={styles.recentsAppName}>
                  {app.name}
                </Text>
                <Text numberOfLines={2} style={styles.recentsAppSubtitle}>
                  {app.subtitle}
                </Text>
                <View style={styles.recentsOpenBtn}>
                  <Text style={styles.recentsOpenBtnText}>Switch to App</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DESTINATION CARD                              */
/* -------------------------------------------------------------------------- */

function DestinationCard({
  item,
  index,
  scrollX,
  cardWidth,
  cardHeight,
  spacing,
  onOpen,
  saved,
  onSave,
  didDragRef,
}: {
  item: any;
  index: number;
  scrollX: Animated.Value;
  cardWidth: number;
  cardHeight: number;
  spacing: number;
  onOpen: (item: any) => void;
  saved: boolean;
  onSave: (id: string) => void;
  didDragRef: React.MutableRefObject<boolean>;
}) {
  const itemSize = cardWidth + spacing;

  const inputRange = [
    (index - 1) * itemSize,
    index * itemSize,
    (index + 1) * itemSize,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: "clamp",
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [18, 0, 18],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.72, 1, 0.72],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.08, 0.25, 0.08],
    extrapolate: "clamp",
  });

  const handlePress = () => {
    if (didDragRef.current) return;
    onOpen(item);
  };

  return (
    <Animated.View
      style={{
        width: cardWidth,
        height: cardHeight,
        marginRight: spacing,
        opacity,
        transform: [{ scale }, { translateY }],
      }}
    >
      <Animated.View
        style={[
          styles.destinationCardShadow,
          {
            width: cardWidth,
            height: cardHeight,
            shadowOpacity,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.title}`}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.destinationCard,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            },
          ]}
        >
          <ImageWithFallback
            source={item.image}
            style={styles.destinationImage}
          >
            <View style={styles.cardTopOverlay} />
            <View style={styles.cardBottomOverlay} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                saved ? `Remove ${item.title} from saved` : `Save ${item.title}`
              }
              hitSlop={10}
              onPress={(event) => {
                event.stopPropagation?.();
                onSave(item.id);
              }}
              style={({ pressed }) => [
                styles.cardSaveButton,
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
            >
              <Glyph color="#FFFFFF" size={20}>
                {saved ? "★" : "☆"}
              </Glyph>
            </Pressable>

            <View style={styles.cardCopy}>
              <Text style={styles.cardCountry}>{item.country}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.ratingRow}>
                {[0, 1, 2, 3, 4].map((star) => (
                  <Glyph
                    key={star}
                    color="#FFFFFF"
                    size={12}
                    style={star < 4 ? styles.ratingStar : null}
                  >
                    ★
                  </Glyph>
                ))}
              </View>
            </View>
          </ImageWithFallback>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HOME UI                                   */
/* -------------------------------------------------------------------------- */

function HomeScreen({
  onOpen,
  activeFilter,
  onFilterChange,
  savedIds,
  onToggleSave,
  osMode,
  onSelectOS,
  onOpenTerminal,
  onOpenContact,
  onOpenSettings,
  theme = "light",
}: {
  onOpen: (item: any) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  osMode: "ios" | "android" | "desktop";
  onSelectOS: (m: "ios" | "android" | "desktop") => void;
  onOpenTerminal: () => void;
  onOpenContact: () => void;
  onOpenSettings: () => void;
  theme?: "light" | "dark" | "cyberpunk";
}) {
  const { width, height } = useWindowDimensions();

  const horizontalPadding = clamp(width * 0.055, 18, 26);
  const spacing = clamp(width * 0.045, 14, 20);
  const cardWidth = clamp(width * 0.72, 250, 338);
  const cardHeight = clamp(height - 255, 380, 520);
  const sideInset = Math.max((width - cardWidth) / 2, horizontalPadding);

  const homeBottomPadding =
    Platform.OS === "ios" ? 10 : Platform.OS === "android" ? 18 : 8;

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const currentScrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const dragStartTimestamp = useRef(0);
  const didDragRef = useRef(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const filteredDestinations = useMemo(
    () => PROJECTS.filter((item) => item.country === activeFilter),
    [activeFilter]
  );

  const snapInterval = cardWidth + spacing;
  const maxScrollOffset = Math.max(
    0,
    (filteredDestinations.length - 1) * snapInterval
  );

  const desktopDragHandlers = useMemo(() => {
    if (Platform.OS !== "web") {
      return {};
    }

    const shouldStartDragging = (_: any, gestureState: any) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);
      return horizontalDistance > 5 && horizontalDistance > verticalDistance;
    };

    const finishDragging = (_: any, gestureState: any) => {
      const duration = Date.now() - dragStartTimestamp.current;
      const totalDx = Math.abs(gestureState.dx);

      if (totalDx > 5 || duration < 180) {
        didDragRef.current = true;
      }

      const projectedOffset = clamp(
        dragStartOffset.current - gestureState.dx - gestureState.vx * 150,
        0,
        maxScrollOffset
      );

      const snappedOffset =
        Math.round(projectedOffset / snapInterval) * snapInterval;

      listRef.current?.scrollToOffset({
        offset: clamp(snappedOffset, 0, maxScrollOffset),
        animated: true,
      });

      setTimeout(() => {
        didDragRef.current = false;
      }, 140);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: shouldStartDragging,
      onMoveShouldSetPanResponderCapture: shouldStartDragging,

      onPanResponderGrant: () => {
        dragStartOffset.current = currentScrollOffset.current;
        dragStartTimestamp.current = Date.now();
        didDragRef.current = false;
      },

      onPanResponderMove: (_: any, gestureState: any) => {
        if (Math.abs(gestureState.dx) > 5) {
          didDragRef.current = true;
        }

        const nextOffset = clamp(
          dragStartOffset.current - gestureState.dx,
          0,
          maxScrollOffset
        );

        listRef.current?.scrollToOffset({
          offset: nextOffset,
          animated: false,
        });
      },

      onPanResponderRelease: finishDragging,
      onPanResponderTerminate: finishDragging,
      onPanResponderTerminationRequest: () => false,
    }).panHandlers;
  }, [maxScrollOffset, snapInterval]);

  const toggleMenu = () => {
    const nextVisible = !menuVisible;
    setMenuVisible(nextVisible);

    Animated.spring(menuAnimation, {
      toValue: nextVisible ? 1 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 190,
      mass: 0.8,
    }).start();
  };

  const changeFilter = (filter: string) => {
    onFilterChange(filter);
    currentScrollOffset.current = 0;
    scrollX.setValue(0);

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    });
  };

  const openDestination = (item: any) => {
    if (didDragRef.current) {
      return;
    }
    onOpen(item);
  };

  const osBadge =
    osMode === "ios"
      ? "iOS 18 • iPhone"
      : osMode === "android"
      ? "Android 15 • Material You"
      : "Desktop Web • macOS";

  const homeTopInset =
    osMode === "ios" ? 44 : osMode === "android" ? 38 : 32;
  const navBarBottom =
    osMode === "android" ? 52 : osMode === "ios" ? 38 : 20;

  return (
    <SafeAreaView
      style={[
        styles.homeSafeArea,
        theme === "dark" && styles.homeSafeAreaDark,
        theme === "cyberpunk" && styles.homeSafeAreaCyberpunk,
      ]}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      <View
        style={[
          styles.homeContainer,
          {
            paddingTop: homeTopInset,
            paddingBottom: homeBottomPadding,
          },
          theme === "dark" && styles.homeContainerDark,
          theme === "cyberpunk" && styles.homeContainerCyberpunk,
        ]}
      >
        <View
          style={[
            styles.homeHeader,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <View>
            <Text style={styles.homeEyebrow}>DEVELOPER PORTFOLIO • {osBadge}</Text>
            <Text style={styles.homeTitle}>Zakarya</Text>
          </View>

          <SoftIconButton
            onPress={toggleMenu}
            accessibilityLabel="Open OS Switcher"
            style={styles.gridButton}
          >
            <View style={styles.gridIcon}>
              {[0, 1, 2, 3].map((dot) => (
                <View key={dot} style={styles.gridIconDot} />
              ))}
            </View>
          </SoftIconButton>
        </View>

        {/* Dynamic OS Selector Dropdown */}
        <Animated.View
          pointerEvents={menuVisible ? "auto" : "none"}
          style={[
            styles.quickMenu,
            {
              right: horizontalPadding,
              opacity: menuAnimation,
              transform: [
                {
                  translateY: menuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-12, 0],
                  }),
                },
                {
                  scale: menuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.quickMenuHeading}>SWITCH OPERATING SYSTEM</Text>
          <Pressable
            onPress={() => {
              onSelectOS("ios");
              toggleMenu();
            }}
            style={({ pressed }) => [
              styles.quickMenuItem,
              osMode === "ios" && styles.quickMenuItemActive,
              pressed && styles.quickMenuItemPressed,
            ]}
          >
            <Glyph size={15}></Glyph>
            <Text style={styles.quickMenuText}>iOS 18 (iPhone Layout)</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onSelectOS("android");
              toggleMenu();
            }}
            style={({ pressed }) => [
              styles.quickMenuItem,
              osMode === "android" && styles.quickMenuItemActive,
              pressed && styles.quickMenuItemPressed,
            ]}
          >
            <Glyph size={14}>🤖</Glyph>
            <Text style={styles.quickMenuText}>Android 15 (Material You)</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onSelectOS("desktop");
              toggleMenu();
            }}
            style={({ pressed }) => [
              styles.quickMenuItem,
              osMode === "desktop" && styles.quickMenuItemActive,
              pressed && styles.quickMenuItemPressed,
            ]}
          >
            <Glyph size={15}>🖥</Glyph>
            <Text style={styles.quickMenuText}>Desktop Web (macOS)</Text>
          </Pressable>
        </Animated.View>

        {/* Tech Domain Filter Bar */}
        <View style={styles.filterArea}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: horizontalPadding,
              paddingRight: horizontalPadding + 20,
            }}
          >
            {FILTERS.map((filter) => {
              const selected = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => changeFilter(filter)}
                  style={({ pressed }) => [
                    styles.filterPill,
                    selected && styles.filterPillActive,
                    {
                      opacity: pressed ? 0.72 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selected && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Project Card Carousel */}
        <View style={styles.carouselArea}>
          <Animated.FlatList
            ref={listRef}
            {...desktopDragHandlers}
            horizontal
            data={filteredDestinations}
            keyExtractor={(item: any) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapInterval}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            bounces
            contentContainerStyle={{
              paddingLeft: sideInset,
              paddingRight: sideInset - spacing,
              alignItems: "center",
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
                listener: (event: any) => {
                  currentScrollOffset.current = event.nativeEvent.contentOffset.x;
                },
              }
            )}
            onMomentumScrollEnd={(event: any) => {
              currentScrollOffset.current = event.nativeEvent.contentOffset.x;
            }}
            renderItem={({ item, index }: any) => (
              <DestinationCard
                item={item}
                index={index}
                scrollX={scrollX}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                spacing={spacing}
                onOpen={openDestination}
                saved={savedIds.includes(item.id)}
                onSave={onToggleSave}
                didDragRef={didDragRef}
              />
            )}
          />
        </View>

        {/* Floating Bottom Navigation Bar */}
        <View
          style={[
            styles.bottomNavigation,
            {
              marginHorizontal: horizontalPadding,
              bottom: navBarBottom,
            },
          ]}
        >
          {/* Item 1: Projects (Active) */}
          <Pressable style={styles.navItem}>
            <Text style={styles.navLabelActive}>Projects</Text>
            <View style={styles.navActiveDot} />
          </Pressable>

          {/* Item 2: Terminal */}
          <Pressable
            onPress={onOpenTerminal}
            accessibilityRole="button"
            accessibilityLabel="Open Terminal"
            style={styles.navItem}
          >
            <Glyph color="#8A95A5" size={20}>
              ⌨
            </Glyph>
            <Text style={styles.navItemSubtext}>CLI</Text>
          </Pressable>

          {/* Item 3: Contact */}
          <Pressable
            onPress={onOpenContact}
            accessibilityRole="button"
            accessibilityLabel="Open Contact & Resume"
            style={styles.navItem}
          >
            <Glyph color="#8A95A5" size={19}>
              👤
            </Glyph>
            <Text style={styles.navItemSubtext}>Contact</Text>
          </Pressable>

          {/* Item 4: Settings */}
          <Pressable
            onPress={onOpenSettings}
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            style={styles.navItem}
          >
            <Glyph color="#8A95A5" size={20}>
              ⚙
            </Glyph>
            <Text style={styles.navItemSubtext}>Config</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                          RELATED DESTINATION CARD                           */
/* -------------------------------------------------------------------------- */

function RelatedDestinationCard({
  item,
  width,
  height,
  onPress,
  isActive,
}: {
  item: any;
  width: number;
  height: number;
  onPress: () => void;
  isActive: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isActive ? `${item.title}, currently selected` : `Open ${item.title}`
      }
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.relatedCard,
        isActive && styles.relatedCardActive,
        {
          width,
          height,
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.965 : 1 }],
        },
      ]}
    >
      <ImageWithFallback source={item.image} style={styles.relatedCardImage}>
        <View style={styles.relatedCardOverlay} />

        {isActive ? (
          <View style={styles.relatedCurrentBadge}>
            <Text style={styles.relatedCurrentBadgeText}>CURRENT</Text>
          </View>
        ) : null}

        <View style={styles.relatedCardCopy}>
          <Text style={styles.relatedCardCountry}>{item.country}</Text>
          <Text numberOfLines={1} style={styles.relatedCardTitle}>
            {item.title}
          </Text>
        </View>
      </ImageWithFallback>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DETAIL SCREEN                                */
/* -------------------------------------------------------------------------- */

function DetailScreen({
  destination,
  onClose,
  onSelectDestination,
  savedIds,
  onToggleSave,
  osMode,
}: {
  destination: any;
  onClose: () => void;
  onSelectDestination: (d: any) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  osMode: "ios" | "android" | "desktop";
}) {
  const { width, height } = useWindowDimensions();

  const openingProgress = useRef(new Animated.Value(0)).current;
  const contentProgress = useRef(new Animated.Value(0)).current;
  const bookingProgress = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const switchProgress = useRef(new Animated.Value(1)).current;
  const switchingRef = useRef(false);
  const detailScrollRef = useRef<any>(null);
  const relatedScrollRef = useRef<any>(null);
  const relatedScrollOffsetRef = useRef(0);
  const relatedDragStartOffsetRef = useRef(0);
  const relatedDidDragRef = useRef(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);
  const [outgoingDestination, setOutgoingDestination] = useState<any>(null);
  const [selectedCardId, setSelectedCardId] = useState(destination.id);

  const heroHeight = clamp(height * 0.65, 470, 660);
  const relatedCardWidth = clamp(width * 0.3, 112, 142);
  const relatedCardHeight = clamp(heroHeight * 0.19, 116, 146);
  const relatedCardSpacing = 12;
  const relatedLeftPadding = 22;
  const relatedRightPadding = 34;

  const androidStatusBarInset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 8 : 0;

  const bottomSafePadding =
    Platform.OS === "ios" ? 44 : Platform.OS === "android" ? 38 : 24;

  const bookingBottomPadding =
    Platform.OS === "ios" ? 44 : Platform.OS === "android" ? 38 : 26;

  const relatedDestinations = useMemo(
    () => PROJECTS.filter((item) => item.country === destination.country),
    [destination.country]
  );

  const relatedContentWidth =
    relatedLeftPadding +
    relatedRightPadding +
    relatedDestinations.length * relatedCardWidth +
    Math.max(0, relatedDestinations.length - 1) * relatedCardSpacing;

  const relatedMaxScrollOffset = Math.max(0, relatedContentWidth - width);
  const relatedSnapInterval = relatedCardWidth + relatedCardSpacing;

  const relatedDesktopDragHandlers = useMemo(() => {
    if (Platform.OS !== "web") {
      return {};
    }

    const shouldStartDragging = (_: any, gestureState: any) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);
      return horizontalDistance > 5 && horizontalDistance > verticalDistance;
    };

    const finishDragging = (_: any, gestureState: any) => {
      const projectedOffset = clamp(
        relatedDragStartOffsetRef.current -
          gestureState.dx -
          gestureState.vx * 120,
        0,
        relatedMaxScrollOffset
      );

      const snappedOffset = clamp(
        Math.round(projectedOffset / relatedSnapInterval) * relatedSnapInterval,
        0,
        relatedMaxScrollOffset
      );

      relatedScrollRef.current?.scrollTo({
        x: snappedOffset,
        animated: true,
      });

      setTimeout(() => {
        relatedDidDragRef.current = false;
      }, 150);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: shouldStartDragging,
      onMoveShouldSetPanResponderCapture: shouldStartDragging,

      onPanResponderGrant: () => {
        relatedDragStartOffsetRef.current = relatedScrollOffsetRef.current;
        relatedDidDragRef.current = false;
      },

      onPanResponderMove: (_: any, gestureState: any) => {
        if (Math.abs(gestureState.dx) > 5) {
          relatedDidDragRef.current = true;
        }

        const nextOffset = clamp(
          relatedDragStartOffsetRef.current - gestureState.dx,
          0,
          relatedMaxScrollOffset
        );

        relatedScrollRef.current?.scrollTo({
          x: nextOffset,
          animated: false,
        });
      },

      onPanResponderRelease: finishDragging,
      onPanResponderTerminate: finishDragging,
      onPanResponderTerminationRequest: () => false,
    }).panHandlers;
  }, [relatedMaxScrollOffset, relatedSnapInterval]);

  const saved = savedIds.includes(destination.id);

  useEffect(() => {
    setSelectedCardId(destination.id);
  }, [destination.id]);

  useEffect(() => {
    relatedDestinations.forEach((item) => {
      Image.prefetch(item.image).catch(() => {});
    });
  }, [relatedDestinations]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(openingProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentProgress, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentProgress, openingProgress]);

  const closeDetail = () => {
    if (switchingRef.current) {
      return;
    }

    Animated.parallel([
      Animated.timing(contentProgress, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(openingProgress, {
        toValue: 0,
        duration: 280,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const switchDestination = (nextDestination: any) => {
    if (
      switchingRef.current ||
      !nextDestination ||
      nextDestination.id === destination.id
    ) {
      return;
    }

    switchingRef.current = true;
    setSelectedCardId(nextDestination.id);
    setOutgoingDestination(destination);

    switchProgress.stopAnimation();
    switchProgress.setValue(1);

    Animated.timing(switchProgress, {
      toValue: 0,
      duration: 175,
      easing: Easing.bezier(0.55, 0, 0.9, 0.45),
      useNativeDriver: true,
    }).start(() => {
      onSelectDestination(nextDestination);

      requestAnimationFrame(() => {
        Animated.timing(switchProgress, {
          toValue: 1,
          duration: 470,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }).start(() => {
          setOutgoingDestination(null);
          switchingRef.current = false;
        });
      });
    });
  };

  const animateSave = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.32,
        useNativeDriver: true,
        speed: 35,
        bounciness: 8,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 26,
        bounciness: 7,
      }),
    ]).start();

    onToggleSave(destination.id);
  };

  const openBooking = () => {
    setBookingOpen(true);

    Animated.spring(bookingProgress, {
      toValue: 1,
      useNativeDriver: true,
      damping: 22,
      stiffness: 180,
      mass: 0.85,
    }).start();
  };

  const closeBooking = () => {
    Animated.timing(bookingProgress, {
      toValue: 0,
      duration: 260,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setBookingOpen(false);
      setBooked(false);
    });
  };

  const confirmBooking = () => {
    setBooked(true);
  };

  const switchContentOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.34, 1],
  });

  const switchTranslateX = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  const switchTextTranslateY = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  const outgoingImageOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const outgoingImageScale = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035],
  });

  const switchVeilOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0],
  });

  const switchingContentOpacity = Animated.multiply(
    contentProgress,
    switchContentOpacity
  );

  return (
    <View style={styles.detailRoot}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View
        style={[
          styles.detailScreen,
          {
            opacity: openingProgress,
            transform: [
              {
                scale: openingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
              {
                translateY: openingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.ScrollView
          ref={detailScrollRef}
          style={styles.detailScroll}
          contentContainerStyle={[
            styles.detailScrollContent,
            {
              paddingBottom: bottomSafePadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
        >
          <ImageBackground
            source={{ uri: destination.image }}
            resizeMode="cover"
            style={[
              styles.detailHero,
              {
                height: heroHeight,
              },
            ]}
            imageStyle={styles.detailHeroImage}
          >
            {outgoingDestination ? (
              <Animated.Image
                pointerEvents="none"
                source={{ uri: outgoingDestination.image }}
                resizeMode="cover"
                style={[
                  styles.detailHeroTransitionImage,
                  {
                    opacity: outgoingImageOpacity,
                    transform: [{ scale: outgoingImageScale }],
                  },
                ]}
              />
            ) : null}

            <View style={styles.detailTopFade} />
            <View style={styles.detailBottomFade} />

            <SafeAreaView
              style={[
                styles.detailSafeArea,
                {
                  paddingTop: androidStatusBarInset,
                },
              ]}
            >
              <View style={styles.detailTopBar}>
                <SoftIconButton
                  onPress={closeDetail}
                  accessibilityLabel="Return to destinations"
                  style={styles.glassButton}
                >
                  <Glyph color="#FFFFFF" size={29} weight="400">
                    ‹
                  </Glyph>
                </SoftIconButton>

                <SoftIconButton
                  onPress={() => window.open(destination.githubUrl, "_blank")}
                  accessibilityLabel="GitHub Source Repository"
                  style={styles.glassButton}
                >
                  <Glyph
                    color="#FFFFFF"
                    size={20}
                    weight="500"
                    style={{ marginTop: 0 }}
                  >
                    🐙
                  </Glyph>
                </SoftIconButton>
              </View>

              <Animated.View
                style={[
                  styles.detailMainCopy,
                  {
                    opacity: switchingContentOpacity,
                    transform: [
                      {
                        translateY: contentProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [28, 0],
                        }),
                      },
                      { translateX: switchTranslateX },
                      { translateY: switchTextTranslateY },
                    ],
                  },
                ]}
              >
                <Text style={styles.detailCountry}>{destination.country}</Text>
                <Text style={styles.detailTitle}>{destination.subtitle}</Text>

                <View style={styles.detailMetaRow}>
                  <View style={styles.detailMetaItem}>
                    <Glyph color="#FFFFFF" size={15}>
                      ◷
                    </Glyph>
                    <Text style={styles.detailMetaText}>
                      {destination.duration}
                    </Text>
                  </View>

                  <View style={styles.detailMetaItem}>
                    <Glyph color="#FFFFFF" size={14}>
                      ⚑
                    </Glyph>
                    <Text style={styles.detailMetaText}>
                      {destination.distance}
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailDescription}>
                  {destination.description}
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.floatingCounters,
                  {
                    opacity: switchingContentOpacity,
                    transform: [
                      {
                        translateX: contentProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [35, 0],
                        }),
                      },
                      { translateY: switchTextTranslateY },
                    ],
                  },
                ]}
              >
                <View style={styles.floatingCounter}>
                  <Glyph color="#FFFFFF" size={17}>
                    ♡
                  </Glyph>
                  <Text style={styles.floatingCounterText}>
                    {destination.saves}
                  </Text>
                </View>

                <View style={styles.floatingCounter}>
                  <Glyph color="#FFFFFF" size={15}>
                    ◇
                  </Glyph>
                  <Text style={styles.floatingCounterText}>
                    {destination.views}
                  </Text>
                </View>

                <View style={styles.floatingCounter}>
                  <Glyph color="#FFFFFF" size={17}>
                    ★
                  </Glyph>
                  <Text style={styles.floatingCounterText}>
                    {destination.likes}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.relatedWrapper,
                  {
                    opacity: contentProgress,
                    transform: [
                      {
                        translateY: contentProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [45, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.relatedHeading}>MORE IN THIS DOMAIN</Text>

                <ScrollView
                  ref={relatedScrollRef}
                  {...relatedDesktopDragHandlers}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={relatedSnapInterval}
                  decelerationRate="fast"
                  disableIntervalMomentum
                  scrollEventThrottle={16}
                  onScroll={(event) => {
                    relatedScrollOffsetRef.current =
                      event.nativeEvent.contentOffset.x;
                  }}
                  contentContainerStyle={styles.relatedContent}
                >
                  {relatedDestinations.map((item) => {
                    const isActive = item.id === selectedCardId;

                    return (
                      <RelatedDestinationCard
                        key={item.id}
                        item={item}
                        width={relatedCardWidth}
                        height={relatedCardHeight}
                        isActive={isActive}
                        onPress={() => {
                          if (relatedDidDragRef.current || isActive) {
                            return;
                          }
                          switchDestination(item);
                        }}
                      />
                    );
                  })}
                </ScrollView>
              </Animated.View>
            </SafeAreaView>
          </ImageBackground>

          <Animated.View
            style={[
              styles.detailBottomPanel,
              {
                opacity: contentProgress,
                transform: [
                  {
                    translateY: contentProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                opacity: switchContentOpacity,
                transform: [{ translateX: switchTranslateX }],
              }}
            >
              <View style={styles.detailPanelHandle} />

              <View style={styles.detailPanelHeader}>
                <View style={styles.detailPanelTitleArea}>
                  <Text style={styles.panelTitle}>{destination.subtitle}</Text>
                  <Text style={styles.panelSubheading}>
                    Architecture & Stack: {destination.location}
                  </Text>
                </View>

                <Animated.View
                  style={{
                    transform: [{ scale: heartScale }],
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      saved ? "Remove project from favourites" : "Save project"
                    }
                    onPress={animateSave}
                    style={({ pressed }) => [
                      styles.sendButton,
                      {
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.94 : 1 }],
                      },
                    ]}
                  >
                    <Glyph color={saved ? "#FF2945" : "#06A88B"} size={22}>
                      {saved ? "★" : "☆"}
                    </Glyph>
                  </Pressable>
                </Animated.View>
              </View>

              <Text style={styles.panelDescription}>
                {destination.description}
              </Text>

              <View style={styles.statisticsRow}>
                <View style={styles.statistic}>
                  <Glyph size={18}>○</Glyph>
                  <Text style={styles.statisticText}>16 Contribs</Text>
                </View>

                <View style={styles.statistic}>
                  <Glyph size={18} color="#EF4770">
                    ♥
                  </Glyph>
                  <Text style={styles.statisticText}>{destination.likes}</Text>
                </View>

                <View style={styles.statistic}>
                  <Glyph size={18}>☆</Glyph>
                  <Text style={styles.statisticText}>{destination.saves}</Text>
                </View>

                <View style={styles.statistic}>
                  <Glyph size={17}>◴</Glyph>
                  <Text style={styles.statisticText}>99.9% Up</Text>
                </View>
              </View>

              <View style={styles.peopleRow}>
                <View style={styles.avatarStack}>
                  {[PHOTO.avatarOne, PHOTO.avatarTwo, PHOTO.avatarThree].map(
                    (avatar, index) => (
                      <Image
                        key={avatar}
                        source={{ uri: avatar }}
                        style={[
                          styles.avatar,
                          {
                            marginLeft: index === 0 ? 0 : -9,
                            zIndex: 4 - index,
                          },
                        ]}
                      />
                    )
                  )}
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tech stack tags"
                  style={({ pressed }) => [
                    styles.morePeopleButton,
                    {
                      opacity: pressed ? 0.65 : 1,
                    },
                  ]}
                >
                  <Glyph size={14} color="#728096">
                    {destination.techStack?.length || 4}+
                  </Glyph>
                </Pressable>
              </View>

              <View style={styles.routeCard}>
                <View style={styles.routePointIcon}>
                  <Glyph color="#8E79F5" size={17}>
                    ⊙
                  </Glyph>
                </View>

                <View style={styles.routeColumn}>
                  <Text style={styles.routeLabel}>Runtime / Engine</Text>
                  <Text numberOfLines={1} style={styles.routeValue}>
                    {destination.location}
                  </Text>
                </View>

                <View style={styles.routeDivider} />

                <View style={styles.routeColumn}>
                  <Text style={styles.routeLabel}>Core Benchmark</Text>
                  <Text style={styles.routeValue}>{destination.distance}</Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Inspect architecture and demo"
                onPress={openBooking}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    opacity: pressed ? 0.82 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  Inspect Architecture & Demo
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.ScrollView>

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.switchVeil,
            { opacity: switchVeilOpacity },
          ]}
        />
      </Animated.View>

      {bookingOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close architecture panel"
            onPress={closeBooking}
            style={StyleSheet.absoluteFill}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.bookingBackdrop,
                {
                  opacity: bookingProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            />
          </Pressable>

          <Animated.View
            style={[
              styles.bookingSheet,
              {
                paddingBottom: bookingBottomPadding,
                transform: [
                  {
                    translateY: bookingProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [520, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.bookingHandle} />

            {!booked ? (
              <>
                <View style={styles.bookingHeader}>
                  <View>
                    <Text style={styles.bookingEyebrow}>SYSTEM BLUEPRINT</Text>
                    <Text style={styles.bookingTitle}>Architecture Specs</Text>
                  </View>

                  <Pressable
                    onPress={closeBooking}
                    hitSlop={10}
                    style={({ pressed }) => [
                      styles.bookingCloseButton,
                      {
                        opacity: pressed ? 0.65 : 1,
                      },
                    ]}
                  >
                    <Glyph size={24} color="#4B5563">
                      ×
                    </Glyph>
                  </Pressable>
                </View>

                <Text style={styles.bookingDescription}>
                  Pipeline: {destination.architectureNotes}
                </Text>

                <View style={styles.bookingOptionCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bookingOptionLabel}>Stack Components</Text>
                    <Text numberOfLines={1} style={styles.bookingOptionValue}>
                      {destination.techStack?.join(" • ") || "Production Microservices"}
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <Pressable
                      onPress={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      style={({ pressed }) => [
                        styles.quantityButton,
                        pressed && styles.quantityButtonPressed,
                      ]}
                    >
                      <Glyph size={23}>−</Glyph>
                    </Pressable>

                    <Text style={styles.quantityText}>{quantity}x</Text>

                    <Pressable
                      onPress={() =>
                        setQuantity((current) => Math.min(8, current + 1))
                      }
                      style={({ pressed }) => [
                        styles.quantityButton,
                        pressed && styles.quantityButtonPressed,
                      ]}
                    >
                      <Glyph size={22}>+</Glyph>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.bookingTotalRow}>
                  <View>
                    <Text style={styles.bookingTotalLabel}>Benchmark Latency</Text>
                    <Text style={styles.bookingTotalNote}>
                      Sub-millisecond P99 response time
                    </Text>
                  </View>

                  <Text style={styles.bookingTotalValue}>
                    {destination.distance}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Confirm inspection"
                  onPress={confirmBooking}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      marginTop: 20,
                      opacity: pressed ? 0.82 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                    },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    Launch Live Demo / GitHub
                  </Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.confirmationContent}>
                <View style={styles.confirmationIcon}>
                  <Glyph color="#FFFFFF" size={36}>
                    ✓
                  </Glyph>
                </View>

                <Text style={styles.confirmationTitle}>Instance Connected</Text>

                <Text style={styles.confirmationText}>
                  The {destination.title} repository and architecture artifacts
                  are live and ready for inspection.
                </Text>

                <Pressable
                  onPress={() => {
                    window.open(destination.githubUrl, "_blank");
                    closeBooking();
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      width: "100%",
                      marginTop: 24,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    Open GitHub Repository ↗
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               TERMINAL MODAL                               */
/* -------------------------------------------------------------------------- */

function TerminalModal({
  visible,
  onClose,
  onSwitchOS,
  osMode,
}: {
  visible: boolean;
  onClose: () => void;
  onSwitchOS: (m: "ios" | "android" | "desktop") => void;
  osMode: "ios" | "android" | "desktop";
}) {
  const [cmdInput, setCmdInput] = useState("");
  const [log, setLog] = useState<string[]>([
    "ZakOS Bash Lab Terminal v2.4.0-hardened",
    "Type 'help' to list available cybersecurity & system commands.",
  ]);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd?.({ animated: true });
  }, [log]);

  if (!visible) return null;

  const handleCommand = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const parts = text.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    let output = "";
    if (cmd === "help") {
      output =
        "Available commands:\n" +
        "  whoami       - Developer background, role & certifications\n" +
        "  tools        - Offensive security & infrastructure tooling\n" +
        "  skills       - Technical competencies matrix\n" +
        "  projects     - 16 production systems & CTF research labs\n" +
        "  os [mode]    - Switch OS frame (ios | android | desktop)\n" +
        "  clear        - Clear terminal log\n" +
        "  exit         - Close terminal";
    } else if (cmd === "whoami") {
      output =
        "Zakarya (Zakar) — Cybersecurity Specialist & Full-Stack Systems Engineer\n" +
        "Specializing in network intrusion detection, SCADA/ICS analysis, and distributed systems.";
    } else if (cmd === "tools") {
      output =
        "[+] Security: Nmap, Wireshark, Scapy, Burp Suite Pro, Metasploit, Ghidra, Volatility 3\n" +
        "[+] Systems: Kali Linux, Arch Linux, Docker, Kubernetes, AWS, PostgreSQL, Kafka, Redis";
    } else if (cmd === "skills") {
      output =
        "• Network Intrusion Detection (NIDS / ML): 94%\n" +
        "• Penetration Testing (eJPT Track): 92%\n" +
        "• Python / FastAPI / Scapy: 96%\n" +
        "• TypeScript / React Native Web: 95%\n" +
        "• Go / Raft Systems: 88%\n" +
        "• C / Linux Kernel (eBPF): 84%";
    } else if (cmd === "projects") {
      output =
        "16 Verified Projects across 4 domains:\n" +
        "  [Security & CTF] NIDS ML, Stuxnet SCADA, eJPT DMZ, eBPF Sandbox\n" +
        "  [Full Stack] ZakOS Web, Voyage Platform, Telemetry Mesh, Collab Canvas\n" +
        "  [Systems & OS] Raft KV Store, Linux Malloc, Hardware Vault, Tactical Mesh\n" +
        "  [Cloud & AI] LLM Red-Team, Autonomous SOC, Neural BinDiff, Edge WASM";
    } else if (cmd === "os") {
      if (arg && ["ios", "android", "desktop"].includes(arg)) {
        onSwitchOS(arg as any);
        output = `[+] System OS skin changed to: ${arg.toUpperCase()}`;
      } else {
        output = `Current OS: ${osMode}. Usage: os <ios | android | desktop>`;
      }
    } else if (cmd === "clear") {
      setLog([]);
      setCmdInput("");
      return;
    } else if (cmd === "exit") {
      onClose();
      return;
    } else {
      output = `bash: command not found: ${cmd}. Type 'help' for options.`;
    }

    setLog((prev) => [...prev, `visitor@zak-portfolio:~$ ${text}`, output]);
    setCmdInput("");
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <View style={styles.modalBackdrop} />
      </Pressable>

      <View style={styles.terminalContainer}>
        <View style={styles.terminalHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={[styles.terminalDot, { backgroundColor: "#EF4444" }]} />
            <View style={[styles.terminalDot, { backgroundColor: "#F59E0B" }]} />
            <View style={[styles.terminalDot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.terminalTitleText}>bash — zak-terminal</Text>
          </View>

          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.terminalCloseText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.terminalBody}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {log.map((line, idx) => (
            <Text key={idx} style={styles.terminalLogLine}>
              {line}
            </Text>
          ))}
        </ScrollView>

        {/* Quick Commands Bar */}
        <View style={styles.terminalQuickRow}>
          {["help", "whoami", "tools", "skills", "projects", "clear"].map((c) => (
            <Pressable
              key={c}
              onPress={() => handleCommand(c)}
              style={styles.terminalQuickPill}
            >
              <Text style={styles.terminalQuickPillText}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.terminalInputRow}>
          <Text style={styles.terminalPromptText}>$</Text>
          <TextInput
            value={cmdInput}
            onChangeText={setCmdInput}
            onSubmitEditing={() => handleCommand(cmdInput)}
            placeholder="type command (e.g. whoami)..."
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.terminalTextInput}
          />
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                CONTACT MODAL                               */
/* -------------------------------------------------------------------------- */

function ContactModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  if (!visible) return null;

  const handleSend = () => {
    if (!name || !email || !msg) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
      setMsg("");
      onClose();
    }, 1200);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <View style={styles.modalBackdrop} />
      </Pressable>

      <View style={styles.contactSheet}>
        <View style={styles.bookingHandle} />
        <View style={styles.bookingHeader}>
          <View>
            <Text style={styles.bookingEyebrow}>CONNECT WITH ME</Text>
            <Text style={styles.bookingTitle}>Zakarya</Text>
          </View>
          <Pressable onPress={onClose} style={styles.bookingCloseButton}>
            <Glyph size={24} color="#4B5563">
              ×
            </Glyph>
          </Pressable>
        </View>

        <Text style={styles.bookingDescription}>
          Cybersecurity Specialist & Full-Stack Systems Engineer based in Casablanca / Remote.
        </Text>

        <View style={styles.contactActionsRow}>
          <Pressable
            onPress={() => window.open("mailto:contact@zakar.dev", "_blank")}
            style={styles.contactActionBtn}
          >
            <Text style={styles.contactActionIcon}>✉</Text>
            <Text style={styles.contactActionText}>Email</Text>
          </Pressable>

          <Pressable
            onPress={() => window.open("https://github.com", "_blank")}
            style={styles.contactActionBtn}
          >
            <Text style={styles.contactActionIcon}>🐙</Text>
            <Text style={styles.contactActionText}>GitHub</Text>
          </Pressable>

          <Pressable
            onPress={() => window.open("https://linkedin.com", "_blank")}
            style={styles.contactActionBtn}
          >
            <Text style={styles.contactActionIcon}>💼</Text>
            <Text style={styles.contactActionText}>LinkedIn</Text>
          </Pressable>
        </View>

        {!sent ? (
          <View style={{ gap: 8, marginTop: 14 }}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#94A3B8"
              style={styles.contactInput}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Your Email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.contactInput}
            />
            <TextInput
              value={msg}
              onChangeText={setMsg}
              placeholder="Your Message..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={[styles.contactInput, { height: 60 }]}
            />
            <Pressable
              onPress={handleSend}
              style={[styles.primaryButton, { marginTop: 10 }]}
            >
              <Text style={styles.primaryButtonText}>Dispatch Message</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text style={{ fontSize: 24, color: "#08AB88", fontWeight: "800" }}>
              ✓ Transmission Sent
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SETTINGS MODAL                               */
/* -------------------------------------------------------------------------- */

function SettingsModal({
  visible,
  onClose,
  osMode,
  onSwitchOS,
  theme = "light",
  onSwitchTheme,
}: {
  visible: boolean;
  onClose: () => void;
  osMode: "ios" | "android" | "desktop";
  onSwitchOS: (m: "ios" | "android" | "desktop") => void;
  theme?: "light" | "dark" | "cyberpunk";
  onSwitchTheme?: (t: "light" | "dark" | "cyberpunk") => void;
}) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <View style={styles.modalBackdrop} />
      </Pressable>

      <View style={styles.contactSheet}>
        <View style={styles.bookingHandle} />
        <View style={styles.bookingHeader}>
          <View>
            <Text style={styles.bookingEyebrow}>SYSTEM CONTROL</Text>
            <Text style={styles.bookingTitle}>OS & Preferences</Text>
          </View>
          <Pressable onPress={onClose} style={styles.bookingCloseButton}>
            <Glyph size={24} color="#4B5563">
              ×
            </Glyph>
          </Pressable>
        </View>

        <Text style={styles.bookingDescription}>
          Select your virtual device environment to re-skin status bars, system gestures, and layout accents.
        </Text>

        <View style={{ gap: 10, marginTop: 14 }}>
          {(
            [
              { id: "ios", label: "iOS 18 (iPhone Mockup / Dynamic Island)", icon: "" },
              { id: "android", label: "Android 15 (Material You / 3-Button Nav)", icon: "🤖" },
              { id: "desktop", label: "Desktop Web (macOS / Portfolio View)", icon: "🖥" },
            ] as const
          ).map((item) => {
            const active = osMode === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => onSwitchOS(item.id)}
                style={[
                  styles.settingsOSOption,
                  active && styles.settingsOSOptionActive,
                ]}
              >
                <Text style={styles.settingsOSIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.settingsOSLabel,
                    active && styles.settingsOSLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {active && <Text style={styles.settingsOSCheck}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {onSwitchTheme && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.controlSectionTitle}>THEME PALETTE</Text>
            <View style={styles.controlSegmentedRow}>
              {(["light", "dark", "cyberpunk"] as const).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => onSwitchTheme(t)}
                  style={[
                    styles.controlSegmentBtn,
                    theme === t && styles.controlSegmentBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.controlSegmentText,
                      theme === t && styles.controlSegmentTextActive,
                    ]}
                  >
                    {t === "light" ? "☀️ Light" : t === "dark" ? "🌙 Dark" : "⚡ Cyber"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Pressable
          onPress={onClose}
          style={[styles.primaryButton, { marginTop: 20 }]}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    APP                                     */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [osMode, setOSMode] = useState<"ios" | "android" | "desktop">(() =>
    detectInitialOS()
  );
  const [theme, setTheme] = useState<"light" | "dark" | "cyberpunk">("light");
  const [activeFilter, setActiveFilter] = useState("Security & CTF");
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [savedIds, setSavedIds] = useState(["sec-nids", "fs-zakos"]);

  // Modals
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Home swipe up physics
  const homeSwipeY = useRef(new Animated.Value(0)).current;

  const toggleSaved = (destinationId: string) => {
    setSavedIds((current) => {
      if (current.includes(destinationId)) {
        return current.filter((id) => id !== destinationId);
      }
      return [...current, destinationId];
    });
  };

  const handleHome = () => {
    setControlCenterOpen(false);
    setIslandExpanded(false);
    setRecentsOpen(false);
    setTerminalOpen(false);
    setContactOpen(false);
    setSettingsOpen(false);
    setSelectedDestination(null);
  };

  const handleBack = () => {
    if (controlCenterOpen) {
      setControlCenterOpen(false);
      return;
    }
    if (islandExpanded) {
      setIslandExpanded(false);
      return;
    }
    if (recentsOpen) {
      setRecentsOpen(false);
      return;
    }
    if (terminalOpen) {
      setTerminalOpen(false);
      return;
    }
    if (contactOpen) {
      setContactOpen(false);
      return;
    }
    if (settingsOpen) {
      setSettingsOpen(false);
      return;
    }
    if (selectedDestination) {
      setSelectedDestination(null);
      return;
    }
  };

  return (
    <View
      style={[
        styles.app,
        theme === "dark" && styles.appDark,
        theme === "cyberpunk" && styles.appCyberpunk,
      ]}
    >
      {/* Dynamic Top System Chrome (Always on top with high zIndex) */}
      <SystemTopChrome
        osMode={osMode}
        onSwitchOS={setOSMode}
        onOpenControlCenter={() => setControlCenterOpen(true)}
        isIslandExpanded={islandExpanded}
        onToggleIsland={() => setIslandExpanded((v) => !v)}
        isDark={theme !== "light" || !!selectedDestination}
      />

      {/* Dynamic Island Expanded Overlay (iOS) */}
      {islandExpanded && osMode === "ios" && (
        <DynamicIslandOverlay
          onClose={() => setIslandExpanded(false)}
          onOpenControlCenter={() => {
            setIslandExpanded(false);
            setControlCenterOpen(true);
          }}
          currentProject={selectedDestination}
        />
      )}

      {/* Main Screen Content with swipe-up transition */}
      <Animated.View
        style={[
          styles.mainContentContainer,
          {
            transform: [{ translateY: homeSwipeY }],
          },
        ]}
      >
        {selectedDestination ? (
          <DetailScreen
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
            onSelectDestination={setSelectedDestination}
            savedIds={savedIds}
            onToggleSave={toggleSaved}
            osMode={osMode}
          />
        ) : (
          <HomeScreen
            onOpen={setSelectedDestination}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            savedIds={savedIds}
            onToggleSave={toggleSaved}
            osMode={osMode}
            onSelectOS={setOSMode}
            onOpenTerminal={() => setTerminalOpen(true)}
            onOpenContact={() => setContactOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            theme={theme}
          />
        )}
      </Animated.View>

      {/* Persistent Bottom System Chrome (Always on top with zIndex: 9999) */}
      <SystemBottomChrome
        osMode={osMode}
        onHome={handleHome}
        onBack={handleBack}
        onRecents={() => setRecentsOpen(true)}
        isDark={theme !== "light" || !!selectedDestination}
        homeSwipeY={homeSwipeY}
      />

      {/* Control Center Slide-Over */}
      <ControlCenterModal
        visible={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
        osMode={osMode}
        onSwitchOS={setOSMode}
        theme={theme}
        onSwitchTheme={setTheme}
      />

      {/* Recents Multitasking Switcher */}
      <RecentsModal
        visible={recentsOpen}
        onClose={() => setRecentsOpen(false)}
        onOpenApp={(appId) => {
          setRecentsOpen(false);
          if (appId === "projects") setSelectedDestination(null);
          else if (appId === "terminal") setTerminalOpen(true);
          else if (appId === "contact") setContactOpen(true);
          else if (appId === "settings") setSettingsOpen(true);
        }}
      />

      {/* Terminal CLI Modal */}
      <TerminalModal
        visible={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onSwitchOS={setOSMode}
        osMode={osMode}
      />

      {/* Contact Modal */}
      <ContactModal
        visible={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        osMode={osMode}
        onSwitchOS={setOSMode}
        theme={theme}
        onSwitchTheme={setTheme}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#F5FAFD",
    position: "relative",
    overflow: "hidden",
  },
  appDark: {
    backgroundColor: "#0B0F17",
  },
  appCyberpunk: {
    backgroundColor: "#070B12",
  },
  mainContentContainer: {
    flex: 1,
    position: "relative",
  },

  homeSafeArea: {
    flex: 1,
    backgroundColor: "#F5FAFD",
  },
  homeSafeAreaDark: {
    backgroundColor: "#0B0F17",
  },
  homeSafeAreaCyberpunk: {
    backgroundColor: "#070B12",
  },

  homeContainer: {
    flex: 1,
    backgroundColor: "#F5FAFD",
  },
  homeContainerDark: {
    backgroundColor: "#0B0F17",
  },
  homeContainerCyberpunk: {
    backgroundColor: "#070B12",
  },

  homeHeader: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 12,
  },

  homeEyebrow: {
    color: "#8592A3",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 1,
    textTransform: "uppercase",
  },

  homeTitle: {
    color: "#11131A",
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  softIconButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  gridButton: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#4D6D83",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.11,
    shadowRadius: 14,
    elevation: 5,
  },

  gridIcon: {
    width: 18,
    height: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "space-between",
    justifyContent: "space-between",
    padding: 2,
  },

  gridIconDot: {
    width: 5,
    height: 5,
    borderWidth: 1.7,
    borderColor: "#20252D",
    borderRadius: 1.4,
  },

  quickMenu: {
    position: "absolute",
    top: 75,
    width: 230,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    zIndex: 30,
    shadowColor: "#425A70",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 14,
  },

  quickMenuHeading: {
    color: "#8592A3",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  quickMenuItem: {
    minHeight: 40,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
  },

  quickMenuItemActive: {
    backgroundColor: "#EAF1FC",
  },

  quickMenuItemPressed: {
    backgroundColor: "#F0F5F8",
  },

  quickMenuText: {
    marginLeft: 10,
    color: "#303844",
    fontSize: 12,
    fontWeight: "700",
  },

  filterArea: {
    height: 55,
    justifyContent: "center",
    zIndex: 4,
  },

  filterPill: {
    height: 34,
    minWidth: 72,
    paddingHorizontal: 19,
    borderRadius: 17,
    backgroundColor: "#E9EEF6",
    marginRight: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  filterPillActive: {
    backgroundColor: "#075CF5",
    shadowColor: "#075CF5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },

  filterText: {
    color: "#303643",
    fontSize: 13,
    fontWeight: "700",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  carouselArea: {
    flex: 1,
    justifyContent: "center",
  },

  destinationCardShadow: {
    borderRadius: 30,
    shadowColor: "#138EA7",
    shadowOffset: {
      width: 0,
      height: 21,
    },
    shadowRadius: 27,
    elevation: 15,
  },

  destinationCard: {
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "#D7EBED",
  },

  destinationImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#CDE5EA",
  },

  imageFallback: {
    overflow: "hidden",
    backgroundColor: "#DDE7EB",
  },

  failedImage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCE7EB",
  },

  failedImageText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  cardTopOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: "50%",
    backgroundColor: "rgba(0,0,0,0.03)",
  },

  cardBottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "44%",
    backgroundColor: "rgba(0,28,43,0.30)",
  },

  cardSaveButton: {
    position: "absolute",
    top: 17,
    right: 16,
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(22,50,63,0.30)",
  },

  cardCopy: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 19,
    alignItems: "center",
  },

  cardCountry: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 3,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    lineHeight: 25,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.28)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 5,
  },

  ratingRow: {
    marginTop: 5,
    flexDirection: "row",
  },

  ratingStar: {
    marginRight: 2,
  },

  bottomNavigation: {
    height: 68,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,
    shadowColor: "#526D7D",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 8,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  navLabelActive: {
    color: "#151A20",
    fontSize: 11,
    fontWeight: "800",
  },

  navActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    backgroundColor: "#121720",
  },

  navItemSubtext: {
    color: "#8A95A5",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },

  relatedCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },

  relatedCardActive: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.96)",
  },

  relatedCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  relatedCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7,35,48,0.18)",
  },

  relatedCurrentBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  relatedCurrentBadgeText: {
    color: "#13212B",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  relatedCardCopy: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
  },

  relatedCardCountry: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },

  relatedCardTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.24)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  detailRoot: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  detailScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  detailScroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  detailScrollContent: {
    backgroundColor: "#FFFFFF",
  },

  detailHero: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#029DBA",
  },

  detailHeroImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  detailHeroTransitionImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  switchVeil: {
    backgroundColor: "#071923",
  },

  detailSafeArea: {
    flex: 1,
  },

  detailTopFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 145,
    backgroundColor: "rgba(0,40,52,0.16)",
  },

  detailBottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "48%",
    backgroundColor: "rgba(0,28,42,0.24)",
  },

  detailTopBar: {
    paddingTop: 10,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  glassButton: {
    backgroundColor: "rgba(8,55,68,0.22)",
  },

  detailMainCopy: {
    position: "absolute",
    left: 22,
    top: "23%",
    width: "62%",
  },

  detailCountry: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  detailTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "700",
    letterSpacing: -0.7,
    textShadowColor: "rgba(0,0,0,0.16)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  detailMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  detailMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  detailMetaText: {
    marginLeft: 6,
    color: "rgba(255,255,255,0.92)",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  detailDescription: {
    color: "rgba(255,255,255,0.91)",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "500",
    marginTop: 16,
  },

  floatingCounters: {
    position: "absolute",
    right: 16,
    top: "26%",
    alignItems: "flex-end",
  },

  floatingCounter: {
    minWidth: 49,
    height: 33,
    paddingHorizontal: 9,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20,78,87,0.27)",
    marginBottom: 10,
  },

  floatingCounterText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  relatedWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 48,
  },

  relatedHeading: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginLeft: 22,
    marginBottom: 9,
    textTransform: "uppercase",
  },

  relatedContent: {
    paddingHorizontal: 22,
    paddingRight: 34,
  },

  detailBottomPanel: {
    marginTop: -22,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: "#1D4052",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 12,
  },

  detailPanelHandle: {
    width: 37,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5EBF0",
    alignSelf: "center",
    marginBottom: 11,
  },

  detailPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailPanelTitleArea: {
    flex: 1,
    paddingRight: 12,
  },

  panelTitle: {
    color: "#151821",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  panelSubheading: {
    color: "#A1A8B1",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#2D6873",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 13,
    elevation: 7,
  },

  panelDescription: {
    color: "#8A929E",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "500",
    marginTop: 10,
  },

  statisticsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
    paddingRight: 8,
  },

  statistic: {
    flexDirection: "row",
    alignItems: "center",
  },

  statisticText: {
    color: "#313844",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },

  peopleRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#E7ECF0",
  },

  morePeopleButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#EFF3FA",
    alignItems: "center",
    justifyContent: "center",
  },

  routeCard: {
    minHeight: 66,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#F7F9FC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  routePointIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#F0EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  routeColumn: {
    flex: 1,
  },

  routeLabel: {
    color: "#A9AFB9",
    fontSize: 9,
    fontWeight: "600",
  },

  routeValue: {
    color: "#242B35",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  routeDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#E4E8EF",
    marginHorizontal: 12,
  },

  primaryButton: {
    minHeight: 52,
    marginTop: 13,
    borderRadius: 16,
    backgroundColor: "#075CF5",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  bookingBackdrop: {
    backgroundColor: "rgba(10,24,34,0.44)",
  },

  bookingSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 410,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 31,
    borderTopRightRadius: 31,
    paddingHorizontal: 22,
    paddingTop: 10,
    shadowColor: "#132C3B",
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 28,
  },

  bookingHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DCE2E8",
    alignSelf: "center",
    marginBottom: 18,
  },

  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bookingEyebrow: {
    color: "#075CF5",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  bookingTitle: {
    color: "#141922",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginTop: 3,
  },

  bookingCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F3F6",
    alignItems: "center",
    justifyContent: "center",
  },

  bookingDescription: {
    color: "#858E9A",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    marginTop: 12,
  },

  bookingOptionCard: {
    marginTop: 20,
    minHeight: 79,
    borderRadius: 20,
    backgroundColor: "#F6F8FB",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bookingOptionLabel: {
    color: "#969EAA",
    fontSize: 11,
    fontWeight: "600",
  },

  bookingOptionValue: {
    color: "#1D2530",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#607181",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 3,
  },

  quantityButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },

  quantityText: {
    minWidth: 38,
    color: "#202833",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  bookingTotalRow: {
    marginTop: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bookingTotalLabel: {
    color: "#222A34",
    fontSize: 14,
    fontWeight: "800",
  },

  bookingTotalNote: {
    color: "#A0A7B1",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 3,
  },

  bookingTotalValue: {
    color: "#075CF5",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  confirmationContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
  },

  confirmationIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#08AB88",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#08AB88",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },

  confirmationTitle: {
    color: "#151B24",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 21,
  },

  confirmationText: {
    maxWidth: 310,
    color: "#89919C",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 9,
  },

  /* ---------------------- DYNAMIC OS CHROME STYLING --------------------- */
  systemTopChromeWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9000,
    backgroundColor: "transparent",
  },
  iosTopChrome: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    backgroundColor: "transparent",
    cursor: "grab",
    userSelect: "none",
  },
  iosClockText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  dynamicIsland: {
    width: 110,
    height: 28,
    backgroundColor: "#000000",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    cursor: "pointer",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dynamicIslandLens: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 6,
  },
  dynamicIslandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#10B981",
  },
  iosRightStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
  },
  iosStatusGlyph: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  iosBottomBarArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    pointerEvents: "box-none",
  },
  iosHomeIndicatorHitZone: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  iosHomeIndicatorTouchArea: {
    cursor: "pointer",
    padding: 6,
  },
  iosHomeIndicator: {
    width: 140,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  androidTopChrome: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "transparent",
    cursor: "grab",
    userSelect: "none",
  },
  androidLeftStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  androidClockText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  androidNotifGlyph: {
    fontSize: 10,
  },
  punchHoleCutout: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000000",
  },
  androidRightStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  androidStatusGlyph: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111827",
  },
  androidBottomBarArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 36,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(12px)",
    zIndex: 9999,
    userSelect: "none",
  },
  androidNavBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  androidNavBtnPressed: {
    opacity: 0.45,
    transform: [{ scale: 0.88 }],
  },
  androidNavIcon: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "800",
  },
  androidHomeCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: "#475569",
  },
  androidRecentsSquare: {
    width: 13,
    height: 13,
    borderRadius: 2.5,
    borderWidth: 2,
    borderColor: "#475569",
  },

  desktopTopChrome: {
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    userSelect: "none",
  },
  desktopWindowControls: {
    flexDirection: "row",
    gap: 6,
  },
  windowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  desktopTitleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  desktopRightStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  desktopStatusGlyph: {
    fontSize: 11,
    color: "#475569",
  },
  desktopStatusTime: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
  },

  /* ----------------------- DYNAMIC ISLAND OVERLAY ----------------------- */
  islandOverlayWrapper: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9500,
    pointerEvents: "box-none",
  },
  islandExpandedContainer: {
    width: 320,
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  islandExpandedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  islandPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#065F46",
  },
  islandExpandedTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  islandExpandedSubtitle: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 1,
  },
  islandExpandedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  islandActionPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#075CF5",
    cursor: "pointer",
  },
  islandActionText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "700",
  },
  islandCloseBtn: {
    padding: 4,
    cursor: "pointer",
  },
  islandCloseText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },

  /* ------------------------ CONTROL CENTER MODAL ------------------------ */
  controlCenterSheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    maxHeight: "85%",
    backgroundColor: "#0B0F17",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 32,
  },
  controlCenterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  controlCenterEyebrow: {
    color: "#075CF5",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  controlCenterTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  controlTogglesGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  controlToggleCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    cursor: "pointer",
  },
  controlToggleCardActive: {
    backgroundColor: "rgba(7, 92, 245, 0.2)",
    borderColor: "#075CF5",
  },
  controlToggleCardWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    borderColor: "#F59E0B",
  },
  controlToggleIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  controlToggleLabel: {
    color: "#F1F5F9",
    fontSize: 11,
    fontWeight: "700",
  },
  controlToggleSubtext: {
    color: "#94A3B8",
    fontSize: 9.5,
    marginTop: 2,
  },
  controlSection: {
    marginBottom: 14,
  },
  controlSectionTitle: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  controlSegmentedRow: {
    flexDirection: "row",
    gap: 8,
  },
  controlSegmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    cursor: "pointer",
  },
  controlSegmentBtnActive: {
    backgroundColor: "#075CF5",
    borderColor: "#38BDF8",
  },
  controlSegmentText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  controlSegmentTextActive: {
    color: "#FFFFFF",
  },
  controlTelemetryCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  controlTelemetryItem: {
    alignItems: "center",
    flex: 1,
  },
  controlTelemetryLabel: {
    color: "#64748B",
    fontSize: 9.5,
    fontWeight: "600",
  },
  controlTelemetryValue: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  controlHandleZone: {
    alignItems: "center",
    paddingTop: 8,
    cursor: "pointer",
  },
  controlDismissBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 4,
  },
  controlDismissText: {
    color: "#64748B",
    fontSize: 9.5,
    fontWeight: "600",
  },

  /* --------------------------- RECENTS MODAL --------------------------- */
  recentsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: "18%",
    backgroundColor: "#0A0E17",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  recentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  recentsTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  recentsCloseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    cursor: "pointer",
  },
  recentsCloseText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  recentsScrollContent: {
    gap: 16,
    paddingBottom: 24,
    paddingRight: 20,
  },
  recentsCard: {
    width: 210,
    height: 290,
    backgroundColor: "#131C2E",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    cursor: "pointer",
  },
  recentsCardTop: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  recentsAppIcon: {
    fontSize: 38,
  },
  recentsCardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
  },
  recentsCardBody: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  recentsAppName: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  recentsAppSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  recentsOpenBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 10,
  },
  recentsOpenBtnText: {
    color: "#38BDF8",
    fontSize: 11.5,
    fontWeight: "700",
  },

  /* ---------------------------- MODALS --------------------------- */
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },

  /* Terminal */
  terminalContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "12%",
    bottom: "12%",
    backgroundColor: "#0A0E17",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
  },
  terminalHeader: {
    height: 38,
    backgroundColor: "#0F172A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  terminalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitleText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
    marginLeft: 6,
  },
  terminalCloseText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },
  terminalBody: {
    flex: 1,
    padding: 12,
    backgroundColor: "#070B12",
  },
  terminalLogLine: {
    color: "#38BDF8",
    fontSize: 11.5,
    lineHeight: 18,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  terminalQuickRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  terminalQuickPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  terminalQuickPillText: {
    color: "#CBD5E1",
    fontSize: 10.5,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  terminalInputRow: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#0A0E17",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  terminalPromptText: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  terminalTextInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "monospace",
    height: 36,
  },

  /* Contact & Settings Bottom Sheets */
  contactSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 380,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 31,
    borderTopRightRadius: 31,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 28,
    shadowColor: "#132C3B",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 28,
  },
  contactActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  contactActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F0F5F8",
    alignItems: "center",
    justifyContent: "center",
  },
  contactActionIcon: {
    fontSize: 18,
  },
  contactActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    marginTop: 2,
  },
  contactInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 12,
    color: "#1E293B",
  },

  settingsOSOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  settingsOSOptionActive: {
    backgroundColor: "#EAF1FC",
    borderColor: "#075CF5",
  },
  settingsOSIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  settingsOSLabel: {
    flex: 1,
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
  },
  settingsOSLabelActive: {
    color: "#075CF5",
  },
  settingsOSCheck: {
    color: "#075CF5",
    fontSize: 14,
    fontWeight: "900",
  },
});
