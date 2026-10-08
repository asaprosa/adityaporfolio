"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SESSION_KEY = "portfolio-curtain-seen";

// Runs in <head> before first paint. Arms the CSS curtain panels (see globals.css) only for a first visit
// in this session and only when motion is allowed. With JavaScript off it never runs, so nothing is covered.
export const curtainArmScript = `try{if(!sessionStorage.getItem("${SESSION_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-curtain","1")}catch(e){}`;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * curtain effect: two panels in the page background colour slide apart (about 1.0s total) to reveal the
 * content that is already in the DOM. Once per session, never locks scroll, skipped under reduced motion.
 */
export function CurtainEffect() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const armed = root.hasAttribute("data-curtain");
    // Hand over from the CSS panels to the Motion panels in the same frame (they are identical).
    root.removeAttribute("data-curtain");
    if (!armed || reduced) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setPhase("running");
  }, [reduced]);

  if (phase !== "running") return null;

  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute inset-y-0 left-0 bg-paper"
        style={{ width: "calc(50% + 1px)" }}
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 bg-paper"
        style={{ width: "calc(50% + 1px)" }}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        onAnimationComplete={() => setPhase("done")}
      />
    </div>
  );
}
