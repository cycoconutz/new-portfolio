import { useEffect } from "react";

// RESUME_VERSION is rewritten automatically by the resume-generator on every
// new resume. The ?v= query busts the CDN/browser cache so recruiters always
// get the current file even though the path stays stable.
const RESUME_VERSION = "1.3.6";
const RESUME_HREF = `${process.env.PUBLIC_URL || ""}/resume.pdf?v=${RESUME_VERSION}`;

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --slate: #23262b;
    --panel: #2b2f35;
    --pane: #1a1d21;
    --alu: #c9ccd1;
    --mut: #7d848d;
    --faint: #5b626b;
    --teal: #1c4e46;
    --led: #f0a020;
    --cable: #e0452f;
    --line: rgba(201, 204, 209, 0.14);
    --grot: 'Schibsted Grotesk', system-ui, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--grot);
    background: var(--slate);
    color: var(--alu);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  .wrap { position: relative; z-index: 1; max-width: 76rem; margin: 0 auto; padding: 0 2rem; }

  /* Reveal */
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* Nav */
  nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; color: var(--alu); text-decoration: none; letter-spacing: 0.02em; }
  .brand .led { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--led); box-shadow: 0 0 10px var(--led); animation: pulse 2.6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
  .nav-links { display: flex; gap: 1.7rem; list-style: none; }
  .nav-links a { color: var(--mut); text-decoration: none; font-size: 0.82rem; font-weight: 500; transition: color .2s; }
  .nav-links a:hover { color: var(--led); }

  /* Hero */
  .hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: center; padding: 4.5rem 0 3.5rem; }
  .kicker { font-family: var(--mono); font-size: 0.72rem; color: var(--led); letter-spacing: 0.06em; margin-bottom: 1.3rem; }
  .hero-title { font-weight: 700; font-size: clamp(2.6rem, 6vw, 5rem); line-height: 1; letter-spacing: -0.03em; }
  .hero-title em { font-style: normal; color: var(--led); }
  .hero-sub { margin-top: 1.5rem; max-width: 32rem; font-size: 1.04rem; line-height: 1.7; color: #aeb4bb; }
  .hero-sub b { color: var(--alu); font-weight: 600; }
  .hero-cta { margin-top: 2.2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.55rem;
    font-family: var(--grot); font-weight: 600; font-size: 0.85rem; text-decoration: none;
    padding: 0.8rem 1.5rem; background: var(--led); color: #1a1d21;
    border: none; border-radius: 6px; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(240,160,32,0.3); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.55rem;
    font-family: var(--grot); font-weight: 500; font-size: 0.85rem; text-decoration: none;
    padding: 0.8rem 1.4rem; background: transparent; color: var(--alu);
    border: 1px solid rgba(201,204,209,0.3); border-radius: 6px;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: var(--led); color: var(--led); }
  .cta-icon { width: 14px; height: 14px; flex: none; }
  .hero-meta { margin-top: 2.6rem; font-family: var(--mono); font-size: 0.76rem; color: var(--mut); line-height: 2; }
  .hero-meta .k { color: var(--faint); }
  .hero-meta .ok { color: var(--led); }

  /* Patch panel */
  .panel {
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 1.4rem; position: relative;
    box-shadow: 0 30px 60px -30px #000, inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .panel .screw { position: absolute; width: 0.7rem; height: 0.7rem; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #4a5058, #22262b); box-shadow: inset 0 0 2px #000; }
  .screw.tl { top: 0.55rem; left: 0.55rem; }
  .screw.tr { top: 0.55rem; right: 0.55rem; }
  .screw.bl { bottom: 0.55rem; left: 0.55rem; }
  .screw.br { bottom: 0.55rem; right: 0.55rem; }
  .panel svg { display: block; width: 100%; height: auto; }
  .cablepath { fill: none; stroke: var(--cable); stroke-width: 4; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(224,69,47,0.5)); }
  .sig { fill: none; stroke: #ffd9a0; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 16 240; animation: travel 3.4s linear infinite; }
  @keyframes travel { to { stroke-dashoffset: -256; } }
  .panel .plabel { position: absolute; bottom: 0.7rem; right: 1rem; font-family: var(--mono); font-size: 0.6rem; color: var(--faint); letter-spacing: 0.08em; }

  /* Signal ribbon */
  .ribbon { position: relative; background: var(--pane); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); overflow: hidden; }
  .ribbon .band { display: flex; gap: 2.4rem; width: max-content; padding: 1.05rem 0; animation: roll 34s linear infinite; align-items: center; }
  .ribbon:hover .band { animation-play-state: paused; }
  .sigitem { display: inline-flex; align-items: center; gap: 0.7rem; white-space: nowrap; font-family: var(--mono); font-size: 0.86rem; color: var(--alu); }
  .sigitem::before { content: ''; width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px rgba(28,78,70,0.9); }
  .sigitem.on::before { background: var(--led); box-shadow: 0 0 8px var(--led); }
  .ribbon .scan { position: absolute; top: 0; bottom: 0; width: 16rem; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(240,160,32,0.12), transparent); animation: scan 6s linear infinite; }
  @keyframes scan { from { transform: translateX(-16rem); } to { transform: translateX(100vw); } }
  @keyframes roll { to { transform: translateX(-50%); } }

  /* Sections */
  section { padding: 5rem 0; border-top: 1px solid var(--line); }
  .sec-kicker { font-family: var(--mono); font-size: 0.74rem; color: var(--led); margin-bottom: 1rem; }
  .sec-title { font-size: clamp(1.6rem, 3.4vw, 2.3rem); font-weight: 700; letter-spacing: -0.01em; margin-bottom: 2.6rem; }

  /* About */
  .about-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 3.5rem; }
  .about-text { font-size: 0.95rem; line-height: 1.85; color: #aeb4bb; }
  .about-text p + p { margin-top: 1.3rem; }
  .about-text strong { color: var(--alu); font-weight: 600; }

  /* Patch points / modules */
  .mod { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 1.3rem 1.5rem; margin-bottom: 1.1rem; display: grid; grid-template-columns: 14rem 1fr; gap: 1.6rem; align-items: center; transition: border-color .2s; }
  .mod:hover { border-color: rgba(240,160,32,0.4); }
  .mod .name { font-family: var(--mono); font-size: 0.72rem; color: var(--led); }
  .mod .name big { display: block; font-family: var(--grot); font-weight: 600; font-size: 1.05rem; color: var(--alu); margin-top: 0.35rem; }
  .jacks { display: flex; flex-wrap: wrap; gap: 1.4rem 1.8rem; }
  .jack { display: flex; flex-direction: column; align-items: center; gap: 0.45rem; }
  .jack .hole { width: 1.35rem; height: 1.35rem; border-radius: 50%; background: #111417; border: 2px solid #3a4048; box-shadow: inset 0 2px 4px #000; transition: .2s; }
  .jack .lab { font-family: var(--mono); font-size: 0.63rem; color: var(--mut); text-align: center; max-width: 6.5rem; transition: color .2s; }
  .jack:hover .hole { border-color: var(--led); box-shadow: 0 0 12px rgba(240,160,32,0.6), inset 0 0 6px rgba(240,160,32,0.4); }
  .jack:hover .lab { color: var(--alu); }

  /* Signal routing / projects */
  .route { display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: baseline; padding: 1.6rem 0; border-bottom: 1px solid rgba(201,204,209,0.1); }
  .route .port { font-family: var(--mono); font-size: 0.72rem; color: var(--cable); }
  .route .nm { font-size: 1.3rem; font-weight: 600; color: var(--alu); text-decoration: none; transition: color .2s; }
  .route .nm:hover { color: var(--led); }
  .route .tag { font-family: var(--mono); font-size: 0.6rem; color: var(--led); border: 1px solid rgba(240,160,32,0.4); border-radius: 4px; padding: 0.12rem 0.45rem; margin-left: 0.7rem; vertical-align: middle; text-transform: uppercase; letter-spacing: 0.06em; }
  .route .ds { margin-top: 0.5rem; font-size: 0.92rem; color: #9aa1a9; max-width: 50ch; }
  .route .tech { display: flex; flex-wrap: wrap; gap: 0.4rem 0.7rem; margin-top: 0.7rem; list-style: none; }
  .route .tech li { font-family: var(--mono); font-size: 0.66rem; color: var(--faint); }
  .route .links { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; }
  .route .links a { font-family: var(--mono); font-size: 0.72rem; color: var(--mut); text-decoration: none; transition: color .2s; }
  .route .links a:hover { color: var(--led); }
  .catalog-cta { display: flex; justify-content: center; margin-top: 3rem; }
  .catalog-btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--panel); border: 1px solid var(--line); color: var(--alu);
    padding: 0.85rem 1.8rem; border-radius: 6px;
    font-size: 0.74rem; font-weight: 600; text-decoration: none;
    transition: color .2s, border-color .2s, transform .15s;
  }
  .catalog-btn:hover { border-color: var(--led); color: var(--led); transform: translateY(-1px); }
  .catalog-arrow { transition: transform .2s; }
  .catalog-btn:hover .catalog-arrow { transform: translateX(4px); }

  /* Experience */
  .exp-row { display: grid; grid-template-columns: 12rem 1fr; gap: 2.4rem; padding: 1.8rem 0; border-top: 1px solid rgba(201,204,209,0.1); }
  .exp-date { font-family: var(--mono); font-size: 0.76rem; color: var(--cable); padding-top: 0.2rem; }
  .exp-role { font-size: 1.15rem; font-weight: 600; color: var(--alu); }
  .exp-company { font-family: var(--mono); font-size: 0.72rem; color: var(--led); margin: 0.45rem 0 0.7rem; }
  .exp-desc { font-size: 0.92rem; line-height: 1.8; color: #9aa1a9; max-width: 44rem; }

  /* Contact */
  .contact { text-align: center; }
  .contact .sec-kicker { display: block; }
  .contact-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.02em; }
  .contact-sub { margin: 1.3rem auto 0; max-width: 32rem; font-size: 0.95rem; line-height: 1.8; color: #aeb4bb; }
  .contact-email { display: inline-block; margin-top: 2.4rem; font-family: var(--mono); font-size: clamp(1.2rem, 3.2vw, 1.9rem); font-weight: 600; color: var(--led); text-decoration: none; border-bottom: 1px dashed rgba(240,160,32,0.45); padding-bottom: 4px; }
  .contact-email:hover { border-bottom-style: solid; }
  .socials { display: flex; justify-content: center; gap: 1rem; margin-top: 3rem; flex-wrap: wrap; }
  .socials a {
    display: inline-flex; align-items: center; gap: 0.55rem;
    font-family: var(--mono); font-size: 0.74rem; color: var(--mut); text-decoration: none;
    border: 1px solid var(--line); border-radius: 6px; padding: 0.6rem 1.2rem;
    transition: color .2s, border-color .2s;
  }
  .socials a:hover { color: var(--led); border-color: var(--led); }
  .socials svg { width: 13px; height: 13px; }

  /* Footer */
  footer { border-top: 1px solid var(--line); }
  .foot { display: flex; justify-content: space-between; align-items: center; padding: 1.8rem 0; font-family: var(--mono); font-size: 0.72rem; color: var(--faint); }
  .foot .led { color: var(--led); }

  @media (max-width: 860px) {
    .wrap { padding: 0 1.5rem; }
    nav { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.3rem 0; }
    .nav-links { flex-wrap: wrap; gap: 1.2rem; }
    .hero { grid-template-columns: 1fr; gap: 2rem; padding: 3rem 0; }
    .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .mod { grid-template-columns: 1fr; gap: 1rem; }
    .route { grid-template-columns: 1fr; gap: 0.7rem; }
    .route .links { flex-direction: row; align-items: center; }
    .exp-row { grid-template-columns: 1fr; gap: 0.5rem; }
    .foot { flex-direction: column; gap: 0.6rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    .ribbon .band, .ribbon .scan, .sig, .brand .led { animation: none; }
  }
`;

const projects = [
  {
    num: "01",
    title: "Lulla",
    tag: "featured",
    desc: "A calm, local-first baby & parent tracker — one-tap feeding, sleep, diaper, growth and routine logs with a live timer, WHO growth charts, and optional family sync across devices. Free, no accounts, no ads.",
    tech: ["TypeScript", "React", "Vite", "PWA", "Neon"],
    live: "https://lulla.dev/landing/",
    repo: "https://github.com/cycoconutz/lulla",
  },
  {
    num: "02",
    title: "Deadwax",
    tag: "latest",
    desc: "A full-stack vinyl marketplace with full-text catalog search, cart and transactional checkout, seller fulfillment dashboards, verified reviews, and an admin moderation back office.",
    tech: ["TypeScript", "React", "Fastify", "PostgreSQL", "Drizzle ORM"],
    live: "https://deadwax-exee.onrender.com/",
    repo: "https://github.com/cycoconutz/deadwax",
  },
  {
    num: "03",
    title: "VAULT",
    tag: "project",
    desc: "A brutalist explorer for the Art Institute of Chicago — search, filter, and pin 65,000+ artworks straight from the museum's open-access API, with debounced, URL-synced search.",
    tech: ["TypeScript", "React", "Vite", "REST API"],
    live: "https://cycoconutz.github.io/vault/",
    repo: "https://github.com/cycoconutz/vault",
  },
  {
    num: "04",
    title: "Karmatic",
    tag: "project",
    desc: "A MERN-stack single-page app built as a three-person collaborative bootcamp capstone with authentication and live data.",
    tech: ["JavaScript", "React", "Express", "MongoDB"],
    live: "https://karmatic.onrender.com/",
    repo: "https://github.com/cycoconutz/Karmatic",
  },
  {
    num: "05",
    title: "TwilightVotes",
    tag: "featured",
    desc: "A voting tracker for Twilight Imperium agenda phases where players can create sessions, add factions, and tally votes across agendas in real time. Live at twilightvotes.com.",
    tech: ["React", "TypeScript", "Tailwind CSS", "TanStack Query"],
    live: "https://www.twilightvotes.com/",
    repo: "https://github.com/cycoconutz/Twilight-Votes",
  },
  {
    num: "06",
    title: "Ledger",
    tag: "project",
    desc: "A zero-backend revenue & receipt tracker: import CSV sales exports (like a Depop report), review revenue in a filterable table, and log expenses with categories, labels, and receipt photos — all stored on-device with IndexedDB.",
    tech: ["JavaScript", "HTML/CSS", "IndexedDB", "CSV"],
    live: "https://cycoconutz.github.io/revenue-tracker/",
    repo: "https://github.com/cycoconutz/revenue-tracker",
  },
];

const skillGroups = [
  {
    cat: "LANGUAGES",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL", "HTML5", "CSS3"],
  },
  {
    cat: "FRONTEND",
    items: ["React 18/19", "Redux", "Tailwind CSS", "TanStack Query", "Vite", "Handlebars", "jQuery", "Responsive Design", "Accessibility"],
  },
  {
    cat: "BACKEND & DATA",
    items: ["Node.js", "Express", "Fastify", "REST APIs", "GraphQL / Apollo", "PostgreSQL", "MySQL", "MongoDB", "IndexedDB", "Drizzle ORM", "Neon"],
  },
  {
    cat: "TESTING & QUALITY",
    items: ["Jest", "React Testing Library"],
  },
  {
    cat: "TOOLS & WORKFLOW",
    items: ["Git / GitHub", "GitHub Actions", "npm", "Figma", "Docker", "Render", "Salesforce", "AI-Assisted Tooling"],
  },
];

const experience = [
  {
    date: "2022 — present",
    role: "Web Developer",
    company: "KUKUI",
    desc: "Building and maintaining web solutions for automotive service businesses. Integrating point-of-sale platforms, inventory systems, and employee scheduling tools while ensuring performance and reliability across client deployments.",
  },
  {
    date: "2021 — 2022",
    role: "Teaching Assistant",
    company: "Coding Bootcamp",
    desc: "Guided students through Full-Stack Development fundamentals — JavaScript, React, Node.js, MySQL, and more. Resolved technical issues, reported deprecated curriculum, and helped students build autonomy and passion for front-end development.",
  },
  {
    date: "2020 — 2021",
    role: "Software Dev Immersive",
    company: "Coding Bootcamp Graduate",
    desc: "450+ hour intensive program covering Full-Stack Development: JavaScript, React, jQuery, MySQL, APIs, Git, Node.js, Express, Jest, Handlebars, MongoDB, GraphQL, and Salesforce.",
  },
];

const ribbonSkills = skillGroups.flatMap((group) => group.items);

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Portfolio() {
  useReveal();

  return (
    <>
      <style>{styles}</style>

      <div className="wrap">
        <nav>
          <a href="#top" className="brand">
            <span className="led" /> JOHN YATES
          </a>
          <ul className="nav-links">
            {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>{item.toLowerCase()}</a>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {/* Hero */}
          <section id="top" className="hero">
            <div className="reveal">
              <p className="kicker">{"// full-stack developer · Lafayette, LA"}</p>
              <h1 className="hero-title">
                Everything<br />
                <em>connected.</em>
              </h1>
              <p className="hero-sub">
                I'm John Yates. I build web apps where the pieces actually{" "}
                <b>plug into each other</b> &mdash; a React surface, a clean API,
                a database that behaves.
              </p>
              <div className="hero-cta">
                <a href="#projects" className="btn">
                  See the work
                </a>
                <a href={RESUME_HREF} className="btn-ghost" download>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cta-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Résumé
                </a>
                <a href="#contact" className="btn-ghost">
                  Get in touch
                </a>
              </div>
              <div className="hero-meta">
                <div>
                  <span className="k">contact:</span> johndyates<span className="k">@</span>gmail.com
                </div>
                <div>
                  <span className="k">location:</span> Lafayette, LA &nbsp;
                  <span className="k">status:</span> <span className="ok">available</span>
                </div>
              </div>
            </div>

            <div className="panel reveal">
              <span className="screw tl" />
              <span className="screw tr" />
              <span className="screw bl" />
              <span className="screw br" />
              <svg viewBox="0 0 320 220" role="img" aria-label="signal path from frontend to database">
                <path className="cablepath" d="M14,40 C90,40 80,180 160,180 S250,40 306,40" />
                <path className="sig" d="M14,40 C90,40 80,180 160,180 S250,40 306,40" />
                <circle cx="14" cy="40" r="6" fill="#2b2f35" stroke="#e0452f" strokeWidth="3" />
                <circle cx="306" cy="40" r="6" fill="#2b2f35" stroke="#e0452f" strokeWidth="3" />
                <circle cx="160" cy="180" r="6" fill="#2b2f35" stroke="#f0a020" strokeWidth="3" />
              </svg>
              <span className="plabel">SIGNAL PATH &middot; REV {RESUME_VERSION}</span>
            </div>
          </section>
        </main>
      </div>

      {/* Signal ribbon */}
      <div className="ribbon" aria-hidden="true">
        <div className="band">
          {[...ribbonSkills, ...ribbonSkills].map((skill, i) => (
            <span key={`${skill}-${i}`} className={"sigitem" + (i % 3 === 0 ? " on" : "")}>
              {skill}
            </span>
          ))}
        </div>
        <span className="scan" />
      </div>

      <div className="wrap">
        <main>
          {/* About + Skills */}
          <section id="about">
            <p className="sec-kicker reveal">{"// about"}</p>
            <h2 className="sec-title reveal">who_i_am</h2>
            <div className="about-grid">
              <div className="about-text reveal">
                <p>
                  I'm a <strong>full-stack web developer</strong> based in Lafayette, LA,
                  currently building web solutions at <strong>KUKUI</strong> for automotive
                  service businesses. I love turning complex problems into clean, intuitive
                  digital experiences.
                </p>
                <p>
                  My background spans the entire stack — from responsive React frontends to
                  Node/Express APIs backed by PostgreSQL and MongoDB. I care deeply about{" "}
                  <strong>code quality, performance,</strong> and shipping things that actually
                  work.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new frameworks, contributing to
                  side projects, or leveling up my skills in whatever's new and interesting in
                  the dev world.
                </p>
              </div>
              <div className="skills reveal" id="skills">
                {skillGroups.map((group) => (
                  <div className="mod" key={group.cat}>
                    <div className="name">
                      MODULE {String(skillGroups.indexOf(group) + 1).padStart(2, "0")}
                      <big>{group.cat}</big>
                    </div>
                    <div className="jacks">
                      {group.items.map((item) => (
                        <div className="jack" key={item} title={item}>
                          <span className="hole" />
                          <span className="lab">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects">
            <p className="sec-kicker reveal">{"// signal routing"}</p>
            <h2 className="sec-title reveal">selected_projects</h2>

            {projects.map((p) => (
              <div className="route reveal" key={p.title}>
                <span className="port">OUT {p.num}</span>
                <div>
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="nm">
                    {p.title}
                  </a>
                  <span className="tag">{p.tag}</span>
                  <p className="ds">{p.desc}</p>
                  <ul className="tech">
                    {p.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="links">
                  <a href={p.live} target="_blank" rel="noopener noreferrer">
                    open &#8599;
                  </a>
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    source &#8599;
                  </a>
                </div>
              </div>
            ))}

            <div className="catalog-cta reveal">
              <a
                href="https://cycoconutz.github.io/portfolio-tabs/"
                target="_blank"
                rel="noopener noreferrer"
                className="catalog-btn"
              >
                view the full project catalog <span className="catalog-arrow">&#8594;</span>
              </a>
            </div>
          </section>

          {/* Experience */}
          <section id="experience">
            <p className="sec-kicker reveal">{"// maintenance log"}</p>
            <h2 className="sec-title reveal">experience</h2>

            {experience.map((exp) => (
              <div className="exp-row reveal" key={exp.role}>
                <div className="exp-date">{exp.date}</div>
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                  <p className="exp-desc">{exp.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Contact */}
          <section id="contact" className="contact">
            <p className="sec-kicker reveal">{"// open channel"}</p>
            <h2 className="contact-title reveal">Let's connect.</h2>
            <p className="contact-sub reveal">
              Open to new opportunities, collaborations, and interesting projects.
              Drop me a line &mdash; I always respond.
            </p>
            <a href="mailto:johndyates@gmail.com" className="contact-email reveal">
              johndyates@gmail.com
            </a>
            <div className="socials reveal">
              <a href={RESUME_HREF} download>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                résumé
              </a>
              <a href="https://github.com/cycoconutz" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                github
              </a>
              <a href="https://www.linkedin.com/in/danny-yates/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0z" />
                </svg>
                linkedin
              </a>
              <a href="https://github.com/cycoconutz/new-portfolio" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                source code
              </a>
            </div>
          </section>
        </main>

        <footer>
          <div className="foot">
            <span>© 2026 JOHN YATES</span>
            <span>
              <span className="led">●</span> SIGNAL OK &nbsp;·&nbsp; BUILT WITH REACT
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
