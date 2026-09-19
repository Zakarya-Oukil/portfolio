# Zakarya — Portfolio OS

An interactive portfolio with a macOS-inspired desktop, an iPhone experience, and an Android Material You experience. Built with React 18, TypeScript, Vite, and React Native Web's Animated / PanResponder APIs.

## Run

Use Node.js 20+ and npm.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

The development server runs on port 3000. The production build is written to `dist/`; deploy this directory to a static host. No credentials or backend are required for the core experience.

## Experiences

- **Desktop:** Multiple draggable windows with independent close, minimize, restore, maximize, and focus behavior. A magnetic dock, desktop shortcuts, menu commands, Spotlight search, live clock, and draggable widgets.
- **iPhone:** Titanium-style frame on a desktop viewport, full-screen layout on narrow screens, expandable Dynamic Island with an optional ambient tone, a four-column app grid, and a fixed dock. Swipe down from the top right for Control Center; tap or drag the home indicator upward to return home.
- **Android:** Wallpaper-coordinated Material You colors, round icons, a swipe-down Quick Settings panel, Back/Home/Recents navigation, and a recent-apps carousel.
- **Projects:** All 16 supplied projects in four domains. Desktop search, collections and saved projects; a mobile discovery carousel; related projects and technical summaries.
- **Terminal:** `help`, `whoami`, `neofetch`, `skills`, `tools`, `projects`, `os [macos|ios|android]`, `theme [dark|light|oled]`, and `clear`. Arrow-key history, Tab completion, and Ctrl+L clearing. Output follows new commands but respects scrolling through older output.
- **Settings:** Instant OS switching, light/dark/OLED appearance, four wallpapers, a configurable GitHub username, and browser memory information.
- **Mail:** Live validation, persistent local drafts, and downloadable `.eml` drafts. Messages are never claimed to have been sent.

OS, appearance, wallpaper, brightness, volume, saved projects, notes, and drafts persist locally. Explicit preferences override automatic device detection. Browser storage failures fall back to in-memory operation.

## Reference behavior

The supplied `GPT6_ASTRA_PORTFOLIO_OS_PROMPT.md` remains unchanged. Its project data and carousel mechanics are incorporated in `src/os/projects-data.ts` and `src/os/Projects.tsx`.

The mobile carousel preserves the exact interpolation ranges:

| Property | Range |
| --- | --- |
| Scale | `[0.88, 1, 0.88]` |
| Vertical translation | `[18, 0, 18]` |
| Opacity | `[0.72, 1, 0.72]` |
| Shadow opacity | `[0.08, 0.25, 0.08]` |

PanResponder tracks displacement and velocity; capture-phase pointer tracking also guards card presses. The drag lock survives release for 150ms. Related cards use the same release lock. Detail transitions preload the incoming image, preserve an outgoing image layer with scale `1.035`, and raise incoming text from 28px without changing the hero's layout.

## Honest integration boundaries

- This is a **web simulation**, not an actual Apple or Android operating system. Control Center toggles do not change physical Wi-Fi, Bluetooth, flashlight, or device power settings. Brightness affects the portfolio; volume affects its optional ambient tone.
- CPU and network graphs are clearly labeled demonstrations. Browser JavaScript heap memory and battery values are used only where their APIs are available.
- Enter a public GitHub username in Settings to fetch the latest 100 public events from GitHub's REST API. The heatmap refreshes every five minutes. It represents recent public events, **not complete yearly contributions or private commits**. Without a username, the heatmap is labeled demo data. API failures are displayed honestly.
- Project statistics come from the supplied portfolio reference and are labeled as project-reported. No repository links, independent benchmarks, or developer contact address have been invented.
- The Mail app stores and validates drafts locally. An email delivery service and a verified recipient address are needed for actual sending.
- The landscape wallpapers are original local SVG illustrations; they are not official Apple assets. Project photography uses the supplied Unsplash URLs, with local gradient fallbacks. Fonts also have system fallbacks.

## Code map

The active application starts at `src/App.tsx` and lives in `src/os/`:

- `state.tsx`: system state, persistence, windows, history, battery and clock.
- `Desktop.tsx`, `Mobile.tsx`, `Shell.tsx`: device shells, navigation, controls and Spotlight.
- `Projects.tsx`: desktop explorer, reference-based mobile carousel, and detail transitions.
- `Apps.tsx`: Terminal, Settings, Mail and About.
- `Widgets.tsx`: clock, telemetry, GitHub and notes.
- `styles.css`: responsive layouts, themes, glass surfaces, and reduced-motion handling.

Earlier components outside `src/os/` remain as reference material and are not mounted by the new application.

## Verification

`npm test` covers desktop/mobile detection, iPad desktop user agents, narrow desktop windows, touch laptops, and server-safe defaults. `npm run build` performs TypeScript checking and a production bundle.

Browser checks performed at desktop and 430 × 932 phone dimensions include project filters/search/save/detail, carousel drag without accidental navigation, traffic-light controls, terminal execution, preference persistence, contact validation, iOS Control Center and Dynamic Island, Android Back/Recents, and OLED black. Physical-device Safari and Android hardware testing remains a release check.

Keyboard shortcuts: Ctrl/Command+K opens Spotlight; Ctrl/Command+, opens Settings; Escape closes overlays or steps back. Reduced-motion preferences are respected, keyboard focus remains visible, and browser zoom is enabled.
