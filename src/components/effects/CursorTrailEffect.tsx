"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

const INTERACTIVE =
  'a, button, [role="button"], [role="tab"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])';

// Lead dot first, then five trailing dots that follow with progressively softer springs.
const DOTS = [
  { size: 10, stiffness: 900, damping: 50, opacity: 1 },
  { size: 8, stiffness: 520, damping: 40, opacity: 0.7 },
  { size: 7, stiffness: 340, damping: 34, opacity: 0.5 },
  { size: 6, stiffness: 230, damping: 30, opacity: 0.36 },
  { size: 5, stiffness: 160, damping: 27, opacity: 0.24 },
  { size: 4, stiffness: 110, damping: 24, opacity: 0.14 },
];

function Dot({
  x,
  y,
  size,
  stiffness,
  damping,
  opacity,
  grow,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  size: number;
  stiffness: number;
  damping: number;
  opacity: number;
  grow: boolean;
  visible: boolean;
}) {
  const sx = useSpring(x, { stiffness, damping, mass: 0.5 });
  const sy = useSpring(y, { stiffness, damping, mass: 0.5 });
  return (
    <motion.div
      aria-hidden
      // White with mix-blend-mode: difference reads dark on the cream page and light on dark surfaces,
      // so it inverts over the lightbox backdrop with no special casing.
      className="pointer-events-none fixed left-0 top-0 z-[300] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={false}
      animate={{ opacity: visible ? opacity : 0, scale: grow ? 2.5 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}

function Trail() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [visible, setVisible] = useState(false);
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    }
    function onOver(e: PointerEvent) {
      const target = e.target;
      setGrow(target instanceof Element && target.closest(INTERACTIVE) !== null);
    }
    const hide = () => setVisible(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [x, y]);

  return (
    <>
      {DOTS.map((d, i) => (
        <Dot key={i} x={x} y={y} {...d} grow={i === 0 && grow} visible={visible} />
      ))}
    </>
  );
}

/**
 * cursorTrail effect: a small dot with a spring-lagged trail of about six dots that follows the pointer.
 * The lead dot grows to 2.5x over links and buttons. Fine pointers only (hover: hover and pointer: fine);
 * off under reduced motion. The system cursor is never hidden.
 */
export function CursorTrailEffect() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  if (reduced || !finePointer) return null;
  return <Trail />;
}
