"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { stagger, fadeUp } from "@/lib/animations";

const chips = ["No clear roadmap", "Too many tools", "Burning resources"];

export default function Hero() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      <div id="main">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight max-w-3xl leading-tight"
            style={{ textShadow: "0 0 60px rgba(200,160,96,0.45)" }}
          >
            Building a digital product feels like standing in the dark.
          </motion.h1>

          {/* Body */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-white/55 font-light max-w-xl leading-relaxed"
          >
            The path is invisible. Every direction looks the same.
          </motion.p>

          {/* Pain-point chips */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {chips.map((chip) => (
              <span
                key={chip}
                className="glass px-5 py-2 rounded-full text-sm text-white/75"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-1"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">
          keep scrolling — I&apos;ve been there too
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
