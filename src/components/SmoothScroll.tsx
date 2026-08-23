"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ticker } from "@/lib/ticker";

/**
 * Site-wide smooth scroll.
 *
 * Adapted from Darkroom Engineering's Lenis (https://github.com/darkroomengineering/lenis, MIT).
 * Ticked through our shared ticker (src/lib/ticker.ts) instead of Lenis's own internal rAF loop —
 * mirroring the Tempus+Lenis integration pattern documented in Tempus's README:
 * `Tempus.add(({ time }) => lenis.raf(time))`.
 *
 * Lenis wraps native scroll rather than replacing it, so position: sticky (used in
 * ResumeBuilderForm), anchor links (Nav's #section links), and scroll-linked Framer Motion
 * effects (InkReveal, ProfilePhoto's useScroll-driven transitions) all keep working unmodified —
 * they just read a smoothed scroll position instead of raw native scroll. It also automatically
 * honors prefers-reduced-motion (forces 1:1 tracking, no smoothing) with no config needed here.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
    });

    const unsubscribe = ticker.add(({ time }) => lenis.raf(time));

    return () => {
      unsubscribe();
      lenis.destroy();
    };
  }, []);

  return null;
}
