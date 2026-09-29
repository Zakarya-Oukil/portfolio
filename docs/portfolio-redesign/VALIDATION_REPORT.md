# Validation report

Date: 2026-09-29. Dev server: Vite on `http://127.0.0.1:3000/`. Browser: Playwright MCP (Chromium) on Windows.

## Automated

| Check | Result |
| --- | --- |
| `npm test` (baseline, before changes) | 20 of 20 pass |
| `npm test` (after changes) | 20 of 20 pass |
| `npm run build` (baseline and after) | TypeScript strict and Vite build pass, no errors |
| `graphify update .` | Ran (graphify 0.9.71 Python package). No code-graph topology changes. Parser warning: `src/os/Widgets.tsx` line 84 reported as a syntax error by graphify's extractor although `tsc` accepts the file. |

No repeatable browser tests were added: `@playwright/test` is not a project dependency and installing it was not justified for this pass. The tests above are API and device-detection tests only, not UI coverage.

## Live browser (Playwright MCP)

Harness note: the browser runs at a 0.75 device pixel ratio, so a requested viewport of W px yields a layout of about W/0.75 CSS px, and screenshots capture only the requested (smaller) region. Layout widths below are the CSS widths the page reported. Full-page screenshots are therefore partial.

| Flow | Widths (CSS px) | Result |
| --- | --- | --- |
| Entry screen overflow, headline lines, CTA above fold | 320, 390, 768, 1280, 1440, 1920 | No horizontal overflow at any width. Headline 3 lines at 320, 2 lines elsewhere. Primary CTA above the fold at every width. |
| Role switch across all three roles | 1280 | `aria-pressed` follows selection. CV link changes per role. |
| CV downloads | 1280 | All three `/resumes/Zakarya_Oukil_*_CV.pdf` return HTTP 200 as `application/pdf`. File content was not re-inspected in this pass. |
| Fast-Pass dialog | 1280 | Opens from "Start a conversation", focus moves inside the dialog, Escape closes it and returns focus to the trigger. |
| "View role evidence" | 1280 | Enters the OS and opens an app window. |
| Console and network | 1280 | No page errors and no 4xx or 5xx responses in the recruiter path. |
| Reduced motion | 1280 | Emulated `reduce`: all six reveal targets at opacity 1 and visible 150ms after load. Emulated `no-preference`: reveal starts at 0 and finishes within 1.6s. |
| Desktop OS | 1280 | Dock, Terminal window with Close, Minimize and Maximize controls, terminal command input and output exercised. Open Projects was clicked, but window presence was not asserted (my selector matched nothing). Treat Projects as unverified. |
| NetHunter mode | 390 | No overflow, no page errors, all buttons at least 40px after the fixes below. |

## Issues found and fixed

| Issue | Fix |
| --- | --- |
| Entry links under 44px: wordmark (21px), "Explore the Portfolio OS" (39 to 43px), footer "Open the OS" (35px) | `min-height: 44px` on those controls in `src/os/recruiter-entry.css` |
| Fixing that collapsed the space in the wordmark ("ZAKARYAOUKIL") | Added `gap: .28em`, verified in a screenshot |
| NetHunter system bar controls far below tap size (Back 40x15, Home 18x21, Recents 48x13, status control 33x21) and Fast-Pass buttons 35px | 44px minimums plus a visible `:focus-visible` outline in `src/os/command-center.css` |
| Terminal input accessible name was only the decorative shell prompt | Added `aria-label="Terminal command"` in `src/os/Apps.tsx` |
| Entry copy contained an em-dash and stacked middle dots | Replaced with plain punctuation in `src/os/RecruiterEntry.tsx` |
| Console warning for deprecated `apple-mobile-web-app-capable` | Added `mobile-web-app-capable` in `index.html` |

## Not verified

- Tablet width was covered only by the overflow measurement (768 CSS px), not by interaction or screenshots.
- Keyboard-only traversal of the whole entry screen and OS, browser zoom to 200%, screen readers, real touch devices, and cross-browser behavior.
- Desktop OS window resize, drag, maximize and minimize during animation, menus, widgets, Spotlight, Settings and themes.
- Projects browsing, Mail submission and its failure states, Incident Replay, Pentest Reports, SOC Hunting, Master's Research, DuckHunter, Subnet Radar.
- Admin login, editors and publishing beyond what the existing API tests cover.
- Lighthouse and other performance measurements. Build sizes only: main JS 267 kB (80 kB gzip), vendor JS 422 kB (136 kB gzip), CSS 162 kB (33 kB gzip).
- Impeccable critique: its reference files are installed under `.agents/skills/impeccable/skill/` but it is not registered as a callable skill in this session, so no Impeccable audit was run.
- Obsidian MCP tools were not loaded; a project note was written to the vault folder directly (see below).

## Content to confirm with the owner

The seeded credential line for the pentest role reads "eJPTv2 track, eJPT certified". Those two statements sit awkwardly together. The wording comes from existing data (`src/os/recruitment-data.ts`, `src/data/seed.json`, `server/data.json`) and was not changed because credential status is a factual claim.

## Screenshots

`docs/portfolio-redesign/screenshots/`: `baseline/` (from the earlier session), `final-desktop-entry-1280.png` (cropped by the harness), `final-mobile-entry-390.png` (top 633px only), `final-nethunter-390.png`.
