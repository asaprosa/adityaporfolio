"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { effects } from "@/config/effects";

export type PagerProject = { slug: string; title: string; image?: string };

// Measured: ~3px overshoot at ~200ms, settled by ~300ms for a 0 to 190px travel.
const GROW = { type: "spring", stiffness: 676, damping: 41, mass: 1 } as const;
const COLLAPSE = { duration: 0.2, ease: [0.4, 0, 0.2, 1] } as const;
const PREVIEW_HEIGHT = 190; // 180px image + 10px gap above the label
const WORD_STAGGER = 0.05;

function Word({
  children,
  order,
  slash,
  reduced,
}: {
  children: string;
  order: number;
  slash?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.span
      className={`inline-block ${slash ? "text-black" : "text-muted"}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(10px)" }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, delay: reduced ? 0 : order * WORD_STAGGER, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

function PagerLink({ dir, project }: { dir: "prev" | "next"; project: PagerProject }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const coarse = useMediaQuery("(pointer: coarse)");
  // Under 768px the bar is a two-column grid: label above title, title clamped to two lines, no hover preview.
  const compact = useMediaQuery("(max-width: 767px)");
  const reduced = usePrefersReducedMotion();
  const active = !coarse && !compact && (hovered || focused);
  const isPrev = dir === "prev";
  const label = isPrev ? "Previous Project" : "Next Project";
  const words = project.title.split(" ");

  // Stagger runs outward from the label: left to right for Previous, right to left for Next.
  // DOM order mirrors for Next: title words, then "/", then the label.
  const wordNodes = words.map((w, i) => (
    <Word key={`${w}-${i}`} order={isPrev ? i + 1 : words.length - i} reduced={reduced}>
      {w}
    </Word>
  ));
  const slashNode = (
    <Word slash order={0} reduced={reduced}>
      /
    </Word>
  );
  const orderedRow = isPrev ? (
    <>
      {slashNode}
      {wordNodes}
    </>
  ) : (
    <>
      {wordNodes}
      {slashNode}
    </>
  );

  const labelNode = <span className="text-black">{label}</span>;

  const staticTitle = (
    <span className="inline-flex gap-x-[0.3em]">
      {isPrev ? (
        <>
          <span className="text-black">/</span>
          <span className="text-muted">{project.title}</span>
        </>
      ) : (
        <>
          <span className="text-muted">{project.title}</span>
          <span className="text-black">/</span>
        </>
      )}
    </span>
  );

  // The clamp lives on an inner span: as a direct flex item it loses display: -webkit-box and shows no ellipsis.
  const compactTitle = (
    <span className="block text-muted">
      <span className="line-clamp-2">{project.title}</span>
    </span>
  );

  const titleNode = compact ? (
    compactTitle
  ) : coarse ? (
    staticTitle
  ) : (
    <AnimatePresence>
      {active && (
        <motion.span
          key="title"
          className="inline-flex gap-x-[0.3em]"
          exit={{ opacity: 0, transition: { duration: 0.03 } }}
        >
          {orderedRow}
        </motion.span>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full md:h-4">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${isPrev ? "Previous" : "Next"} project: ${project.title}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className={`t-pager absolute bottom-0 flex w-max max-w-[calc(50vw-6rem)] flex-col overflow-hidden max-md:relative max-md:min-h-11 max-md:w-full max-md:max-w-none coarse:min-h-11 coarse:justify-end ${
          isPrev ? "left-0 items-start text-left" : "right-0 items-end text-right max-md:items-start max-md:text-left"
        }`}
      >
        {!coarse && !compact && (
          <motion.div
            aria-hidden
            className="overflow-hidden"
            initial={false}
            animate={
              reduced
                ? { height: active ? PREVIEW_HEIGHT : 0, transition: { duration: 0 } }
                : active
                  ? { height: PREVIEW_HEIGHT, transition: GROW }
                  : { height: 0, transition: COLLAPSE }
            }
          >
            <AnimatePresence>
              {active && project.image && (
                <motion.div
                  key="preview"
                  className="relative h-[180px] w-[230px]"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: reduced ? { duration: 0.2 } : { delay: 0.2, duration: 0.3 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.03 } }}
                >
                  <Image src={project.image} alt="" fill sizes="230px" className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        <span
          className={`flex min-h-4 flex-wrap items-baseline gap-x-[0.3em] leading-4 max-md:items-stretch max-md:gap-y-1 ${
            isPrev ? "max-md:flex-col" : "max-md:flex-col-reverse"
          }`}
        >
          {isPrev ? (
            <>
              {labelNode}
              {titleNode}
            </>
          ) : (
            <>
              {titleNode}
              {labelNode}
            </>
          )}
        </span>
      </Link>
    </div>
  );
}

export function ProjectPager({ prev, next }: { prev?: PagerProject; next?: PagerProject }) {
  return (
    <nav
      aria-label="Project navigation"
      className="mt-24 grid grid-cols-2 items-end gap-x-4 gap-y-6 md:grid-cols-3 md:gap-y-0"
    >
      <div className="justify-self-start w-full">{prev && <PagerLink dir="prev" project={prev} />}</div>
      <Link
        href={effects.projectIndex ? "/projects" : "/#projects"}
        className="t-pager order-last col-span-2 flex min-h-11 w-full items-center justify-center justify-self-center border-t border-ink/15 normal-case leading-4 text-black md:order-none md:col-span-1 md:min-h-0 md:w-auto md:border-0 coarse:min-h-11 coarse:items-end"
      >
        Back to List
      </Link>
      <div className="justify-self-end w-full">{next && <PagerLink dir="next" project={next} />}</div>
    </nav>
  );
}
