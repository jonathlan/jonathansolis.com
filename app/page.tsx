"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ScrollProvider, useScroll } from "@/lib/scrollContext";
import DotNav from "@/components/DotNav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

const WorldCanvas = dynamic(() => import("@/components/WorldCanvas"), { ssr: false });

const SECTIONS = [Hero, About, Portfolio, Blog, Contact];
const NUM_SECTIONS = SECTIONS.length;

type CubicBezier = [number, number, number, number];

// Content depth-zoom transition: enter small/blurry (from far), exit large/blurry (rushing past)
const depthVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 0.72,
    filter: "blur(8px)",
  },
  active: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as CubicBezier },
  },
  exit: {
    opacity: 0,
    scale: 1.38,
    filter: "blur(12px)",
    transition: { duration: 0.5, ease: [0.55, 0, 1, 0.45] as CubicBezier },
  },
};

function PageController() {
  const { activeSection, scrollToSection } = useScroll();
  const activeSectionRef = useRef(activeSection);
  const isTransitioningRef = useRef(false);
  const lastWheelTime = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const navigate = (dir: 1 | -1) => {
      if (isTransitioningRef.current) return;
      // Don't navigate when a modal is open
      if (document.querySelector('[role="dialog"]')) return;

      const next = Math.max(0, Math.min(NUM_SECTIONS - 1, activeSectionRef.current + dir));
      if (next === activeSectionRef.current) return;

      isTransitioningRef.current = true;
      scrollToSection(next);
      setTimeout(() => { isTransitioningRef.current = false; }, 1100);
    };

    const handleWheel = (e: WheelEvent) => {
      if (document.querySelector('[role="dialog"]')) return;

      // Allow scrolling within section-scroll containers until boundary
      const scrollEl = document.querySelector(".section-scroll") as HTMLElement | null;
      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 8;
        const atTop = scrollTop <= 8;
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }

      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 900) return;
      if (Math.abs(e.deltaY) < 15) return;
      lastWheelTime.current = now;
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      // Ignore horizontal swipes and short taps
      if (Math.abs(dx) > Math.abs(dy)) return;
      if (Math.abs(dy) < 80) return;
      // Respect section-scroll boundaries (same logic as wheel)
      const scrollEl = document.querySelector(".section-scroll") as HTMLElement | null;
      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 8;
        const atTop = scrollTop <= 8;
        if (dy > 0 && !atBottom) return;
        if (dy < 0 && !atTop) return;
      }
      navigate(dy > 0 ? 1 : -1);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") navigate(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") navigate(-1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKey);
    };
  }, [scrollToSection]);

  const ActiveSection = SECTIONS[activeSection];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <WorldCanvas />
      <DotNav />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          variants={depthVariants}
          initial="enter"
          animate="active"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <ActiveSection />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <ScrollProvider>
      <PageController />
    </ScrollProvider>
  );
}
