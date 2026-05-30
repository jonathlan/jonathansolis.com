"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FacebookIcon, GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from "@/components/SocialIcons";
import { stagger, fadeUp } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      <div id="main">
        <div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
              style={{ textShadow: "0 0 60px rgba(47,163,238,0.45)" }}
            >
              Jonathan Solis
            </motion.h1>

            {/* Title */}
            <motion.p
              variants={fadeUp}
              className="mt-5 text-xl md:text-2xl text-white/60 font-light tracking-widest uppercase"
            >
              Product Manager
            </motion.p>

            {/* Location */}
            <motion.p variants={fadeUp} className="mt-2 text-base text-white/35 tracking-wide">
              Mexico · Italy
            </motion.p>

            {/* Social icons */}
            <motion.div
              variants={fadeUp}
              data-testid="social-icons"
              className="flex items-center gap-3 mt-10"
            >
              {[
                { href: "https://www.facebook.com/jonathlan/", label: "Facebook", Icon: FacebookIcon },
                { href: "https://github.com/jonathlan", label: "GitHub", Icon: GithubIcon, testId: "github-link" },
                { href: "https://www.linkedin.com/in/jonathlan/", label: "LinkedIn", Icon: LinkedinIcon },
                { href: "https://twitter.com/jonathlan", label: "Twitter", Icon: TwitterIcon },
                { href: "mailto:hello@jonathansolis.com", label: "Email", Icon: MailIcon },
              ].map(({ href, label, Icon, testId }) => (
                <a
                  key={label}
                  href={href}
                  data-testid={testId}
                  aria-label={label}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="flex items-center justify-center w-13 h-13 rounded-full glass glass-hover text-white transition-all duration-200 hover:scale-110"
                >
                  <Icon size={21} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-1"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">scroll</span>
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
