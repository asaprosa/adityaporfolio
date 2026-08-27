"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type InkRevealProps = {
  text: string;
  leadWord?: string;
};

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span style={{ opacity }} className="text-ink">
      {children}{" "}
    </motion.span>
  );
}

export function InkReveal({ text, leadWord }: InkRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });

  const words = text.split(" ");

  return (
    <section className="px-6 py-32 md:px-10">
      <div className="mx-auto max-w-4xl">
        <p
          ref={ref}
          className="text-center text-2xl font-medium leading-snug sm:text-3xl md:text-4xl"
        >
          {leadWord && <span className="text-ink">{leadWord} </span>}
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            return (
              <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
