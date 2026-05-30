"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
            {/* Profile photo */}
            <motion.div variants={fadeUp}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#2fa3ee]/30 blur-2xl scale-125" />
                <Image
                  src="/assets/img/Cover picture 7.png"
                  alt="Jonathan Solis"
                  width={200}
                  height={200}
                  priority
                  className="relative w-32 h-32 md:w-44 md:h-44 rounded-full object-cover ring-2 ring-white/20 shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
              style={{ textShadow: "0 0 40px rgba(47,163,238,0.4)" }}
            >
              Jonathan Solis
            </motion.h1>

            {/* Title */}
            <motion.p
              variants={fadeUp}
              className="mt-3 text-lg md:text-xl text-white/60 font-light tracking-widest uppercase"
            >
              Product Manager
            </motion.p>

            {/* Location */}
            <motion.p variants={fadeUp} className="mt-1 text-sm text-white/35 tracking-wide">
              Mexico · Italy
            </motion.p>

            {/* Social icons */}
            <motion.div
              variants={fadeUp}
              data-testid="social-icons"
              className="flex items-center gap-2 mt-8"
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
                  className="flex items-center justify-center w-11 h-11 rounded-full glass glass-hover text-white transition-all duration-200 hover:scale-110"
                >
                  <Icon size={18} />
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
