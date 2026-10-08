"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type TickerLink = { label: string; href: string };

/**
 * ticker effect: a horizontal row of links with equal gaps (wrapping on small screens). While one link is
 * hovered or keyboard-focused it stays at full opacity and lifts slightly, the others dim to 0.5 and drop
 * slightly. Under reduced motion only the opacity changes, instantly.
 */
export function TickerLinks({ links }: { links: TickerLink[] }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul role="list" className="mt-4 flex flex-wrap gap-x-6 gap-y-3" onMouseLeave={() => setActive(null)}>
      {links.map((link, i) => {
        const dimmed = active !== null && active !== i;
        const lifted = active === i;
        return (
          <li key={link.label}>
            <motion.a
              href={link.href}
              className="inline-block text-sm text-paper"
              initial={false}
              animate={{ opacity: dimmed ? 0.5 : 1, y: reduced ? 0 : dimmed ? 2 : lifted ? -2 : 0 }}
              transition={reduced ? { duration: 0 } : { type: "spring", visualDuration: 0.3, bounce: 0.1 }}
              onMouseEnter={() => setActive(i)}
              onFocus={(e) => setActive(e.currentTarget.matches(":focus-visible") ? i : null)}
              onBlur={() => setActive(null)}
            >
              {link.label}
            </motion.a>
          </li>
        );
      })}
    </ul>
  );
}
