"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { stagger, fadeUp, slideInLeft } from "@/lib/animations";

const posts = [
  {
    title: "Como crear un producto digital en 5 pasos",
    excerpt: "¿Cuándo fue la última vez que lanzaste un producto o servicio y no funcionó? Por eso hoy vamos a ver como crear un producto digital.",
    image: "https://jonathansolis.com/blog/wp-content/uploads/2022/06/crear-un-producto-digital.jpg",
    url: "https://jonathansolis.com/blog/como-crear-un-producto-digital/",
    readTime: "5 min",
  },
  {
    title: "Programación en finanzas, que si y que no.",
    excerpt: "Las finanzas son un área en donde la programación tiene un rol muy importante. Aclaremos algunos puntos.",
    image: "https://jonathansolis.com/blog/wp-content/uploads/2022/06/lala-azizli-ruSoEmT0IBg-unsplash.jpg",
    url: "https://jonathansolis.com/blog/programacion-en-finanzas-que-si-y-que-no/",
    readTime: "7 min",
  },
  {
    title: 'Soy mentor en "CoderDojo"',
    excerpt: "No hace mucho que me convertí en mentor de CoderDojo y tal vez, tú también deberías hacerlo.",
    image: "https://jonathansolis.com/blog/wp-content/uploads/2022/05/CoderDogo_logo.webp",
    url: "https://jonathansolis.com/blog/soy-mentor-en-coderdojo/",
    readTime: "4 min",
  },
  {
    title: "Por qué deberías mudarte a Linux",
    excerpt: "Las ventajas de Linux con respecto a Windows son muchísimas. Hoy te cuento algunas.",
    image: "https://jonathansolis.com/blog/wp-content/uploads/2021/04/Linux_security.jpg",
    url: "https://jonathansolis.com/blog/por-que-deberias-mudarte-a-linux//",
    readTime: "6 min",
  },
];

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
          <motion.div variants={slideInLeft} className="mb-8">
            <span className="text-[#2fa3ee] text-xs font-semibold uppercase tracking-[0.2em]">Blog</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
              Writing in <span className="text-[#2fa3ee]">Spanish</span>
            </h2>
            <p className="mt-3 text-base md:text-lg text-white/60 leading-7 max-w-2xl">
              I write about product management, technology, and personal growth — in Spanish.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <motion.a
                key={post.url}
                variants={fadeUp}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass glass-hover rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-2.5 right-2.5 text-xs bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    {post.readTime}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-white text-sm group-hover:text-[#2fa3ee] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed flex-1">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-[#2fa3ee] font-medium mt-3">
                    Read article <ArrowUpRight size={11} />
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
