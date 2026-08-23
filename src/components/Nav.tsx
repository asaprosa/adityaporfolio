"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, X } from "lucide-react";
import { personal } from "@/data/personal";
import { RollingText } from "@/components/RollingTextButton";

const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-6 z-50 flex flex-col items-center"
    >
      <div className="grain-surface flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 shadow-lg shadow-ink/10">
        <a href={sectionHref("top")} className="text-sm font-semibold text-paper">
          {personal.name.split(" ")[0]}
        </a>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-105"
        >
          {open ? <X size={15} /> : <MoreHorizontal size={15} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grain-surface mt-2 rounded-card bg-ink px-2 py-2 shadow-lg shadow-ink/10"
          >
            <ul className="flex flex-col">
              {sections.map((s) => (
                <li key={s.id}>
                  <motion.a
                    href={sectionHref(s.id)}
                    onClick={() => setOpen(false)}
                    className="block rounded-control px-4 py-2 text-sm text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
                    initial="initial"
                    whileHover="hover"
                  >
                    <RollingText text={s.label} />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
