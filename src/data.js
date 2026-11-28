export const projects = [
  {
    id: "lulla",
    num: "01",
    title: "Lulla",
    tag: "featured",
    desc: "A calm, local-first family tracker: one-tap feeding, sleep, diaper and routine logs with a live timer, milestones, and optional account-based family sync across devices. Free, no ads.",
    tech: ["TypeScript", "React", "Vite", "PWA", "Neon"],
    // Verified: package.json (react-router-dom, tailwindcss, zustand, recharts, vitest, @testing-library/react, dexie).
    skills: ["typescript", "react", "react-router", "vite", "tailwind", "zustand", "recharts", "pwa", "indexeddb", "postgresql", "sql", "vitest", "rtl", "html-css"],
    live: "https://lulla.dev/landing/",
    repo: "https://github.com/cycoconutz/lulla",
  },
  {
    id: "deadwax",
    num: "02",
    title: "Deadwax",
    tag: "featured",
    desc: "A full-stack vinyl marketplace with a checkout that cannot oversell: race-safe stock claims, Stripe payments with idempotency keys, replay-safe signed webhooks, and a transactional outbox. Plus full-text catalog search, seller fulfillment dashboards, and an admin back office.",
    proof: [
      ["1 of 20", "concurrent checkouts win the last copy"],
      ["0", "duplicate charges or rows"],
      ["p95 5 ms", "at 50 rps in a local load test"],
    ],
    tech: ["TypeScript", "React", "Fastify", "PostgreSQL", "Drizzle ORM", "Stripe", "OpenTelemetry", "Vitest"],
    // Skill ids this project uses (Node.js is verified: Fastify on Node 22, but not a visible chip).
    // Verified: client/package.json (react-router-dom, @tanstack/react-query, vite), server/package.json (zod, vitest).
    skills: ["typescript", "react", "react-router", "tanstack-query", "vite", "nodejs", "fastify", "zod", "postgresql", "sql", "drizzle-orm", "stripe", "opentelemetry", "vitest", "html-css"],
    live: "https://deadwax-exee.onrender.com/",
    repo: "https://github.com/cycoconutz/deadwax",
  },
  {
    id: "ironlog",
    num: "03",
    title: "IronLog",
    tag: "project",
    desc: "A full-stack strength-training log: record sessions set by set, then see weekly volume, muscle-group splits, streaks, and estimated-1RM personal records. A Spring Boot API and a React SPA ship as a single Docker image over PostgreSQL.",
    tech: ["Java 21", "Spring Boot", "Spring Security", "JPA", "PostgreSQL", "React", "TypeScript", "Vite", "Docker"],
    // Verified: frontend/package.json (react-router-dom, recharts). e2e/ uses a CDP runner, not Playwright.
    skills: ["java-spring-boot", "spring-security", "jpa", "postgresql", "sql", "react", "react-router", "recharts", "typescript", "vite", "docker", "html-css"],
    live: "https://ironlog-llgm.onrender.com/",
    repo: "https://github.com/cycoconutz/ironlog",
  },
];

// Visible tech chip text to skill id, so a chip can toggle its skill.
export const techSkill = {
  TypeScript: "typescript",
  React: "react",
  Vite: "vite",
  PWA: "pwa",
  Neon: "postgresql",
  Fastify: "fastify",
  PostgreSQL: "postgresql",
  "Drizzle ORM": "drizzle-orm",
  Stripe: "stripe",
  OpenTelemetry: "opentelemetry",
  Vitest: "vitest",
  "Java 21": "java-spring-boot",
  "Spring Boot": "java-spring-boot",
  "Spring Security": "spring-security",
  JPA: "jpa",
  Docker: "docker",
};

export const skillGroups = [
  {
    cat: "LANGUAGES",
    items: [
      { id: "typescript", name: "TypeScript" },
      { id: "javascript", name: "JavaScript" },
      { id: "sql", name: "SQL" },
      { id: "html-css", name: "HTML / CSS" },
    ],
  },
  {
    cat: "FRONTEND",
    items: [
      { id: "react", name: "React" },
      { id: "vite", name: "Vite" },
      { id: "react-router", name: "React Router" },
      { id: "tailwind", name: "Tailwind CSS" },
      { id: "pwa", name: "PWA" },
    ],
  },
  {
    cat: "BACKEND",
    items: [
      { id: "nodejs", name: "Node.js", aliases: ["node"] },
      { id: "express", name: "Express" },
      { id: "fastify", name: "Fastify" },
      { id: "graphql", name: "GraphQL" },
      { id: "postgresql", name: "PostgreSQL" },
      { id: "mysql", name: "MySQL" },
      { id: "mongodb", name: "MongoDB" },
      { id: "drizzle-orm", name: "Drizzle ORM" },
    ],
  },
  {
    cat: "QUALITY & OPS",
    items: [
      { id: "vitest", name: "Vitest" },
      { id: "jest", name: "Jest" },
      { id: "rtl", name: "React Testing Library" },
      { id: "github-actions", name: "GitHub Actions" },
      { id: "docker", name: "Docker" },
      { id: "aws", name: "AWS" },
    ],
  },
];

export const alsoSkills = [
  { id: "nextjs", name: "Next.js" },
  { id: "stripe", name: "Stripe" },
  { id: "opentelemetry", name: "OpenTelemetry" },
  { id: "zod", name: "Zod" },
  { id: "redux", name: "Redux" },
  { id: "zustand", name: "Zustand" },
  { id: "tanstack-query", name: "TanStack Query" },
  { id: "recharts", name: "Recharts" },
  { id: "indexeddb", name: "IndexedDB" },
  { id: "playwright", name: "Playwright" },
  { id: "datadog", name: "Datadog" },
  { id: "figma", name: "Figma" },
  { id: "java-spring-boot", name: "Java / Spring Boot" },
  { id: "spring-security", name: "Spring Security" },
  { id: "jpa", name: "JPA" },
  { id: "csharp-dotnet", name: "C# / .NET" },
];

export const experience = [
  {
    date: "Sep 2022 - Sep 2026",
    location: "Remote",
    role: "Full-Stack Web Developer",
    company: "KUKUI",
    bullets: [
      "Shipped Node and Express APIs over MySQL and MongoDB on AWS; migrated REST to GraphQL with Apollo.",
      "Shipped 10 POS integrations including Tekmetric, plus React UIs for inventory and scheduling.",
      "Built 200 customer sites a year on an in-house CMS and raised Lighthouse scores 10 to 15 points.",
      "Owned features end to end for software used by thousands of people daily, from Figma to production.",
      "Reviewed code on a 32-person team, and wrote the onboarding and training docs new hires use.",
      "Wrote Jest tests, monitored production in Datadog, and traced bugs to root cause rather than symptoms.",
    ],
  },
  {
    date: "Jun 2022 - Sep 2022",
    role: "Teaching Assistant",
    company: "2U",
    desc: "Guided students through full-stack development fundamentals: JavaScript, React, Node.js, MySQL, and more. Resolved technical issues, reported deprecated curriculum, and helped students build autonomy in front-end development.",
  },
  {
    date: "2022",
    role: "Software Dev Immersive",
    company: "University of Texas at Austin",
    desc: "450+ hour intensive program covering full-stack development: JavaScript, React, jQuery, MySQL, APIs, Git, Node.js, Express, Jest, Handlebars, MongoDB, GraphQL, and Salesforce.",
  },
];

// The scrolling strip: a few headline skills, then everything in the "also" list.
export const ribbonSkills = [
  ...new Set([
    "TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL", "Fastify", "Stripe", "Docker", "Vitest", "Tailwind CSS",
    ...alsoSkills.map((s) => s.name),
  ]),
];

// ---- Skill lookups ----
export const allSkills = [...skillGroups.flatMap((g) => g.items), ...alsoSkills];

const experienceText = experience
  .map((e) => [e.desc, ...(e.bullets || [])].filter(Boolean).join(" "))
  .join(" ")
  .toLowerCase();

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// True when the skill's name (or an alias) appears as a whole word in experience copy.
export function usedInExperience(skill) {
  return [skill.name, ...(skill.aliases || [])].some((term) =>
    new RegExp(`(^|[^a-z0-9])${escapeRe(term.toLowerCase())}($|[^a-z0-9])`).test(experienceText)
  );
}
