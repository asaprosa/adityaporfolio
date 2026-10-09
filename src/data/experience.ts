export type ExperienceGroup = {
  label: string;
  /** Indexes into the role's bullets. The bullet text itself is never copied here. */
  bullets: number[];
};

export type ExperienceEntry = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  groups?: ExperienceGroup[];
};

/**
 * The figures that appear both in the stat row and inside the bullet text. The bullets below are built
 * from this constant, so the two can never drift apart.
 */
export const experienceStats = {
  e2eCases: 700,
  e2eCasesFrom: 300,
  playwrightScenarios: 25,
  modules: 41,
  buildsPerRelease: 6,
} as const;

export const experienceStatItems = [
  { value: experienceStats.e2eCases, suffix: "+", label: `E2E cases (from ${experienceStats.e2eCasesFrom})` },
  { value: experienceStats.playwrightScenarios, suffix: "+", label: "Playwright scenarios" },
  { value: experienceStats.modules, suffix: "", label: "modules" },
  { value: experienceStats.buildsPerRelease, suffix: "+", label: "builds per release (average)" },
];

export const experience: ExperienceEntry[] = [
  {
    title: "Automation Test Engineer | Software Engineer Trainee",
    company: "Iesoft Technologies",
    location: "Remote",
    period: "Oct 2024 – Present",
    bullets: [
      `Executed E2E manual and automated test plans across a ${experienceStats.modules}-module responsive SaaS application, identifying complex edge cases.`,
      "Performed initial Root Cause Analysis (RCA) on defect submissions using Chrome DevTools (Network/Console tabs) and frontend source code tracing.",
      "Engineered custom SQL queries with Trino for database-level verification, data integrity, and schema conformance checks.",
      `Expanded Java + Selenium regression coverage from ${experienceStats.e2eCasesFrom} to ${experienceStats.e2eCases}+ E2E cases; migrating the team's Selenium/Java regression suite to Playwright, leveraging its native AI agent workflow (Planner/Generator/Healer) to auto-generate test specs and self-heal locators. Built ${experienceStats.playwrightScenarios}+ business-outcome test scenarios across payment, appointment, consultation, patient, and pharmacy workflows via Playwright CLI plus MCP, asserting financial invariants and data persistence rather than surface-level UI checks, with migration continuing module by module.`,
      `Coordinated QA release sign-off across an average of ${experienceStats.buildsPerRelease}+ builds per release cycle, documenting defect reports and reproduction steps.`,
      "Configured scheduled automated test execution via GitHub Actions CI/CD, implementing runner cleanup scripts to terminate orphaned Chrome/driver processes and maintain pipeline reliability.",
      "Executed REST API validation using Postman and security testing with Burp Suite.",
      "Traced defects into frontend source code and implemented targeted fixes in React/Angular components.",
      "Built an internal AI-assisted QA workflow: feature intake via AI chat, automated structured Trello card generation, and automated multi-audience release summaries generated from the release board.",
    ],
    groups: [
      // Playwright migration, GitHub Actions CI/CD, AI-assisted QA workflow
      { label: "Automation and tooling", bullets: [3, 5, 8] },
      // E2E test plans, Trino SQL checks, Postman and Burp
      { label: "Coverage and verification", bullets: [0, 2, 6] },
      // root cause analysis, frontend defect fixes, release sign-off
      { label: "Defects and releases", bullets: [1, 7, 4] },
    ],
  },
];

export const education = {
  degree: "Bachelor of Engineering in Artificial Intelligence & Data Science",
  school: "P.E.S. Modern College of Engineering, Pune, India",
  period: "Graduated 2024",
  detail: "CGPA: 8.2 / 10",
};

export const achievements = [
  {
    label: "Research Publication",
    detail: 'Author of "Blockchain and AI in Pharmaceutical Supply Chain", published in IJCRR, April 2024.',
  },
  {
    label: "Hackathon Recognition",
    detail: "Awarded 2nd Prize at Engineering Project Exhibition for designing a distributed Blockchain ledger network.",
  },
];
