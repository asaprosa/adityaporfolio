"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Noto_Sans_Devanagari, Noto_Sans_JP } from "next/font/google";
import { usePrefersReducedMotion } from "@/lib/hooks";

const notoDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["700"] });
const notoJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["700"] });

const GREETINGS = [
  { text: "Hello", font: "font-sans" },
  { text: "नमस्ते", font: notoDevanagari.className },
  { text: "नमस्कार", font: notoDevanagari.className },
  { text: "こんにちは", font: notoJP.className },
];

const STEP_MS = 400;
const SLIDE_DURATION_S = 0.7;
const SESSION_KEY = "portfolio-intro-seen";

type Phase = "pending" | "greeting" | "closing" | "done";

export function IntroSplash() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [index, setIndex] = useState(0);
  const timers = useRef<number[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  // Runs before paint, so repeat-session visitors never see a flash of the splash.
  useLayoutEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (reducedMotion || seen) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("greeting");
  }, [reducedMotion]);

  useEffect(() => {
    if (phase !== "greeting") return;

    if (index < GREETINGS.length - 1) {
      const id = window.setTimeout(() => setIndex((i) => i + 1), STEP_MS);
      timers.current.push(id);
    } else {
      const id = window.setTimeout(() => setPhase("closing"), STEP_MS);
      timers.current.push(id);
    }

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [phase, index]);

  useEffect(() => {
    if (phase === "greeting" || phase === "closing") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "pending" || phase === "done") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      animate={phase === "closing" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: SLIDE_DURATION_S, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === "closing") setPhase("done");
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`grain-text text-6xl font-bold sm:text-7xl ${GREETINGS[index].font}`}
        >
          {GREETINGS[index].text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
