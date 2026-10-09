"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export const TOPICS = ["Hiring", "Freelance", "Collaboration", "Other"] as const;

const PILL = 46;
const ROW = 44; // 44px rows keep the options a comfortable tap target
const PAD = 6;
const OPEN_HEIGHT = PILL + TOPICS.length * ROW + PAD * 2;
const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

/**
 * morphDropdown effect: a "Topic" selector for the contact form. The pill trigger morphs into a floating
 * menu (height and border-radius spring, with the list scaling in; no SVG filter). Options get a sliding
 * hover highlight, the trigger label crossfades on choice, and it follows the listbox pattern: the trigger
 * opens with Enter, Space or the arrow keys, then arrows, Home, End, letters, Enter, Space, Escape and Tab
 * work on the list. A hidden input named "topic" carries the value into the form. The options are always in
 * the server HTML.
 */
export function TopicSelect() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);

  // Move focus into the list while it is open (the options use aria-activedescendant).
  useEffect(() => {
    if (!open) return;
    list.current?.focus({ preventScroll: true });
    // Once the menu has grown, bring it fully into view (matters on phones, where the field sits near the fold).
    const t = window.setTimeout(
      () => list.current?.parentElement?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }),
      reduced ? 0 : 260
    );
    return () => window.clearTimeout(t);
  }, [open, reduced]);

  // Close on a pointer press outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Clear the choice when the form resets after a successful send.
  useEffect(() => {
    const form = root.current?.closest("form");
    const onReset = () => setValue(null);
    form?.addEventListener("reset", onReset);
    return () => form?.removeEventListener("reset", onReset);
  }, []);

  function show(at: number) {
    setHighlight(at);
    setOpen(true);
  }

  function choose(i: number) {
    setValue(TOPICS[i]);
    setOpen(false);
    trigger.current?.focus();
  }

  function onTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const selected = value ? TOPICS.indexOf(value as (typeof TOPICS)[number]) : -1;
    show(e.key === "ArrowUp" ? TOPICS.length - 1 : Math.max(0, selected));
  }

  function onListKey(e: KeyboardEvent<HTMLUListElement>) {
    const last = TOPICS.length - 1;
    switch (e.key) {
      case "ArrowDown":
        setHighlight((h) => Math.min(last, h + 1));
        break;
      case "ArrowUp":
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Home":
        setHighlight(0);
        break;
      case "End":
        setHighlight(last);
        break;
      case "Enter":
      case " ":
        choose(highlight);
        break;
      case "Escape":
        setOpen(false);
        trigger.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        return; // let focus move on naturally
      default: {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        const from = highlight + 1;
        const ordered = [...TOPICS.slice(from), ...TOPICS.slice(0, from)];
        const hit = ordered.find((t) => t.toLowerCase().startsWith(e.key.toLowerCase()));
        if (!hit) return;
        setHighlight(TOPICS.indexOf(hit));
      }
    }
    e.preventDefault();
  }

  const transition = reduced ? { duration: 0 } : SPRING;
  const label = value ?? "Choose a topic";

  return (
    <div>
      <span id="topic-label" className="text-sm text-paper/70">
        Topic
      </span>
      <input type="hidden" name="topic" value={value ?? ""} />
      {/* The wrapper holds the pill's place in the form; the morphing surface floats over what follows. */}
      <div ref={root} className="relative mt-2" style={{ height: PILL }}>
        <motion.div
          initial={false}
          animate={{ height: open ? OPEN_HEIGHT : PILL, borderRadius: open ? 16 : PILL / 2 }}
          transition={transition}
          style={{ boxShadow: open ? "0 12px 32px rgba(0,0,0,0.35)" : "0 0 0 rgba(0,0,0,0)" }}
          className={`absolute inset-x-0 top-0 z-20 overflow-hidden border bg-ink transition-[border-color,box-shadow] duration-200 ${
            open ? "border-paper/40" : "border-paper/15"
          }`}
        >
          <button
            ref={trigger}
            id="topic-trigger"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls="topic-list"
            aria-labelledby="topic-label topic-trigger"
            onClick={() => (open ? setOpen(false) : show(value ? TOPICS.indexOf(value as (typeof TOPICS)[number]) : 0))}
            onKeyDown={onTriggerKey}
            className="flex w-full items-center justify-between px-4 text-base text-paper outline-none focus-visible:bg-paper/10 md:text-sm coarse:text-base"
            style={{ height: PILL - 2 }}
          >
            <span className="relative grid">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.18 }}
                  className={value ? "text-paper" : "text-paper/40"}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
            <ChevronDown
              size={16}
              className={`text-paper/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          <motion.ul
            ref={list}
            id="topic-list"
            role="listbox"
            tabIndex={-1}
            aria-labelledby="topic-label"
            aria-hidden={!open}
            aria-activedescendant={open ? `topic-opt-${highlight}` : undefined}
            onKeyDown={onListKey}
            onBlur={(e) => {
              if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
            }}
            initial={false}
            animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.96 }}
            transition={transition}
            // Stays in the DOM (and the server HTML) when closed; visibility keeps it out of sight and reach.
            style={{
              visibility: open ? "visible" : "hidden",
              transitionProperty: "visibility",
              transitionDuration: "0s",
              transitionDelay: open || reduced ? "0s" : "0.2s",
              padding: PAD,
              transformOrigin: "top",
            }}
            className="outline-none"
          >
            {TOPICS.map((topic, i) => (
              <li
                key={topic}
                id={`topic-opt-${i}`}
                role="option"
                aria-selected={value === topic}
                onPointerEnter={() => setHighlight(i)}
                onClick={() => choose(i)}
                className="relative flex cursor-pointer items-center justify-between rounded-control px-3 text-base text-paper md:text-sm coarse:text-base"
                style={{ height: ROW }}
              >
                {highlight === i && (
                  <motion.span
                    layoutId="topic-highlight"
                    aria-hidden
                    className="absolute inset-0 rounded-control bg-paper/15"
                    transition={transition}
                  />
                )}
                <span className="relative">{topic}</span>
                {value === topic && <span aria-hidden className="relative text-paper/60">•</span>}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}
