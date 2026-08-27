"use client";

import { useState, type FormEvent } from "react";
import { Github, Linkedin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { personal } from "@/data/personal";
import { RollingTextButton } from "@/components/RollingTextButton";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-content gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
            Have a role, a project, or just want to talk shop about test automation? My inbox is
            open.
          </p>
          <div className="mt-8 flex gap-3">
            <motion.a
              href={personal.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <Github size={17} />
            </motion.a>
            <motion.a
              href={personal.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <Linkedin size={17} />
            </motion.a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grain-surface rounded-card bg-ink p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm text-paper/70">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-2 w-full rounded-control border border-paper/15 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-paper/50"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-paper/70">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-control border border-paper/15 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-paper/50"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm text-paper/70">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full resize-none rounded-control border border-paper/15 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-paper/50"
                  placeholder="Tell me about your project"
                />
              </div>
              <RollingTextButton
                type="submit"
                isLoading={status === "loading"}
                text="Submit"
                className="w-full rounded-control py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              />
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
                    className="text-sm text-paper/80"
                  >
                    Thanks — I&apos;ll get back to you soon.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
                    className="text-sm text-red-300"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
