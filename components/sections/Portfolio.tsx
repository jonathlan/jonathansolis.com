"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";
import Modal from "@/components/Modal";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  modalTitle: string;
  actionUrl: string;
  actionLabel: string;
};

const projects: Project[] = [
  {
    id: "this-site",
    title: "This site (JonathanSolis.com)",
    description: "My personal web page built with an automated CI/CD pipeline.",
    image: "/assets/img/portfolio/gears.jpg",
    alt: "Gold gears",
    modalTitle: "This site — JonathanSolis.com",
    actionUrl: "https://gitlab.com/jonathlan/jonathansolis.com/-/pipelines",
    actionLabel: "Go to project",
  },
  {
    id: "roadmap",
    title: "API Product Roadmap",
    description: "Product roadmap for an API that enhances an app to display dishes and ingredients dynamically.",
    image: "/assets/img/portfolio/roadmap-thumb.png",
    alt: "Roadmap",
    modalTitle: "Kitchen API — Product Roadmap",
    actionUrl: "https://trello.com/kitchenapi",
    actionLabel: "Go to project",
  },
  {
    id: "proxy",
    title: "Proxy Format",
    description: "A simple proxy that formats dates from 3rd party web servers. Built in Ruby.",
    image: "/assets/img/portfolio/proxy.png",
    alt: "Proxy format architecture",
    modalTitle: "Proxy Format",
    actionUrl: "https://proxyformatter.herokuapp.com/",
    actionLabel: "Go to project",
  },
  {
    id: "websites",
    title: "10s of Websites",
    description: "Dozens of websites created and maintained for customers since 2008.",
    image: "/assets/img/portfolio/websites.jpg",
    alt: "Web hosting tools",
    modalTitle: "10s of Websites — Garsol Web Hosting",
    actionUrl: "https://www.garsolwebhosting.com",
    actionLabel: "Go to project",
  },
];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={project.modalTitle}
      actionUrl={project.actionUrl}
      actionLabel={project.actionLabel}
    >
      {project.id === "this-site" && (
        <>
          <p>My own personal web page is hosted on a Linux server with 2 environments: Staging and Production.</p>
          <p>The site is created with a <a href="https://gitlab.com/jonathlan/jonathansolis.com/-/pipelines" target="_blank" rel="noopener noreferrer" className="text-[#2fa3ee] hover:underline">CI/CD pipeline in GitLab</a>. Every time a change is pushed, it publishes to staging, runs automated Selenium tests in Java, and if everything is OK, deploys to production.</p>
          <p className="font-semibold">All automated, no manual processes involved.</p>
          <Image src="/assets/img/portfolio/pipeline.png" alt="CI/CD Pipeline" width={600} height={300} className="rounded-xl w-full" />
          <Image src="/assets/img/portfolio/burndown-up.png" alt="Burndown chart" width={600} height={300} className="rounded-xl w-full" />
        </>
      )}
      {project.id === "roadmap" && (
        <>
          <p>This is a product roadmap created during the course <em>Technical Product Manager</em> from Platzi.</p>
          <p>It is for an API &ldquo;Kitchen API&rdquo; used by the RoloFoods App. Divided in 3 phases, each with 2&ndash;3 sprints. The goal is to create endpoints to update ingredients and dishes according to their availability.</p>
          <a href="https://trello.com/kitchenapi" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/img/portfolio/roadmap.png" alt="Kitchen API Roadmap" width={600} height={400} className="rounded-xl w-full hover:opacity-90 transition-opacity" />
          </a>
        </>
      )}
      {project.id === "proxy" && (
        <>
          <Image src="/assets/img/portfolio/proxy.png" alt="Proxy format architecture" width={600} height={300} className="rounded-xl w-full" />
          <p>A proxy web server that formats dates received from another web server. Useful for software like Portfolio Performance which only accepts a specific date format as input.</p>
          <p>Created in Ruby, hosted on Heroku: <a href="https://proxyformatter.herokuapp.com/" target="_blank" rel="noopener noreferrer" className="text-[#2fa3ee] hover:underline">proxyformatter.herokuapp.com</a></p>
        </>
      )}
      {project.id === "websites" && (
        <>
          <p>I established <a href="https://www.garsolwebhosting.com" target="_blank" rel="noopener noreferrer" className="text-[#2fa3ee] hover:underline">Garsol Web Hosting</a> in 2008 and have been a web hosting provider since then, creating and maintaining dozens of websites for customers.</p>
          <p>I help them with design, hosting, domain, SSL, backup tools and email to make their businesses more successful.</p>
          <p className="font-medium">Some long-term customers:</p>
          <Image src="/assets/img/portfolio/henrick.png" alt="HenrickStativ.com" width={600} height={300} className="rounded-xl w-full" />
          <Image src="/assets/img/portfolio/sisa.png" alt="SuministrosIngenieriayAsesoria.com" width={600} height={300} className="rounded-xl w-full" />
        </>
      )}
    </Modal>
  );
}

export default function Portfolio() {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const active = projects.find((p) => p.id === openProject);

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
            <motion.div variants={slideInLeft} className="mb-8">
              <span className="text-[#2fa3ee] text-xs font-semibold uppercase tracking-[0.2em]">Portfolio</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
                My <span className="text-[#2fa3ee]">products</span>
              </h2>
              <p className="mt-3 text-base md:text-lg text-white/60 leading-7 max-w-2xl">
                I like to stay up to date by reading and taking courses in multiple domains. These are some products I have created thanks to that knowledge.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  onClick={() => setOpenProject(project.id)}
                  className="group cursor-pointer glass glass-hover rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden h-36">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#2fa3ee] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{project.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#2fa3ee] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View details <ExternalLink size={11} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {active && (
        <ProjectModal project={active} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
}
