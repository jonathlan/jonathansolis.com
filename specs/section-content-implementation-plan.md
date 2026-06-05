# Plan — Implement "Section Content Spec" (+ Design System) for jonathansolis.com rebrand

## Context

`specs/jonathansolis-com.md` defines an "Abstract to Concrete" rebrand. The visitor is the hero,
Jonathan is the guide, and the 5 sections walk an arc: **abstract → burdened → breakthrough →
precise → open** (The Dark → The Weight → The Clearing → How I Help → Contact).

This plan covers the **`## Section Content Spec`** (copy + structure for all 5 section components)
and, per the user's decisions, also the **`## Design System`** (new color tokens, glass card, DotNav
labels, metadata). The **WorldCanvas.tsx 3D rewrite is explicitly out of scope** — it is a separate
section of the spec and was not requested here. The sections currently render over the existing
Three.js world, which keeps working unchanged.

User decisions captured during planning:
1. **Apply the Design System too** — swap to the amber/purple palette now, not later.
2. **Move social row to Contact AND update the Selenium tests** so they stay green.
3. **Aere project** → include as a **text-only placeholder** evidence block (no image yet).

Section ids stay the same (`about`, `portfolio`, `blog`, `contact`) so the narrative labels are
cosmetic — `id="about"` is now "The Weight", `id="blog"` is now "How I Help", etc. Do **not** rename
ids (Selenium + scroll context depend on them).

---

## Design System changes (do first — tokens the sections reference)

### `tailwind.config.ts`
Replace the `colors` block:
```ts
colors: {
  primary: "#c8a060",   // warm amber — eyebrows, links, CTAs
  secondary: "#8060d0", // purple — buttons, borders (echoes torus knot)
  warm: "#c8a96e",      // hover states / highlights
}
```
Note: `Modal.tsx` (`bg-primary`/`hover:bg-secondary`) and `CoursesModal.tsx`
(`border-primary text-primary`) consume these tokens — they will recolor automatically, which is
desired.

### `app/globals.css`
- Body background `#020b18` → **`#080810`**.
- `.glass` → `background: rgba(15,15,30,0.45); border: 1px solid rgba(150,120,200,0.15);` (keep the
  14px backdrop-blur). `.glass-hover:hover` → `background: rgba(15,15,30,0.65);`.

### `app/layout.tsx`
- Body class `bg-[#020b18]` → **`bg-[#080810]`**.
- Metadata: keep `title: "Jonathan Solis"`. New `description`:
  *"Digital product guide. I help founders and teams build their first product or rescue one that's
  lost its way. 20 years of experience across 4 continents."* OG/Twitter description →
  *"I guide teams through the dark of building digital products."*

### `components/DotNav.tsx`
- `sections` array → `["The Dark", "The Weight", "The Clearing", "How I Help", "Contact"]`.
- Active dot `backgroundColor` `#2fa3ee` → **`#c8a060`**.

### Global accent swap in sections
Throughout the 5 section components, replace hardcoded `#2fa3ee` usages: eyebrows / links / CTAs →
`text-primary` (amber); buttons & borders where the spec calls for it → `secondary` (purple).
Replace blue `textShadow` glows (`rgba(47,163,238,…)`) with amber `rgba(200,160,96,…)`.

---

## Section content rewrites

### Section 0 — `components/sections/Hero.tsx` (The Dark)
- **Keep `id="main"` wrapping an `<h1>`** (Selenium `FindHeroTitle` needs `//*[@id="main"]//h1`).
- Remove name/title/location and the **social icons row** (moves to Contact).
- H1 (light weight, `font-light`): *"Building a digital product feels like standing in the dark."*
- Body: *"The path is invisible. Every direction looks the same."*
- Three `.glass` pain-point chips: **"No clear roadmap" · "Too many tools" · "Burning resources"**.
- Scroll hint copy → *"keep scrolling — I've been there too"* (keep the animated chevron).
- Drop the now-unused `SocialIcons` import.

### Section 1 — `components/sections/About.tsx` (The Weight, `id="about"`)
- **Remove** the skills grid and fun-facts grid. **Remove** the languages row (moves to S3).
- Eyebrow: *"Sounds familiar?"*
- H2: *"You've got the idea, the budget. But the dark keeps winning."*
- Body (3 short paragraphs): the developer-quotes / agencies-disappear / six-months paragraph; then
  *"Most products don't fail because of a bad idea. They fail because there was nobody to help them
  navigate."*
- Pull-quote `.glass` card: *"I speak business and tech natively — I can read the codebase, run the
  pipeline, and still write the roadmap."*
- Below pull-quote: a **"View certifications →"** text link (`text-primary`) that opens the existing
  `CoursesModal` (retain `useState(coursesOpen)` + `<CoursesModal />`).
- Micro-copy: *"I've shipped products for clients across 4 continents."* / *"And right now, I'm
  building one of my own."*
- Trim now-unused lucide imports.

### Section 2 — `components/sections/Portfolio.tsx` (The Clearing, `id="portfolio"`)
Restructure from 4 project cards → **2 service cards**, each opening a `Modal` with **two evidence
blocks**.
- Eyebrow: *"The path exists."*  H2 (bold): *"It doesn't have to be this way. I've walked this path
  before."*
- Body: *"For two decades I've taken digital product ideas from napkin to launch, and rescued
  products heading off a cliff."*
- **Card A — Build from Zero** (`Sprout` icon): *"I've built SaaS tools and cultural heritage
  platforms. If you have an idea worth building, let's scope it."*
  - Modal evidence: **Aere** (text-only placeholder — *"Archaeological sites platform with 3D
    modeling, built on OpenBuilding."*, no image) + **API Roadmap** (reuse existing Kitchen API copy
    + roadmap image from the current `roadmap` project).
- **Card B — Fix What's Broken** (`Wrench` icon): *"Your product exists but something's wrong. I
  audit the codebase directly, not just the backlog — then fix it."*
  - Modal evidence: **Proxy Format** + **Garsol Web Hosting** (reuse existing `proxy` and `websites`
    copy/images).
- CTA below cards: **"Ready to start walking? →"** → `scrollToSection(3)` via `useScroll()` (same
  pattern as `DotNav`).
- Reuse the existing `Modal` component and image assets under `/assets/img/portfolio/`. Replace the
  `projects` array shape with two service entries; keep the `ProjectModal` render switching keyed by
  id, but render two evidence blocks per modal.

### Section 3 — `components/sections/Blog.tsx` (How I Help, `id="blog"`)
Full repurpose from blog grid → process timelines.
- Eyebrow: *"What working with me looks like"*  H2: *"Two ways I can help you build."*
- **Path A — Build from Zero** (3-step timeline): Discovery / Scope & Roadmap / Build & Ship (copy
  from spec lines 112–114).
- **Path B — Fix What's Broken** (3-step timeline): Audit / Diagnosis / Execution (spec 116–119).
- CTA: **"Book a free 30-min call →"** → `mailto:hello@jonathansolis.com`.
- **Languages row** (moved from About): *"I work in: Spanish · English · French · Italian"*.
- **Mini blog row — 2 cards, no images:**
  - *"Como crear un producto digital en 5 pasos" — 5 min* →
    `https://jonathansolis.com/blog/como-crear-un-producto-digital/`
  - *"Validación de ideas por medio del mom test" — 6 min* →
    `https://jonathansolis.com/blog/validacion-de-ideas-por-medio-del-mom-test/`
- Keep the `.section-scroll` wrapper (this section is tall).

### Section 4 — `components/sections/Contact.tsx` (Start Walking, `id="contact"`)
- Eyebrow: *"The path is clear."*  H2: *"Ready to build something?"*
- Body: *"Send me a message and we'll figure out if I'm the right guide for your project."*
- Primary CTA: email `hello@jonathansolis.com` (keep the existing glass email button; restyle border
  to `secondary`/`primary`).
- **Social row** (GitHub, LinkedIn, Twitter, Facebook) — add the Selenium anchors here (see below).
- Drop the "@jonathlan everywhere" handle line (not in spec).

---

## Selenium update (decision #2 — keep tests green)

The icon tests load the home page and immediately look for the social row, but only the active
section renders (`AnimatePresence mode="wait"`). After moving the row to Contact, update both the
markup and the page object:

- **Contact.tsx social row**: add `data-testid="social-icons"` to the row wrapper and
  `data-testid="github-link"` to the GitHub `<a>` (mirrors what Hero had).
- **`test/.../pages/JonathanHomePage.java`**: before locating the icons, navigate to Contact —
  click the DotNav button `By.cssSelector("[aria-label='Go to Contact']")` (or send 4×
  `Keys.ARROW_DOWN`), then wait for `data-testid='social-icons'`.
- **Icon count**: the Contact row has **4** social links (email is a separate CTA). Either change
  `numberOfIconsIsCorrect` to expect `hasEnoughIcons(4)`, or also tag the email CTA with an `<a>`
  inside the row to keep 5. Recommend updating the assertion to **4** to match the spec.
- `FindHeroTitle` stays valid as long as Hero keeps `id="main"` + an `<h1>`.
- These run in CI against staging; validate there (cannot run locally without the staging deploy).

---

## Out of scope (do not touch in this task)
`components/WorldCanvas.tsx` (3D rewrite is a separate spec section), `app/page.tsx`,
`lib/scrollContext.tsx`, `lib/animations.ts`, `components/Modal.tsx`, `components/SocialIcons.tsx`,
`next.config.mjs`, `.gitlab-ci.yml`. Section **ids** must not be renamed.

## Files to modify
| File | Change |
|---|---|
| `tailwind.config.ts` | amber/purple/warm tokens |
| `app/globals.css` | body bg `#080810`, new `.glass`/`.glass-hover` |
| `app/layout.tsx` | body bg class, metadata |
| `components/DotNav.tsx` | labels + active-dot color |
| `components/sections/Hero.tsx` | S0 copy, drop social row, keep `id=main`+`h1` |
| `components/sections/About.tsx` | S1 copy, drop grids/languages, keep CoursesModal link |
| `components/sections/Portfolio.tsx` | S2 → 2 service cards + 2-evidence modals |
| `components/sections/Blog.tsx` | S3 → process timelines + languages + 2 blog cards |
| `components/sections/Contact.tsx` | S4 copy + Selenium-anchored social row |
| `test/.../pages/JonathanHomePage.java` (+ `JonathanTests.java`) | navigate to Contact; count → 4 |

## Verification
1. `npm run build` — must produce `out/` with no type/lint errors (drop all unused imports).
2. `npx serve out` (or `npm run dev`) — manually walk all 5 sections: verify copy matches spec,
   pain-point chips render, Portfolio service cards open modals with both evidence blocks, Blog shows
   both timelines + languages + 2 blog links, Contact email + 4 social icons.
3. Confirm DotNav tooltips read the 5 new labels and the active dot is amber.
4. Confirm new palette: amber eyebrows/links, purple borders/buttons, `#080810` background.
5. Selenium (CI against staging after deploy): `FindHeroTitle`, `relevantIconURL`,
   `numberOfIconsIsCorrect`, `titleIsCorrect` pass with the updated page object.
