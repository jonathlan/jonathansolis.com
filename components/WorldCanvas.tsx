"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScroll } from "@/lib/scrollContext";

// Camera dives inside the sphere (r=7) then back out
const CAMERA_POSITIONS = [
  new THREE.Vector3(0, 0, 11),        // Hero    — outside sphere, full view
  new THREE.Vector3(2.5, 0.8, 4),     // About   — just inside sphere
  new THREE.Vector3(-1.2, -0.7, 0.3), // Portfolio — near center
  new THREE.Vector3(1.0, 2.0, -2.5),  // Blog    — past center, floating up
  new THREE.Vector3(0.3, 0.5, 8),     // Contact — pulling back out
];

// FOV widens as camera enters the sphere, giving an immersive depth feel
const CAMERA_FOVS = [60, 66, 80, 73, 62];

const PRIMARY = 0x2fa3ee;
const WHITE = 0xffffff;
const PURPLE = 0x8844cc;

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeSection } = useScroll();
  const activeSectionRef = useRef(activeSection);
  const targetPositionRef = useRef(CAMERA_POSITIONS[0].clone());
  const targetFovRef = useRef(CAMERA_FOVS[0]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    targetPositionRef.current = CAMERA_POSITIONS[activeSection].clone();
    targetFovRef.current = CAMERA_FOVS[activeSection];
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    // Exponential fog — deepens depth as camera moves through scene
    scene.fog = new THREE.FogExp2(0x020b18, 0.07);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOVS[0],
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    camera.position.copy(CAMERA_POSITIONS[0]);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Lights
    scene.add(new THREE.AmbientLight(WHITE, 0.5));

    const light1 = new THREE.PointLight(PRIMARY, 4, 35);
    light1.position.set(4, 4, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(WHITE, 2, 35);
    light2.position.set(-5, -3, -5);
    scene.add(light2);

    // Accent purple light — visible when deep inside sphere
    const light3 = new THREE.PointLight(PURPLE, 1.5, 20);
    light3.position.set(0, -3, 0);
    scene.add(light3);

    // Outer wireframe sphere — the "world shell"
    const shellGeo = new THREE.SphereGeometry(7, 32, 20);
    const shellMat = new THREE.MeshBasicMaterial({
      color: PRIMARY,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // Floating inner objects
    type FloatingObj = {
      mesh: THREE.Mesh;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatOffset: number;
      initialY: number;
    };
    const objects: FloatingObj[] = [];

    const placeRandom = (mesh: THREE.Mesh, radius: number) => {
      const r = 0.4 + Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    };

    // 50 cubes
    for (let i = 0; i < 50; i++) {
      const size = 0.12 + Math.random() * 0.22;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshPhongMaterial({
        color: Math.random() > 0.5 ? PRIMARY : WHITE,
        transparent: true,
        opacity: 0.45 + Math.random() * 0.45,
        shininess: 90,
      });
      const mesh = new THREE.Mesh(geo, mat);
      placeRandom(mesh, 5.8);
      scene.add(mesh);
      objects.push({
        mesh,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.022,
          (Math.random() - 0.5) * 0.022,
          (Math.random() - 0.5) * 0.022
        ),
        floatSpeed: 0.25 + Math.random() * 0.55,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      });
    }

    // 25 icosahedrons — faceted gems
    for (let i = 0; i < 25; i++) {
      const radius = 0.1 + Math.random() * 0.18;
      const geo = new THREE.IcosahedronGeometry(radius, 0);
      const mat = new THREE.MeshPhongMaterial({
        color: PRIMARY,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.45,
        shininess: 140,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      placeRandom(mesh, 5.8);
      scene.add(mesh);
      objects.push({
        mesh,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.018,
          (Math.random() - 0.5) * 0.028,
          (Math.random() - 0.5) * 0.012
        ),
        floatSpeed: 0.18 + Math.random() * 0.42,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      });
    }

    // 25 glass bubbles
    for (let i = 0; i < 25; i++) {
      const radius = 0.07 + Math.random() * 0.2;
      const geo = new THREE.SphereGeometry(radius, 16, 12);
      const mat = new THREE.MeshPhysicalMaterial({
        color: WHITE,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.22,
        roughness: 0,
        metalness: 0,
        transmission: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      placeRandom(mesh, 5.8);
      scene.add(mesh);
      objects.push({
        mesh,
        rotSpeed: new THREE.Vector3(0, 0, 0),
        floatSpeed: 0.12 + Math.random() * 0.28,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      });
    }

    // Distant star field — tiny dots at 9–20 units radius
    for (let i = 0; i < 220; i++) {
      const r = 9 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const size = 0.012 + Math.random() * 0.025;
      const geo = new THREE.SphereGeometry(size, 4, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: WHITE,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.55,
      });
      const star = new THREE.Mesh(geo, mat);
      star.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      scene.add(star);
    }

    // Animation loop
    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        objects.forEach((obj) => {
          obj.mesh.rotation.x += obj.rotSpeed.x;
          obj.mesh.rotation.y += obj.rotSpeed.y;
          obj.mesh.rotation.z += obj.rotSpeed.z;
          // Oscillate around initial Y position
          obj.mesh.position.y =
            obj.initialY + Math.sin(elapsed * obj.floatSpeed + obj.floatOffset) * 0.28;
        });

        shell.rotation.y += 0.0008;
        shell.rotation.x += 0.0003;

        // Lerp camera position
        camera.position.lerp(targetPositionRef.current, 0.05);
        camera.lookAt(0, 0, 0);

        // Lerp camera FOV — widens when entering sphere, narrows when exiting
        const fovDiff = targetFovRef.current - camera.fov;
        if (Math.abs(fovDiff) > 0.05) {
          camera.fov += fovDiff * 0.05;
          camera.updateProjectionMatrix();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
