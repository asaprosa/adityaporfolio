"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin } from "lucide-react";
import { personal } from "@/data/personal";
import { RollingText } from "@/components/RollingTextButton";
import { motion } from "framer-motion";

const quickLinks = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const socialLinks = [
  { label: "GitHub", href: personal.links.github, Icon: Github },
  { label: "LinkedIn", href: personal.links.linkedin, Icon: Linkedin },
];

/** Reveals one word at a time as the heading scrolls into view: fades, unblurs, and lifts in. */
function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tightest2 text-paper sm:text-5xl">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", duration: 1.8, bounce: 0, delay: i * 0.06 }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  );
}

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <footer className="grain-surface relative overflow-hidden bg-[#0a0a0a] px-8 pb-32 pt-24 md:px-16">
      <div className="mx-auto grid max-w-content gap-14 md:grid-cols-3 md:gap-8">
        <AnimatedHeading text={personal.footerStatement} />

        <div>
          <p className="text-sm text-paper/50">/Quick links</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <motion.a
                key={link.id}
                href={sectionHref(link.id)}
                className="rounded-control bg-paper/10 px-4 py-2 text-sm text-paper transition-colors hover:bg-paper/20 group"
                initial="initial"
                whileHover="hover"
              >
                <span className="inline-block transition-transform group-hover:scale-105">
                  <RollingText text={link.label} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-paper/50">/Contact</p>
          <motion.a
            href={`mailto:${personal.email}`}
            className="mt-4 inline-block text-sm text-paper hover:underline group"
            initial="initial"
            whileHover="hover"
          >
            <RollingText text={personal.email} />
          </motion.a>

          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <p className="mt-6 text-xs text-paper/40">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom-clipped brand wordmark: this wrapper handles the static "sink halfway below the
          footer edge" crop, kept separate from the motion element below so framer's animated y
          doesn't fight the CSS transform doing the crop offset. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 w-[94vw] -translate-x-1/2 translate-y-1/2"
      >
        <motion.p
          className="select-none whitespace-nowrap text-center font-sans text-[16vw] font-bold leading-none tracking-tighter text-neutral-900"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ type: "spring", duration: 2.2, bounce: 0, delay: 0 }}
        >
          {personal.name.split(" ")[0].toUpperCase()}
        </motion.p>
      </div>
    </footer>
  );
}
