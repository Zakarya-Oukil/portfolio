import {
  Project,
  ProjectCategory,
  SkillItem,
  WallpaperId,
} from '../types';

export const DEVELOPER_PROFILE = {
  name: 'Zakaria (Zakar)',
  handle: '@zakaria-dev',
  role: 'Cybersecurity Specialist & Full-Stack Systems Engineer',
  location: 'Casablanca, Morocco / Remote',
  status: 'Available for Engineering & Security Roles',
  bio: 'Specialized in offensive cybersecurity, defensive network intrusion detection, low-level systems, and high-performance cross-platform web/mobile architectures. eJPT & OSCP track researcher.',
  email: 'contact@zakar.dev',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  resumeUrl: '#resume',
};

export const WALLPAPERS: {
  id: WallpaperId;
  name: string;
  osTarget: string;
  url: string;
  darkOverlay: string;
}[] = [
  {
    id: 'ios-abstract',
    name: 'iOS Titanium Aurora',
    osTarget: 'iOS',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
    darkOverlay: 'rgba(15, 23, 42, 0.45)',
  },
  {
    id: 'android-material',
    name: 'Material You Botanical',
    osTarget: 'Android',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=85',
    darkOverlay: 'rgba(17, 24, 39, 0.40)',
  },
  {
    id: 'macos-sonoma',
    name: 'Sonoma Horizon',
    osTarget: 'Desktop Web',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    darkOverlay: 'rgba(10, 15, 30, 0.35)',
  },
  {
    id: 'cyberpunk-neon',
    name: 'OLED Cyber Grid',
    osTarget: 'All Platforms',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=85',
    darkOverlay: 'rgba(0, 0, 0, 0.55)',
  },
];

export const CATEGORIES: ProjectCategory[] = [
  'Security & CTF',
  'Full Stack & Systems',
  'Mobile & Cloud',
  'AI & Labs',
];

export const PROJECTS: Project[] = [
  /* -------------------------- SECURITY & CTF -------------------------- */
  {
    id: 'nids-ml',
    category: 'Security & CTF',
    title: 'NIDS with Machine Learning',
    subtitle: 'ML-Driven Network Intrusion Detection Engine',
    badge: 'RANDOM FOREST + STREAMLIT',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=90',
    duration: '4 MOS',
    complexity: 'L4 SEC ENG',
    stars: 542,
    views: 1890,
    likes: 419,
    description:
      'Production-grade network intrusion detection system evaluating real-time PCAP traffic flows. Uses Random Forest and XGBoost ensembles trained on CIC-IDS2017 & NSL-KDD datasets to detect DDoS, port scans, infiltration, and botnet activity with a 99.4% detection rate and sub-10ms classification latency.',
    architectureNotes:
      'Scapy packet ingestion -> feature extraction (flow duration, inter-arrival time, packet flags) -> ONNX runtime inference -> Redis telemetry queue -> interactive Streamlit SIEM dashboard with threat severity heatmaps.',
    architecture: {
      frontend: 'Streamlit Real-Time Dashboard, Plotly Cyber Charts',
      backend: 'Python 3.11, Scapy, Pandas, ONNX Runtime',
      security: 'Suricata Rule Cross-Correlation, PCAP Replay Pipeline',
      dataPipeline: 'Redis Pub/Sub, SQLite Event Store',
      deployment: 'Docker Swarm, Linux Kernel Promiscuous Sniffing',
    },
    techStack: ['Python', 'Scapy', 'Random Forest', 'Streamlit', 'Redis', 'Docker'],
    metrics: [
      { label: 'Detection Accuracy', value: '99.4%' },
      { label: 'Inference Latency', value: '< 8.2ms' },
      { label: 'Throughput', value: '150k pkt/s' },
      { label: 'False Positive Rate', value: '0.06%' },
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.zakar.dev/nids',
  },
  {
    id: 'stuxnet-analysis',
    category: 'Security & CTF',
    title: 'Stuxnet Exploit Architecture',
    subtitle: 'ICS/SCADA Cyber Warfare Dissection Lab',
    badge: 'MALWARE REVERSE ENGINEERING',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=90',
    duration: '2 MOS',
    complexity: 'EXPLOIT DEV',
    stars: 780,
    views: 3120,
    likes: 642,
    description:
      'Exhaustive static and dynamic reverse-engineering breakdown of Stuxnet. Includes isolated emulation of the 4 zero-day vulnerability chains (CVE-2010-2568 LNK file parsing, print spooler elevation, Siemens WinCC hardcoded credentials), rootkit kernel driver signing bypass, and PLC Step 7 frequency manipulation analysis.',
    architectureNotes:
      'Simulated Siemens S7-300 PLC environment running inside snap7, memory dump reconstruction via Volatility 3, Ghidra disassembly with annotated control-flow graphs, and automated Yara rule signatures.',
    architecture: {
      frontend: 'Interactive React Flow Infection Graph & Control Map',
      backend: 'C/C++, Assembly x86, Python snap7 PLC Simulator',
      security: 'Ghidra Headless, x64dbg, Volatility 3, Yara Engine',
      dataPipeline: 'JSON AST CFG Export, Binary Diff Dumps',
      deployment: 'Air-Gapped Vagrant Sandbox VM',
    },
    techStack: ['Ghidra', 'x86 Asm', 'C++', 'Volatility', 'Yara', 'SCADA/PLC'],
    metrics: [
      { label: 'Zero-Days Analyzed', value: '4 Flaws' },
      { label: 'CFG Nodes Mapped', value: '1,420' },
      { label: 'Rootkit Drivers', value: '2 Signed' },
      { label: 'Payload Simulation', value: 'Step 7 PLC' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'dmz-pentest-suite',
    category: 'Security & CTF',
    title: 'eJPT/HTB DMZ Assessment Suite',
    subtitle: 'Automated Multi-Tier Pivoting & Audit Framework',
    badge: 'RED TEAM / PENTEST',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'OFFENSIVE SEC',
    stars: 620,
    views: 2450,
    likes: 512,
    description:
      'Full offensive security penetration testing harness designed for complex DMZ environments like HackTheBox Pro Labs and eJPT scenarios. Integrates automated Chisel/SOCKS5 multi-hop tunneling, double-pivot port sweeps, Kerberos ticketing validation (AS-REP roasting, Kerberoasting), and bloodhound pathing.',
    architectureNotes:
      'Async Python daemon orchestrating raw socket port discovery across nested subnets, Impacket protocol wrappers for SMB/RPC, automated credential harvesting with memory hash parsing.',
    architecture: {
      frontend: 'Curses Terminal CLI & BloodHound Cypher Query Exporter',
      backend: 'Go (Fast Tunneling Agent), Python 3.11 Impacket Core',
      security: 'Kerberos, Chisel SOCKS5, Nmap NSE Scripts, BloodHound',
      dataPipeline: 'SQLite Local Vault with AES-256-GCM Credential Store',
      deployment: 'Kali Linux, Arch ARM / Pwnagotchi Support',
    },
    techStack: ['Go', 'Python', 'Impacket', 'Chisel', 'Kerberos', 'BloodHound'],
    metrics: [
      { label: 'Pivoting Speed', value: '10x Native' },
      { label: 'Subnets Scanned', value: 'Class C in 4s' },
      { label: 'HTB Pro Labs Cleared', value: 'Dante / Offshore' },
      { label: 'Protocols Tested', value: 'SMB/RPC/WMI' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'zero-trust-auth',
    category: 'Security & CTF',
    title: 'Zero-Trust Kernel Sandbox',
    subtitle: 'eBPF Syscall Monitor & mTLS Identity Broker',
    badge: 'SYS SECURITY / eBPF',
    image:
      'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1400&q=90',
    duration: '5 MOS',
    complexity: 'KERNEL LINUX',
    stars: 490,
    views: 1680,
    likes: 388,
    description:
      'High-performance host security enclave using eBPF probes attached to Linux kernel syscalls (`sys_enter_execve`, `sys_enter_connect`). Enforces micro-segmentation and kills unauthorized reverse shells in user space in less than 40 microseconds while enforcing mutual TLS (mTLS) with SPIFFE/SPIRE IDs.',
    architectureNotes:
      'Kernel C eBPF programs compiled via LLVM/Clang into bytecode -> loaded by Go Cilium eBPF manager -> user-space ring buffer alerts -> automated network namespace isolation.',
    architecture: {
      frontend: 'Next.js 14 Real-time Kernel Event Visualizer',
      backend: 'Go (Cilium eBPF Library), Kernel C Probes',
      security: 'SPIFFE/SPIRE mTLS, Linux Capabilities Drop, Seccomp',
      dataPipeline: 'eBPF Ring Buffer, OpenTelemetry OTLP Exporter',
      deployment: 'Linux 6.x Kernel, Docker Container Enclaves',
    },
    techStack: ['C', 'eBPF', 'Go', 'Linux Kernel', 'SPIFFE', 'mTLS'],
    metrics: [
      { label: 'Block Latency', value: '< 42μs' },
      { label: 'Kernel Overhead', value: '< 1.1% CPU' },
      { label: 'Syscalls Filtered', value: '64 Crucial' },
      { label: 'Zero Breaches', value: 'Audited' },
    ],
    githubUrl: 'https://github.com',
  },

  /* ---------------------- FULL STACK & SYSTEMS ---------------------- */
  {
    id: 'agentic-web-os',
    category: 'Full Stack & Systems',
    title: 'ZakOS / Hermes Agentic Web OS',
    subtitle: 'Multi-OS Virtual Device & Agent Platform',
    badge: 'AGENTIC OS ARCHITECTURE',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'L5 ARCHITECT',
    stars: 940,
    views: 4200,
    likes: 820,
    description:
      'Interactive Web-based Operating System capable of simulating native iOS, Android (Material You), and Desktop environments with dynamic frame re-skinning, WebAssembly CLI terminal runtime, autonomous agent tool calling, and cross-platform React Native Web primitives.',
    architectureNotes:
      'Universal component model shared between React Native Web and Expo. State machine tracking device frames, viewport dimensions, dynamic pan responder physics, and zero-flash overwrite crossfading.',
    architecture: {
      frontend: 'React Native Web, TypeScript, Animated API, PanResponder',
      backend: 'Vite Bundler, Node.js Microservices, SSE Streaming API',
      security: 'Content Security Policy (CSP) Level 3, Sandboxed iFrames',
      dataPipeline: 'Local State Machines, IndexedDB Persistence',
      deployment: 'Vercel Edge, Docker Container, Static PWA Ready',
    },
    techStack: ['React Native Web', 'TypeScript', 'Vite', 'Animated', 'Tailwind', 'WASM'],
    metrics: [
      { label: 'Lighthouse Score', value: '100 / 100' },
      { label: 'FPS on Swiping', value: '60 FPS Solid' },
      { label: 'Bundle Size', value: '< 140KB' },
      { label: 'OS Modes', value: '3 Interactive' },
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://zakar.dev',
  },
  {
    id: 'voyage-platform',
    category: 'Full Stack & Systems',
    title: 'Hyper-Scale Travel Platform',
    subtitle: 'Event-Driven Distributed Booking Engine',
    badge: 'DISTRIBUTED SYSTEMS',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90',
    duration: '4 MOS',
    complexity: 'FULL STACK',
    stars: 610,
    views: 2890,
    likes: 530,
    description:
      'High-concurrency global travel platform supporting instant destination reservations, dynamic currency pricing, and zero-flash fluid image crossfading. Built with distributed idempotency keys, optimistic UI updates, and Kafka transaction logs guaranteeing zero double-bookings.',
    architectureNotes:
      'Next.js 14 App Router -> Go gRPC Microservices -> Apache Kafka event bus -> Redis cluster locks -> PostgreSQL distributed partitions with row-level security (RLS).',
    architecture: {
      frontend: 'Next.js 14, Tailwind CSS, Framer Motion, React Query',
      backend: 'Go (Gin/gRPC), Node.js Fastify, Python ML Recommender',
      security: 'JWT with Refresh Token Rotation, Stripe Webhook HMAC',
      dataPipeline: 'Apache Kafka, Redis Pub/Sub, PostgreSQL Read Replicas',
      deployment: 'Kubernetes (GKE), Cloudflare Workers Global CDN',
    },
    techStack: ['Next.js', 'Go', 'PostgreSQL', 'Kafka', 'Redis', 'Kubernetes'],
    metrics: [
      { label: 'P99 Latency', value: '28ms' },
      { label: 'Concurrent Bookings', value: '25,000/s' },
      { label: 'Cache Hit Ratio', value: '96.2%' },
      { label: 'Uptime SLA', value: '99.99%' },
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://demo.zakar.dev/voyage',
  },
  {
    id: 'distributed-db-engine',
    category: 'Full Stack & Systems',
    title: 'Raft Distributed KV Store',
    subtitle: 'Log-Structured Consensus Database Engine',
    badge: 'SYSTEMS / GO & RUST',
    image:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=90',
    duration: '6 MOS',
    complexity: 'CONSENSUS PROTOCOL',
    stars: 870,
    views: 3900,
    likes: 710,
    description:
      'Distributed fault-tolerant Key-Value store implementing the Raft consensus algorithm from scratch in Go. Features an LSM-Tree (Log-Structured Merge-Tree) storage engine with SSTables, memtables, Bloom filters, Write-Ahead Logging (WAL), and dynamic leader election.',
    architectureNotes:
      'Custom RPC transport layer with protobuf serialization, heartbeats, term incrementation, log compaction via snapshotting, and linearizable read index validation.',
    architecture: {
      frontend: 'Web-based Cluster Topology & Leader State Inspector',
      backend: 'Go 1.22, Protobuf, gRPC, Custom LSM-Tree Engine',
      security: 'TLS 1.3 Node-to-Node Mutual Authentication',
      dataPipeline: 'WAL In-Memory Buffers, Disk SSTable Compaction',
      deployment: 'Multi-AZ Cloud Deployment, Chaos Mesh Tested',
    },
    techStack: ['Go', 'Raft Algorithm', 'LSM-Tree', 'Protobuf', 'gRPC', 'Linux'],
    metrics: [
      { label: 'Write Throughput', value: '180k ops/s' },
      { label: 'Election Failover', value: '< 150ms' },
      { label: 'Bloom Accuracy', value: '99.9%' },
      { label: 'Linearizability', value: 'Jepsen Verified' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'cloud-telemetry-mesh',
    category: 'Full Stack & Systems',
    title: 'High-Throughput Telemetry Mesh',
    subtitle: 'ClickHouse & OpenTelemetry Streaming Pipeline',
    badge: 'OBSERVABILITY / CLOUD',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'BIG DATA',
    stars: 520,
    views: 2100,
    likes: 440,
    description:
      'Enterprise log and trace aggregation mesh handling 20 million events per minute across Kubernetes clusters. Uses Vector collector agents, ClickHouse columnar database for sub-second analytical queries, and real-time anomaly alerting via Slack/PagerDuty.',
    architectureNotes:
      'Vector daemons -> Apache Kafka buffering -> ClickHouse Vector streaming consumer -> Grafana dashboards with SQL query optimizations.',
    architecture: {
      frontend: 'Custom Grafana Dashboards, React Analytics Visualizer',
      backend: 'Vector (Rust), ClickHouse Columnar DB, Python Fastly Workers',
      security: 'Encrypted OTLP Traces, Role-Based Column Masking',
      dataPipeline: 'Apache Kafka, ClickHouse Materialized Views',
      deployment: 'AWS EKS, Terraform Managed Infra, S3 Cold Storage',
    },
    techStack: ['ClickHouse', 'Vector', 'Rust', 'Kafka', 'Kubernetes', 'Grafana'],
    metrics: [
      { label: 'Events Handled', value: '20M / min' },
      { label: 'Query Response', value: '< 90ms' },
      { label: 'Storage Compression', value: '8.4x Ratio' },
      { label: 'Retention Days', value: '90 Days Live' },
    ],
    githubUrl: 'https://github.com',
  },

  /* ------------------------ MOBILE & CLOUD ------------------------ */
  {
    id: 'offline-tactical-suite',
    category: 'Mobile & Cloud',
    title: 'Offline-First Tactical Field Suite',
    subtitle: 'CRDT Peer-to-Peer Mobile Mesh Network',
    badge: 'REACT NATIVE / P2P',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=90',
    duration: '4 MOS',
    complexity: 'MOBILE ENG',
    stars: 670,
    views: 2750,
    likes: 580,
    description:
      'Tactical mobile communication application engineered for zero-connectivity environments. Synchronizes geospatial maps, tactical pins, and mission logs across devices using Yjs Conflict-Free Replicated Data Types (CRDTs) over Bluetooth Low Energy (BLE) and local Wi-Fi Direct.',
    architectureNotes:
      'WatermelonDB local SQLite persistence, Yjs CRDT synchronization, custom WebRTC and BLE peripheral/central connection managers with cryptographic session handshakes.',
    architecture: {
      frontend: 'React Native, Expo, Mapbox Offline Vector Tiles',
      backend: 'Node.js Mesh Relay, WebRTC Data Channels',
      security: 'Signal Protocol Double Ratchet E2E Encryption',
      dataPipeline: 'Yjs CRDTs, WatermelonDB SQLite Reactive Sync',
      deployment: 'iOS App Store, Google Play Store, Bare APK',
    },
    techStack: ['React Native', 'TypeScript', 'CRDTs', 'BLE', 'WebRTC', 'SQLite'],
    metrics: [
      { label: 'Offline Sync Lag', value: '< 25ms' },
      { label: 'Mesh Range', value: 'Up to 120m' },
      { label: 'Encryption', value: 'Signal E2E' },
      { label: 'Battery Impact', value: '< 2.8% / hr' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'serverless-pipeline',
    category: 'Mobile & Cloud',
    title: 'Automated DLP Cloud Pipeline',
    subtitle: 'Data Loss Prevention & S3 Sanitization Engine',
    badge: 'CLOUD SECURITY / AWS',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=90',
    duration: '2 MOS',
    complexity: 'SERVERLESS',
    stars: 430,
    views: 1820,
    likes: 360,
    description:
      'Automated cloud data-protection engine triggering upon S3 object upload to scan, classify, and redact PII, PCI, and proprietary source tokens before data enters enterprise analytics data lakes. Implemented with AWS Lambda, EventBridge, and Google Cloud DLP.',
    architectureNotes:
      'Event-driven architecture with zero idle cost. Streams payloads into Rust Lambda functions for high-speed regex and entropy calculation, quarantining suspect blobs into an isolated KMS-encrypted vault.',
    architecture: {
      frontend: 'Next.js Security Operations Audit Dashboard',
      backend: 'AWS Lambda (Rust/Python), Step Functions, EventBridge',
      security: 'AWS KMS Custom Key, IAM Least-Privilege Roles',
      dataPipeline: 'Amazon SQS FIFO, CloudWatch Metrics, S3 Object Lambda',
      deployment: 'Terraform, GitHub Actions CI/CD Pipeline',
    },
    techStack: ['AWS Lambda', 'Rust', 'Terraform', 'EventBridge', 'KMS', 'S3'],
    metrics: [
      { label: 'Scan Latency', value: '< 18ms / file' },
      { label: 'Monthly Volume', value: '4 TBs Scanned' },
      { label: 'False Positives', value: '< 0.01%' },
      { label: 'Cost Reduction', value: '72% vs SaaS' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'edge-cdn-optimizer',
    category: 'Mobile & Cloud',
    title: 'WASM Edge Image Synthesizer',
    subtitle: 'Sub-Millisecond Asset Compression at Edge',
    badge: 'CLOUDFLARE / WASM',
    image:
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=90',
    duration: '2 MOS',
    complexity: 'EDGE COMPUTE',
    stars: 580,
    views: 2200,
    likes: 470,
    description:
      'Cloudflare Workers edge service executing WebAssembly-compiled image optimization libraries (libvips / mozjpeg / libwebp). Dynamically detects client device capabilities, screen DPR, and network speed to transcode assets into AVIF/WebP on the fly.',
    architectureNotes:
      'Rust codebase compiled to WebAssembly target `wasm32-unknown-unknown`, binding directly to Cloudflare V8 isolates. KV caching for transcoded variants with Tiered Cache routing.',
    architecture: {
      frontend: 'Responsive Picture Element Web Components',
      backend: 'Cloudflare Workers (Rust WebAssembly)',
      security: 'Signed HMAC URLs to prevent origin exhaustion attacks',
      dataPipeline: 'Cloudflare KV, R2 Object Storage',
      deployment: 'Global Anycast Network (300+ Cities)',
    },
    techStack: ['Rust', 'WebAssembly', 'Cloudflare Workers', 'AVIF', 'HTTP/3'],
    metrics: [
      { label: 'Edge TTFB', value: '14ms Avg' },
      { label: 'Bandwidth Saved', value: '64% Reduction' },
      { label: 'Global Pops', value: '310 Cities' },
      { label: 'Cold Starts', value: '0ms (Isolates)' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'secure-vault-mobile',
    category: 'Mobile & Cloud',
    title: 'Hardware Biometric Mobile Vault',
    subtitle: 'Secure Enclave & StrongBox Password Manager',
    badge: 'CRYPTO / MOBILE',
    image:
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'CRYPTOGRAPHY',
    stars: 710,
    views: 2980,
    likes: 620,
    description:
      'Zero-knowledge encrypted mobile credential manager. Leverages Apple Secure Enclave (FaceID) on iOS and Android KeyStore StrongBox (Fingerprint) hardware to derive ephemeral AES-256-GCM keys. Master keys never touch RAM in plaintext.',
    architectureNotes:
      'Argon2id key derivation with 64MB memory cost -> hardware-backed private key signing -> local encrypted realm DB -> optional zero-knowledge sync to user-owned Nextcloud/S3 server.',
    architecture: {
      frontend: 'React Native, Expo Local Authentication, Swift / Kotlin Native Modules',
      backend: 'Zero-Knowledge Sync Server in Rust (Optional self-host)',
      security: 'Apple Secure Enclave, Android StrongBox, AES-256-GCM',
      dataPipeline: 'Encrypted SQLite, Protobuf Serialization',
      deployment: 'App Store, Play Store, F-Droid Compliant',
    },
    techStack: ['React Native', 'Swift', 'Kotlin', 'Secure Enclave', 'AES-256', 'Argon2'],
    metrics: [
      { label: 'Crack Resistance', value: 'Quantum Resistant' },
      { label: 'Hardware Derivation', value: '120ms' },
      { label: 'Zero Knowledge', value: 'Audited' },
      { label: 'Vulnerabilities', value: '0 CVEs' },
    ],
    githubUrl: 'https://github.com',
  },

  /* -------------------------- AI & LABS -------------------------- */
  {
    id: 'llm-agent-evaluator',
    category: 'AI & Labs',
    title: 'LLM Red-Team & Prompt Jailbreak',
    subtitle: 'Automated Adversarial Security Benchmark',
    badge: 'AI SECURITY / LLM',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'GENAI SEC',
    stars: 890,
    views: 3800,
    likes: 740,
    description:
      'Autonomous red-teaming harness testing LLMs and multi-agent frameworks against prompt injections, token smuggling, jailbreaks, data exfiltration via indirect injections, and RAG poisoning. Automated fuzzing generates thousands of semantic payload variations.',
    architectureNotes:
      'Genetic algorithm mutating adversarial prompts -> scoring output toxicity and compliance using specialized judge models -> generating formal vulnerability reports according to OWASP Top 10 for LLM Applications.',
    architecture: {
      frontend: 'React Flow Interactive Jailbreak Attack Tree Graph',
      backend: 'Python 3.11, LangChain, PyTorch, vLLM Local Engine',
      security: 'OWASP LLM Top 10 Evaluator, Guardrails AI Integration',
      dataPipeline: 'PostgreSQL Vector (pgvector), JSON Benchmark Export',
      deployment: 'NVIDIA TensorRT-LLM, AWS GPU Instances',
    },
    techStack: ['Python', 'PyTorch', 'vLLM', 'LangChain', 'pgvector', 'Docker'],
    metrics: [
      { label: 'Attack Vectors', value: '3,800+ Tested' },
      { label: 'Jailbreak Detection', value: '98.7% Recall' },
      { label: 'Benchmark Speed', value: '45 req/s' },
      { label: 'OWASP Mapped', value: '10/10 Covered' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'autonomous-soc-analyst',
    category: 'AI & Labs',
    title: 'Autonomous SOC Alert Triager',
    subtitle: 'Graph Neural Network for SIEM Anomaly Clustering',
    badge: 'CYBER AI / GNN',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=90',
    duration: '4 MOS',
    complexity: 'L5 AI LAB',
    stars: 760,
    views: 3100,
    likes: 650,
    description:
      'Autonomous Tier-1 Security Operations Center triage bot. Parses millions of Windows Event Logs, Sysmon telemetry, and Zeek network traces, structuring them into a heterogeneous attack graph. Graph Convolutional Networks (GCN) identify lateral movement chains in minutes.',
    architectureNotes:
      'Heterogeneous Graph creation via PyTorch Geometric -> sub-graph anomaly scoring -> automated Sigma rule generation -> automated isolation recommendation via SOAR webhook.',
    architecture: {
      frontend: 'Cytoscape.js Network Graph Visualizer & Incident Viewer',
      backend: 'Python, PyTorch Geometric, Neo4j Graph DB, FastAPI',
      security: 'MITRE ATT&CK Framework Mapping, Sigma Rule Builder',
      dataPipeline: 'Kafka, Elasticsearch, Neo4j Graph Ingestion',
      deployment: 'Kubernetes Cluster with GPU worker pools',
    },
    techStack: ['PyTorch', 'Neo4j', 'FastAPI', 'Elasticsearch', 'Sysmon', 'MITRE ATT&CK'],
    metrics: [
      { label: 'Alert Fatigue Drop', value: '88% Fewer Pings' },
      { label: 'Graph Resolution', value: '1.2M Edges/s' },
      { label: 'MTTD Reduction', value: 'From 4hrs to 4min' },
      { label: 'Sigma Rules', value: 'Auto-Generated' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'binary-diffing-ai',
    category: 'AI & Labs',
    title: 'Neural Binary Diffing Engine',
    subtitle: 'Embedding-Based Vulnerability & Patch Matcher',
    badge: 'REVERSE ENG / AI',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=90',
    duration: '3 MOS',
    complexity: 'BIN SEC',
    stars: 640,
    views: 2600,
    likes: 540,
    description:
      'Deep-learning based cross-architecture binary diffing tool. Extracts Control Flow Graphs (CFGs) from compiled binaries (ELF/PE) across x86, ARM, and MIPS, generating dense vector embeddings with Graph Attention Networks (GAT) to identify 1-day vulnerabilities across architectures.',
    architectureNotes:
      'Headless Ghidra disassembler script -> intermediate representation (P-Code) normalization -> Graph Neural Network embedding generation -> FAISS cosine similarity index.',
    architecture: {
      frontend: 'Side-by-Side Synchronized Decompiler Hex & C Diff UI',
      backend: 'Ghidra Headless, Python, PyTorch, FAISS Vector Index',
      security: 'CVE Vulnerability Signature Matching across stripped bins',
      dataPipeline: 'Binary AST Hashing, Parquet Vector Storage',
      deployment: 'Local CLI tool and Web API service',
    },
    techStack: ['Ghidra', 'Python', 'PyTorch', 'FAISS', 'Assembly', 'C'],
    metrics: [
      { label: 'Cross-Arch Accuracy', value: '94.2% Top-1' },
      { label: 'Diff Speed', value: '< 2.4s / binary' },
      { label: 'Architectures', value: 'x86, ARM, MIPS' },
      { label: 'Database Size', value: '25,000 CVEs' },
    ],
    githubUrl: 'https://github.com',
  },
  {
    id: 'multimodal-vision-recon',
    category: 'AI & Labs',
    title: 'OSINT Geospatial Reconnaissance',
    subtitle: 'Computer Vision & Multi-Source Intelligence Scanner',
    badge: 'OSINT / COMPUTER VISION',
    image:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=90',
    duration: '2 MOS',
    complexity: 'DATA RECON',
    stars: 590,
    views: 2400,
    likes: 490,
    description:
      'Multi-source open source intelligence (OSINT) reconnaissance pipeline. Ingests satellite imagery, social imagery, and telemetry to extract EXIF coordinates, detect infrastructure features using fine-tuned YOLOv8 models, and correlate flight ADS-B tracking data.',
    architectureNotes:
      'FastAPI async scrapers, YOLOv8 vision pipeline on ONNX, MapLibre GL vector tiles mapping target assets with timeline scrubbing.',
    architecture: {
      frontend: 'MapLibre GL 3D Map, Timeline Playback Controller',
      backend: 'Python, FastAPI, YOLOv8, GDAL / GeoPandas',
      security: 'OPSEC-Compliant Tor Proxy Rotation, Zero-Footprint Ingestion',
      dataPipeline: 'PostGIS Spatial DB, Redis Queue, S3 Imagery Cache',
      deployment: 'Docker, Linux Ubuntu Server',
    },
    techStack: ['YOLOv8', 'Python', 'PostGIS', 'MapLibre', 'GeoPandas', 'FastAPI'],
    metrics: [
      { label: 'Inference Time', value: '12ms / tile' },
      { label: 'Target Accuracy', value: '93.8% mAP50' },
      { label: 'Spatial Latency', value: 'Real-time Stream' },
      { label: 'Proxy Anonymity', value: '100% Tor Exit' },
    ],
    githubUrl: 'https://github.com',
  },
];

export const SKILLS_LIST: SkillItem[] = [
  /* Security */
  { name: 'Penetration Testing (eJPT)', level: 92, category: 'Security' },
  { name: 'Network Intrusion Detection (NIDS)', level: 94, category: 'Security' },
  { name: 'Reverse Engineering (Ghidra/x64dbg)', level: 86, category: 'Security' },
  { name: 'Offensive Pivoting (Chisel/BloodHound)', level: 90, category: 'Security' },
  { name: 'Linux Kernel & eBPF Security', level: 84, category: 'Security' },
  { name: 'Zero-Trust & mTLS Architecture', level: 88, category: 'Security' },

  /* Languages */
  { name: 'Python (FastAPI, Scapy, PyTorch)', level: 96, category: 'Languages' },
  { name: 'TypeScript / JavaScript', level: 94, category: 'Languages' },
  { name: 'Go (Golang Systems & gRPC)', level: 88, category: 'Languages' },
  { name: 'C / C++ (Low-level & Exploits)', level: 82, category: 'Languages' },
  { name: 'Bash / Zsh Shell Scripting', level: 95, category: 'Languages' },
  { name: 'SQL & Query Optimization', level: 90, category: 'Languages' },

  /* Systems & Cloud */
  { name: 'Linux Administration (Arch, Debian, RHEL)', level: 95, category: 'Systems & Cloud' },
  { name: 'Docker & Container Hardening', level: 92, category: 'Systems & Cloud' },
  { name: 'Kubernetes & Service Mesh', level: 85, category: 'Systems & Cloud' },
  { name: 'AWS & Cloud Security Architecture', level: 87, category: 'Systems & Cloud' },
  { name: 'Kafka & Distributed Event Streaming', level: 84, category: 'Systems & Cloud' },
  { name: 'Redis & Distributed Caching', level: 91, category: 'Systems & Cloud' },

  /* Web & Frameworks */
  { name: 'React Native & React Native Web', level: 94, category: 'Web & Frameworks' },
  { name: 'Next.js 14 / React 18', level: 92, category: 'Web & Frameworks' },
  { name: 'Vite & Modern Frontend Tooling', level: 95, category: 'Web & Frameworks' },
  { name: 'Tailwind CSS & Mobile UI Systems', level: 96, category: 'Web & Frameworks' },
  { name: 'REST & gRPC API Design', level: 93, category: 'Web & Frameworks' },
  { name: 'WebAssembly (WASM)', level: 80, category: 'Web & Frameworks' },
];
