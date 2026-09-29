# Motion system

## Signature interactions actually implemented (GSAP 3.15 + `@gsap/react`)

Both live in `src/os/RecruiterEntry.tsx` and use `useGSAP` with a scoped ref and `gsap.matchMedia`.

| Interaction | Purpose | Duration | Ease | Distance | Stagger |
| --- | --- | --- | --- | --- | --- |
| Entry reveal on `[data-entry-reveal]` | Hierarchy: headline first, actions and evidence follow | 0.6s | `power3.out` | 18px up | 0.07s |
| Role detail swap on `[data-role-detail]` | State transition: shows that competencies, credentials, evidence and CV changed with the role | 0.28s | `power2.out` | 9px up | 0.035s |

Both animate `autoAlpha` and `y` only (opacity and transform), then `clearProps: 'all'`.

## Reduced motion

`gsap.matchMedia` registers the tweens under `(prefers-reduced-motion: no-preference)`. Under `reduce` nothing is registered and content is fully visible immediately. Because `matchMedia` reacts to changes, toggling the preference while the page is open reverts the tweens. CSS additionally zeroes transition and animation durations inside `.recruiter-entry` under `reduce`. Measured in the browser: with reduced motion, all six reveal targets are opacity 1 and visible 150ms after load.

## Lifecycle and safety

- `useGSAP` reverts its context on unmount, and `matchMedia.revert()` is returned as cleanup.
- The role-detail effect uses `dependencies: [role.id]` and `revertOnUpdate: true`, so repeated role switching does not stack tweens.
- The entry animation is not gated on loading. Without JS the page would not render at all (React app), and with GSAP initialization failing the elements remain in their CSS state.
- No ScrollTrigger, no pinning, no idle loops, no scroll listeners. There is no scrollable narrative content on the entry screen to justify them.

## Not changed

The OS layer keeps its existing CSS and React Native Web animation (dock magnification, window transitions, boot, incident replay playback). These were audited but not migrated to GSAP, to avoid two systems writing the same transforms.
