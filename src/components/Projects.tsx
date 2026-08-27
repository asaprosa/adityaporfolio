"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Placeholder } from "@/components/Placeholder";
import { Tilt } from "@/components/Tilt";
import { TextArrowButton } from "@/components/TextArrowButton";
import { RollingText } from "@/components/RollingTextButton";
import { motion } from "motion/react";
import { projects } from "@/data/projects";
import { personal } from "@/data/personal";

const MotionLink = motion.create(Link);

export function Projects() {
  return (
    <section id="projects" className="px-6 py-28 md:px-10">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">
            Featured
            <br />
            Projects
          </h2>
          <TextArrowButton
            as="a"
            href={personal.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-ink"
          >
            View all work
          </TextArrowButton>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {projects.map((project, i) => {
            const cover = project.images[0];
            return (
              <Reveal key={project.slug} delay={i * 0.1}>
                <MotionLink
                  href={`/projects/${project.slug}`}
                  className="group block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
                >
                  <Tilt
                    rotationFactor={6}
                    springOptions={{ stiffness: 200, damping: 22 }}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-card"
                  >
                    {cover ? (
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <Placeholder label="Screenshot" variant="tile" className="h-full w-full" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/50 group-hover:opacity-100">
                      <motion.span 
                        initial="initial"
                        whileHover="hover"
                        className="inline-flex translate-y-2 items-center gap-1.5 rounded-control bg-paper px-4 py-2 text-sm font-medium text-ink transition-transform duration-300 group-hover:translate-y-0"
                      >
                        <RollingText text="View project" />
                        <ArrowUpRight size={15} />
                      </motion.span>
                    </div>
                  </Tilt>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
                      <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <motion.span
                        key={t}
                        initial="initial"
                        whileHover="hover"
                        className="rounded-control border border-ink/15 px-2.5 py-1 text-xs text-ink cursor-default"
                      >
                        <RollingText text={t} />
                      </motion.span>
                    ))}
                  </div>
                </MotionLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
