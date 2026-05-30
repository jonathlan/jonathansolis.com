"use client";

import { motion } from "framer-motion";
import { useScroll } from "@/lib/scrollContext";

const sections = ["Hero", "About", "Portfolio", "Blog", "Contact"];

export default function DotNav() {
  const { activeSection, scrollToSection } = useScroll();

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
      aria-label="Section navigation"
    >
      {sections.map((label, index) => (
        <button
          key={label}
          onClick={() => scrollToSection(index)}
          aria-label={`Go to ${label}`}
          className="flex items-center justify-center w-11 h-11 group"
        >
          <motion.span
            animate={{
              scale: activeSection === index ? 1.5 : 1,
              backgroundColor:
                activeSection === index ? "#2fa3ee" : "rgba(255,255,255,0.5)",
            }}
            transition={{ duration: 0.2 }}
            className="block w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm"
          />
          {/* Label tooltip on hover */}
          <span className="absolute right-8 text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
