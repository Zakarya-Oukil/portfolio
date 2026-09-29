# Design direction: evidence-first security portfolio

Canonical handoff. Related: `BASELINE_AUDIT.md`, `FEATURE_UI_INVENTORY.md`, `COVERAGE_MATRIX.md`, `MOTION_SYSTEM.md`, `VALIDATION_REPORT.md`.

## Design read

Portfolio for security hiring managers and recruiters, dark technical language, leaning toward native CSS plus GSAP. Dials: variance 7, motion 5, density 4. Motion stays low because the recruiter path must be scannable in seconds and the OS layer already carries its own animation.

## Pre-flight randomization (real run)

The earlier version of this file described a simulated selection. This is the actual output of a seeded `random.Random(7331)` run in Python:

| Draw | Result | Decision |
| --- | --- | --- |
| Hero architecture | Artistic Asymmetry | Adopted. Intro copy sits left, the role evidence panel sits right and overlaps the intro's column rhythm. |
| Typography | Outfit | Not adopted. Geist Variable is on the allowed list, already bundled through `@fontsource-variable/geist` and self-hosted, so no new font dependency or extra request. |
| Components | Horizontal Accordions, Inline Typography Images, Infinite Marquee | Not adopted. The marquee would need client or partner logos, and there are none to show. Inline images need real project imagery that is not yet curated. Accordions add nothing to a three-item role selector. |
| GSAP paradigms | Scroll Pinning Split, Image Scale and Fade | Not adopted. The entry screen fits one viewport and has no long scroll to pin. Both remain candidates if a long-form case study page is added. |

The draw was assessed against the content rather than applied blindly, per the brief's conflict order.

## Core concept

One entry screen, three questions answered above the fold: who is this, which role fits, what is the next step. The Portfolio OS stays as a second layer entered by choice ("Enter the workstation", "View role evidence", Ctrl or Cmd+K for Fast-Pass).

## Recruiter journey

1. Land on the entry screen (`src/os/RecruiterEntry.tsx`), no boot animation and no blocking intro.
2. Pick a role (pentest, SOC, systems). Competencies, credential status, evidence app and CV update in place.
3. Download the role CV (real PDFs in `public/resumes/`), open role evidence in the OS, or start a conversation (Fast-Pass dialog).
4. Optionally enter the workstation. The choice is remembered for the browser session (`sessionStorage` key `zak.explored`).

## Technical-review journey

Enter the OS, then use Projects, Pentest Reports (executive and technical audiences), SOC Hunting, Master's Research, Incident Replay, Terminal and the NetHunter tools. Simulations stay labeled as simulations.

## Typography

Geist Variable for interface and display, system monospace for status labels. Display headline uses `clamp` scaling and measured at 47px (320 to 390 wide), 69px (768), 77px (1280), 86px (1440), 112px (1920). It wraps to 2 lines from 390px up and 3 lines at 320px.

## Color and state

One accent, a pale mint green, on a near-black teal surface. No pure black or white. Status is never color alone: credential state is written out ("in progress", "eligible", "certified").

## Layout, shape, depth

Two-column asymmetric grid above tablet width collapsing to one column on narrow screens. One radius scale for controls. Depth comes from hairline borders and tinted surfaces, not drop shadows.

## Iconography and imagery

Text arrows only on the entry screen. Existing OS icons unchanged. No stock or placeholder imagery: the brief bans it and no curated project screenshots have been added to the entry screen yet (see limitations).

## Responsive rules

Verified in the browser at 320, 390, 768, 1280, 1440 and 1920 CSS px: no horizontal overflow, headline within three lines, primary CTA above the fold. Touch targets are at least 44px on the entry screen and NetHunter navigation.

## Motion and reduced motion

See `MOTION_SYSTEM.md`.

## Patterns to avoid

Em-dashes in page copy, stacked middle dots, decorative status dots, invented metrics, client logos, testimonials, certifications without status, fake screenshots, blanket `overflow: hidden` to mask layout bugs, and any wording that presents a proposed screen as a booking or a saved inquiry as a sent email.

## Known limitations

- The OS layer (dock, menus, some Fast-Pass labels) still uses emoji glyphs and em-dashes in labels such as "Zakarya — Portfolio OS" (the page title, left unchanged because it is SEO-relevant). Those were not part of the entry redesign.
- No case-study or long-scroll page exists, so scroll-driven GSAP patterns were deliberately not added.
