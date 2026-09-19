# MASTER SYSTEM PROMPT FOR GPT-6 ASTRA: INTERACTIVE MULTI-OS VIRTUAL PORTFOLIO (macOS 27, iPhone 16 Pro Max, Android Material You)

> **Role & Profile:** You are an Elite Autonomous Frontend Architect, Systems Interaction Designer, and Graphics Engineer specializing in high-performance Web Virtual Operating Systems, React Native Web, and modern Canvas/CSS Physics.
> 
> **Objective:** Build a complete, production-ready, interactive Multi-OS Virtual Device Portfolio web application from scratch. The system allows visitors to experience the developer's portfolio across three distinct, fully functioning operating systems:
> 1. **macOS 27 (MacBook Pro)** — 1:1 Apple desktop environment with Liquid Glass aesthetics, draggable widgets, floating magnetic Dock, Menu Bar, and window management.
> 2. **iOS 18+ (iPhone 16 Pro Max)** — Dynamic Island, swipeable Control Center, Squircle App Grid, Dock, and Home Indicator swipe physics.
> 3. **Android 15 (Material You)** — Material You dynamic theming, Quick Settings notification shade, 3-button navigation bar, and the high-fidelity gesture carousel from the reference code.

---

## 1. ARCHITECTURAL REQUIREMENTS & OS SPECIFICATIONS

### A. Automatic Device Detection & Runtime OS Switcher
1. **Initial Detection:**
   - Detect user agent and screen dimensions on initial load.
   - Touch mobile with iOS UA $\rightarrow$ Default to **iOS Mode**.
   - Touch mobile with Android UA $\rightarrow$ Default to **Android Mode**.
   - Desktop / Laptop screen $\rightarrow$ Default to **macOS 27 Desktop Mode**.
2. **Persistent Settings App:**
   - Present on all 3 home screens.
   - Allows instant switching between `macOS (Desktop)`, `iOS (iPhone 16 Pro Max)`, and `Android (Material You)`.
   - Toggle Dark Mode / Light Mode / OLED Pitch Black.
   - Wallpaper picker (Dynamic Apple Sonoma/Sequoia landscapes, Cyberpunk Neon, Minimalist OLED).

---

### B. OS 1: macOS 27 (Apple MacBook Pro / Liquid Glass)
1. **Visual Language:**
   - **Liquid Glass Frosted UI:** Ultra-modern glassmorphism with `backdrop-filter: blur(25px)`, subtle `1px solid rgba(255,255,255,0.18)` borders, soft inner specular highlights, and deep layered drop shadows.
2. **Top macOS Menu Bar:**
   - Apple icon menu (About This Mac, System Settings, Force Quit, Sleep, Restart).
   - Dynamic Active App Name (e.g., "Portfolio", "Terminal", "Settings").
   - Menus: `File`, `Edit`, `View`, `Window`, `Help`.
   - Right status bar items: Battery percentage with live charging glyph, Wi-Fi signal icon, Control Center toggle, Spotlight search icon, and live digital clock (`HH:mm:ss`).
3. **Interactive Desktop Widgets:**
   - **Clock & Date Widget:** Analog/digital hybrid clock with smooth ticking second hand.
   - **System Telemetry Widget:** Live animated CPU load, RAM usage, and Network I/O gauges.
   - **GitHub Activity Heatmap:** Real-time visual commit matrix graph showing developer consistency.
   - **Quick Notes / Terminal Teaser:** Interactive sticky note with developer bio and contact shortcuts.
4. **macOS Window Manager:**
   - Draggable windows with smooth mouse pointer coordinate tracking.
   - Native macOS traffic light controls on window headers:
     - 🔴 **Red:** Close window.
     - 🟡 **Yellow:** Minimize to dock.
     - 🟢 **Green:** Fullscreen / Maximize toggle.
5. **Floating Magnetic macOS Dock:**
   - Centered at the bottom with frosted liquid glass pill styling.
   - Hover magnification wave effect (icons dynamically scale up smoothly when cursor approaches).
   - Glowing dot indicator beneath open/active applications.
   - Click-to-launch with iconic macOS vertical bounce animation.

---

### C. OS 2: iOS 18+ (iPhone 16 Pro Max)
1. **Bezel & Dynamic Island:**
   - Realistic iPhone 16 Pro Max titanium frame mockup with ultra-slim bezels and rounded corners.
   - **Interactive Dynamic Island:** Pill-shaped cutout at the top that reacts to system events:
     - Normal idle pill.
     - Expands on tap into an expanded pill showing battery charging, now-playing music teaser, or system alerts.
2. **iOS Control Center:**
   - **Gesture:** Swipe down from the top-right corner of the phone bezel (works via mouse drag on desktop AND native touch drag on mobile).
   - **Toggles:** Frosted quad-tiles for Cellular, Wi-Fi, Bluetooth, AirDrop; interactive vertical brightness slider, interactive vertical volume slider; Dark Mode toggle, Low Power Mode, Flashlight.
3. **App Grid & Home Screen:**
   - Classic iOS 4-column layout with authentic continuous squircles (`border-radius: 22%`).
   - App labels underneath icons with subtle text dropshadow.
   - Bottom floating iOS Dock (up to 4 fixed priority apps: Projects, Terminal, Settings, Mail).
4. **Home Indicator & Navigation Gestures:**
   - Pill-shaped bottom bar (`homeIndicator`).
   - **Single Click / Tap:** Returns to the App Grid immediately or closes any open detail sheet.
   - **Drag Up (`dy < -40`):** Card/sheet smoothly scales down and glides upward back into the home screen grid.

---

### D. OS 3: Android 15 (Material You)
1. **Material You Aesthetic:**
   - Dynamic tonal palettes extracted from active wallpaper.
   - Pill-shaped buttons, high-contrast Material 3 chips, and expressive elevation shadows.
2. **Quick Settings & Notification Shade:**
   - Swipe down from the top bezel to reveal the expanded Material You Quick Settings panel (Big pill toggles for Internet, Bluetooth, Do Not Disturb, Flashlight, Auto-Rotate, Brightness bar).
3. **3-Button & Gesture Navigation:**
   - Classic Android navigation bar at bottom:
     - ◀ **Back:** Steps back through navigation history or closes open sheet.
     - ● **Home:** Immediately resets viewport to the main carousel/home screen.
     - ■ **Recents:** Opens multitasking app switcher carousel.
4. **Core Mobile Experience:**
   - Seamlessly uses the exact mobile discovery carousel and physics from the reference code!

---

## 2. STRICT INTERACTION PHYSICS & NO-GHOST-CLICK SPECIFICATION

1. **The Double-Lock PanResponder:**
   - When running on Web (`Platform.OS === 'web'`), desktop mouse dragging MUST NOT trigger accidental clicks upon release.
   - Store `dragStartTimestamp` and `dragDistance` in refs inside the `PanResponder`.
   - If horizontal displacement exceeds 6px or gesture duration indicates a flick/drag, enforce an active 150ms lock before resetting `didDragRef.current`.
   - Every card press handler MUST evaluate `if (didDragRef.current) return;` before opening details.
2. **Exact Mathematical Interpolation Formulas (DO NOT MODIFY):**
   - `scale`: `[0.88, 1, 0.88]`
   - `translateY`: `[18, 0, 18]`
   - `opacity`: `[0.72, 1, 0.72]`
   - `shadowOpacity`: `[0.08, 0.25, 0.08]`
3. **Zero-Flash Detail Overwrite Crossfade:**
   - Outgoing hero image scales up to 1.035 while opacity smoothly reduces.
   - Rising text transition: 28px $\rightarrow$ 0px vertical translate.
   - Incoming image fades in without any white blink or layout jump.

---

## 3. CORE APPS TO IMPLEMENT

### 1. Projects App (Developer Portfolio)
Uses the reference carousel with 16 technical projects categorized into 4 domains:
- **Security & CTF:**
  1. *ML Intrusion Detection* (Python / Scikit-Learn • 99.4% ACC • 0.4ms LAT)
  2. *Stuxnet SCADA Analysis* (Assembly / Siemens PLC • 4 ZERO-DAYS • PLC MESH)
  3. *eJPT / HTB DMZ Suite* (Kali / Chisel / Kerberos • 18 TARGETS • 3 SUBNETS)
  4. *eBPF Kernel Sandbox* (C / Linux Kernel / Go • 0% RUNTIME DROP • RING-0)
- **Full Stack:**
  1. *ZakOS Agentic OS* (React / TypeScript / Tailwind • SUB-10MS • 6 AGENTS)
  2. *Distributed Travel Platform* (React Native / Node.js • 100K QPS • GLOBAL EDGE)
  3. *Real-Time Telemetry Canvas* (Next.js / WebSockets / Rust • 60 FPS • LIVE BUS)
  4. *Decentralized KV Store* (Go / gRPC / Protobuf • 3-NODE MESH • P99 2MS)
- **Systems & OS:**
  1. *Linux Memory Allocator* (C / POSIX / mmap • O(1) BUCKET • ZERO LEAK)
  2. *Hardware Vault* (C++ / ARM Cortex-M • AES-256-GCM • HARDWARE RNG)
  3. *BLE Tactical Radio* (Embedded C / Nordic nRF52 • 2.4 GHz MESH • 1.2 KM RANGE)
  4. *WASM Edge Runtime* (Rust / WebAssembly • 1.2MS COLD • ISOLATED MEM)
- **Cloud & AI:**
  1. *LLM Red-Teaming Engine* (Python / PyTorch / Transformers • 98% BYPASS • MULTI-MODEL)
  2. *Autonomous SOC Alert Triager* (LangChain / FastAPI / Qdrant • 85% AUTO-CLOSE • 2.1S EVAL)
  3. *Neural Binary Differ* (PyTorch / Ghidra / Python • GNN EMBED • CROSS-ARCH)
  4. *Container Sandbox* (Go / Linux Namespaces / cgroups v2 • OCI COMPLIANT • GVISOR LEVEL)

### 2. Terminal App (Cybersecurity CLI)
- Functional command line interface: prompt `visitor@zak-portfolio:~$ `.
- History buffer, scroll-lock, and command auto-scroll.
- Commands:
  - `help`: Lists commands.
  - `whoami`: Displays visitor context and developer profile.
  - `neofetch`: ASCII artwork of OS badge with system telemetry specs.
  - `skills`: Offensive security, defensive infrastructure, full-stack, systems engineering.
  - `tools`: Nmap, Wireshark, Burp Suite, Metasploit, Docker, Linux, Ghidra, IDA.
  - `projects`: Interactive shortcut list of all 16 portfolio projects.
  - `os [macos|ios|android]`: Switches the virtual OS from the command line!
  - `theme [dark|light|oled]`: Live theme switching.
  - `clear`: Wipes terminal screen.

### 3. Settings App
- OS mode switcher (macOS 27, iPhone 16 Pro Max, Android 15).
- Display preferences (Dark Mode, Light Mode, OLED pitch black).
- Wallpaper chooser with live background updates.
- About Zakarya profile card & system memory telemetry.

### 4. Contact / Mail App
- Clean mail composer interface with fields: Name, Email, Subject, Message.
- Real-time client-side validation with success feedback.

---

## 4. THE REFERENCE CODEBASE (FOUNDATIONAL ASSET)

Incorporate the exact mechanics, gestures, pan handlers, components, and styling tokens from the reference code below into this multi-OS portfolio:

```tsx
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
  dubaiDowntown:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90",
  dubaiPalm:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=90",
  dubaiDesert:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=90",
  dubaiMarina:
    "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&q=90",

  chinaWall:
    "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1400&q=90",
  chinaMountains:
    "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1400&q=90",
  chinaShanghai:
    "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1400&q=90",
  chinaGuilin:
    "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1400&q=90",

  koreaSeoul:
    "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1400&q=90",
  koreaJeju:
    "https://images.unsplash.com/photo-1538485399081-7c897a378c3f?auto=format&fit=crop&w=1400&q=90",
  koreaPalace:
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1400&q=90",
  koreaBusan:
    "https://images.unsplash.com/photo-1538669715315-155098f0fb1d?auto=format&fit=crop&w=1400&q=90",

  japanKyoto:
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=90",
  japanTemple:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=90",
  japanFuji:
    "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1400&q=90",
  japanTokyo:
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1400&q=90",

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
  {
    id: "dubai-downtown",
    country: "Dubai",
    title: "Downtown Dubai",
    subtitle: "Downtown escape",
    location: "Downtown Dubai",
    image: PHOTO.dubaiDowntown,
    duration: "6 DAYS",
    distance: "24 KM",
    likes: 412,
    saves: 84,
    views: 690,
    description:
      "Discover a polished city escape filled with iconic architecture, rooftop views, elegant dining and bright evening streets.",
  },
  {
    id: "dubai-palm",
    country: "Dubai",
    title: "Palm Jumeirah",
    subtitle: "Palm island tour",
    location: "Palm Jumeirah",
    image: PHOTO.dubaiPalm,
    duration: "5 DAYS",
    distance: "31 KM",
    likes: 376,
    saves: 72,
    views: 584,
    description:
      "Enjoy calm beaches, waterfront resorts and sweeping skyline views across one of Dubai's most recognisable coastal districts.",
  },
  {
    id: "dubai-marina",
    country: "Dubai",
    title: "Dubai Marina",
    subtitle: "Marina night tour",
    location: "Dubai Marina",
    image: PHOTO.dubaiMarina,
    duration: "4 DAYS",
    distance: "18 KM",
    likes: 298,
    saves: 61,
    views: 492,
    description:
      "Walk beside the marina, explore modern waterfront spaces and watch the city lights reflect across the water after sunset.",
  },
  {
    id: "dubai-desert",
    country: "Dubai",
    title: "Desert Safari",
    subtitle: "Golden desert tour",
    location: "Dubai Desert",
    image: PHOTO.dubaiDesert,
    duration: "3 DAYS",
    distance: "67 KM",
    likes: 455,
    saves: 96,
    views: 728,
    description:
      "Travel through warm golden dunes, pause for a quiet sunset and experience a slower side of Dubai beyond the skyline.",
  },

  {
    id: "china-wall",
    country: "China",
    title: "Great Wall",
    subtitle: "Great Wall journey",
    location: "Beijing",
    image: PHOTO.chinaWall,
    duration: "8 DAYS",
    distance: "94 KM",
    likes: 541,
    saves: 121,
    views: 860,
    description:
      "Follow the ancient wall across dramatic ridges and enjoy wide mountain views shaped by centuries of history.",
  },
  {
    id: "china-mountains",
    country: "China",
    title: "Zhangjiajie",
    subtitle: "Mountain cloud tour",
    location: "Hunan",
    image: PHOTO.chinaMountains,
    duration: "7 DAYS",
    distance: "143 KM",
    likes: 487,
    saves: 109,
    views: 744,
    description:
      "Explore tall stone pillars, forest paths and soft layers of cloud in one of China's most cinematic mountain landscapes.",
  },
  {
    id: "china-shanghai",
    country: "China",
    title: "Shanghai",
    subtitle: "Shanghai city tour",
    location: "Shanghai",
    image: PHOTO.chinaShanghai,
    duration: "5 DAYS",
    distance: "38 KM",
    likes: 334,
    saves: 74,
    views: 519,
    description:
      "Experience a fast-moving city of glowing towers, elegant riverside walks and a striking mix of old and new architecture.",
  },
  {
    id: "china-guilin",
    country: "China",
    title: "Guilin River",
    subtitle: "Guilin river escape",
    location: "Guangxi",
    image: PHOTO.chinaGuilin,
    duration: "6 DAYS",
    distance: "116 KM",
    likes: 426,
    saves: 88,
    views: 638,
    description:
      "Cruise between green limestone peaks, quiet villages and reflective river scenery in the peaceful Guilin countryside.",
  },

  {
    id: "korea-seoul",
    country: "Korea",
    title: "Seoul Nights",
    subtitle: "Seoul city escape",
    location: "Seoul",
    image: PHOTO.koreaSeoul,
    duration: "6 DAYS",
    distance: "42 KM",
    likes: 462,
    saves: 93,
    views: 701,
    description:
      "Move between vibrant neighbourhoods, glowing city streets, modern cafés and traditional corners across energetic Seoul.",
  },
  {
    id: "korea-jeju",
    country: "Korea",
    title: "Jeju Island",
    subtitle: "Jeju island tour",
    location: "Jeju",
    image: PHOTO.koreaJeju,
    duration: "7 DAYS",
    distance: "87 KM",
    likes: 518,
    saves: 118,
    views: 812,
    description:
      "Find coastal roads, volcanic landscapes and quiet natural viewpoints across Korea's relaxed island destination.",
  },
  {
    id: "korea-palace",
    country: "Korea",
    title: "Royal Seoul",
    subtitle: "Royal palace walk",
    location: "Gyeongbokgung",
    image: PHOTO.koreaPalace,
    duration: "4 DAYS",
    distance: "21 KM",
    likes: 305,
    saves: 69,
    views: 487,
    description:
      "Walk through graceful palace courtyards, historic gates and calm gardens surrounded by the modern city.",
  },
  {
    id: "korea-busan",
    country: "Korea",
    title: "Busan Coast",
    subtitle: "Busan coastal tour",
    location: "Busan",
    image: PHOTO.koreaBusan,
    duration: "5 DAYS",
    distance: "63 KM",
    likes: 389,
    saves: 81,
    views: 604,
    description:
      "Follow Busan's coastline through colourful districts, sea views, relaxed beaches and lively waterfront markets.",
  },

  {
    id: "japan-kyoto",
    country: "Japan",
    title: "Kyoto",
    subtitle: "Kyoto temple tour",
    location: "Kyoto",
    image: PHOTO.japanKyoto,
    duration: "7 DAYS",
    distance: "58 KM",
    likes: 574,
    saves: 132,
    views: 914,
    description:
      "Discover quiet lanes, traditional wooden buildings, temple gardens and warm evening light across timeless Kyoto.",
  },
  {
    id: "japan-temple",
    country: "Japan",
    title: "Old Japan",
    subtitle: "Historic Japan tour",
    location: "Nara",
    image: PHOTO.japanTemple,
    duration: "5 DAYS",
    distance: "44 KM",
    likes: 441,
    saves: 98,
    views: 676,
    description:
      "Slow down among historic streets, peaceful temple grounds and carefully preserved architecture from another era.",
  },
  {
    id: "japan-fuji",
    country: "Japan",
    title: "Mount Fuji",
    subtitle: "Fuji landscape tour",
    location: "Yamanashi",
    image: PHOTO.japanFuji,
    duration: "6 DAYS",
    distance: "129 KM",
    likes: 642,
    saves: 149,
    views: 1024,
    description:
      "Enjoy crisp lake views, open countryside and unforgettable perspectives of Japan's most famous mountain.",
  },
  {
    id: "japan-tokyo",
    country: "Japan",
    title: "Tokyo Nights",
    subtitle: "Tokyo night escape",
    location: "Tokyo",
    image: PHOTO.japanTokyo,
    duration: "6 DAYS",
    distance: "36 KM",
    likes: 533,
    saves: 115,
    views: 846,
    description:
      "Explore neon streets, refined restaurants, compact neighbourhoods and the fast rhythm of Tokyo after dark.",
  },
];

const FILTERS = ["Dubai", "China", "Korea", "Japan"];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function Glyph({
  children,
  size = 18,
  color = "#111827",
  weight = "600",
  style,
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
            <Text style={styles.homeEyebrow}>Discover</Text>
            <Text style={styles.homeTitle}>Asia</Text>
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
            <Text style={styles.navLabelActive}>World</Text>
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
              <Text style={styles.primaryButtonText}>Commence The Tour</Text>
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
                    <Text style={styles.bookingEyebrow}>PRIVATE TOUR</Text>
                    <Text style={styles.bookingTitle}>Plan your escape</Text>
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
                    <Text style={styles.bookingOptionLabel}>Travellers</Text>
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

                <Text style={styles.confirmationTitle}>Your tour is ready</Text>

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
  const [activeFilter, setActiveFilter] = useState("Dubai");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [savedIds, setSavedIds] = useState(["dubai-downtown"]);

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
```

---

## 5. FINAL DELIVERABLE & QUALITY VERIFICATION
1. Complete, self-contained single or modular TypeScript codebase.
2. Zero build or lint errors with standard React / React Native Web bundlers.
3. Every button, gesture, slider, drag interaction, and window controller must be clickable and functional.
4. Smooth 60 FPS transitions without visual glitching, layout shifting, or white blinks.
