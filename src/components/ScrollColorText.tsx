"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface ScrollColorTextProps {
  text: string;
  className?: string;
  startColor?: string;
  fillColor?: string;
}

export function ScrollColorText({
  text,
  className = "",
  startColor = "#6b6b6b", // muted
  fillColor = "#111111", // ink
}: ScrollColorTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const characters = text.split("");

  return (
    <section ref={containerRef} className="h-[250vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 md:px-10">
        <div className={`mx-auto max-w-4xl text-center text-2xl font-medium leading-snug sm:text-3xl md:text-4xl inline [word-break:break-word] [hyphens:manual] ${className}`}>
          {characters.map((char, index) => {
            const start = index / characters.length;
            const end = start + 1 / characters.length;

            return (
              <Character
                key={index}
                char={char}
                progress={scrollYProgress}
                range={[start, end]}
                startColor={startColor}
                fillColor={fillColor}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  startColor: string;
  fillColor: string;
}

function Character({ char, progress, range, startColor, fillColor }: CharacterProps) {
  const color = useTransform(progress, range, [startColor, fillColor]);

  return (
    <motion.span style={{ color }} className="inline whitespace-pre-wrap">
      {char}
    </motion.span>
  );
}
