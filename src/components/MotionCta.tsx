"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const MotionLink = motion.create(Link);
const SPRING = { type: "spring" as const, visualDuration: 0.3, bounce: 0.15 };

export function MotionCta({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      className={className}
    >
      {children}
    </MotionLink>
  );
}
