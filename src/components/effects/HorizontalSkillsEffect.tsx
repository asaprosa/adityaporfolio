"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { SkillCard } from "@/components/SkillCard";
import { skills, type Skill } from "@/data/skills";
import { smoothScrollTo } from "@/components/effects/SmoothScrollEffect";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

// The four panels. Every entry in the existing skills list is placed in exactly one panel;
// anything not named here lands in the last panel so nothing is ever dropped.
const GROUPS: { title: string; names: string[] }[] = [
  {
    title: "Automation",
    names: [
      "Playwright",
      "Selenium WebDriver",
      "Page Object Model",
      "Model Context Protocol",
      "Claude",
      "Gemini",
      "Groq / Llama 3.3",
      "Multi-Model Fallbacks",
      "Prompt Calibration",
    ],
  },
  {
    title: "Languages and Web",
    names: ["TypeScript", "JavaScript", "Node.js", "React", "Angular", "Vite", "PostgreSQL"],
  },
  { title: "API and Security", names: ["Postman", "REST API Automation", "k6 Load Testing", "Secrets Remediation"] },
  {
    title: "DevOps and Process",
    names: ["Linux/SSH", "Git", "GitHub Actions CI/CD", "Vercel Serverless", "Trello", "Agile/Scrum"],
  },
];

function buildPanels(): { title: string; skills: Skill[] }[] {
  const byName = new Map(skills.map((s) => [s.name, s]));
  const used = new Set<string>();
  const panels = GROUPS.map((g) => ({
    title: g.title,
    skills: g.names.flatMap((n) => {
      const s = byName.get(n);
      if (!s) return [];
      used.add(n);
      return [s];
    }),
  }));
  panels[panels.length - 1].skills.push(...skills.filter((s) => !used.has(s.name)));
  return panels;
}

const panels = buildPanels();
const COUNT = panels.length;

function PanelBody({ title, items, index }: { title: string; items: Skill[]; index: number }) {
  return (
    <div className="mx-auto grid w-full max-w-content gap-8 md:grid-cols-[1fr_2fr] md:items-center">
      <div>
        <p className="text-sm text-muted">
          {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
        </p>
        <h3 className="grain-text mt-3 text-5xl font-semibold tracking-tightest2 sm:text-6xl">{title}</h3>
      </div>
      <ul className="flex flex-wrap gap-3">
        {items.map((s) => (
          <li key={s.name}>
            <SkillCard skill={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * horizontalSkills effect: four panels slide sideways as the page scrolls (the section pins while it does),
 * with idle snapping to a panel, arrow-key and dot navigation, and a screen-reader label. Under 768px or
 * with reduced motion it renders the same four panels as a plain vertical stack. The server HTML is the
 * stack, so the content is present without JavaScript.
 */
export function HorizontalSkills() {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();
  const horizontal = wide && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const snapTimer = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(COUNT - 1) * 100}vw`]);

  function panelTop(i: number) {
    const el = sectionRef.current;
    if (!el) return 0;
    return el.getBoundingClientRect().top + window.scrollY + i * window.innerHeight;
  }

  function goTo(i: number) {
    smoothScrollTo(panelTop(Math.min(COUNT - 1, Math.max(0, i))));
  }

  function snapToNearest() {
    const el = sectionRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    const into = -el.getBoundingClientRect().top;
    if (into <= 0 || into >= (COUNT - 1) * vh) return; // outside the pinned range: leave scrolling alone
    const target = Math.round(into / vh);
    if (Math.abs(into - target * vh) < 2) return;
    goTo(target);
  }

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!horizontal) return;
    setActive(Math.round(Math.min(1, Math.max(0, p)) * (COUNT - 1)));
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(snapToNearest, 180);
  });

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const next: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: COUNT - 1,
    };
    if (!(e.key in next)) return;
    const target = Math.min(COUNT - 1, Math.max(0, next[e.key]));
    if (target === active) return; // at an end: let the key behave normally
    e.preventDefault();
    goTo(target);
  }

  if (!horizontal) {
    return (
      // The ref stays attached in the stacked layout too: useScroll throws if its target ref is never hydrated.
      <section id="skills" ref={sectionRef} className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-content">
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">Skills</h2>
          <div className="mt-14 space-y-16">
            {panels.map((p, i) => (
              <div key={p.title} role="group" aria-label={`${i + 1} of ${COUNT}: ${p.title}`}>
                <PanelBody title={p.title} items={p.skills} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" ref={sectionRef} style={{ height: `${COUNT * 100}dvh` }} className="relative">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Skills in four panels. Use the left and right arrow keys, Home and End, or the buttons below to move between panels."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="sticky top-0 flex h-dvh flex-col overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink"
      >
        <div className="mx-auto w-full max-w-content px-6 pt-28 md:px-10">
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">Skills</h2>
        </div>

        <div className="relative flex-1">
          <motion.div className="absolute inset-y-0 left-0 flex" style={{ x, width: `${COUNT * 100}vw` }}>
            {panels.map((p, i) => (
              <div
                key={p.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${COUNT}: ${p.title}`}
                className="flex h-full w-screen shrink-0 items-center px-6 md:px-10"
              >
                <PanelBody title={p.title} items={p.skills} index={i} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-content gap-2 px-6 pb-20 md:px-10">
          {panels.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to panel ${i + 1} of ${COUNT}: ${p.title}`}
              aria-current={i === active}
              className="group flex h-11 flex-1 items-center"
            >
              <span className={`block h-1 w-full rounded-full transition-colors ${i <= active ? "bg-ink" : "bg-ink/15"}`} />
            </button>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {`Panel ${active + 1} of ${COUNT}: ${panels[active].title}`}
        </p>
      </div>
    </section>
  );
}
