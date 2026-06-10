"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useScroll } from "@/lib/scrollContext";

// ─── Module-scope config ────────────────────────────────────────────────────

const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 6.5, 0,    7),   // S0: camera far left, hero right  (heroZ=0,  cam ~7 ahead)
  new THREE.Vector3( 6.5, 1,   -11),  // S1: camera far right, hero left  (heroZ=-18, cam ~7 ahead)
  new THREE.Vector3(-5.5, 0.5,-29),   // S2: camera far left, hero right  (heroZ=-36, cam ~7 ahead)
  new THREE.Vector3( 6.0, 1.5,-47),   // S3: camera far right, hero left  (heroZ=-54, cam ~7 ahead)
  new THREE.Vector3( 0,   0.5,-65),   // S4: center, settled          (heroZ=-72, cam ~7 ahead)
]);

// LOOK_AT desktop: offset away from the hero to push it to the correct screen side.
// Hero RIGHT  → look LEFT  (negative X, away from hero)
// Hero LEFT   → look RIGHT (positive X, away from hero)
// Mobile: these get replaced with hero-centered look-ats (no horizontal offset).
const LOOK_AT: THREE.Vector3[] = [
  new THREE.Vector3(-7.0, 0,    0),   // S0: look far left  → hero appears RIGHT
  new THREE.Vector3( 7.5, 0.5,-18),   // S1: look far right → hero appears LEFT
  new THREE.Vector3(-6.5, 0,  -36),   // S2: look far left  → hero appears RIGHT
  new THREE.Vector3( 7.0, 0,  -54),   // S3: look far right → hero appears LEFT
  new THREE.Vector3( 0,   0,  -72),   // S4: centered
];

// Mobile look-ats: keep heroes centered on small screens
const LOOK_AT_MOBILE: THREE.Vector3[] = [
  new THREE.Vector3( 2.5, 0,    0),
  new THREE.Vector3(-2.5, 0.5,-18),
  new THREE.Vector3( 2.0, 0,  -36),
  new THREE.Vector3(-2.0, 0,  -54),
  new THREE.Vector3( 0,   0,  -72),
];

const FOVS   = [72, 30, 40, 30, 68];
const BLOOM  = [0.3, 0.6, 0.2, 0.1, 1.0];
const GROUND_OPACITY = [0, 1, 0, 1, 0];

// Hero world positions: alternating X sides, Z at intervals of -18 (3× original)
const HERO_POS = [
  new THREE.Vector3( 2.5, 0,    0),   // S0
  new THREE.Vector3(-2.5, 0,  -18),   // S1
  new THREE.Vector3( 7.0, 0,  -36),   // S2
  new THREE.Vector3(-2.5, 0,  -54),   // S3
  new THREE.Vector3( 0,   0,  -72),   // S4
];

// Focus distances tuned per section (camera-to-hero approximate distance ~7 each)
const BOKEH_FOCUS = [7, 7, 7, 7, 7];

// Lights config: [S0, S1, S2, S3, S4] — {color(hex), intensity}
interface LightConfig { color: number; intensity: number }
const LIGHTS_CONFIG: {
  key:  LightConfig[];
  fill: LightConfig[];
  rim:  LightConfig[];
  amb:  LightConfig[];
} = {
  key: [
    { color: 0x000000, intensity: 0.8 },
    { color: 0x3030aa, intensity: 1.2 },
    { color: 0xffffff, intensity: 3.0 },
    { color: 0x4080ff, intensity: 2.5 },
    { color: 0xffcc88, intensity: 2.0 },
  ],
  fill: [
    { color: 0x000010, intensity: 0.3 },
    { color: 0x100010, intensity: 0.8 },
    { color: 0xff8040, intensity: 1.5 },
    { color: 0x002040, intensity: 0.8 },
    { color: 0xff8020, intensity: 1.5 },
  ],
  rim: [
    { color: 0x000020, intensity: 0.2 },
    { color: 0x0000aa, intensity: 0.5 },
    { color: 0x4080ff, intensity: 2.0 },
    { color: 0x002080, intensity: 1.5 },
    { color: 0x8060ff, intensity: 1.0 },
  ],
  amb: [
    { color: 0x050510, intensity: 0.2 },
    { color: 0x0a0a20, intensity: 0.3 },
    { color: 0x1a1a3a, intensity: 0.6 },
    { color: 0x0a1020, intensity: 0.4 },
    { color: 0x1a1020, intensity: 0.5 },
  ],
};

// ─── Satellite type ──────────────────────────────────────────────────────────
interface Satellite {
  mesh: THREE.Mesh;
  radius: number;
  speed:  number;
  tilt:   number;
  phase:  number;
  selfRotX: number;
  selfRotY: number;
  selfRotZ: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randSelfRot() {
  return rand(0.003, 0.014);
}

// Patches a material so its surface color blends vertically (local Y) between
// `bottom` and `top`. Replaces only the albedo via onBeforeCompile — all PBR
// shading, metalness/roughness and env reflections still apply on top.
function applyVerticalGradient<T extends THREE.Material>(
  material: T,
  bottom: number,
  top: number,
  yMin: number,
  yMax: number,
): T {
  const cBottom = new THREE.Color(bottom);
  const cTop    = new THREE.Color(top);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGradBottom = { value: cBottom };
    shader.uniforms.uGradTop    = { value: cTop };
    shader.uniforms.uGradMinY   = { value: yMin };
    shader.uniforms.uGradMaxY   = { value: yMax };

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vGradY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGradY = position.y;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying float vGradY;\nuniform vec3 uGradBottom;\nuniform vec3 uGradTop;\nuniform float uGradMinY;\nuniform float uGradMaxY;"
      )
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nfloat _g = clamp((vGradY - uGradMinY) / (uGradMaxY - uGradMinY), 0.0, 1.0);\ndiffuseColor.rgb = mix(uGradBottom, uGradTop, _g);"
      );
  };
  return material;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorldCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useScroll();
  const activeSectionRef  = useRef(activeSection);
  const frameRef          = useRef<number>(0);

  // Keep activeSectionRef in sync without triggering re-renders in the rAF loop
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // ── Main effect: build scene + rAF loop ─────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ── Disposables tracker ──────────────────────────────────────────────
    const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];
    function trackGeo(g: THREE.BufferGeometry) { disposables.push(g); return g; }
    function trackMat(m: THREE.Material)        { disposables.push(m); return m; }

    // ── Scene ────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080810);

    // ── Camera ───────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      FOVS[0],
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    const startPos = cameraPath.getPoint(0);
    camera.position.copy(startPos);

    // ── Renderer ─────────────────────────────────────────────────────────
    // Renderer owns its own canvas (a fresh one each mount). Binding to a reused
    // <canvas> ref breaks under React StrictMode: cleanup's forceContextLoss()
    // permanently kills the context on that element, so the remount's getContext()
    // returns null → "Cannot read properties of null (reading 'precision')".
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = "block w-full h-full";
    container.appendChild(renderer.domElement);
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;  // reduced from 1.2 — ACES at 1.2 was blowing out the pearl sphere
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled  = true;

    // ── Environment map (RoomEnvironment — no external fetch) ────────────
    const pmrem  = new THREE.PMREMGenerator(renderer);
    const envRT  = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose(); // pmrem disposed; keep envRT for cleanup

    // ── Materials ────────────────────────────────────────────────────────
    const matPearl = trackMat(new THREE.MeshStandardMaterial({
      color: 0x72acef, metalness: 0.15, roughness: 0.1,
      envMapIntensity: 0.1,   // low env intensity — RoomEnvironment + ACES was blowing out the sphere
    }));
    const matDarkGloss = trackMat(new THREE.MeshStandardMaterial({
      color: 0x2a2a4a, metalness: 0.8, roughness: 0.1,
      envMapIntensity: 1.0,
    }));
    const matBlueCrystal = trackMat(new THREE.MeshStandardMaterial({
      color: 0x6090d0, metalness: 0.5, roughness: 0.1,
      envMapIntensity: 1.0,
    }));
    const matGround = trackMat(new THREE.MeshStandardMaterial({
      color: 0x1a1a2e, roughness: 0.4, metalness: 0.3,
      transparent: true, opacity: 0,
    }));
    const matCrystal = trackMat(new THREE.MeshStandardMaterial({
      color: 0xffffff, metalness: 0.5, roughness: 0.1,
      transparent: true, opacity: 0.03,
    }));

    // ── Hero gradient materials — vertical two-tone (top lighter), per hero ──
    // yMin/yMax = the hero geometry's local vertical bounds. PBR params mirror
    // each hero's original material so only the albedo gains the gradient.
    const matHeroS0 = trackMat(applyVerticalGradient(   // pearl sphere (r=2.5)
      new THREE.MeshStandardMaterial({ metalness: 0.15, roughness: 0.1, envMapIntensity: 0.1 }),
      0x000000, 0x000000, -2.5, 2.5));
    const matHeroS1 = trackMat(applyVerticalGradient(   // monolith box (h=4.5)
      new THREE.MeshStandardMaterial({ metalness: 0.8, roughness: 0.1, envMapIntensity: 1.0 }),
      0x141428, 0x4a4a7a, -2.25, 2.25));
    const matHeroS2 = trackMat(applyVerticalGradient(   // torus knot (~±1.8)
      new THREE.MeshStandardMaterial({ metalness: 0.2, roughness: 0.05, envMapIntensity: 1.0 }),
      0x5a40a0, 0xa585e8, -1.8, 1.8));
    const matHeroS3 = trackMat(applyVerticalGradient(   // spike cones (h=3.2)
      new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.1, envMapIntensity: 1.0 }),
      0x3f6aa8, 0x8fb8f0, -1.6, 1.6));
    const matHeroS4 = trackMat(applyVerticalGradient(   // wireframe icosahedron (r=3)
      new THREE.MeshBasicMaterial({ wireframe: true }),
      0x2a2a70, 0x9090f0, -3, 3));

    // ── Lights ───────────────────────────────────────────────────────────
    const keyLight  = new THREE.DirectionalLight(LIGHTS_CONFIG.key[0].color,  LIGHTS_CONFIG.key[0].intensity);
    keyLight.position.set(-5, 8, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(LIGHTS_CONFIG.fill[0].color, LIGHTS_CONFIG.fill[0].intensity);
    fillLight.position.set(5, -3, 2);
    scene.add(fillLight);

    const rimLight  = new THREE.PointLight(LIGHTS_CONFIG.rim[0].color,  LIGHTS_CONFIG.rim[0].intensity);
    rimLight.position.set(-4, 4, -6);
    scene.add(rimLight);

    const ambLight  = new THREE.AmbientLight(LIGHTS_CONFIG.amb[0].color, LIGHTS_CONFIG.amb[0].intensity);
    scene.add(ambLight);

    // Pre-allocated color temporaries for lerp (avoid per-frame allocation)
    const tmpKeyColor  = new THREE.Color(LIGHTS_CONFIG.key[0].color);
    const tmpFillColor = new THREE.Color(LIGHTS_CONFIG.fill[0].color);
    const tmpRimColor  = new THREE.Color(LIGHTS_CONFIG.rim[0].color);
    const tmpAmbColor  = new THREE.Color(LIGHTS_CONFIG.amb[0].color);

    // ── Satellite factory ─────────────────────────────────────────────────
    type SatFactory = {
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      radius: number;
      speed:  number;
      tilt:   number;
      phase:  number;
    };
    function makeSatellite(f: SatFactory): Satellite {
      const mesh = new THREE.Mesh(f.geometry, f.material);
      mesh.castShadow = true;
      scene.add(mesh);
      return {
        mesh,
        radius: f.radius,
        speed:  f.speed,
        tilt:   f.tilt,
        phase:  f.phase,
        selfRotX: randSelfRot(),
        selfRotY: randSelfRot(),
        selfRotZ: randSelfRot(),
      };
    }

    // ── Per-section heroes ───────────────────────────────────────────────
    const segments  = isMobile ? 32 : 64;     // halved on mobile
    const satDiv    = isMobile ? 2 : 1;        // satellite count divisor on mobile

    type HeroEntry = {
      group:      THREE.Group;
      hero:       THREE.Mesh;
      spinAxis:   "x" | "y";
      spinSpeed:  number;
      satellites: Satellite[];
    };
    const sections: HeroEntry[] = [];

    // S0 — Pearl Sphere
    {
      const group = new THREE.Group();
      group.position.copy(HERO_POS[0]);
      scene.add(group);

      const heroGeo = trackGeo(new THREE.SphereGeometry(2.5, segments, segments));
      const hero    = new THREE.Mesh(heroGeo, matHeroS0);
      hero.castShadow = true;
      group.add(hero);

      const satellites: Satellite[] = [];
      const totalSats = Math.max(1, Math.ceil(7 / satDiv));
      for (let i = 0; i < totalSats; i++) {
        const r    = rand(0.3, 0.6);
        const geo  = trackGeo(new THREE.SphereGeometry(r, 16, 16));
        let mat: THREE.Material;
        if (i === 0) {
          mat = matPearl; // first one solid
        } else {
          mat = trackMat(new THREE.MeshStandardMaterial({
            color: 0xe3aee7,
            metalness: 0.1, roughness: 0.05,
            transparent: true,
            opacity: i >= Math.ceil(totalSats * 0.5) ? 0.2 : 1.0,
            envMapIntensity: 1.0,
          }));
        }
        satellites.push(makeSatellite({
          geometry: geo, material: mat,
          radius: rand(3.5, 5.5),
          speed:  rand(0.004, 0.008),
          tilt:   rand(0, Math.PI),
          phase:  rand(0, Math.PI * 2),
        }));
      }

      sections.push({ group, hero, spinAxis: "x", spinSpeed: 0.002, satellites });
    }

    // S1 — Monolith + Cubes
    {
      const group = new THREE.Group();
      group.position.copy(HERO_POS[1]);
      scene.add(group);

      const heroGeo  = trackGeo(new THREE.BoxGeometry(1.2, 4.5, 1.2));
      const hero     = new THREE.Mesh(heroGeo, matHeroS1);
      hero.castShadow = true;
      group.add(hero);

      const discGeo  = trackGeo(new THREE.CylinderGeometry(2.5, 2.5, 0.1, 8));
      const disc     = new THREE.Mesh(discGeo, matDarkGloss);
      // Drop the disc so its top face meets the box
      // bases (box height 4.5, centered → base at y = -2.25), so the box sit on it.
      disc.position.y = -2.25;
      disc.castShadow = true;
      group.add(disc);

      const satellites: Satellite[] = [];
      const totalSats = Math.max(1, Math.ceil(5 / satDiv));
      for (let i = 0; i < totalSats; i++) {
        const s = rand(0.4, 0.7);
        const geo = trackGeo(new THREE.BoxGeometry(s, s, s));
        satellites.push(makeSatellite({
          geometry: geo, material: matDarkGloss,
          radius: rand(3.0, 5.0),
          speed:  rand(0.006, 0.015),
          tilt:   Math.PI * 0.35,
          phase:  rand(0, Math.PI * 2),
        }));
      }

      sections.push({ group, hero, spinAxis: "y", spinSpeed: 0.002, satellites });
    }

    // S2 — Torus Knot
    {
      const group = new THREE.Group();
      group.position.copy(HERO_POS[2]);
      scene.add(group);

      const segTube = isMobile ? 128 : 256;
      const heroGeo = trackGeo(new THREE.TorusKnotGeometry(1.4, 0.38, segTube, 16));
      const hero    = new THREE.Mesh(heroGeo, matHeroS2);
      hero.castShadow = true;
      group.add(hero);

      const satellites: Satellite[] = [];
      const totalSats = Math.max(1, Math.ceil(4 / satDiv));
      for (let i = 0; i < totalSats; i++) {
        const r   = rand(0.12, 0.18);
        const geo = trackGeo(new THREE.SphereGeometry(r, 16, 16));
        const mat = trackMat(new THREE.MeshStandardMaterial({
          color: 0x8060d0,
          metalness: 0.2, roughness: 0.05,
          transparent: true, opacity: 0.2,
          envMapIntensity: 1.0,
        }));
        satellites.push(makeSatellite({
          geometry: geo, material: mat,
          radius: rand(2.0, 2.8),
          speed:  rand(0.02, 0.035),
          tilt:   rand(0, Math.PI),
          phase:  rand(0, Math.PI * 2),
        }));
      }

      sections.push({ group, hero, spinAxis: "y", spinSpeed: 0.003, satellites });
    }

    // S3 — Spike Cones + Platform
    {
      const group = new THREE.Group();
      group.position.copy(HERO_POS[3]);
      scene.add(group);

      // Three cones with slight lean
      const leans = [-0.1, 0, 0.1];
      const offsets = [-1.2, 0, 1.2];
      let heroMesh: THREE.Mesh | null = null;
      for (let i = 0; i < 3; i++) {
        const coneGeo = trackGeo(new THREE.ConeGeometry(0.5, 3.2, 8));
        const cone    = new THREE.Mesh(coneGeo, matHeroS3);
        cone.rotation.z  = leans[i];
        cone.position.x  = offsets[i];
        cone.castShadow  = true;
        group.add(cone);
        if (i === 1) heroMesh = cone; // center cone is the reference "hero"
      }

      const discGeo = trackGeo(new THREE.CylinderGeometry(2, 2, 0.15, 8));
      const disc    = new THREE.Mesh(discGeo, matBlueCrystal);
      // Drop the disc so its top face (y + half-height 0.075) meets the cone
      // bases (cone height 3.2, centered → base at y = -1.6), so the cones sit on it.
      disc.position.y = -1.675;
      disc.castShadow = true;
      group.add(disc);

      const satellites: Satellite[] = [];
      const totalSats = Math.max(1, Math.ceil(3 / satDiv));
      for (let i = 0; i < totalSats; i++) {
        const geo = trackGeo(new THREE.TorusGeometry(0.3, 0.1, 8, 32));
        satellites.push(makeSatellite({
          geometry: geo, material: matCrystal,
          radius: rand(2.5, 4.0),
          speed:  rand(0.01, 0.02),
          tilt:   rand(0, 0.2),   // nearly flat
          phase:  rand(0, Math.PI * 2),
        }));
      }

      sections.push({
        group,
        hero: heroMesh ?? new THREE.Mesh(), // fallback (never null in practice)
        spinAxis: "x",
        spinSpeed: 0.002,
        satellites,
      });
    }

    // S4 — Wireframe Icosahedron
    {
      const group = new THREE.Group();
      group.position.copy(HERO_POS[4]);
      scene.add(group);

      const heroGeo = trackGeo(new THREE.IcosahedronGeometry(3, 2));
      const hero    = new THREE.Mesh(heroGeo, matHeroS4);
      group.add(hero);

      const ringGeo = trackGeo(new THREE.TorusGeometry(4.5, 0.05, 8, 64));
      const ring    = new THREE.Mesh(ringGeo, matCrystal);
      group.add(ring);

      const satellites: Satellite[] = [];
      const totalSats = Math.max(1, Math.ceil(5 / satDiv));
      for (let i = 0; i < totalSats; i++) {
        const r   = rand(0.08, 0.12);
        const geo = trackGeo(new THREE.SphereGeometry(r, 16, 16));
        satellites.push(makeSatellite({
          geometry: geo, material: matBlueCrystal,
          radius: rand(3.5, 5.0),
          speed:  rand(0.003, 0.006),
          tilt:   rand(0, Math.PI),
          phase:  rand(0, Math.PI * 2),
        }));
      }

      sections.push({ group, hero, spinAxis: "x", spinSpeed: 0.002, satellites });
    }

    // ── Ground plane ─────────────────────────────────────────────────────
    const groundGeo = trackGeo(new THREE.PlaneGeometry(40, 40));
    const ground    = new THREE.Mesh(groundGeo, matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Starfield ────────────────────────────────────────────────────────
    // Z spans the full camera journey (S0 ~Z+7 → S4 ~Z-65, heroes 0 → -72),
    // extended past S4 so stars stay in front of the camera in every section.
    const starCount = isMobile ? 250 : 450;
    for (let i = 0; i < starCount; i++) {
      const size = rand(0.04, 0.12);
      const geo  = trackGeo(new THREE.PlaneGeometry(size, size));
      const mat  = trackMat(new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: rand(0.35, 0.9),
        depthWrite: false,
        side: THREE.DoubleSide,
      }));
      const star = new THREE.Mesh(geo, mat);
      star.position.set(
        rand(-38, 38),
        rand(-22, 22),
        rand(-95, 25)
      );
      star.rotation.z = Math.random() * Math.PI;
      scene.add(star);
    }

    // ── Post-processing ───────────────────────────────────────────────────
    const bloomStrength0 = BLOOM[0] * (isMobile ? 0.7 : 1);
    const composer  = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomStrength0,
      0.8,   // radius
      0.6    // threshold raised from 0.4 — prevents pearl sphere body from triggering bloom
    );
    composer.addPass(bloomPass);

    let bokehPass: BokehPass | null = null;
    if (!isMobile) {
      bokehPass = new BokehPass(scene, camera, {
        focus:   BOKEH_FOCUS[0],
        aperture: 0.003,
        maxblur:  0.005,
      });
      composer.addPass(bokehPass);
    }

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // ── Scroll progress (internal continuous lerp) ────────────────────────
    const scrollProgressRef = { current: 0 };

    // Select look-at table: mobile keeps heroes centered, desktop offsets them
    const lookAtTable = isMobile ? LOOK_AT_MOBILE : LOOK_AT;

    // Pre-allocated vectors to avoid per-frame GC
    const curveTarget   = new THREE.Vector3();
    const currentLookAt = lookAtTable[0].clone();
    const targetLookAt  = new THREE.Vector3();
    const lookAtMatrix  = new THREE.Matrix4();

    // Parallax state
    const mouse          = { x: 0, y: 0 };
    const parallaxOffset = { x: 0, y: 0 };

    // ── Event listeners ───────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mouse.x =  (t.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(t.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("resize",     onResize);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("touchmove",  onTouchMove, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────
    let reducedMotionRendered = false;
    let frame = 0;  // per-frame counter for satellite orbits (consistent with hero spin +=)

    const PARALLAX_STRENGTH = 0.25;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      frame++;

      // Reduced-motion: render single static frame then stop updating
      if (prefersReducedMotion) {
        if (!reducedMotionRendered) {
          composer.render();
          reducedMotionRendered = true;
        }
        return;
      }

      // ── Continuous scroll progress ──────────────────────────────────
      const idx    = activeSectionRef.current;
      const target = idx / 4;
      scrollProgressRef.current += (target - scrollProgressRef.current) * 0.045;
      const t = Math.max(0, Math.min(1, scrollProgressRef.current));

      // ── Hero spins ──────────────────────────────────────────────────
      sections.forEach((s) => {
        if (s.spinAxis === "y") {
          s.hero.rotation.y += s.spinSpeed;
        } else {
          s.hero.rotation.x += s.spinSpeed;
        }
      });

      // ── Satellites ──────────────────────────────────────────────────
      // Use `frame` (per-frame counter) not `elapsed` (seconds) so that
      // speed values 0.004–0.035 produce visible orbital motion each frame,
      // matching the spec's intent and the per-frame hero spin increments.
      sections.forEach((s) => {
        const heroWorld = HERO_POS[sections.indexOf(s)];
        s.satellites.forEach((sat) => {
          sat.mesh.position.x = heroWorld.x + Math.cos(frame * sat.speed + sat.phase) * sat.radius;
          sat.mesh.position.y = heroWorld.y + Math.sin(frame * sat.speed + sat.phase) * Math.sin(sat.tilt) * sat.radius;
          sat.mesh.position.z = heroWorld.z + Math.sin(frame * sat.speed + sat.phase) * Math.cos(sat.tilt) * sat.radius;
          sat.mesh.rotation.x += sat.selfRotX;
          sat.mesh.rotation.y += sat.selfRotY;
          sat.mesh.rotation.z += sat.selfRotZ;
        });
      });

      // ── Lights lerp ─────────────────────────────────────────────────
      const lf = 0.04;
      tmpKeyColor.set(LIGHTS_CONFIG.key[idx].color);
      keyLight.color.lerp(tmpKeyColor, lf);
      keyLight.intensity += (LIGHTS_CONFIG.key[idx].intensity - keyLight.intensity) * lf;

      tmpFillColor.set(LIGHTS_CONFIG.fill[idx].color);
      fillLight.color.lerp(tmpFillColor, lf);
      fillLight.intensity += (LIGHTS_CONFIG.fill[idx].intensity - fillLight.intensity) * lf;

      tmpRimColor.set(LIGHTS_CONFIG.rim[idx].color);
      rimLight.color.lerp(tmpRimColor, lf);
      rimLight.intensity += (LIGHTS_CONFIG.rim[idx].intensity - rimLight.intensity) * lf;

      tmpAmbColor.set(LIGHTS_CONFIG.amb[idx].color);
      ambLight.color.lerp(tmpAmbColor, lf);
      ambLight.intensity += (LIGHTS_CONFIG.amb[idx].intensity - ambLight.intensity) * lf;

      // ── Ground opacity lerp ─────────────────────────────────────────
      const groundTarget = GROUND_OPACITY[idx];
      (matGround as THREE.MeshStandardMaterial).opacity +=
        (groundTarget - (matGround as THREE.MeshStandardMaterial).opacity) * 0.04;

      // ── Bloom lerp ──────────────────────────────────────────────────
      const bloomTarget = BLOOM[idx] * (isMobile ? 0.7 : 1);
      bloomPass.strength += (bloomTarget - bloomPass.strength) * 0.03;

      // ── Bokeh focus lerp ────────────────────────────────────────────
      if (bokehPass) {
        const focusTarget = BOKEH_FOCUS[idx];
        // uniforms is typed as `object` in @types/three — cast for index access
        const bu = bokehPass.uniforms as Record<string, { value: number }>;
        bu["focus"].value += (focusTarget - bu["focus"].value) * 0.03;
      }

      // ── Camera path ─────────────────────────────────────────────────
      cameraPath.getPoint(t, curveTarget);
      camera.position.lerp(curveTarget, 0.05);

      // ── Mouse/touch parallax (additive to X/Y, never Z) ─────────────
      parallaxOffset.x += (mouse.x * PARALLAX_STRENGTH - parallaxOffset.x) * 0.05;
      parallaxOffset.y += (mouse.y * PARALLAX_STRENGTH - parallaxOffset.y) * 0.05;
      camera.position.x += parallaxOffset.x;
      camera.position.y += parallaxOffset.y;

      // ── LookAt lerp ─────────────────────────────────────────────────
      targetLookAt.copy(lookAtTable[idx]);
      currentLookAt.lerp(targetLookAt, 0.05);
      // Apply lookAt without permanently modifying camera rotation
      // (we use a matrix approach so we can lerp back out)
      lookAtMatrix.lookAt(camera.position, currentLookAt, camera.up);
      camera.quaternion.setFromRotationMatrix(lookAtMatrix);

      // ── FOV lerp ────────────────────────────────────────────────────
      camera.fov += (FOVS[idx] - camera.fov) * 0.03;
      camera.updateProjectionMatrix();

      composer.render();
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);

      // Dispose tracked geometries + materials
      disposables.forEach((d) => d.dispose());

      // Traverse scene and dispose anything we may have missed
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            (mesh.material as THREE.Material)?.dispose();
          }
        }
      });

      // Env map
      envRT.dispose();

      // Post-processing passes
      renderPass.dispose();
      bloomPass.dispose();
      bokehPass?.dispose();
      outputPass.dispose();
      composer.dispose();

      // Renderer last
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <MuteButton />
    </>
  );
}

// ─── MuteButton — separate component so it owns its own audio ref ──────────
function MuteButton() {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/assets/audio/ambient.mp3");
    audio.loop   = true;
    audio.volume = 0.35;
    audio.muted  = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
      className="fixed bottom-5 left-5 z-20 pointer-events-auto glass glass-hover rounded-full p-2 text-white/70 hover:text-white transition-colors"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
