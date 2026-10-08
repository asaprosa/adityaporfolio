import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResumeBuilderForm } from "./ResumeBuilderForm";

export const metadata: Metadata = {
  title: "Resume Builder — lite demo — Aditya Ghodke",
  description:
    "Paste a resume and job description to get a tailored rewrite, an ATS compatibility score, missing keywords, and improvement suggestions. Bring your own LLM API key.",
};

export default function ResumeBuilderPage() {
  return (
    <>
      <Nav />
      <main className="px-6 pb-28 pt-32 md:px-10">
        <div className="mx-auto max-w-content">
          <Link
            href="/projects/ats-resume-tailor"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={15} />
            Back to project
          </Link>

          <h1 className="grain-text mt-6 text-5xl font-semibold tracking-tightest2 sm:text-6xl">
            Resume Builder
            <br />
            lite demo
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Paste your resume and a target job description. Pick an LLM provider and bring your
            own API key — it&apos;s used for this request only and never stored on our servers.
            You&apos;ll get a tailored resume, an ATS compatibility score, missing keywords, and
            concrete suggestions.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            This is a smaller, in-portfolio build of{" "}
            <Link href="/projects/ats-resume-tailor" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              ATS Resume Tailor
            </Link>
            , which also generates LaTeX resumes, cover letters, interview prep, and a LinkedIn
            About —{" "}
            <a
              href="https://resumetemplatefromjd.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              try the full app
              <ArrowUpRight size={12} />
            </a>{" "}
            or{" "}
            <a
              href="https://github.com/AdityaGhodkeIesoftek/ResumeFromJD"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              see the source
              <ArrowUpRight size={12} />
            </a>
            .
          </p>

          <div className="mt-16">
            <ResumeBuilderForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
