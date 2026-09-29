# Redesign coverage matrix

**Legend:** `SV` = implementation/behavior found in current source; `BU` = browser behavior not verified; `P` = redesign or acceptance check pending. The IDs are stable **documentation IDs**, not existing test selectors. `SV` is not a pass for visual quality, accessibility, content accuracy, external links, downloads, API availability or responsive operation. Public entry and Recruiter Fast-Pass are the next redesign targets; all future-state checks remain `P`. Inventory details and evidence: `FEATURE_UI_INVENTORY.md`, `BASELINE_AUDIT.md`.

## Minimum feature-preservation checklist

| ID | Feature / entry / acceptance path | Desktop | Tablet | Mobile | Keyboard / touch, motion and states | Current evidence → redesign check |
| --- | --- | --- | --- | --- | --- | --- |
| ENT-01 | `/` public vs `/admin` entry, loading + browser history | SV/BU | SV/BU | SV/BU | Popstate route; admin fallback | `src/App.tsx`; P preserve both routes, no accidental admin exposure or blank screen. |
| ENT-02 | Boot first session, skip, handoff, mode persistence | SV/BU | SV/BU | SV/BU | Skip click; Escape transition; reduced motion skips timers | `state.tsx`, `BootAnimation.tsx`, `Transition.tsx`; P verify first/repeat entry, no trapped overlay. |
| ENT-03 | Initial device detection and saved mode | SV/BU | SV/BU | SV/BU | Touch UA/≤768 logic; no automatic mode on resize | `deviceDetection.ts`, `state.tsx`; P test cold vs persisted devices and orientation/resize. |
| NAV-01 | Shortcuts, back/history, overlays and toast/sleep | SV/BU | SV/BU | SV/BU | Ctrl/Cmd+K Fast-Pass, Ctrl/Cmd+Shift+K Spotlight, Ctrl/Cmd+, Settings, Escape order; native dialog Escape; touch Back/Home | `Shell.tsx`, `state.tsx`; P test precedence and focus restoration. |
| NAV-02 | Top Applications menu, stance, workspace, status controls | SV/BU | SV/BU* | SV/BU* | Menu pointer/outside/Escape, tab buttons; workspace selection is toast only | `Desktop.tsx`; P do not promise actual virtual desktop isolation. *Desktop mode at narrow viewport only; controls hide. |
| NAV-03 | Desktop/mobile dock + Spotlight app/project search | SV/BU | SV/BU | SV/BU | Button tabs, mouse magnification, search focus/loop/no-results; Enter first app; project result dispatch | `Shell.tsx`; P test mobile fallback and keyboard search versus Fast-Pass shortcut. |
| NAV-04 | Control Center and display settings | SV/BU | SV/BU | SV/BU | Backdrop, buttons, ranges, status pull-down / shade swipe-up; simulated hardware | `Shell.tsx`, `Mobile.tsx`; P verify touch, no hardware claim. |
| NAV-05 | Window open/focus/close/min/max/drag | SV/BU | SV/BU* | SV/BU* | Traffic lights + titlebar pointer drag/double-click; no keyboard drag | `Desktop.tsx`; P test window visibility/clamping/overlap. *Workstation mode only. |
| NAV-06 | NetHunter home, status, recents, nav | SV/BU | SV/BU | SV/BU | 11 app cards, pinned recruiter card, role drawer pill, Back/Home/Chroot; downward swipe | `Mobile.tsx`; P test accessible touch size, scroll, app switch, framed and real phone. |
| NAV-07 | Filesystem shortcuts/drag positions | SV/BU | Hidden ≤900 | Hidden ≤900 | Pointer-up launch, grid drag saved; keyboard launch unproven (no `onClick`) | `Desktop.tsx`; P preserve discoverability with alternative entries; fix/check keyboard if reused. |
| NAV-08 | Mission HUD WHOAMI/STACK/LABS and actions | SV/BU | Hidden ≤900 | Hidden ≤900 | Buttons/tab content, pointer drag/16px snap/reset/local save; no keyboard drag | `Desktop.tsx`; P avoid inventing telemetry or collapse. |
| NAV-09 | About/certs/GitHub/neofetch/optional clock/telemetry/notes widgets | SV/BU | Hidden ≤900 | Hidden ≤900 | Configure visibility/order; GitHub failure, note edit, links; pointer drag not saved; demo CPU/network | `Widgets.tsx`; P retain alternative access and simulated disclaimers. |
| APP-01 | Projects browse/filter/search/save/detail/technical overview | SV/BU | SV/BU | SV/BU | Desktop sidebar vs mobile category+animated carousel; empty/image failure, Back detail/overview | `Projects.tsx`; P verify swipe + keyboard, saved persistence, project search results. |
| APP-02 | Terminal commands and shortcuts | SV/BU | SV/BU | SV/BU | Enter, Up/Down, Tab completion, Ctrl+L; no Ctrl+R/C/real scans | `Apps.tsx`; P keep simulation clearly labeled. |
| APP-03 | Settings OS/theme/wallpaper/GitHub form | SV/BU | SV/BU | SV/BU | Native controls, persistence/error; no notification/sound control in Settings | `Apps.tsx`; P validate selected/persisted states. |
| APP-04 | Mail inquiry + local draft | SV/BU | SV/BU | SV/BU | Validation/error/sending/success, POST `/api/mail`, EML only after success | `Apps.tsx`, API; P test blocked/error/offline, no encryption promise. |
| APP-05 | About → Projects/Mail | SV/BU | SV/BU | SV/BU | Two native buttons | `Apps.tsx`; P preserve routes. |
| APP-06 | Brief Dossier CV/booking/credentials | SV/BU | SV/BU | SV/BU | Optional links vs pending; Escape/Exit brief | `Recruiter.tsx`; P test statuses, fallback, focus. |
| APP-07 | Brief Flagships metrics/architecture/evidence | SV/BU | SV/BU | SV/BU | Node expand; 0–3 projects; no carousel | `Recruiter.tsx`; P test links, missing metric notes. |
| APP-08 | Brief Quickstart guided topics | SV/BU | SV/BU | SV/BU | Four topic buttons, defense launch; not arbitrary terminal | `Recruiter.tsx`; P test nav and clear simulation copy. |
| APP-09 | Defense lab triage/analysis/containment/replay | SV/BU | SV/BU | SV/BU | Correct/wrong choices, disabled advance, replay reset; simulated only | `Recruiter.tsx`; P test keyboard and state reset. |
| APP-10 | Pentest audits + executive/technical + CVSS | SV/BU | SV/BU | SV/BU | Select report, score controls, audience toggle, `.md` export/empty list | `PentestReportsApp.tsx`, `ReportAudience.tsx`; P test sticky/stacked layouts and disclosures. |
| APP-11 | SOC rules, static SIEM stream, MITRE | SV/BU | SV/BU | SV/BU | Rule selection, audience, clipboard failure/success, simulated triage | `SocCommandApp.tsx`; P test table horizontal scroll and missing data. |
| APP-12 | Thesis and benchmark display | SV/BU | SV/BU | SV/BU | Two hardcoded benchmark views, copy BibTeX, `.md` export | `MastersResearchApp.tsx`; P verify published claims, clipboard and viewport. |
| APP-13 | Credentials attestation simulation | SV/BU | SV/BU | SV/BU | Placeholder key, fake re-verify spinner, issuer links | `CredentialSigModal.tsx`; P do not claim cryptographic validation. |
| APP-14 | Live SOC scripted scenario | SV/BU | SV/BU | SV/BU | Three choices, replay/Defense; no real shell | `LiveSocScriptModal.tsx`; P simulate explicitly, verify scroll/state. |
| APP-15 | DuckHunter scripts | SV/BU | SV/BU | SV/BU | Presets, clipboard, timed fake injection; no real USB | `NetHunterApps.tsx`; P review safety messaging. |
| APP-16 | Subnet Radar | SV/BU | SV/BU | SV/BU | Timed fake scan + clickable non-button host cards (keyboard gap) | `NetHunterApps.tsx`; P fix/check keyboard + clearly simulated network. |
| APP-17 | Red/Blue replay | SV/BU | SV/BU | SV/BU | Prev/Next/Play-Pause/markers, 6.5s stages, pause hidden, reference link, Fast-Pass CTA; no scrubber/Space shortcut | `IncidentReplayApp.tsx`, `recruitment-data.ts`; P verify timing, mobile stack and reduced-motion implications. |
| REC-01 | **Fast-Pass: role select → evidence/CV → screening → next step** | SV/BU | SV/BU | SV/BU | Native dialog, radio roles, three PDFs, evidence launches, booking URL or future-time form, email link or inquiry form, POST `/api/mail`; Escape/X/backdrop and restored focus; keyboard/mobile touch, pending/error/success | `RecruiterFastPassDrawer.tsx`, `recruitment-data.ts`; **P redesign and browser-verify all branches below**. |
| REC-02 | Full brief nav and restore previous workspace | SV/BU | SV/BU | SV/BU | Start opens 3 apps/minimizes old; Exit/Escape restore, Defense branch | `state.tsx`, `Recruiter.tsx`; P verify no stale windows. |
| REC-03 | Mobile pinned recruiter card vs Fast-Pass pill | SV/BU | SV/BU | SV/BU | Card CV/Mail; **adjacent pill** opens role drawer | `Mobile.tsx`, `NetHunterApps.tsx`; P keep role entry distinct. |
| ADM-01 | Admin login/edit/publish/inbox | SV/BU | SV/BU | SV/BU | 12 nav sections, autosaved browser draft, server publish or local-only fallback; auth errors/confirm delete | `AdminDashboard.tsx`, `CyberAppsAdmin.tsx`, `RecruitmentEditors.tsx`, `admin.css`; P verify production auth + all editors. |
| API-01 | Public content + mail, authenticated admin API | SV (tests) / BU | SV (tests) / BU | SV (tests) / BU | JSON validation, same-origin, auth, rate-limit; actual paths in inventory | `portfolio-api.mjs`; P integration check without publishing production data. |
| DATA-01 | Seed/API/cache, role PDFs, fallbacks | SV/BU | SV/BU | SV/BU | Offline, missing links/assets, cached/seed mismatches | `portfolio-store.ts`, `seed.json`, `server/data.json`, `public/resumes`; P compare source IDs and live downloads. |

## Fast-Pass redesign branch checks (all P, no browser evidence yet)

| Acceptance ID | Acceptance action and expected outcome | Source baseline |
| --- | --- | --- |
| FP-01 | Open from workstation top panel, desktop dock, mobile home pill, Ctrl/Cmd+K, replay CTA; appropriate modal layering and initial focus. | `Shell.tsx`, `Desktop.tsx`, `Mobile.tsx`, `IncidentReplayApp.tsx` |
| FP-02 | Switch pentest/SOC/systems using pointer, touch and radio keyboard; matching summary, cert status, **four** competencies, evidence app and role PDF change together. | `RecruiterFastPassDrawer.tsx`, `recruitment-data.ts` |
| FP-03 | Open each matching evidence app and return/navigation; never lose workspace or strand a phone user. | `state.tsx`, drawer |
| FP-04 | Download three role PDFs; check paths and PDF response/content, keyboard access, missing/unsafe URL fallback. | `public/resumes/*`, `safeLink` |
| FP-05 | Work authorization/availability/preference/clearance have readable labels, candidate-supplied caveat; publication state/accuracy independently checked. | drawer/config |
| FP-06 | Configured HTTP(S) booking opens external link safely; absent link shows form; chosen date strictly in future, timezone shown, request **proposed not booked**, POST `/api/mail`. | drawer/API |
| FP-07 | Valid email opens `mailto:`; otherwise inquiry form. Optional public PGP link is just a download; **no encryption by site** and no key means explicit notice. | drawer/config |
| FP-08 | Required fields, max lengths, disabled while sending, duplicate guard, timeout, invalid/429/offline/server error, success and cancel preserve/clear correct state. | drawer/API |
| FP-09 | Escape/X/backdrop close, focus returns to opener, Tab stays in modal, backdrop cannot activate OS, short viewport scroll stays inside drawer; test sequential overlays. | native `<dialog>` and Shell |
| FP-10 | Replay/full brief footer and phone pinned-card pathways remain usable, restore behavior intact. | drawer/brief/mobile card |
| FP-11 | Test dark/light/OLED surroundings, 1440/1024/768/390/320px and touch at 200% zoom; no clipping, single-column evidence ≤540. | CSS and mode selection |
| FP-12 | Reduced-motion disables gratuitous transitions; keyboard focus contrast and status announcements; no simulated claims upgraded to verified claims. | OS CSS, drawer |

## Verification record and ownership

- Source baseline: all `SV` entries derive from mounted imports, branches and styles listed, not from a browser. No dedicated UI/end-to-end/browser tests exist in the inspected `tests/` files.
- Test/build baseline was reported by the main task owner as **`npm test` 20/20 passing and `npm run build` passing**; this document does not claim this agent ran those commands. API/device-detection tests do not establish any `BU` UI cell.
- Redesign in progress: entry and Fast-Pass (`ENT-*`, `NAV-*` entry pathways, `REC-01`, `FP-*`). Mark their implementation and every viewport/keyboard/touch/motion acceptance check `P` until an actual browser run provides evidence. Other rows are preservation/regression checks, not authorization to rebuild dormant legacy UI.
