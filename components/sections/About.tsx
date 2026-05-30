"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cog, Bug, Zap, Monitor, Globe, Coffee, Award, Swords } from "lucide-react";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";
import CoursesModal from "@/components/CoursesModal";

const skills = [
  { icon: Cog, label: "Product Management", desc: "Passionate about the whole product process." },
  { icon: Bug, label: "Quality Assurance", desc: "Strong background in the QA area." },
  { icon: Zap, label: "Troubleshooting", desc: "Excellent at troubleshooting complicated situations." },
  { icon: Monitor, label: "Front / Back end", desc: "Comfortable working in both front and back end." },
];

const languages = [
  { lang: "Spanish", level: "Native" },
  { lang: "English", level: "Fluent" },
  { lang: "French", level: "Proficient" },
  { lang: "Italian", level: "Good" },
];

const funFacts = [
  { icon: Globe, stat: "5", label: "Continents visited" },
  { icon: Coffee, stat: "4K", label: "Cups of coffee" },
  { icon: Swords, stat: "II", label: "Black belt" },
  { icon: Award, stat: "20+", label: "Courses taken" },
];

export default function About() {
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <>
      <section
        id="about"
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
              <span className="text-[#2fa3ee] text-xs font-semibold uppercase tracking-[0.2em]">About me</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
                Product Manager.<br />
                <span className="text-[#2fa3ee]">Builder. Learner.</span>
              </h2>
              <p className="mt-3 text-base md:text-lg text-white/60 leading-7 max-w-2xl">
                I am Jonathan Solis, a Mexican Product Manager based in Italy. I have wide experience
                creating software products with a special focus in quality assurance.
              </p>
            </motion.div>

            {/* Skills grid */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {skills.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="glass glass-hover rounded-2xl flex gap-4 p-4 transition-colors duration-200 cursor-default"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#2fa3ee]/15 flex items-center justify-center">
                    <Icon size={20} className="text-[#2fa3ee]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{label}</p>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Languages */}
            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map(({ lang, level }) => (
                  <span
                    key={lang}
                    className="glass px-4 py-1.5 rounded-full text-sm text-white"
                  >
                    <span className="font-semibold">{lang}</span>
                    <span className="text-white/40 ml-1">· {level}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Fun facts */}
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {funFacts.map(({ icon: Icon, stat, label }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  onClick={i === 3 ? () => setCoursesOpen(true) : undefined}
                  className={`glass rounded-2xl p-4 flex flex-col items-center text-center transition-colors duration-200 ${
                    i === 3 ? "cursor-pointer glass-hover" : "cursor-default"
                  }`}
                >
                  <Icon size={24} className="text-[#2fa3ee] mb-1.5" />
                  <span className="text-xl font-bold text-white">{stat}</span>
                  <span className="text-[10px] text-white/45 mt-1 leading-tight">{label}</span>
                  {i === 3 && (
                    <span className="text-[10px] text-[#2fa3ee] mt-1 font-medium">View list →</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CoursesModal isOpen={coursesOpen} onClose={() => setCoursesOpen(false)} />
    </>
  );
}
