"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, FacebookIcon } from "@/components/SocialIcons";
import { stagger, fadeUp } from "@/lib/animations";

const socials = [
  { icon: GithubIcon, label: "GitHub", url: "https://github.com/jonathlan" },
  { icon: LinkedinIcon, label: "LinkedIn", url: "https://www.linkedin.com/in/jonathlan/" },
  { icon: TwitterIcon, label: "Twitter", url: "https://twitter.com/jonathlan" },
  { icon: FacebookIcon, label: "Facebook", url: "https://www.facebook.com/jonathlan/" },
];

export default function Contact() {
  return (
    <section id="contact" className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="w-full max-w-xl mx-auto text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <span className="text-[#2fa3ee] text-xs font-semibold uppercase tracking-[0.2em]">Contact</span>
            <h2
              className="mt-3 text-4xl md:text-5xl font-bold text-white"
              style={{ textShadow: "0 0 60px rgba(47,163,238,0.3)" }}
            >
              Let&apos;s chat!
            </h2>
            <p className="mt-5 text-base md:text-lg text-white/55 leading-8 max-w-md mx-auto">
              I&apos;d love to talk. Reach me through social media or drop me an email — I usually respond within a day.
            </p>
          </motion.div>

          {/* Email CTA */}
          <motion.a
            variants={fadeUp}
            href="mailto:hello@jonathansolis.com"
            className="inline-flex items-center gap-3 mt-10 glass glass-hover font-semibold px-8 py-4 rounded-2xl text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(47,163,238,0.25)] text-base min-h-[56px] border border-[#2fa3ee]/30"
          >
            <Mail size={20} className="text-[#2fa3ee]" />
            hello@jonathansolis.com
          </motion.a>

          {/* Social row */}
          <motion.div variants={fadeUp} className="flex justify-center gap-4 mt-8">
            {socials.map(({ icon: Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-12 h-12 rounded-full glass glass-hover text-white transition-all duration-200 hover:scale-110 hover:border-[#2fa3ee]/40"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>

          {/* Handle */}
          <motion.p variants={fadeUp} className="mt-6 text-white/30 text-sm">
            Social ID: <span className="text-white/55 font-medium">@jonathlan</span> — everywhere
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
