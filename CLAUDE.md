# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site for jonathansolis.com, built with **Next.js 14 (App Router)**, **Three.js**, **Framer Motion**, and **Tailwind CSS**. The build produces a static export (`out/`) deployed via FTP through a GitLab CI/CD pipeline. No Node server is needed in production.

## Development commands

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # static export to out/
npx serve out      # preview the static build locally
```

## Git workflow
Always work on a new branch, never commit directly to main or master.
Branch naming: `feature/<short-description>` or `fix/<short-description>`.

## CI/CD pipeline

Defined in `.gitlab-ci.yml` with four stages:

1. **build** — `node:20-alpine`, runs `npm ci && npm run build`, uploads `out/` as artifact
2. **publish** — mirrors `./out/` to `staging.jonathansolis.com` via FTP (`lftp`). Excludes: `.gitlab-ci.yml`, `.git`, `languages/`, `gallery/`, `blog/`, `test/`, `.m2/`, `links/`
3. **test** — runs Selenium tests in Java (Maven) against staging
4. **deploy** — mirrors `./out/` to production `jonathansolis.com` via FTP (master branch only)

FTP credentials are stored as GitLab CI variables: `$JS_STAGE_FTP_U`, `$JS_STAGE_FTP_PWD`, `$JS_PROD_FTP_U`, `$JS_PROD_FTP_PWD`, `$JS_ADD`.

## Running tests locally

Tests are Java/Maven/Selenium and run against the staging URL defined in `test/Java-Selenium/src/test/resources/config.json`:

```bash
cd test/Java-Selenium
mvn compile
mvn test -Dtest=com.jonathan.JonathanTests
```

To run a single test method:
```bash
mvn test -Dtest=com.jonathan.JonathanTests#titleIsCorrect
```

Requires Chrome installed. The CI uses `markhobson/maven-chrome:jdk-11` Docker image. Selenium selectors that rely on the old HTML structure (class names, XPaths) may need updating — the Selenium tests have not been migrated yet and are considered lower priority.

## Architecture

### Stack
- **Next.js 14 App Router** with `output: 'export'` (static generation, no SSR at runtime)
- **Three.js** (raw, no @react-three/fiber) — full-viewport WebGL background
- **Framer Motion** — section transitions and element animations
- **Tailwind CSS** — utility styling with brand color extensions (`primary: #2fa3ee`, `secondary: #128AD8`)
- **Lucide React** — icons; brand social icons (GitHub, LinkedIn, etc.) use custom inline SVGs in `components/SocialIcons.tsx`

### Navigation model
The site uses **JavaScript-driven section switching**, not CSS scroll-snap. A single `PageController` component in `app/page.tsx` listens to `wheel`, `touchend`, and `keydown` events and calls `scrollToSection(index)` from `ScrollContext`. `AnimatePresence mode="wait"` renders only one section at a time:
- **Exit animation**: current section scales to 1.38× and blurs out (rushes toward camera)
- **Enter animation**: new section scales up from 0.72× and unblurs (arrives from distance)
- Wheel scrolling within a `.section-scroll` container is allowed until content hits its boundary, then navigation triggers

### Three.js world (`components/WorldCanvas.tsx`)
- Rendered on a `position: fixed` canvas behind all content (`z-index: 0`)
- Dynamically imported with `ssr: false` to avoid SSR issues
- Scene contains: wireframe sphere shell (r=7), 100 floating objects (cubes, icosahedrons, glass bubbles), 220 star particles at r=9–20
- **Camera path**: dives inside the sphere across 5 positions (Hero `z=11` → About `z=4` → Portfolio `z≈0` → Blog `z=-2.5` → Contact `z=8`). Position and FOV both lerp each frame (`0.05` factor)
- FOV widens from 60° → 80° as camera enters the sphere
- `FogExp2(0x020b18, 0.07)` adds depth — far objects fade into the dark background
- `activeSectionRef` keeps the animation loop in sync with context without stale closures

### Sections
All sections are **fully transparent** — no background color. Content floats directly over the 3D world. Cards use the `.glass` utility class (`bg-white/5, backdrop-blur-14px, border-white/11`). All text is white with varying opacity.

Each section is a React client component in `components/sections/`. Sections that may overflow on small viewports wrap their content in a `div.section-scroll` which allows wheel-scrolling within the section before the scroll triggers navigation.

Sections with modals: `About.tsx` (CoursesModal — tabbed course list), `Portfolio.tsx` (ProjectModal — per-project detail). When `role="dialog"` is detected in the DOM, the wheel/key navigation is suppressed so modal interaction is not interrupted.

### Key files
| File | Purpose |
|---|---|
| `app/page.tsx` | Page assembly, wheel/touch/key navigation, AnimatePresence |
| `app/layout.tsx` | GTM script injection, Inter font, metadata |
| `app/globals.css` | Dark body bg (`#020b18`), `.glass` / `.glass-hover` utilities |
| `lib/scrollContext.tsx` | `activeSection` state + `scrollToSection`; `isTransitioning` guard |
| `lib/animations.ts` | Shared Framer Motion variants (`fadeUp`, `stagger`, `slideInLeft`, `modalAnim`) |
| `components/WorldCanvas.tsx` | Three.js scene (dynamically imported, ssr:false) |
| `components/DotNav.tsx` | Fixed right-side dot navigation (5 dots, one per section) |
| `components/Modal.tsx` | Framer Motion `AnimatePresence` modal; always has `role="dialog"` |
| `components/SocialIcons.tsx` | Inline SVG brand icons (GitHub, LinkedIn, Twitter, Facebook, Mail) |

### Selenium DOM anchors (do not remove)
- `<title>Jonathan Solis</title>` — checked by `titleIsCorrect` test
- `id="main"` — wraps profile photo in Hero section
- `data-testid="social-icons"` — social icon row in Hero
- `data-testid="github-link"` — GitHub link in Hero
- Section ids: `id="about"`, `id="portfolio"`, `id="blog"`, `id="contact"`

### Other pages (not part of Next.js)
- `links/index.htm` — link-tree page with its own `links/links-style.css`; excluded from FTP sync with `-x links/`
- `languages/es/index.html` — Spanish version; excluded from FTP sync
- `/blog/` — separate WordPress install; **never touch in CI config**

### Analytics & server config
- **Google Tag Manager** (`GTM-WFWZNP6`) injected via `next/script` in `app/layout.tsx`
- **`.htaccess`** — forces HTTPS, sets 1-year cache on static assets, blocks specific IPs
- **`public/googleaf0e2ab5b4c9e3a7.html`** — Google Search Console verification file; must remain in `public/`
