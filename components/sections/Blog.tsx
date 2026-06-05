"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";

const pathA = [
  {
    step: "01",
    title: "Discovery",
    desc: "We define what you're building and who it's for.",
  },
  {
    step: "02",
    title: "Scope & Roadmap",
    desc: "You get a prioritized backlog and a realistic timeline.",
  },
  {
    step: "03",
    title: "Build & Ship",
    desc: "I manage the product, coordinate the team, and deliver v1.",
  },
];

const pathB = [
  {
    step: "01",
    title: "Audit",
    desc: "I review your product, codebase health, team dynamics, and backlog.",
  },
  {
    step: "02",
    title: "Diagnosis",
    desc: "You get a written report: what's broken, why, and how to fix it.",
  },
  {
    step: "03",
    title: "Execution",
    desc: "I take the lead and get the product back on track.",
  },
];

function Timeline({ steps }: { steps: typeof pathA }) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map(({ step, title, desc }) => (
        <div key={step} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-secondary">{step}</span>
            <div className="flex-1 w-px bg-secondary/20 mt-1" />
          </div>
          <div className="pb-4">
            <p className="font-semibold text-white text-sm">{title}</p>
            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Blog() {
  return (
    <section
      id="blog"
      className="min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="section-scroll w-full max-w-4xl mx-auto px-6 py-8 md:py-10 overflow-y-auto max-h-screen">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.div variants={slideInLeft} className="mb-8">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
              What working with me looks like
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
              Two ways I can help you build.
            </h2>
          </motion.div>

          {/* Process timelines */}
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Path A */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
                Path A — Build from Zero
              </h3>
              <Timeline steps={pathA} />
            </motion.div>

            {/* Path B */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
                Path B — Fix What&apos;s Broken
              </h3>
              <Timeline steps={pathB} />
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <a
              href="mailto:hello@jonathansolis.com"
              className="inline-flex items-center gap-2 glass glass-hover rounded-2xl px-8 py-4 text-white font-semibold text-base border border-secondary/30 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(128,96,208,0.25)]"
            >
              Book a free 30-min call →
            </a>
          </motion.div>

          {/* Languages row */}
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-white/40 text-sm">
              I work in:{" "}
              <span className="text-white/65">Spanish · English · French · Italian</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
