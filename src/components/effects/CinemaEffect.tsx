"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/hooks";

const MotionLink = motion.create(Link);
const SWIPE_THRESHOLD = 40; // px

/**
 * cinema effect: the Featured Projects grid as expanding image panels (768px and up; below that the
 * existing stacked cards show). Every panel is a real link to its project page.
 * - Mouse: hover expands a panel, and a click anywhere on any panel opens the project.
 * - Touch: the first tap on a collapsed panel expands it, a tap on the expanded panel opens the project.
 *   A horizontal swipe moves to the next or previous panel.
 * - Keyboard: panels are tab stops, Left/Right (and Up/Down, Home, End) move focus and expand, Enter opens.
 * Collapsed panels carry a dark scrim so the vertical title stays above 4.5:1 contrast on any screenshot.
 * All panels are in the server HTML.
 */
export function CinemaPanels() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const tapped = useRef({ type: "", wasActive: true });
  const swiped = useRef(false);
  const last = projects.length - 1;

  function activate(i: number, focus = false) {
    const next = Math.min(last, Math.max(0, i));
    setActive(next);
    if (focus) links.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLAnchorElement>, i: number) {
    const target: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in target)) return;
    e.preventDefault();
    activate(target[e.key], true);
  }

  function onPanelPointerDown(e: PointerEvent<HTMLAnchorElement>, i: number) {
    tapped.current = { type: e.pointerType, wasActive: i === active };
  }

  // Touch has no hover, so the first tap on a collapsed panel only expands it. Mouse and keyboard
  // (detail 0) clicks always follow the link.
  function onClick(e: MouseEvent<HTMLAnchorElement>, i: number) {
    if (swiped.current) {
      swiped.current = false;
      e.preventDefault();
      return;
    }
    if (e.detail !== 0 && tapped.current.type === "touch" && !tapped.current.wasActive) {
      e.preventDefault();
      setActive(i);
    }
  }

  // Swipe is for touch only (mouse uses hover and click). touch-action: pan-y keeps vertical page scroll native.
  function onGroupPointerDown(e: PointerEvent<HTMLDivElement>) {
    touchStartX.current = e.pointerType === "touch" ? e.clientX : null;
  }
  function onGroupPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || e.pointerType !== "touch") return;
    const dx = e.clientX - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    swiped.current = true;
    activate(active + (dx < 0 ? 1 : -1));
  }

  return (
    <div
      role="group"
      aria-label="Featured projects"
      onPointerDown={onGroupPointerDown}
      onPointerUp={onGroupPointerUp}
      onPointerCancel={() => (touchStartX.current = null)}
      style={{ touchAction: "pan-y" }}
      className="mt-14 hidden h-[34rem] gap-3 md:flex"
    >
      {projects.map((project, i) => {
        const isActive = i === active;
        const cover = project.images[0];
        return (
          <MotionLink
            key={project.slug}
            ref={(el: HTMLAnchorElement | null) => {
              links.current[i] = el;
            }}
            href={`/projects/${project.slug}`}
            aria-label={`${project.title}, ${project.subtitle}`}
            draggable={false}
            initial={false}
            animate={{ flexGrow: isActive ? 6 : 1 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onPointerDown={(e: PointerEvent<HTMLAnchorElement>) => onPanelPointerDown(e, i)}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => onClick(e, i)}
            onKeyDown={(e: KeyboardEvent<HTMLAnchorElement>) => onKeyDown(e, i)}
            className="relative block min-w-[3.5rem] basis-0 cursor-pointer overflow-hidden rounded-card bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
          >
            {cover && (
              <Image
                src={cover.src}
                alt=""
                fill
                draggable={false}
                sizes="(min-width: 768px) 60vw, 100vw"
                style={{
                  // Collapsed: crop the narrow slice to the useful part of the screenshot. Expanded: top-centre.
                  objectPosition: isActive ? "50% 0%" : (project.objectPosition ?? "50% 0%"),
                }}
                className="select-none object-cover transition-[object-position] duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            {/* Dark scrim on collapsed panels: even a white screenshot lands near #4c4c4c under it, which keeps
                the cream title above 7:1 (the 4.5:1 minimum for small text). */}
            <div
              aria-hidden
              className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100"}`}
            />

            {/* Collapsed state: vertical title along the slice */}
            <span
              aria-hidden
              className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium uppercase tracking-wide text-paper [writing-mode:vertical-rl] rotate-180 transition-opacity duration-200 ${
                isActive ? "opacity-0" : "opacity-100"
              }`}
            >
              {project.title}
            </span>

            {/* Expanded state. Always in the DOM; the whole panel is the link. */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 text-paper transition-opacity duration-300 ${
                isActive ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              <p className="text-sm text-paper/70">{project.subtitle}</p>
              <h3 className="mt-1 text-2xl font-semibold leading-tight">{project.title}</h3>
              <p className="mt-2 truncate text-sm text-paper/80">{project.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-control bg-paper px-4 py-2 text-sm font-medium text-ink">
                View project
                <ArrowUpRight size={15} />
              </span>
            </div>
          </MotionLink>
        );
      })}
    </div>
  );
}
