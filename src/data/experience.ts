export type ExperienceEntry = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    title: "Automation Test Engineer | Software Engineer Trainee",
    company: "Iesoft Technologies",
    location: "Remote",
    period: "Oct 2024 – Present",
    bullets: [
      "Executed E2E manual and automated test plans across a 41-module responsive SaaS application, identifying complex edge cases.",
      "Performed initial Root Cause Analysis (RCA) on defect submissions using Chrome DevTools (Network/Console tabs) and frontend source code tracing.",
      "Engineered custom SQL queries with Trino for database-level verification, data integrity, and schema conformance checks.",
      "Migrating the team's Selenium/Java regression suite to Playwright, leveraging its native AI agent workflow (Planner/Generator/Healer) to auto-generate test specs and self-heal locators. Built ~13 business-outcome test units across payment, patient, pharmacy, appointment, and authentication workflows via Playwright CLI plus MCP, asserting financial invariants and data persistence rather than surface-level UI checks, with migration continuing module by module.",
      "Coordinated QA release sign-off across an average of 6+ builds per release cycle, documenting defect reports and reproduction steps.",
      "Configured scheduled automated test execution via GitHub Actions CI/CD, implementing runner cleanup scripts to terminate orphaned Chrome/driver processes and maintain pipeline reliability.",
      "Executed REST API validation using Postman and security testing with Burp Suite.",
      "Traced defects into frontend source code and implemented targeted fixes in React/Angular components.",
      "Built an internal AI-assisted QA workflow: feature intake via AI chat, automated structured Trello card generation, and automated multi-audience release summaries generated from the release board.",
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
