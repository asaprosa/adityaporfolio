"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { ticker } from "@/lib/ticker";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const SHOW_BACK_TO_TOP_AFTER = 600;

// The live Lenis instance (or null when native scroll is in use), so the button can reuse it.
let lenis: Lenis | null = null;

/** Scroll to a page offset using Lenis when it is running, otherwise native smooth scrolling. */
export function smoothScrollTo(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 0.9, easing: easeOutCubic });
  else window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

/**
 * smoothScroll effect.
 * - Lenis with gentle cubic easing, on screens 768px and up, without reduced motion.
 * - Native scroll under 768px, with reduced motion, and inside dialogs (the lightbox).
 * - A 2px scroll-progress bar and a back-to-top button that fades in after 600px.
 * - Anchor links scroll smoothly (Lenis anchors, or the CSS scroll-behavior on native scroll).
 */
export function SmoothScrollEffect() {
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const [showTop, setShowTop] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  const barScale = reduced ? scrollYProgress : smoothProgress;

  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > SHOW_BACK_TO_TOP_AFTER));
  useEffect(() => setShowTop(window.scrollY > SHOW_BACK_TO_TOP_AFTER), []);

  useEffect(() => {
    if (reduced || !wide) return;

    const instance = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: easeOutCubic,
      anchors: { duration: 1.2, easing: easeOutCubic },
      // Dialogs (the lightbox) and anything marked data-lenis-prevent keep native scrolling.
      prevent: (node) => !!node.closest('[role="dialog"], [aria-modal="true"], [data-lenis-prevent]'),
    });
    lenis = instance;

    const unsubscribe = ticker.add(({ time }) => instance.raf(time));

    return () => {
      unsubscribe();
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [reduced, wide]);

  function backToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.2, easing: easeOutCubic });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink"
        style={{ scaleX: barScale }}
      />
      <motion.button
        type="button"
        onClick={backToTop}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        initial={false}
        animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 8 }}
        transition={reduced ? { duration: 0 } : { type: "spring", visualDuration: 0.3, bounce: 0.1 }}
        style={{ pointerEvents: showTop ? "auto" : "none" }}
        className="grain-surface fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-ink/10"
      >
        <ArrowUp size={17} />
      </motion.button>
    </>
  );
}
