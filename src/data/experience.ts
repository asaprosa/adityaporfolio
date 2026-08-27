export type ExperienceEntry = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    title: "Automation Test Engineer",
    company: "Iesoft Technologies",
    location: "Remote",
    period: "May 2025 – Present",
    bullets: [
      "Designed, developed, and executed detailed test plans, test cases, and test scenarios for web applications using manual and automation testing techniques.",
      "Utilized Postman for API testing, ensuring data integrity and validation.",
      "Collaborated closely with developers, product managers, and stakeholders to ensure quality deliverables, following Agile/Scrum methodologies.",
      "Orchestrated QA release sign-offs across an average of 6+ builds per release cycle, delivering detailed defect reports and readiness metrics.",
    ],
  },
  {
    title: "Software Engineer Trainee – Test Automation",
    company: "Iesoft Technologies",
    location: "Remote",
    period: "Oct 2024 – May 2025",
    bullets: [
      "Systematically grew the regression catalog from 300 to 700+ automated E2E test cases, expanding functional coverage and ensuring adherence to STLC processes.",
      "Identified, logged, and tracked defects, performing functional, regression, and integration testing.",
      "Constructed and maintained automated regression pipelines using GitHub Actions CI/CD systems.",
      "Analyzed developer source code to trace regression failures, applying targeted fixes to ensure product stability.",
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
