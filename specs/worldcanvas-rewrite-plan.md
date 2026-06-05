# Plan: Rewrite WorldCanvas.tsx — Volra-style abstract 3D scene

## Context

The site currently renders a forest/sphere-shell Three.js scene (`components/WorldCanvas.tsx`)
behind all content. The "Abstract to Concrete" rebrand (spec: `specs/jonathansolis-com (1).md`)
replaces this with a Volra-style dark, glossy abstract world: one hero shape per section, a
camera that sweeps an S-curve through the scene, post-processing bloom + bokeh, and per-section
lighting that arcs from cold blue → warm. The 3D world is atmosphere; copy does the storytelling.

This plan covers **only `components/WorldCanvas.tsx`** (a complete rewrite). Section content,
palette, layout, and DotNav are separate steps in the spec's implementation sequence and are
out of scope here. `lib/scrollContext.tsx`, `app/page.tsx`, and `next.config.mjs` stay unchanged.

**User decisions (confirmed):**
- Environment map: use three's built-in **`RoomEnvironment` + `PMREMGenerator`** (no external `.hdr`,
  no network fetch — robust on the static FTP host).
- Ambient audio: **wire up the toggle now**, pointing at `public/assets/audio/ambient.mp3`; user
  supplies the file later. Toggle stays inert until the file exists.

## Key constraints & how they're solved

1. **Discrete → continuous scroll progress.** `scrollContext` exposes only `activeSection ∈ {0..4}`.
   The camera path needs `t ∈ [0,1]`. Keep `scrollContext` untouched; derive progress internally:
   `targetProgress = activeSection / 4`, lerp a `scrollProgressRef` toward it each frame
   (`+= (target - cur) * 0.045`), feed into `cameraPath.getPoint(t)`. No React re-renders — all
   motion lives in the rAF loop (mirrors the existing `activeSectionRef` pattern).
2. **Imports** (three `^0.184`, no new deps — all passes ship inside three):
   ```ts
   import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
   import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
   import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
   import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
   import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
   import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
   ```
   Use `.js` suffix + `three/examples/jsm/...` (resolves under Next 14 webpack; SSR safe via the
   existing `dynamic(import, {ssr:false})` in `app/page.tsx`).
3. **Canvas alpha.** Switch from the current `alpha:true` to `alpha:false` +
   `scene.background = new THREE.Color(0x080810)`. BokehPass + bloom + OutputPass are unreliable
   over a transparent buffer (dark halos, bad CoC). Sections are fully transparent and float over
   the canvas, so a solid canvas bg matching the body color is visually identical and far more robust.
4. **Tone mapping / pass order.** Renderer sets `ACESFilmicToneMapping`, exposure `1.2`,
   `SRGBColorSpace`, `shadowMap.enabled`. Tone map is applied once by `OutputPass`, which MUST be
   last: `RenderPass → UnrealBloomPass → [BokehPass] → OutputPass`.
5. **Disposal.** Track all created geometries/materials in a `disposables[]`; on unmount dispose
   them + traverse scene + `envRT.dispose()` + each pass `.dispose()` + `composer.dispose()` +
   `renderer.dispose()` + `renderer.forceContextLoss()` (prevents WebGL context leaks on
   StrictMode / fast-refresh double-mount), and remove all listeners + pause audio.

## File to modify

`components/WorldCanvas.tsx` — complete rewrite. Component returns a fragment: the existing
`<canvas … pointer-events-none>` plus a `pointer-events-auto` mute button.

### Module-scope config (arrays indexed by section 0..4)
- `cameraPath = new THREE.CatmullRomCurve3([...])` — 5 waypoints (spec lines 360–366).
- `LOOK_AT[5]`, `FOVS = [60,65,72,68,62]`, `BLOOM = [0.3,0.6,2.0,1.4,1.0]`,
  `GROUND_OPACITY = [0,1,0,1,0]` (S1 & S3 only), `HERO_POS[5]` (Z 0,-6,-12,-18,-24;
  X +2.5,-2.5,+2.0,-2.0,0).
- `LIGHTS_CONFIG = { key, fill, rim, ambient }`, each a 5-entry `{color, intensity}` table
  (spec lines 332–337). Pre-build `THREE.Color` instances once to avoid per-frame allocation.
- Material specs: pearl, darkGloss, purpleGloss, blueCrystal, wireframe, ground (spec table
  lines 181–188) using `MeshStandardMaterial`/`MeshPhysicalMaterial` — no Lambert/Phong.
- `BOKEH_FOCUS[5]` ≈ camera-waypoint-to-hero distance per section (~14,12,12,11,11); tune in impl.

### Build order (main `useEffect`)
1. Detect `isMobile = innerWidth < 768 || maxTouchPoints > 0` and `prefersReducedMotion` (once).
2. Scene + `scene.background = #080810` (no fog).
3. Camera `PerspectiveCamera(FOVS[0], aspect, 0.1, 100)` at `cameraPath.getPoint(0)`.
4. Renderer (`alpha:false`, `antialias:!isMobile`, pixelRatio ≤2) + tone-map/colorspace/shadow settings.
5. Env: `pmrem.fromScene(new RoomEnvironment(), 0.04)` → `scene.environment`; dispose pmrem, keep `envRT`.
6. 4 lights from `LIGHTS_CONFIG[0]`; key light `castShadow`.
7. Shared materials (pushed to `disposables`).
8. 5 hero groups via per-section builders (below), placed at `HERO_POS[i]`; collect into `sections[]`
   and satellites into `allSatellites[]` (each with a back-ref to its hero world position).
9. Ground plane (`Plane(40,40)`, y=-3.2, `receiveShadow`, transparent, opacity lerped).
10. Starfield: 200 `PlaneGeometry` tiny squares (100 on mobile), `MeshBasicMaterial side:DoubleSide`,
    fixed in world space, never animated (spec lines 295–315).
11. Composer: RenderPass → UnrealBloomPass(threshold 0.4, radius 0.8, strength `BLOOM[0]*(isMobile?0.7:1)`)
    → BokehPass(aperture 0.003, maxblur 0.005) **only if !isMobile** → OutputPass.
12. Audio: `new Audio("/assets/audio/ambient.mp3")`, `loop`, `volume 0.35`, `muted=true`, not played
    yet; store in `audioRef`. `muted` is the one piece of React state (drives the icon).
13. Listeners: `resize` (camera/renderer/composer/bloom setSize), `mousemove`, `touchmove {passive}`.
14. `clock`; start `animate()`. Return the cleanup described above.

### Satellite factory (reused by all sections)
Per satellite at init: `{ radius, speed, tilt, phase, selfRotX, selfRotY, selfRotZ }`
with `selfRot*` randomized in `0.003–0.014` (set once, never change). Per frame: orbit using the
spec formula (lines 202–209) around the hero's world position, **then** apply self-rotation.

### Per-section heroes (spec lines 214–289)
- **S0 Pearl sphere** `Sphere(2.5,64/32)` + 7 satellites (1 small solid, 3 solid + 3 at opacity 0.2),
  slow wide orbit (0.004–0.008), random tilts. Spin `rotation.x += 0.002`.
- **S1 Monolith** `Box(1.2,4.5,1.2)` darkGloss + disc `Cylinder(2.5,2.5,0.1,8)`; 5 cubes
  `Box(0.4–0.7)`, single diagonal plane `tilt=PI*0.35`, speed 0.006–0.015. Spin x. Ground visible.
- **S2 Torus knot** `TorusKnot(1.4,0.38,256/128,16)` purpleGloss + 4 sphere satellites
  `Sphere(0.12–0.18)` opacity 0.2, fast tight orbit (0.02–0.035, r 2–2.8). Spin **y += 0.003** (the exception).
- **S3 Spike cones** 3×`Cone(0.22,3.2,8)` blueCrystal (`rotation.z ±0.1` lean) + disc
  `Cylinder(2,2,0.15,8)`; 3 thin torus rings `Torus(0.3,0.02,8,32)`, flat orbit (tilt≈0, 0.01–0.02,
  r 2.5–4). Spin x. Ground visible.
- **S4 Wireframe** `Icosahedron(3,2)` wireframe `#4040a0` + outer ring `Torus(5.5,0.02,8,64)`;
  5 pearl satellites `Sphere(0.08–0.12)`, very slow drift (0.003–0.006, r 3.5–5), random tilts. Spin x.

### animate() step order
rAF → elapsed → if reduced-motion render one static frame & return → compute `scrollProgress` →
hero spins → satellites (orbit then self-rotate) → lights lerp (0.04) → ground opacity lerp →
bloom strength lerp (0.03) → bokeh focus lerp (0.03, guarded) → `camera.position.lerp(curve.getPoint(t),0.05)`
→ parallax additive on X/Y only (`±0.25`, ease 0.05, never Z) → lookAt lerp (0.05) → FOV lerp (0.03)
→ `composer.render()`. Pre-allocate the `getPoint` target vector and color temporaries to avoid GC hitches.

### Mute toggle UI
Sibling `<button>` (`fixed bottom-5 left-5 z-20 pointer-events-auto`, `.glass`/`.glass-hover`,
lucide `Volume2`/`VolumeX`) — bottom-left to avoid the right-side `DotNav`. Click is the user gesture
that unmutes + `play()`s (autoplay-policy safe; starts muted).

### Mobile / accessibility fallbacks
`isMobile`: skip BokehPass, halve geometry segments + satellite counts, bloom ×0.7, pixelRatio ≤2.
`prefers-reduced-motion`: build the scene but render a single frozen frame at `t=0`.

## New asset (user-supplied)
`public/assets/audio/ambient.mp3` — small looping low-bitrate ambient track. Referenced by the
toggle; user drops it in later.

## Verification
1. `npm run dev` → load `http://localhost:3000`. Scroll/arrow/swipe through all 5 sections; confirm
   the correct hero appears each section, satellites orbit + tumble, camera sweeps the S-curve, and
   lighting/bloom shift cold→warm. Ground appears only on S1 & S3.
2. Mute toggle: bottom-left, click unmutes/plays (silent until the mp3 exists — no console autoplay error).
3. Resize the window + emulate a mobile viewport (DevTools): no stretch; bokeh is dropped on mobile;
   no errors.
4. Enable "reduce motion" (OS or DevTools rendering emulation): scene renders a static frame, no orbiting.
5. `npm run build` → static export succeeds (no SSR/window errors; three addon imports resolve).
6. `npx serve out` → spot-check the production build renders the canvas and runs.
7. Watch the console across several mount/unmount cycles (fast-refresh): no "too many WebGL contexts"
   warning (confirms disposal + `forceContextLoss`).
