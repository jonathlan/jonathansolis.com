"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";
import CoursesModal from "@/components/CoursesModal";

export default function About() {
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <>
      <section
        id="about"
        className="min-h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div className="section-scroll w-full max-w-3xl mx-auto px-6 py-8 md:py-10 overflow-y-auto max-h-screen">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Heading */}
            <motion.div variants={slideInLeft} className="mb-8">
              <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
                Sounds familiar?
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white leading-tight">
                You&apos;ve got the idea, the budget. But the dark keeps winning.
              </h2>
            </motion.div>

            {/* Body paragraphs */}
            <motion.div variants={fadeUp} className="space-y-4 mb-8">
              <p className="text-base md:text-lg text-white/60 leading-7">
                Agencies disappear after the kickoff call? You lose six months to decisions you didn&apos;t know you had to make?
              </p>
              <p className="text-base md:text-lg text-white/60 leading-7">
                Most products don&apos;t fail because of a bad idea. They fail because there was nobody to help them navigate.
              </p>
            </motion.div>

            {/* Pull-quote */}
            <motion.blockquote
              variants={fadeUp}
              className="glass rounded-2xl p-6 mb-6 border-l-4 border-secondary"
            >
              <p className="text-white/85 text-base md:text-lg leading-7 italic">
                &ldquo;I speak business and tech natively — I can read the codebase, run the pipeline, and still write the roadmap.&rdquo;
              </p>
            </motion.blockquote>

            {/* Certifications link */}
            <motion.div variants={fadeUp} className="mb-8">
              <button
                onClick={() => setCoursesOpen(true)}
                className="text-primary text-sm font-medium hover:text-warm transition-colors"
              >
                View certifications →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CoursesModal isOpen={coursesOpen} onClose={() => setCoursesOpen(false)} />
    </>
  );
}
