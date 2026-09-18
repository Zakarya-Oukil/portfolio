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

const DESTINATIONS = [
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

const FILTERS = ["Security & CTF", "Full Stack", "Systems & OS", "Cloud & AI"];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function Glyph({
  children,
  size = 18,
  color = "#111827",
  weight = "600",
  style,
}: {
  children?: any;
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
          onPress={() => onOpen(item)}
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
                saved
                  ? `Remove ${item.title} from saved`
                  : `Save ${item.title}`
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
}) {
  const { width, height } = useWindowDimensions();

  const horizontalPadding = clamp(width * 0.055, 18, 26);
  const spacing = clamp(width * 0.045, 14, 20);
  const cardWidth = clamp(width * 0.72, 250, 338);
  const cardHeight = clamp(height - 245, 390, 530);
  const sideInset = Math.max((width - cardWidth) / 2, horizontalPadding);

  const homeBottomPadding =
    Platform.OS === "ios"
      ? 10
      : Platform.OS === "android"
        ? 18
        : 8;

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const currentScrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const didDragRef = useRef(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const filteredDestinations = useMemo(
    () => DESTINATIONS.filter((item) => item.country === activeFilter),
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

    const shouldStartDragging = (_, gestureState) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);

      return horizontalDistance > 5 && horizontalDistance > verticalDistance;
    };

    const finishDragging = (_, gestureState) => {
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
        didDragRef.current = false;
      },

      onPanResponderMove: (_, gestureState) => {
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

  const changeFilter = (filter) => {
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

  const openDestination = (item) => {
    if (didDragRef.current) {
      return;
    }

    onOpen(item);
  };

  return (
    <SafeAreaView style={styles.homeSafeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5FAFD"
        translucent={false}
      />

      <View
        style={[
          styles.homeContainer,
          {
            paddingTop: clamp(height * 0.018, 8, 18),
            paddingBottom: homeBottomPadding,
          },
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
            <Text style={styles.homeEyebrow}>Developer Portfolio</Text>
            <Text style={styles.homeTitle}>Zakarya</Text>
          </View>

          <SoftIconButton
            onPress={toggleMenu}
            accessibilityLabel="Open navigation menu"
            style={styles.gridButton}
          >
            <View style={styles.gridIcon}>
              {[0, 1, 2, 3].map((dot) => (
                <View key={dot} style={styles.gridIconDot} />
              ))}
            </View>
          </SoftIconButton>
        </View>

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
          <Pressable
            onPress={toggleMenu}
            style={({ pressed }) => [
              styles.quickMenuItem,
              pressed && styles.quickMenuItemPressed,
            ]}
          >
            <Glyph size={16}>⌕</Glyph>
            <Text style={styles.quickMenuText}>Explore places</Text>
          </Pressable>

          <Pressable
            onPress={toggleMenu}
            style={({ pressed }) => [
              styles.quickMenuItem,
              pressed && styles.quickMenuItemPressed,
            ]}
          >
            <Glyph size={15}>♡</Glyph>
            <Text style={styles.quickMenuText}>Saved tours</Text>
          </Pressable>
        </Animated.View>

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

        <View style={styles.carouselArea}>
          <Animated.FlatList
            ref={listRef}
            {...desktopDragHandlers}
            horizontal
            data={filteredDestinations}
            keyExtractor={(item) => item.id}
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
                listener: (event) => {
                  currentScrollOffset.current =
                    event.nativeEvent.contentOffset.x;
                },
              }
            )}
            onMomentumScrollEnd={(event) => {
              currentScrollOffset.current =
                event.nativeEvent.contentOffset.x;
            }}
            renderItem={({ item, index }) => (
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
              />
            )}
          />
        </View>

        <View
          style={[
            styles.bottomNavigation,
            {
              marginHorizontal: horizontalPadding,
            },
          ]}
        >
          <Pressable style={styles.navItem}>
            <Text style={styles.navLabelActive}>Projects</Text>
            <View style={styles.navActiveDot} />
          </Pressable>

          <Pressable style={styles.navItem}>
            <Glyph color="#A8B0BA" size={22}>
              ◎
            </Glyph>
          </Pressable>

          <Pressable style={styles.navItem}>
            <Glyph color="#A8B0BA" size={21}>
              ▢
            </Glyph>
          </Pressable>

          <Pressable style={styles.navItem}>
            <Glyph color="#A8B0BA" size={23}>
              ♙
            </Glyph>
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
}) {
  const { width, height } = useWindowDimensions();

  const openingProgress = useRef(new Animated.Value(0)).current;
  const contentProgress = useRef(new Animated.Value(0)).current;
  const bookingProgress = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const switchProgress = useRef(new Animated.Value(1)).current;
  const switchingRef = useRef(false);
  const detailScrollRef = useRef(null);
  const relatedScrollRef = useRef(null);
  const relatedScrollOffsetRef = useRef(0);
  const relatedDragStartOffsetRef = useRef(0);
  const relatedDidDragRef = useRef(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);
  const [outgoingDestination, setOutgoingDestination] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(destination.id);

  const heroHeight = clamp(height * 0.67, 490, 670);
  const relatedCardWidth = clamp(width * 0.3, 112, 142);
  const relatedCardHeight = clamp(heroHeight * 0.19, 116, 146);
  const relatedCardSpacing = 12;
  const relatedLeftPadding = 22;
  const relatedRightPadding = 34;

  const androidStatusBarInset =
    Platform.OS === "android"
      ? (StatusBar.currentHeight || 24) + 8
      : 0;

  const bottomSafePadding =
    Platform.OS === "ios"
      ? 44
      : Platform.OS === "android"
        ? 38
        : 24;

  const bookingBottomPadding =
    Platform.OS === "ios"
      ? 44
      : Platform.OS === "android"
        ? 38
        : 26;

  const relatedDestinations = useMemo(
    () =>
      DESTINATIONS.filter(
        (item) => item.country === destination.country
      ),
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

    const shouldStartDragging = (_, gestureState) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);

      return horizontalDistance > 5 && horizontalDistance > verticalDistance;
    };

    const finishDragging = (_, gestureState) => {
      const projectedOffset = clamp(
        relatedDragStartOffsetRef.current -
          gestureState.dx -
          gestureState.vx * 120,
        0,
        relatedMaxScrollOffset
      );

      const snappedOffset = clamp(
        Math.round(projectedOffset / relatedSnapInterval) *
          relatedSnapInterval,
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
        relatedDragStartOffsetRef.current =
          relatedScrollOffsetRef.current;
        relatedDidDragRef.current = false;
      },

      onPanResponderMove: (_, gestureState) => {
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

  const switchDestination = (nextDestination) => {
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

  const estimatedTotal = quantity * 1240;

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
                  onPress={() => {}}
                  accessibilityLabel="More options"
                  style={styles.glassButton}
                >
                  <Glyph
                    color="#FFFFFF"
                    size={22}
                    weight="500"
                    style={{ marginTop: -7 }}
                  >
                    ⋮
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
                    ♡
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
                <Text style={styles.relatedHeading}>Explore this country</Text>

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
                  A premium route through {destination.location}
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
                    saved
                      ? "Remove tour from favourites"
                      : "Save tour"
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
                    {saved ? "♥" : "➤"}
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
                <Text style={styles.statisticText}>24</Text>
              </View>

              <View style={styles.statistic}>
                <Glyph size={18} color="#EF4770">
                  ♥
                </Glyph>
                <Text style={styles.statisticText}>65</Text>
              </View>

              <View style={styles.statistic}>
                <Glyph size={18}>☆</Glyph>
                <Text style={styles.statisticText}>17</Text>
              </View>

              <View style={styles.statistic}>
                <Glyph size={17}>◴</Glyph>
                <Text style={styles.statisticText}>80</Text>
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
                accessibilityLabel="View more participants"
                style={({ pressed }) => [
                  styles.morePeopleButton,
                  {
                    opacity: pressed ? 0.65 : 1,
                  },
                ]}
              >
                <Glyph size={21} color="#728096">
                  …
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
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeValue}>Your hotel</Text>
              </View>

              <View style={styles.routeDivider} />

              <View style={styles.routeColumn}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeValue}>{destination.location}</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Commence the tour"
              onPress={openBooking}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  opacity: pressed ? 0.82 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <Text style={styles.primaryButtonText}>Inspect GitHub & Demo</Text>
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
            accessibilityLabel="Close booking panel"
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
                    <Text style={styles.bookingEyebrow}>SOURCE CODE & ARCHITECTURE</Text>
                    <Text style={styles.bookingTitle}>Technical Overview</Text>
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
                  Reserve a place for the {destination.title} experience.
                  Adjust the number of travellers before continuing.
                </Text>

                <View style={styles.bookingOptionCard}>
                  <View>
                    <Text style={styles.bookingOptionLabel}>Architecture Spec</Text>
                    <Text style={styles.bookingOptionValue}>
                      {quantity} {quantity === 1 ? "person" : "people"}
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

                    <Text style={styles.quantityText}>{quantity}</Text>

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
                    <Text style={styles.bookingTotalLabel}>
                      Estimated total
                    </Text>
                    <Text style={styles.bookingTotalNote}>
                      Taxes and flights not included
                    </Text>
                  </View>

                  <Text style={styles.bookingTotalValue}>
                    ${estimatedTotal.toLocaleString()}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Confirm booking"
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
                    Continue Reservation
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

                <Text style={styles.confirmationTitle}>Repository Access Granted</Text>

                <Text style={styles.confirmationText}>
                  The {destination.title} tour has been prepared for {quantity}{" "}
                  {quantity === 1 ? "traveller" : "travellers"}.
                </Text>

                <Pressable
                  onPress={closeBooking}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      width: "100%",
                      marginTop: 24,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Done</Text>
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
/*                                    APP                                     */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [activeFilter, setActiveFilter] = useState("Security & CTF");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [savedIds, setSavedIds] = useState(["sec-ml-ids"]);

  const toggleSaved = (destinationId) => {
    setSavedIds((current) => {
      if (current.includes(destinationId)) {
        return current.filter((id) => id !== destinationId);
      }

      return [...current, destinationId];
    });
  };

  if (selectedDestination) {
    return (
      <View style={styles.app}>
        <DetailScreen
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onSelectDestination={setSelectedDestination}
          savedIds={savedIds}
          onToggleSave={toggleSaved}
        />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <HomeScreen
        onOpen={setSelectedDestination}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        savedIds={savedIds}
        onToggleSave={toggleSaved}
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
  },

  homeSafeArea: {
    flex: 1,
    backgroundColor: "#F5FAFD",
  },

  homeContainer: {
    flex: 1,
    backgroundColor: "#F5FAFD",
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
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 1,
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
    width: 176,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 8,
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

  quickMenuItem: {
    minHeight: 44,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },

  quickMenuItemPressed: {
    backgroundColor: "#F0F5F8",
  },

  quickMenuText: {
    marginLeft: 10,
    color: "#303844",
    fontSize: 13,
    fontWeight: "600",
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
    fontSize: 29,
    lineHeight: 34,
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
    fontSize: 16,
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
    fontSize: 22,
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
});