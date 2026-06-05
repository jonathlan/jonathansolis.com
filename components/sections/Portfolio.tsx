"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sprout, Wrench, type LucideIcon } from "lucide-react";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";
import Modal from "@/components/Modal";
import { useScroll } from "@/lib/scrollContext";

type ServiceId = "build" | "fix";

type Service = {
  id: ServiceId;
  icon: LucideIcon;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    id: "build",
    icon: Sprout,
    title: "Building from zero",
    description:
      "I've built SaaS tools and cultural heritage platforms. If you have an idea worth building, let's scope it.",
  },
  {
    id: "fix",
    icon: Wrench,
    title: "Fixing what's broken",
    description:
      "A product exists but something's wrong. I audit the codebase directly, not just the backlog, then fix it.",
  },
];

function BuildModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Build from Zero">
      {/* Evidence block 1 — Aere (text-only placeholder) */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Aere</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Archaeological sites platform with 3D modeling, built on OpenBuilding.
        </p>
      </div>

      {/* Evidence block 2 — API Roadmap */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Kitchen API — Product Roadmap</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          This is a product roadmap created during the course <em>Technical Product Manager</em> from Platzi.
          It is for an API &ldquo;Kitchen API&rdquo; used by the RoloFoods App. Divided in 3 phases, each
          with 2&ndash;3 sprints. The goal is to create endpoints to update ingredients and dishes according
          to their availability.
        </p>
        <a href="https://trello.com/kitchenapi" target="_blank" rel="noopener noreferrer">
          <Image
            src="/assets/img/portfolio/roadmap.png"
            alt="Kitchen API Roadmap"
            width={600}
            height={400}
            className="rounded-xl w-full hover:opacity-90 transition-opacity"
          />
        </a>
      </div>
    </Modal>
  );
}

function FixModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Fix What's Broken">
      {/* Evidence block 1 — Proxy Format */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Proxy Format</h3>
        <Image
          src="/assets/img/portfolio/proxy.png"
          alt="Proxy format architecture"
          width={600}
          height={300}
          className="rounded-xl w-full mb-3"
        />
        <p className="text-sm text-gray-600 leading-relaxed">
          A proxy web server that formats dates received from another web server. Useful for software
          like Portfolio Performance which only accepts a specific date format as input.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mt-1">
          Created in Ruby, hosted on Heroku:{" "}
          <a
            href="https://proxyformatter.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            proxyformatter.herokuapp.com
          </a>
        </p>
      </div>

      {/* Evidence block 2 — Garsol Web Hosting */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Garsol Web Hosting</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          I established{" "}
          <a
            href="https://www.garsolwebhosting.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Garsol Web Hosting
          </a>{" "}
          in 2008 and have been a web hosting provider since then, creating and maintaining dozens of
          websites for customers. I help them with design, hosting, domain, SSL, backup tools and
          email to make their businesses more successful.
        </p>
        <Image
          src="/assets/img/portfolio/henrick.png"
          alt="HenrickStativ.com"
          width={600}
          height={300}
          className="rounded-xl w-full mb-2"
        />
        <Image
          src="/assets/img/portfolio/sisa.png"
          alt="SuministrosIngenieriayAsesoria.com"
          width={600}
          height={300}
          className="rounded-xl w-full"
        />
      </div>
    </Modal>
  );
}

export default function Portfolio() {
  const [openService, setOpenService] = useState<ServiceId | null>(null);
  const { scrollToSection } = useScroll();

  return (
    <>
      <section
        id="portfolio"
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
                The path exists.
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white leading-tight">
                I&apos;ve shipped products for clients across 4 continents.
              </h2>
              <p className="mt-3 text-base md:text-lg text-white/60 leading-7 max-w-2xl">
                For two decades I&apos;ve taken digital product ideas from napkin to launch, and
                rescued products heading off a cliff.
              </p>
            </motion.div>

            {/* Micro-copy */}
            <motion.div variants={fadeUp} className="space-y-1">
              <p className="text-sm text-white/40">And right now, I&apos;m building one of my own.</p>
            </motion.div>

            {/* Service cards */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {services.map(({ id, icon: Icon, title, description }) => (
                <motion.div
                  key={id}
                  variants={fadeUp}
                  onClick={() => setOpenService(id)}
                  className="group cursor-pointer glass glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                    <Icon size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-white/55 mt-1.5 leading-relaxed">{description}</p>
                  </div>
                  <span className="text-xs text-primary font-medium mt-auto">
                    See examples →
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="text-center">
              <button
                onClick={() => scrollToSection(3)}
                className="text-primary text-sm font-medium hover:text-warm transition-colors"
              >
                Ready to start walking? →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {openService === "build" && <BuildModal onClose={() => setOpenService(null)} />}
      {openService === "fix" && <FixModal onClose={() => setOpenService(null)} />}
    </>
  );
}
