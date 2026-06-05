# jonathansolis.com — "Abstract to Concrete" Rebrand Spec

---

### Positioning

- FROM: Product Manager with credentials
- TO: Guide through complexity — from abstract ideas to concrete products

### Target for this site
Anyone who lands here: founders, solopreneurs, vibe coders, curious people. Not a hard-sell funnel. A "wow, this person is interesting and capable" experience that also makes clear what Jonathan does.

---

## Narrative Architecture (5 sections)

| Index | Label | Narrative beat | Hero 3D shape |
|---|---|---|---|
| 0 | The Dark | Empathy — visitor's confusion named | Pearl sphere (beautiful but opaque — you see something, can't read it) |
| 1 | The Weight | Overwhelm validated — ideas with no path | Monolith + floating cubes (heavy, chaotic) |
| 2 | The Clearing | Turn — Jonathan steps in as guide | Torus knot (organic complexity revealed as beautiful) |
| 3 | How I Help | Two concrete paths presented | Spike cones on platform (precise, crystalline) |
| 4 | Start Walking | Warm invitation, friction removed | Wireframe sphere (structure transparent — you can see through to what's beyond) |

Arc: **abstract → burdened → breakthrough → precise → open**

The visitor is the hero. Jonathan is the guide.

---

## Section Content Spec

### Section 0 — The Dark

**Headline (H1, light weight):**
> Building a digital product feels like standing in the dark.

**Body:**
> The path is invisible. Every direction looks the same.

**Three glass pain-point chips:**
- "No clear roadmap"
- "Too many tools"
- "Burning resources"

**Scroll hint:** `keep scrolling — I've been there too`

---

### Section 1 — The Weight (`id="about"`)

**Eyebrow:** "Sounds familiar?"

**Headline (H2):**
> You've got the idea, the budget. But the dark keeps winning.

**Body (3 paragraphs):**
> Developers' quotes make no sense? Agencies disappear after the kickoff call? You lose six months to decisions you didn't know you had to make?

> Most products don't fail because of a bad idea. They fail because there was nobody to help them navigate.

**Pull-quote glass card:**
> I speak business and tech natively — I can read the codebase, run the pipeline, and still write the roadmap.

**Micro-copy below:**
> I've shipped products for clients across 4 continents.
> And right now, I'm building one of my own.

**Notes:**
- Retain CoursesModal via "View certifications →" text link below pull-quote
- Remove skills grid
- Language row (Spanish · English · French · Italian) moves to Section 3

---

### Section 2 — The Clearing (`id="portfolio"`)

**Eyebrow:** "The path exists."

**Headline (H2, bold):**
> It doesn't have to be this way.
> I've walked this path before.

**Body:**
> For two decades I've taken digital product ideas from napkin to launch, and rescued products heading off a cliff.

**Two service cards (glass cards, clickable, open modal):**

Card A — **Build from Zero**
- Icon: Sprout (Lucide)
- Copy: "I've built SaaS tools and cultural heritage platforms. If you have an idea worth building, let's scope it."
- Modal evidence: Aere (archaeological sites + 3D modeling with OpenBuilding), API Roadmap project

Card B — **Fix What's Broken**
- Icon: Wrench (Lucide)
- Copy: "Your product exists but something's wrong. I audit the codebase directly, not just the backlog — then fix it."
- Modal evidence: Proxy Format project, Garsol Web Hosting

**CTA below cards:**
> [Ready to start walking? →] — scrolls to Section 3

---

### Section 3 — How I Help (`id="blog"`)

**Eyebrow:** "What working with me looks like"

**Headline (H2):**
> Two ways I can help you build.

**Path A — Build from Zero (3-step timeline):**
1. **Discovery** — "We define what you're building and who it's for."
2. **Scope & Roadmap** — "You get a prioritized backlog and a realistic timeline."
3. **Build & Ship** — "I manage the product, coordinate the team, and deliver v1."

**Path B — Fix What's Broken (3-step timeline):**
1. **Audit** — "I review your product, codebase health, team dynamics, and backlog."
2. **Diagnosis** — "You get a written report: what's broken, why, and how to fix it."
3. **Execution** — "I step in as interim PM or advisor and get the product back on track."

**CTA:** `[Book a free 30-min call →]` → `mailto:hello@jonathansolis.com`

**Languages row:** I work in: Spanish · English · French · Italian

**Mini blog row (2 cards, no images):**
> "Como crear un producto digital en 5 pasos" — 5 min
> "Validación de ideas por medio del mom test" — 6 min `/blog/validacion-de-ideas-por-medio-del-mom-test/`

---

### Section 4 — Start Walking (`id="contact"`)

**Eyebrow:** "The path is clear."

**Headline (H2):**
> Ready to build something?

**Body:**
> Send me a message and we'll figure out if I'm the right guide for your project.

**Primary CTA:** `hello@jonathansolis.com`

**Social icons row** (moved from Hero): GitHub, LinkedIn, Twitter, Facebook

---

## WorldCanvas.tsx — Full Rewrite Spec

### Direction
Volra-style. Dark, glossy abstract geometry. One hero shape per section dominates the viewport. The 3D world is atmosphere — the copy does the storytelling. No forest, no trees, no ground fog.

### Reference Images
| Name | Reference |
|---|---|
| S0 hero sphere | `@specs/0-Perl sphere.jpg` |
| S1 Monolith | `@specs/1-Monolith.jpg` |
| S2 Torus knot | `@specs/2-Torus.png` |
| S3 Spike cones | `@specs/3-Cones.jpg` |
| S4 Wireframe sphere | `@specs/4-Wireframe sphere.png` |
| Hero positioning + S path | `@specs/Hero positioning and user 'S' path.jpg` |

### Scene Foundation

```js
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.shadowMap.enabled = true
```

**Background:** `#080810` — near-black with blue-purple undertone

**Post-processing (EffectComposer — required for the premium look):**
- `UnrealBloomPass` — threshold `0.4`, strength lerps per section, radius `0.8`
- `BokehPass` — aperture `0.003`, maxblur `0.005`, focus lerps per section

Without these passes MeshStandardMaterial looks flat. They are non-negotiable.

### Materials

| Name | Use | metalness | roughness | color |
|---|---|---|---|---|
| Pearl | Hero sphere S0 + satellite spheres S4 | 0.1 | 0.05 | `#c8c8e0` |
| Dark gloss | Monolith S1, secondary shapes | 0.8 | 0.1 | `#2a2a4a` |
| Purple gloss | Torus knot S2 | 0.2 | 0.05 | `#8060d0` |
| Blue crystal | Spike cones S3 | 0.5 | 0.1 | `#6090d0` |
| Wireframe | Hero sphere S4 + outer ring | — | — | `#4040a0` |
| Ground | Subtle reflective plane S1 + S3 | 0.3 | 0.4 | `#1a1a2e` |

Load an RGBE environment map for sphere reflections — any free studio HDR.

### Per-Section Hero Objects + Satellites

All heroes rotate slowly around their **X axis** (`rotation.x += 0.002` per frame), **except** the torus knot which rotates around **Y axis** (`rotation.y += 0.003`).

**Satellite orbit formula (reusable for all sections):**
```js
// Per satellite at init: { radius, speed, tilt, phase, selfRotX, selfRotY, selfRotZ }
// selfRot values set randomly at init (range 0.003–0.014), never change

// Per frame — orbit:
satellite.position.x = hero.position.x + Math.cos(t * s.speed + s.phase) * s.radius
satellite.position.y = hero.position.y + Math.sin(t * s.speed + s.phase) * Math.sin(s.tilt) * s.radius
satellite.position.z = hero.position.z + Math.sin(t * s.speed + s.phase) * Math.cos(s.tilt) * s.radius

// Per frame — self-rotation (tumbles independently while orbiting):
satellite.rotation.x += s.selfRotX
satellite.rotation.y += s.selfRotY
satellite.rotation.z += s.selfRotZ
```

---

**Section 0 — The Dark: Pearl Sphere**
```js
// Hero — beautiful but opaque, you can see something but can't read it
SphereGeometry(2.5, 64, 64), pearl material (metalness 0.1, roughness 0.05, color #c8c8e0)
// RGBE env map for reflections. rotation.x += 0.002

// Satellites: 7 spheres total
// 1x SphereGeometry(0.5) — small, solid pearl
// 6x SphereGeometry(0.3–0.6 random) — medium, 3 solid + 3 at opacity 0.2
// Orbit: slow wide (speed 0.004–0.008), multiple tilted planes
// Each satellite also self-rotates (selfRotX/Y/Z set randomly at init)
```
No ground plane.

---

**Section 1 — The Weight: Monolith + Cubes**
```js
// Hero
BoxGeometry(1.2, 4.5, 1.2), dark gloss (metalness 0.8, roughness 0.1, color #2a2a4a)
CylinderGeometry(2.5, 2.5, 0.1, 8) // disc platform
// rotation.x += 0.002

// Satellites: 5x BoxGeometry(0.4–0.7 random), dark gloss
// Single diagonal orbital plane (tilt = Math.PI * 0.35)
// speed 0.006–0.015
// Each cube also self-rotates (tumbles while orbiting)
// Ground plane present
```

---

**Section 2 — The Clearing: Torus Knot**
```js
TorusKnotGeometry(1.4, 0.38, 256, 16)
// Purple gloss: metalness 0.2, roughness 0.05, color #8060d0
// Fills ~60% of viewport, intentionally extends beyond edges
// rotation.y += 0.003 (Y axis only — exception)

// Satellites: 4x SphereGeometry(0.12–0.18)
// Same purple tint, opacity 0.2 (almost transparent)
// Fast tight orbits: speed 0.02–0.035, radius 2–2.8
// Each satellite also self-rotates
```
No ground plane.

---

**Section 3 — How I Help: Spike Cones on Platform**
```js
3x ConeGeometry(0.22, 3.2, 8) // slight lean variation rotation.z ±0.1
CylinderGeometry(2, 2, 0.15, 8) // disc platform
// Blue crystal: metalness 0.5, roughness 0.1, color #6090d0
// rotation.x += 0.002

// Satellites: 3x TorusGeometry(0.3, 0.02, 8, 32) thin rings
// Flat orbital planes (tilt ≈ 0) spinning around the platform
// speed 0.01–0.02, radius 2.5–4
// Rings also self-rotate on their own axes
// Ground plane present
```

---

**Section 4 — Contact: Wireframe Sphere**
```js
// Hero — structure now transparent, you can see through to what's beyond
IcosahedronGeometry(3, 2), wireframe: true, color #4040a0
TorusGeometry(5.5, 0.02, 8, 64) // outer wireframe ring
// rotation.x += 0.002

// Satellites: 5x SphereGeometry(0.08–0.12), pearl material
// Very slow gentle drift: speed 0.003–0.006, radius 3.5–5, multiple planes
// Each satellite also self-rotates
```
No ground plane.

### Starfield Background (global — all sections)

Present across the entire scene, fixed in world space (does not move with camera parallax). Visible on all sections — more prominent on S0 and S4 where there's no ground or dense geometry to compete.

```js
// ~200 particles, created once, never moved
const starCount = 200
for (let i = 0; i < starCount; i++) {
  const size = Math.random() * 0.06 + 0.02  // 0.02–0.08 units
  const geo = new THREE.PlaneGeometry(size, size)
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: Math.random() * 0.5 + 0.15,  // 0.15–0.65
    depthWrite: false,
  })
  const star = new THREE.Mesh(geo, mat)
  star.position.set(
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 60,
  )
  star.rotation.z = Math.random() * Math.PI
  scene.add(star)
}
```

Stars are **not** added to the parallax offset or camera path — they stay fixed so they feel like a distant backdrop.

### Ground Plane
```js
PlaneGeometry(40, 40), rotation.x = -Math.PI/2, position.y = -3.2
MeshStandardMaterial({ color: #1a1a2e, roughness: 0.4, metalness: 0.3 })
// Present in S1 and S3 only — S0, S2, S4 float in darkness
// Opacity lerps 0→1 entering S1, 1→0 leaving S1, 0→1 entering S3, 1→0 leaving S3
```

### Lighting per Section

Four lights, all lerp color + intensity each frame (factor `0.04`):

| Light | Type | S0 | S1 | S2 | S3 | S4 |
|---|---|---|---|---|---|---|
| Key | DirectionalLight (-5,8,4) | `#2020ff`@0.8 | `#3030aa`@1.2 | `#ffffff`@3.0 | `#4080ff`@2.5 | `#ffcc88`@2.0 |
| Fill | PointLight (5,-3,2) | `#000010`@0.3 | `#100010`@0.8 | `#ff8040`@1.5 | `#002040`@0.8 | `#ff8020`@1.5 |
| Rim | PointLight (-4,4,-6) | `#000020`@0.2 | `#0000aa`@0.5 | `#4080ff`@2.0 | `#002080`@1.5 | `#8060ff`@1.0 |
| Ambient | AmbientLight | `#050510`@0.2 | `#0a0a20`@0.3 | `#1a1a3a`@0.6 | `#0a1020`@0.4 | `#1a1020`@0.5 |

Color temperature arc: **cold blue → dark heavy → warm breakthrough → cool precise → warm arrived**

### Bloom per Section

Lerp `bloomPass.strength` each frame (factor `0.03`):

| Section | Strength | Effect |
|---|---|---|
| 0 — The Dark | 0.3 | Pearl sphere glows softly, ambiguous |
| 1 — Weight | 0.6 | Heavy, low glow |
| 2 — Clearing | 2.0 | Full reveal, torus knot blazes |
| 3 — How I Help | 1.4 | Clear, purposeful |
| 4 — Contact | 1.0 | Wireframe glows at edges, open |

### Camera Path — S-Curve

The user's journey is not a straight line. The camera follows an S-shaped path through the scene, swinging left and right as it advances. Hero objects alternate sides so the camera always approaches from the opposite side.

**Implementation: use `CatmullRomCurve3`** — define waypoints, map scroll progress `t ∈ [0,1]` to `curve.getPoint(t)`.

```js
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-1.5, 0,   14),  // S0: camera left, hero right
  new THREE.Vector3( 3,   1,    5),  // S1: camera right, hero left
  new THREE.Vector3(-1.5, 0.5, -2),  // S2: camera left, hero right
  new THREE.Vector3( 2.5, 1.5, -9),  // S3: camera right, hero left
  new THREE.Vector3( 0,   0.5,-13),  // S4: center, settled
])

// Animation loop:
const pos = cameraPath.getPoint(scrollProgress) // scrollProgress: 0–1
camera.position.lerp(pos, 0.05)
```

**Hero object world positions (alternate X sides):**

| Section | X | Z | Side |
|---|---|---|---|
| S0 — The Dark | +2.5 | 0 | Right |
| S1 — Weight | -2.5 | -6 | Left |
| S2 — Clearing | +2.0 | -12 | Right |
| S3 — How I Help | -2.0 | -18 | Left |
| S4 — Contact | 0 | -24 | Center |

**LookAt targets:**
```js
const lookAtTargets = [
  new THREE.Vector3( 2.5, 0,    0),   // S0 — look right
  new THREE.Vector3(-2.5, 0.5, -6),   // S1 — look left
  new THREE.Vector3( 2.0, 0,  -12),   // S2 — look right
  new THREE.Vector3(-2.0, 0,  -18),   // S3 — look left
  new THREE.Vector3( 0,   0,  -24),   // S4 — center
]
// Lerp currentLookAt toward target each frame (factor 0.05)
```

**FOV per section** (lerp, factor 0.03):

| Section | FOV |
|---|---|
| 0 | 60 |
| 1 | 65 |
| 2 | 72 |
| 3 | 68 |
| 4 | 62 |

### Mouse / Touch Parallax

```js
const mouse = { x: 0, y: 0 }
const parallaxOffset = { x: 0, y: 0 }
const PARALLAX_STRENGTH = 0.25

window.addEventListener('mousemove', (e) => {
  mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
})

window.addEventListener('touchmove', (e) => {
  const t = e.touches[0]
  mouse.x =  (t.clientX / window.innerWidth  - 0.5) * 2
  mouse.y = -(t.clientY / window.innerHeight - 0.5) * 2
}, { passive: true })

// In animation loop — ADDITIVE to the CatmullRomCurve3 position:
parallaxOffset.x += (mouse.x * PARALLAX_STRENGTH - parallaxOffset.x) * 0.05
parallaxOffset.y += (mouse.y * PARALLAX_STRENGTH - parallaxOffset.y) * 0.05
camera.position.x += parallaxOffset.x
camera.position.y += parallaxOffset.y
// Do NOT apply to Z — that would fight the scroll mechanic
```

---

## Design System

### Color Tokens

| Token | Value | Use |
|---|---|---|
| Primary accent | `#c8a060` | Links, eyebrows, CTAs (warm amber — contrasts cool 3D world) |
| Secondary | `#8060d0` | Buttons, borders (purple — echoes torus knot) |
| Background | `#080810` | Body + scene |
| Warm accent | `#c8a96e` | Hover states, highlights |

### Glass Card
```css
.glass {
  background: rgba(15, 15, 30, 0.45);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(150, 120, 200, 0.15);
}
.glass-hover:hover {
  background: rgba(15, 15, 30, 0.65);
}
```

### DotNav Labels
```ts
const sections = ["The Dark", "The Weight", "The Clearing", "How I Help", "Contact"]
```

### Metadata
```
title: "Jonathan Solis"
description: "Digital product guide. I help founders and teams build their first product or rescue one that's lost its way. 20 years of experience across 4 continents."
OG: "I guide teams through the dark of building digital products."
```

---

## Implementation Sequence

1. **WorldCanvas.tsx rewrite** — abstract geometry replaces forest scene
2. **Color palette swap** — tailwind.config.ts, globals.css, layout.tsx
3. **Content rewrite** — all 5 section components with updated copy
4. **DOM anchor migration** — social icons → Contact, id="main" relocation
5. **Build + Selenium** — `npm run build`, `npx serve out`, run tests

### Files to modify
| File | Change |
|---|---|
| `components/WorldCanvas.tsx` | Complete rewrite |
| `components/sections/Hero.tsx` | Section 0 content |
| `components/sections/About.tsx` | Section 1 content + updated micro-copy |
| `components/sections/Portfolio.tsx` | Section 2 + service cards |
| `components/sections/Blog.tsx` | Section 3 process timelines |
| `components/sections/Contact.tsx` | Section 4 copy + social icons |
| `tailwind.config.ts` | Color tokens |
| `app/globals.css` | Glass card + body background |
| `app/layout.tsx` | BG class + metadata |
| `components/DotNav.tsx` | Labels + active dot color |

### Unchanged files
`lib/scrollContext.tsx`, `lib/animations.ts`, `components/Modal.tsx`,
`components/CoursesModal.tsx`, `components/SocialIcons.tsx`,
`app/page.tsx`, `next.config.mjs`, `.gitlab-ci.yml`

---

## Resolved Decisions

1. **Blog row S3** — "Como crear un producto digital en 5 pasos" + `/blog/validacion-de-ideas-por-medio-del-mom-test/`
2. **CoursesModal** — retain, linked as "View certifications →" below pull-quote in S1
3. **Service card modals** — Build from Zero: Aere + API Roadmap. Fix What's Broken: Proxy Format + Garsol
4. **Ambient audio** — wind/ambient with mute toggle

## Mobile Performance

- Detect mobile: `window.innerWidth < 768` or `navigator.maxTouchPoints > 0`
- Skip `BokehPass` entirely on mobile
- Halve geometry segment counts (`SphereGeometry(2.5, 32, 32)` not 64)
- Reduce satellite count by half
- Keep `UnrealBloomPass` but lower strength by 30%

---

## Prompt for Claude (WorldCanvas implementation)

> Rewrite `WorldCanvas.tsx`. Replace the forest scene entirely with abstract 3D geometry in the Volra style. Use `MeshStandardMaterial`/`MeshPhysicalMaterial` throughout — no Lambert. Add `EffectComposer` with `UnrealBloomPass` (strength lerps per section) and `BokehPass`. Background `#080810`. Load an RGBE environment map for sphere reflections.
>
> Each section has one hero object. S0: large pearl sphere + 7 orbiting satellite spheres (3 semi-transparent), slow wide orbit, multiple planes. S1: tall box monolith on disc platform + 5 cubes orbiting on a single diagonal plane. S2: large TorusKnotGeometry purple gloss fills ~60% viewport + 4 semi-transparent sphere satellites in fast tight orbit. S3: 3 spike cones on disc platform, blue crystal + 3 thin torus rings orbiting flat around the platform. S4: wireframe icosahedron + outer torus ring + 5 small pearl satellites in slow gentle orbit.
>
> All satellites both orbit their hero AND self-rotate on their own axes (random rotation speeds set at init, applied each frame after orbit position update).
>
> Hero objects are fixed in world space at Z intervals (0, -6, -12, -18, -24) with alternating X offsets (+2.5, -2.5, +2.0, -2.0, 0) for the S-curve path. Camera follows a CatmullRomCurve3 mapped to scroll progress. Four lights lerp color and intensity per section. Ground plane present only in S1 and S3. Global starfield of ~200 tiny square particles fixed in world space. Mouse/touch parallax adds ±0.25 units on X/Y additive to camera position. Ambient audio with mute toggle.
>
> Keep the existing scroll-based section progress system and lerp infrastructure. Only WorldCanvas and sections change.
