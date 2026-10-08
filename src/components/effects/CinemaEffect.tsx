"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SWIPE_THRESHOLD = 40; // px

/**
 * cinema effect: the Featured Projects grid as expanding image panels (768px and up; below that the
 * existing stacked cards show). Collapsed panels are a narrow image slice with a vertical title. The active
 * panel widens to show the image, category, title, a one-line description and a "View project" link.
 * Hover or click activates a panel, arrow keys / Home / End move between panels (roving focus), and a
 * horizontal swipe on touch moves to the next or previous panel. All panels are in the server HTML.
 */
export function CinemaPanels() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const last = projects.length - 1;

  function activate(i: number, focus = false) {
    const next = Math.min(last, Math.max(0, i));
    setActive(next);
    if (focus) buttons.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
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

  // Swipe is for touch only (mouse uses hover and click). touch-action: pan-y keeps vertical page scroll native.
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    touchStartX.current = e.pointerType === "touch" ? e.clientX : null;
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || e.pointerType !== "touch") return;
    const dx = e.clientX - start;
    if (dx < -SWIPE_THRESHOLD) activate(active + 1);
    else if (dx > SWIPE_THRESHOLD) activate(active - 1);
  }

  return (
    <div
      role="group"
      aria-label="Featured projects"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (touchStartX.current = null)}
      style={{ touchAction: "pan-y" }}
      className="mt-14 hidden h-[34rem] gap-3 md:flex"
    >
      {projects.map((project, i) => {
        const isActive = i === active;
        const cover = project.images[0];
        const contentId = `cinema-${project.slug}`;
        return (
          <motion.div
            key={project.slug}
            initial={false}
            animate={{ flexGrow: isActive ? 6 : 1 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24 }}
            onMouseEnter={() => setActive(i)}
            className="relative min-w-[3.5rem] basis-0 overflow-hidden rounded-card bg-ink"
          >
            {cover && (
              <Image
                src={cover.src}
                alt=""
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className={`object-cover object-top transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              aria-expanded={isActive}
              aria-controls={contentId}
              aria-label={`${project.title}, ${project.subtitle}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => activate(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
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

            {/* Expanded state. Always in the DOM; hidden from assistive tech and the tab order when collapsed. */}
            <div
              id={contentId}
              aria-hidden={!isActive}
              className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 text-paper transition-opacity duration-300 ${
                isActive ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              <p className="text-sm text-paper/70">{project.subtitle}</p>
              <h3 className="mt-1 text-2xl font-semibold leading-tight">{project.title}</h3>
              <p className="mt-2 truncate text-sm text-paper/80">{project.description}</p>
              <Link
                href={`/projects/${project.slug}`}
                tabIndex={isActive ? 0 : -1}
                className="pointer-events-auto mt-4 inline-flex items-center gap-1.5 rounded-control bg-paper px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                View project
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
