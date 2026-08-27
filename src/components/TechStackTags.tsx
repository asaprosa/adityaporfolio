"use client";

import { motion } from "motion/react";
import { RollingText } from "@/components/RollingTextButton";

export function TechStackTags({ tech }: { tech: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => (
        <motion.span
          key={t}
          initial="initial"
          whileHover="hover"
          className="rounded-control border border-ink/15 px-3 py-1.5 text-sm text-ink cursor-default"
        >
          <RollingText text={t} />
        </motion.span>
      ))}
    </div>
  );
}
