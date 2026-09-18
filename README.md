# ⚡ Interactive Multi-OS Virtual Device Portfolio

An interactive Portfolio Operating System built with React Native for Web and Vite. Showcasing cybersecurity and full-stack systems engineering projects with native-feeling mobile and desktop device environments.

---

## 🌟 Key Features

- **Dynamic Multi-OS Emulation & Chrome:**
  - **iOS Mode:** iPhone viewport with Dynamic Island and native-feel home indicator bar.
  - **Android Mode:** Material You aesthetics with camera punch-hole and 3-button system navigation bar.
  - **Desktop Web Mode:** macOS-style traffic light window controls (red/yellow/green) and top ribbon bar.
  - **Automatic Client Detection:** Detects screen and user agent on boot to default into the most appropriate OS mode.
  - **OS Switcher:** Accessible via top quick menu or the dedicated Settings modal.

- **Fluid Gestures & Physics:**
  - Desktop cursor dragging with `PanResponder` and velocity snapping.
  - 140ms gesture isolation click-lock preventing ghost navigation on web click/release.
  - Exact card interpolations: `scale` [0.88, 1, 0.88], `translateY` [18, 0, 18], `opacity` [0.72, 1, 0.72], `shadowOpacity` [0.08, 0.25, 0.08].

- **Zero-Flash Overwrite Crossfade Detail View:**
  - Seamless project switching with outgoing image scale up to 1.035 and synchronized dark veil fade.
  - Rising text animations (28px -> 0px) and fixed-order "More in this domain" row with active white border transitions.

- **System Architecture & Demo Blueprint:**
  - Interactive sheet providing full technical blueprints, benchmark breakdowns (`99.4% ACC`, `8.4M IOPS`, etc.), and direct source / live demo launch buttons.

- **Native Tool Suite:**
  - **Interactive Terminal:** CLI prompt (`whoami`, `neofetch`, `skills`, `tools`, `projects`, `clear`, etc.).
  - **Contact Modal:** Direct message dispatch and social links.
  - **Settings Modal:** OS switcher and theme options.

---

## 🛠️ Tech Stack

- **Framework:** React 18, React Native for Web (`react-native-web`)
- **Bundler & Build Tool:** Vite 5
- **Language:** TypeScript
- **Animations:** Animated API with native driver acceleration and PanResponder gesture physics

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Zakarya-Oukil/portfolio.git

# Navigate into project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
```

---

## 👤 Author

**Zakarya Oukil**
- GitHub: [@oukil078-oss](https://github.com/oukil078-oss) / [@Zakarya-Oukil](https://github.com/Zakarya-Oukil)
