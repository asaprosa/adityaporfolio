"use client";

import { PageTransitionLayout } from "@/components/PageTransitionLayout";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransitionLayout>{children}</PageTransitionLayout>;
}
