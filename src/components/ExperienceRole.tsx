"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { experienceStatItems, type ExperienceEntry } from "@/data/experience";
import { effects } from "@/config/effects";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

// Fade up on first view. The server HTML and the first paint are fully visible; only items that start
// below the fold are tucked away (in a layout effect, before paint) and then revealed once.
function useBelowFold(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [tucked, setTucked] = useState(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  useLayoutEffect(() => {
    const el = ref.current;
    if (enabled && el && el.getBoundingClientRect().top > window.innerHeight * 0.92) setTucked(true);
  }, [ref, enabled]);
  return tucked && !inView;
}

function FadeUp({ index, onMouseEnter, children }: { index: number; onMouseEnter: () => void; children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const hidden = useBelowFold(ref, !reduced);
  return (
    <motion.li
      ref={ref}
      initial={false}
      animate={hidden ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      transition={hidden ? { duration: 0 } : { duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </motion.li>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [shown, setShown] = useState(value);
  const armed = useRef(false);
  const countUp = effects.experienceCountUp && !reduced;

  // Server HTML and first paint show the final number. If the row starts below the fold, drop it to 0
  // before paint and count up once when it is first seen.
  useLayoutEffect(() => {
    if (countUp && ref.current && ref.current.getBoundingClientRect().top > window.innerHeight * 0.92) {
      armed.current = true;
      setShown(0);
    }
  }, [countUp]);

  useLayoutEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <li ref={ref} className="flex items-baseline gap-2">
      <span className="text-lg font-semibold tabular-nums text-ink">
        {shown}
        {suffix}
      </span>
      <span className="text-sm text-muted">{label}</span>
    </li>
  );
}

export function ExperienceRole({ role }: { role: ExperienceEntry }) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const railRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState(0);
  const [hovered, setHovered] = useState<{ group: number; item: number } | null>(null);

  const groups = role.groups ?? [{ label: "", bullets: role.bullets.map((_, i) => i) }];

  // The rail draws as the section scrolls: its fill is scaleY tied to scroll progress.
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 0.7", "end 0.55"] });

  function updateReached(p: number) {
    const rail = railRef.current;
    if (!rail) return;
    const tip = p * rail.offsetHeight;
    let n = 0;
    groupRefs.current.forEach((g, i) => {
      if (g && tip >= g.offsetTop + 6) n = i + 1;
    });
    setReached(n);
  }
  useMotionValueEvent(scrollYProgress, "change", updateReached);
  useLayoutEffect(() => updateReached(scrollYProgress.get()));

  const dim = finePointer && !reduced;

  return (
    <div className="flex flex-col gap-4 border-b border-ink/15 py-8 sm:flex-row sm:items-start sm:gap-10">
      {/* Sticky on desktop: role, company and dates stay put while the bullets scroll past. */}
      <div className="sm:sticky sm:top-28 sm:w-64 sm:shrink-0">
        <h3 className="text-xl font-semibold text-ink">{role.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {role.company} · {role.location}
        </p>
        <p className="mt-1 text-sm text-muted">{role.period}</p>
      </div>

      <div className="min-w-0 flex-1">
        <ul aria-label="Key figures" className="flex flex-wrap gap-x-8 gap-y-2 border-b border-ink/10 pb-5">
          {experienceStatItems.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </ul>

        <div ref={railRef} className="relative mt-6 pl-7">
          <span aria-hidden className="absolute bottom-1 left-0 top-1 w-px bg-ink/15" />
          <motion.span
            aria-hidden
            className="absolute bottom-1 left-0 top-1 w-px origin-top bg-ink"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />

          <div className="space-y-8">
            {groups.map((g, gi) => (
              <div
                key={g.label || gi}
                ref={(el) => {
                  groupRefs.current[gi] = el;
                }}
                className="relative"
              >
                {g.label && (
                  <>
                    <span
                      aria-hidden
                      className={`absolute -left-[31px] top-[3px] h-[7px] w-[7px] rounded-full border border-ink transition-colors duration-300 ${
                        reduced || gi < reached ? "bg-ink" : "bg-paper"
                      }`}
                    />
                    <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-ink">{g.label}</h4>
                  </>
                )}
                <ul className={`space-y-2.5 ${g.label ? "mt-3" : ""}`} onMouseLeave={() => setHovered(null)}>
                  {g.bullets.map((bi, i) => {
                    const dimmed = dim && hovered?.group === gi && hovered.item !== i;
                    return (
                      <FadeUp key={bi} index={i} onMouseEnter={() => setHovered({ group: gi, item: i })}>
                        <span
                          className="flex gap-3 text-sm leading-relaxed text-muted transition-opacity duration-200"
                          style={{ opacity: dimmed ? 0.5 : 1 }}
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                          {role.bullets[bi]}
                        </span>
                      </FadeUp>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
