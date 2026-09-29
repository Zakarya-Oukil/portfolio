# Migrating this portfolio from Vite to Next.js

Written on 2026-09-29, from the state of `main` at commit `0a3aa0c`. Tick items off as you go.
Goal: keep the version 7 design ("sheet"), the lab, and the honest content rules exactly as they are.

## 0. Decide first

- [ ] **App Router or Pages Router.** Use the App Router. The plan below assumes it.
- [ ] **Keep the admin or drop it on Vercel.** The admin needs a writable server (`server/`). Vercel functions have no persistent disk, so `server/data.json` cannot be edited there. Pick one:
  - Keep values in environment variables only (simplest, no admin on Vercel).
  - Move admin data to a database or Vercel KV/Blob and rebuild the admin on it.
  - Keep the Node server for the admin on your VPS and let Next.js read its public endpoint.
- [ ] **Static or dynamic.** The site is fully static except the admin data. Prefer static export or ISR.

## 1. Create the Next.js app

- [ ] `npx create-next-app@latest` with TypeScript, App Router, no Tailwind, src directory.
- [ ] Copy over: `public/`, `src/site/`, `design-assets/` (if used), `PRODUCT.md`, `DESIGN.md`, `docs/`, `.impeccable/`.
- [ ] Do **not** copy `src/os/`, `src/lab/`, `src/apps/`, `src/react-native.d.ts`, `react-native-web`, Spline packages and the old OS styles. The OS shell is retired. Only `src/admin/` still imports from `src/os/`, so port the admin last or leave it behind.
- [ ] Install what the site actually uses: `gsap`, `@gsap/react`, `motion`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/big-shoulders-display` (only if a version still uses it), `@phosphor-icons/react` (check first).
- [ ] Remove versions 1 to 5 and the switcher if you want a lean build (`src/site/v1` to `v5`, `src/site/versions/`). Version 7 does not import them. `src/site/shared/InnerPages.tsx` and `src/site/content.ts` are still used.

## 2. Routing (replaces `src/site/router.tsx` and `routes.ts`)

Current custom routes and their Next.js equivalents:

| Now | Next.js |
| --- | --- |
| `/` | `app/page.tsx` |
| `/work` | `app/work/page.tsx` |
| `/work/[slug]` | `app/work/[slug]/page.tsx` (use `generateStaticParams` from `CASE_STUDIES`) |
| `/lab` | `app/lab/page.tsx` |
| `/lab/[slug]` | `app/lab/[slug]/page.tsx` (use `generateStaticParams` from `LAB_SHEETS`) |
| anything else | `app/not-found.tsx` |

- [ ] Replace `SheetLink` (`src/site/v7/ctx.tsx`) internals. It calls `navigate()` from the old router. Use `useRouter().push()` from `next/navigation`, and keep the sheet-wipe animation before calling it.
- [ ] Replace `usePath()` and `parseRoute()` in `V7.tsx` with the Next.js route segments. Each page renders only its own view instead of one component switching on the route.
- [ ] Hash links (`/#roles`) keep working through `scrollToId` in `src/site/v7/motion7.ts`. After a route change, call it from an effect on the new page.
- [ ] Move `titleFor()` into `generateMetadata()` per page. Also set the description and Open Graph tags there, and delete the old `index.html`.
- [ ] `App.tsx` and `main.tsx` go away. The `/admin` branch needs its own route if you keep the admin.

## 3. Client components (the build fails without this)

Everything that touches `window`, `document`, `localStorage`, GSAP, canvas or ScrollSmoother needs `'use client'` at the top:

- [ ] `src/site/v7/V7.tsx`, `ctx.tsx`, `Plotter.tsx`
- [ ] `src/site/lab/*.tsx` (all of them: Audit, Chain, Challenge, SpiderRun, Small, LabPages)
- [ ] `src/site/shared/InnerPages.tsx` (uses the live-content hook)
- [ ] Hooks and helpers that read `window` at module load: `src/site/motion.ts`, `src/site/v7/motion7.ts` (keep them imported only from client components)
- [ ] `useMedia`, `usePrefersReducedMotion` and similar read `window.matchMedia` in `useState` initialisers. Guard them (`typeof window !== 'undefined'`) or initialise in an effect, otherwise the server render and the browser disagree (hydration errors).
- [ ] GSAP plugin registration (`gsap.registerPlugin(...)`) must run only on the client.
- [ ] `ScrollSmoother` wraps `#v7-wrapper` and `#v7-content`. Keep those two elements in a client layout, and keep the fixed header and the frame outside them.

## 4. Environment variables

`import.meta.env.VITE_*` does not exist in Next.js. Files to change: `src/site/site-config.ts`, `src/site/live.ts`, `src/site/v1/Home.tsx` (delete with v1).

| Old | New |
| --- | --- |
| `VITE_CONTACT_EMAIL` | `NEXT_PUBLIC_CONTACT_EMAIL` |
| `VITE_BOOKING_URL` | `NEXT_PUBLIC_BOOKING_URL` |
| `VITE_GITHUB_URL` | `NEXT_PUBLIC_GITHUB_URL` |
| `VITE_LINKEDIN_URL` | `NEXT_PUBLIC_LINKEDIN_URL` |
| `VITE_INSTAGRAM_URL` | `NEXT_PUBLIC_INSTAGRAM_URL` |
| `VITE_CONTACT_PHONE` | `NEXT_PUBLIC_CONTACT_PHONE` |
| `VITE_WHATSAPP_NUMBER` | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| `VITE_EJPT_VERIFY_URL` | `NEXT_PUBLIC_EJPT_VERIFY_URL` |

- [ ] Replace `import.meta.env.X` with `process.env.NEXT_PUBLIC_X`. Next.js only inlines these when written literally, so do not read them through a variable name.
- [ ] Set them in Vercel: Project, Settings, Environment Variables. Set them for Production and Preview.
- [ ] Empty means hidden. Do not put placeholder values in.

## 5. Security headers

The Audit sheet (`/lab/audit`) reads what the server sends, so these must survive the move.

- [ ] Move the `headers` array from `vercel.json` into `next.config.ts` `async headers()`.
- [ ] Headers to keep: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.
- [ ] **The CSP will need work.** Current policy is `script-src 'self'`, which blocks the inline scripts Next.js emits. Use a per-request nonce with middleware (recommended), or start in `Content-Security-Policy-Report-Only` while you tune it. Do not weaken it to `'unsafe-inline'` for scripts just to make it pass.
- [ ] `style-src` currently allows `'unsafe-inline'` (React inline styles, GSAP). Keep that.
- [ ] `connect-src` allows `https://api.github.com`. Remove it if nothing calls it.
- [ ] After deploying, open `/lab/audit` on the live site. The goal is every check passing except "security.txt" (a note) until you publish one.
- [ ] Delete `vercel.json` rewrites. Next.js handles routing. Keep nothing that duplicates it.

## 6. Fonts and images

- [ ] Fonts are self-hosted (`public/fonts/` plus `@fontsource-variable/*`). Do not switch to `next/font/google`: it changes how fonts are served and the Audit sheet's third-party check depends on all fonts being first-party.
- [ ] `src/site/fonts.css` declares Switzer and Gambetta with `@font-face`. Import it from `app/layout.tsx`. Check the licence note in that file.
- [ ] Vite was set to `assetsInlineLimit: 0` so fonts are never inlined as `data:` URIs (the CSP blocks them). Next.js does not inline fonts by default, but check the deployed page for CSP errors in the console.
- [ ] Images are plain `<img>` tags with width and height. You can move to `next/image` later. It is optional.
- [ ] `public/img/` and `public/uploads/` come across as they are.
- [ ] CSS is plain CSS (`v7.css`, `lab.css`, `base.css`). Import global CSS in `app/layout.tsx`. Class names are prefixed `v7-`, so there are no conflicts.

## 7. The admin and live content

Currently `src/site/live.ts` fetches `/api/portfolio-data` and merges admin values over the environment values. On Vercel that endpoint will not exist.

- [ ] Keep the graceful fallback (it already falls back to environment values when the endpoint is missing).
- [ ] If you keep an admin, port these endpoints from `server/portfolio-api.mjs`:
  - `GET /api/portfolio-data` (public, read)
  - `POST /api/portfolio-data` (authenticated, write)
  - `POST /api/admin/login`, `GET /api/admin/session`, `POST /api/admin/logout`
  - `POST /api/mail`, `GET /api/messages`, `POST /api/messages/delete`
- [ ] `server/data.json` cannot be written on Vercel. Use a database or KV store.
- [ ] Rate-limit and validate `/api/mail` before exposing it. It sends mail to you, so it can be abused.
- [ ] `server/auth.local.json` and `server/sessions.local.json` are ignored by git on purpose. Never commit them. Create the admin password again in the new setup with `scripts/setup-admin.mjs` as a reference.
- [ ] `server/messages.json` is now git-ignored. Keep it that way, because it holds visitor messages.
- [ ] `src/admin/*` imports from `src/os/*` (state types, `portfolio-store`, icons, `DEFAULT_*` data). Either port those imports over or rebuild a small admin for just: contact fields, per-role CV URLs and availability facts.

## 8. Honesty rules to keep (owner decisions)

Do not reintroduce any of these. They were removed on purpose:

- [ ] No client engagements, "verified" credentials, thesis metrics or results that are not real.
- [ ] BTL1 and Security+ are **in progress**. The Master's is **candidate**. Only the eJPT is earned.
- [ ] No claims about work authorization or security clearance (the owner said they are not true).
- [ ] No kernel or eBPF claims beyond "studying".
- [ ] Lab content is labelled as simulation, live check, puzzle or study notes.
- [ ] Empty contact fields, CV links and facts stay hidden.

## 9. Pre-deploy checks

- [ ] `npm run build` passes with no type errors.
- [ ] No console errors on `/`, `/work`, `/work/zaks-spider`, `/lab`, and each `/lab/<sheet>`.
- [ ] Reduced motion (browser setting): no pinned reel, no smooth scroll, everything visible.
- [ ] Keyboard: Tab reaches the role rows, the sheet links in the work reel (focus scrolls the pin to that sheet) and the lab controls, with a visible focus ring.
- [ ] Phone width (390 px): header links visible, no horizontal scroll.
- [ ] Accessibility scan (axe, WCAG 2.1 AA) shows zero violations.
- [ ] The Audit sheet on the live site.
- [ ] `PRODUCT.md` and `DESIGN.md` still describe what shipped.

## 10. Where things are today

- Design system: `DESIGN.md` (tokens, type, components, motion rules) and `.impeccable/design.json`.
- Product truth and honesty rules: `PRODUCT.md`.
- Site entry: `src/site/Site.tsx` picks the version and sends `/lab` paths to version 7.
- Version 7: `src/site/v7/` (page, motion, plotter background, styles).
- Lab sheets: `src/site/lab/` (registry, fixtures in `data.ts`, one component per sheet).
- Live content (admin or environment): `src/site/live.ts`.
- Case studies, credentials and roles seed content: `src/site/content.ts`.
