"use client";

import { useState, type FocusEvent, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CARD_W = 280;
const CARD_H = 180;
const ROLL = { duration: 0.45, ease: [0.76, 0, 0.24, 1] } as const;

// Masked text roll: the title slides up out of its box while a copy rises in from below.
function Roll({ text, on, reduced }: { text: string; on: boolean; reduced: boolean }) {
  const rolled = on && !reduced;
  const transition = reduced ? { duration: 0 } : ROLL;
  return (
    <span className="relative block overflow-hidden py-1">
      <motion.span className="block" initial={false} animate={{ y: rolled ? "-110%" : "0%" }} transition={transition}>
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-1 block"
        initial={false}
        animate={{ y: rolled ? "0%" : "110%" }}
        transition={transition}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * projectIndex effect: every project as a row (title, category, year). Hovering or focusing a row rolls its
 * title up behind a mask and shows a preview card that follows the cursor on a spring. On touch (no hover)
 * the preview shows inline under each row instead. Reduced motion keeps the card but drops the roll and the
 * spring. All rows are plain links in the server HTML.
 */
export function ProjectIndex() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  function place(nx: number, ny: number, first: boolean) {
    x.set(nx);
    y.set(ny);
    if (first) {
      springX.jump(nx);
      springY.jump(ny);
    }
  }

  function enter(i: number, e: PointerEvent) {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    place(e.clientX + 24, e.clientY - CARD_H / 2, active === null);
    setActive(i);
  }

  function move(e: PointerEvent) {
    if (e.pointerType === "touch") return;
    x.set(e.clientX + 24);
    y.set(e.clientY - CARD_H / 2);
  }

  // Keyboard focus behaves like hover: the card sits beside the focused row.
  function focus(i: number, e: FocusEvent<HTMLAnchorElement>) {
    if (!e.currentTarget.matches(":focus-visible")) return;
    const r = e.currentTarget.getBoundingClientRect();
    place(r.left + r.width * 0.6, r.top + r.height / 2 - CARD_H / 2, active === null);
    setActive(i);
  }

  const current = active === null ? null : projects[active];
  const cardX = reduced ? x : springX;
  const cardY = reduced ? y : springY;

  return (
    <>
      <ul className="mt-14 border-t border-ink/15" onPointerMove={move}>
        {projects.map((project, i) => (
          <li key={project.slug} className="border-b border-ink/15">
            <Link
              href={`/projects/${project.slug}`}
              onPointerEnter={(e) => enter(i, e)}
              onPointerLeave={() => setActive(null)}
              onFocus={(e) => focus(i, e)}
              onBlur={() => setActive(null)}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-6 text-ink md:grid-cols-[3fr_2fr_auto]"
            >
              <span className="text-2xl font-semibold tracking-tightest2 sm:text-3xl">
                <Roll text={project.title} on={active === i} reduced={reduced} />
              </span>
              <span className="hidden text-sm text-muted md:block">{project.subtitle}</span>
              <span className="text-sm tabular-nums text-muted">{project.year}</span>
              <span className="col-span-2 mt-1 text-sm text-muted md:hidden">{project.subtitle}</span>
            </Link>

            {/* Touch devices have no hover, so the preview sits inline under the row. */}
            {project.images[0] && (
              <div className="relative mb-6 hidden aspect-[16/9] w-full overflow-hidden rounded-card [@media(hover:none)]:block">
                <Image src={project.images[0].src} alt="" fill sizes="100vw" className="object-cover object-top" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current?.images[0] && (
          <motion.div
            key="preview-card"
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-40 overflow-hidden rounded-card bg-ink shadow-lg shadow-ink/20 [@media(hover:none)]:hidden"
            style={{ x: cardX, y: cardY, width: CARD_W, height: CARD_H }}
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={current.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <Image src={current.images[0].src} alt="" fill sizes="280px" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
