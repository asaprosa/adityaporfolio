"use client";

import { MotionConfig } from "motion/react";
import { PageTransitionLayout } from "@/components/PageTransitionLayout";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <PageTransitionLayout>{children}</PageTransitionLayout>
    </MotionConfig>
  );
}
