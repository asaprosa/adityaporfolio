export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  highlights: string[];
  link?: string;
  linkLabel?: string;
  repo?: string;
  secondaryLink?: string;
  secondaryLinkLabel?: string;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "gold-silver-loan-system",
    title: "Gold & Silver Loan Management System",
    subtitle: "Freelance project",
    description:
      "A staff-facing web app for a pawn-loan (gold/silver) shop, plus a self-service portal for the shop's B2B wholesale customers (Vyaparis) — covering the full loan lifecycle: pledge, release, renewal, top-up, and partial repayment, with two fully isolated authentication systems for staff vs. self-service customers.",
    tech: ["Next.js 16", "TypeScript", "React 19", "Prisma", "PostgreSQL", "Tailwind CSS"],
    highlights: [
      "Architected a multi-transaction-type loan engine (pledge, release, renewal, top-up, partial-repayment) with a 3-mode interest calculator (slab/prorata/manual), validated against 799 real historical releases with zero discrepancies via a dedicated replay script.",
      "Built two fully isolated auth systems: NextAuth v5 (JWT) for staff with OWNER/ASSISTANT roles, and a separate custom HMAC-SHA256 signed-cookie session for the Vyapari self-service portal — no shared session concept between the two.",
      "Implemented dual QR/HID scanning input (Bluetooth scanner and phone-camera decode) feeding one shared per-workflow scan handler, used across single-item release, bulk release, and daily Vyapari settlement (Hishob).",
      "Backed by 153 unit tests (Vitest, 12 files) chaining real production interest/settlement functions, plus Playwright E2E coverage.",
    ],
    images: [
      {
        src: "/images/projects/gold-silver-dashboard.png",
        alt: "Gold & Silver Loan Management System — staff dashboard",
      },
      {
        src: "/images/projects/gold-silver-vyapari-hishob.png",
        alt: "Gold & Silver Loan Management System — Vyapari daily Hishob settlement",
      },
      {
        src: "/images/projects/gold-silver-melting-register.png",
        alt: "Gold & Silver Loan Management System — melting/warning register",
      },
    ],
  },
  {
    slug: "qa-automation-engine",
    title: "Multi-Model AI & Risk-Scored QA Automation Engine",
    subtitle: "Internal QA tooling",
    description:
      "A risk-prioritization engine and serverless automation suite that cuts pre-test planning overhead by orchestrating multiple LLMs with resilient fallbacks.",
    tech: ["Node.js", "Vercel", "Playwright", "Groq", "Claude", "Gemini"],
    highlights: [
      "Architected a 7-factor usage-calibrated risk-scoring algorithm with dependency-graph traversal across 41 SaaS modules, backed by a 122-case node:test suite that is estimated to cut manual test-planning prep from 30–45 minutes to under 5 minutes per feature.",
      "Integrated Gemini, Claude, and Groq (Llama 3.3 70B) with exponential backoff, token-budget tuning, and prompt-calibration loops for multi-LLM resilience.",
      "Developed a Telegram-to-Trello automation webhook on Vercel handling custom Unicode/bidi text parsing.",
    ],
    images: [
      {
        src: "/images/projects/qa-tools-create-card.png",
        alt: "QA Tools — Create Test Card view, generating a Trello card with a grounded test plan from a pasted feature description",
      },
      {
        src: "/images/projects/qa-tools-release-summary.png",
        alt: "QA Tools — Release Summary view, reading the Trello board and generating release summaries plus a production changes log",
      },
      {
        src: "/images/projects/qa-tools-trello-card.png",
        alt: "The resulting Trello card — a generated test plan checklist, fully completed, tied to a real production feature",
      },
    ],
  },
  {
    slug: "ats-resume-tailor",
    title: "ATS Resume Tailor",
    subtitle: "Browser-only resume tailoring app",
    description:
      "A bring-your-own-key app that tailors a resume to a job description: it extracts what the JD actually requires, scores the resume against it, and generates a keyword-optimized, ATS-friendly LaTeX resume — plus a cover letter, interview prep, and a LinkedIn About. A deterministic verification pass flags any generated metric that isn't traceable back to the source resume.",
    tech: ["React", "Vite", "JavaScript", "Kimi", "Gemini", "Groq", "NVIDIA NIM"],
    highlights: [
      "JD analysis extracts required/preferred skills, responsibilities, and ATS keywords from a pasted job description. Resume input supports PDF/DOCX/TXT upload — parsed entirely client-side via pdf.js and mammoth, never uploaded anywhere — or pasting directly.",
      "Scores the resume across ATS score, keyword match, and experience/skill/responsibility match, then generates a tailored resume as clean, ATS-friendly LaTeX (or fills in your own .tex template), plus a keyword report, missing-skills report, interview prep, cover letter, and LinkedIn About — each grounded only in the resume you provide.",
      "Multi-provider fallback tries Kimi, then Gemini, then Groq, then NVIDIA NIM — built after a real billing suspension on one provider mid-project, so no single provider outage blocks generation.",
      "Runs entirely in the browser with no backend: visitors bring their own free API key, stored only in localStorage and sent directly to the provider. Verified by grepping the production bundle for key-shaped strings, not just asserted.",
    ],
    repo: "https://github.com/AdityaGhodkeIesoftek/ResumeFromJD",
    link: "https://resumetemplatefromjd.vercel.app/",
    secondaryLink: "/resume-builder",
    secondaryLinkLabel: "Or try the lite demo built into this portfolio",
    images: [
      {
        src: "/images/projects/ats-resume-tailor-scorer.png",
        alt: "ATS Resume Tailor — ATS Resume tab showing the generated LaTeX resume alongside ATS score, keyword match, and skills gauges",
      },
      {
        src: "/images/projects/ats-resume-tailor-keywords.png",
        alt: "ATS Resume Tailor — Keyword Report tab listing job-description keywords, whether each is present in the resume, and where to place missing ones",
      },
      {
        src: "/images/projects/ats-resume-tailor-api-keys.png",
        alt: "ATS Resume Tailor — API Key Settings modal explaining the bring-your-own-key model across Gemini, Groq, NVIDIA NIM, and Kimi",
      },
    ],
  },
];
