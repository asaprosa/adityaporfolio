"use client";

import { motion, type Variants } from "motion/react";
import { personal } from "@/data/personal";
import { SparkleIcon, BoltIcon } from "@/components/DecorativeIcons";
import { AsciiField } from "@/components/AsciiField";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const year = new Date().getFullYear();

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-32 pb-16 md:px-10"
    >
      <AsciiField className="pointer-events-none absolute inset-0 z-0" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        <motion.h1
          variants={item}
          className="grain-text relative select-none break-words text-center font-sans text-[12.5vw] font-extrabold leading-[0.88] tracking-tightest2 sm:text-[13vw] lg:text-[10vw]"
        >
          <motion.span
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 top-0 -translate-y-1/2"
          >
            <SparkleIcon className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
          </motion.span>
          {personal.headlineWords[0]} {personal.headlineWords[1]}
          <br />
          {personal.headlineWords[2]}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-1 bottom-0 translate-y-1/3"
          >
            <BoltIcon className="h-10 w-7 sm:h-14 sm:w-10 lg:h-20 lg:w-14" />
          </motion.span>
        </motion.h1>

        <motion.div variants={item} className="mx-auto mt-10 w-32 sm:w-40">
          {/* Real photo is a single floating element (see ProfilePhoto) that morphs from here into About's slot on scroll. */}
          <div id="hero-photo-anchor" className="aspect-square w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto mt-10 flex w-full max-w-content items-end justify-between px-2 text-xs text-muted sm:text-sm"
      >
        <span className="grain-text font-sans text-2xl font-extrabold sm:text-3xl">©{year}</span>
        <span className="font-sans tracking-wide text-muted">/{personal.availability.toUpperCase()}</span>
      </motion.div>
    </section>
  );
}
