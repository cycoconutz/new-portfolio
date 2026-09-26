import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c0f;
    --panel: #101319;
    --line: rgba(226, 232, 240, 0.09);
    --text: #d6dce5;
    --muted: #7d8694;
    --faint: #565e6b;
    --accent: #e8ae4b;
    --ok: #7bd88f;
    --mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--mono);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 26px 26px;
    mask-image: linear-gradient(to bottom, black 0%, black 18%, transparent 55%);
  }
  .wrap { position: relative; z-index: 1; max-width: 70rem; margin: 0 auto; padding: 0 2rem; }

  /* Reveal */
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* Nav */
  nav { display: flex; align-items: center; justify-content: space-between; padding: 2rem 0; border-bottom: 1px solid var(--line); }
  .brand { font-size: 0.85rem; font-weight: 500; color: var(--text); text-decoration: none; }
  .brand b { color: var(--accent); font-weight: 500; }
  .brand .hint { color: var(--muted); }
  .nav-links { display: flex; gap: 1.8rem; list-style: none; }
  .nav-links a { font-size: 0.75rem; color: var(--muted); text-decoration: none; transition: color .2s; }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a .slash { color: var(--faint); }

  /* Hero */
  .hero { padding: 6.5rem 0 5.5rem; }
  .cmd { font-size: 0.8rem; color: var(--faint); margin-bottom: 2.4rem; }
  .cmd b { color: var(--accent); font-weight: 500; }
  .hero-title {
    font-size: clamp(2.6rem, 7vw, 5rem); font-weight: 800; line-height: 1.02;
    letter-spacing: -0.02em;
  }
  .cursor {
    display: inline-block; width: 0.55em; height: 1.02em; margin-left: 0.18em;
    background: var(--accent); vertical-align: text-bottom;
    animation: blink 1.1s steps(1) infinite;
  }
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  .hero-role { margin-top: 1.1rem; font-size: 0.92rem; color: var(--muted); }
  .hero-role b { color: var(--ok); font-weight: 500; }
  .hero-sub { margin-top: 2rem; max-width: 34rem; font-size: 0.86rem; font-weight: 300; line-height: 1.8; color: var(--muted); }
  .hero-cta { margin-top: 2.6rem; display: flex; align-items: center; gap: 1.2rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--accent); color: #101012;
    padding: 0.8rem 1.6rem; border-radius: 6px; text-decoration: none;
    font-size: 0.78rem; font-weight: 600; transition: background .2s, transform .15s;
    cursor: pointer; border: none;
  }
  .btn:hover { background: #f2bc60; transform: translateY(-1px); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.6rem;
    color: var(--text); text-decoration: none; font-size: 0.78rem; font-weight: 500;
    border: 1px solid var(--line); border-radius: 6px; padding: 0.8rem 1.4rem;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .hero-meta { margin-top: 3rem; font-size: 0.76rem; color: var(--faint); line-height: 2; }
  .hero-meta .k { color: var(--muted); }

  /* Sections */
  section { padding: 6rem 0; border-top: 1px solid var(--line); }
  .sec-cmd { font-size: 0.8rem; color: var(--faint); margin-bottom: 2.6rem; }
  .sec-cmd b { color: var(--accent); font-weight: 500; }
  .sec-title { font-size: clamp(1.6rem, 3.4vw, 2.3rem); font-weight: 700; letter-spacing: -0.01em; margin-bottom: 3rem; }

  /* About */
  .about-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 4rem; }
  .about-text { font-size: 0.86rem; font-weight: 300; line-height: 1.9; color: var(--muted); }
  .about-text p + p { margin-top: 1.4rem; }
  .about-text strong { color: var(--text); font-weight: 600; }
  .skill-group + .skill-group { margin-top: 2rem; }
  .skill-cat { font-size: 0.74rem; color: var(--accent); margin-bottom: 0.9rem; }
  .skill-cat::before { content: '> '; color: var(--faint); }
  .chips { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .chip {
    font-size: 0.72rem; color: var(--text); border: 1px solid var(--line);
    background: var(--panel); padding: 0.42rem 0.7rem; border-radius: 4px;
  }
  .chip::before { content: '['; color: var(--faint); }
  .chip::after { content: ']'; color: var(--faint); }

  /* Projects */
  .project-row {
    display: grid; grid-template-columns: 4.2rem 1fr auto; gap: 1.8rem;
    align-items: baseline; padding: 2.4rem 0; border-top: 1px solid var(--line);
  }
  .project-row:last-child { border-bottom: 1px solid var(--line); }
  .p-num { font-size: 0.78rem; color: var(--faint); }
  .p-num::before { content: './'; color: var(--accent); }
  .p-title-row { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
  .p-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.01em; transition: color .2s; }
  .p-title-link { color: inherit; text-decoration: none; }
  .p-title-link:hover { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 4px; }
  .project-row:hover .p-title { color: var(--accent); }
  .p-tag {
    font-size: 0.64rem; color: var(--ok); border: 1px solid rgba(123,216,143,0.4);
    padding: 0.18rem 0.5rem; border-radius: 4px;
  }
  .p-desc { margin-top: 0.8rem; max-width: 38rem; font-size: 0.78rem; font-weight: 300; line-height: 1.85; color: var(--muted); }
  .p-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.1rem; list-style: none; }
  .p-tech li { font-size: 0.68rem; color: var(--faint); }
  .p-tech li::before { content: '['; }
  .p-tech li::after { content: ']'; }
  .p-links { display: flex; flex-direction: column; gap: 0.6rem; align-items: flex-end; }
  .p-links a { font-size: 0.74rem; font-weight: 500; color: var(--muted); text-decoration: none; transition: color .2s; }
  .p-links a:hover { color: var(--accent); }
  .catalog-cta { display: flex; justify-content: center; margin-top: 3rem; }
  .catalog-btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--panel); border: 1px solid var(--line); color: var(--text);
    padding: 0.85rem 1.8rem; border-radius: 6px;
    font-size: 0.74rem; font-weight: 600; text-decoration: none;
    transition: color .2s, border-color .2s, transform .15s;
  }
  .catalog-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
  .catalog-arrow { transition: transform 0.2s; }
  .catalog-btn:hover .catalog-arrow { transform: translateX(4px); }

  /* Experience */
  .exp-row { display: grid; grid-template-columns: 11rem 1fr; gap: 2.6rem; padding: 2.2rem 0; border-top: 1px solid var(--line); }
  .exp-row:last-child { border-bottom: 1px solid var(--line); }
  .exp-date { font-size: 0.76rem; color: var(--faint); padding-top: 0.3rem; }
  .exp-role { font-size: 1.15rem; font-weight: 700; }
  .exp-company { font-size: 0.72rem; color: var(--accent); margin: 0.5rem 0 0.8rem; }
  .exp-company::before { content: '@ '; }
  .exp-desc { font-size: 0.8rem; font-weight: 300; line-height: 1.85; color: var(--muted); max-width: 40rem; }

  /* Contact */
  .contact { text-align: center; }
  .contact .sec-cmd { display: flex; justify-content: center; }
  .contact-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; }
  .contact-sub { margin: 1.4rem auto 0; max-width: 30rem; font-size: 0.82rem; font-weight: 300; line-height: 1.9; color: var(--muted); }
  .contact-email {
    display: inline-block; margin-top: 2.6rem;
    font-size: clamp(1.3rem, 3.4vw, 2rem); font-weight: 600; color: var(--accent);
    text-decoration: none; border-bottom: 1px dashed rgba(232,174,75,0.4); padding-bottom: 4px;
  }
  .contact-email:hover { border-bottom-style: solid; }
  .socials { display: flex; justify-content: center; gap: 1rem; margin-top: 3.2rem; flex-wrap: wrap; }
  .socials a {
    display: inline-flex; align-items: center; gap: 0.55rem;
    font-size: 0.74rem; color: var(--muted); text-decoration: none;
    border: 1px solid var(--line); border-radius: 6px; padding: 0.6rem 1.2rem;
    transition: color .2s, border-color .2s;
  }
  .socials a:hover { color: var(--accent); border-color: var(--accent); }
  .socials svg { width: 13px; height: 13px; }

  /* Footer */
  footer { border-top: 1px solid var(--line); }
  .foot { display: flex; justify-content: space-between; align-items: center; padding: 1.8rem 0; font-size: 0.72rem; color: var(--faint); }
  .foot span b { color: var(--accent); font-weight: 500; }
  .foot .ok { color: var(--ok); }

  @media (max-width: 860px) {
    nav { flex-direction: column; gap: 1rem; padding: 1.4rem 2rem; align-items: flex-start; }
    .wrap { padding: 0 1.5rem; }
    .nav-links { gap: 1.2rem; }
    .hero { padding: 4rem 0; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .project-row { grid-template-columns: 1fr; gap: 0.8rem; }
    .p-links { flex-direction: row; align-items: center; }
    .exp-row { grid-template-columns: 1fr; gap: 0.5rem; }
    .foot { flex-direction: column; gap: 0.6rem; }
  }
`;

const projects = [
  {
    num: "01",
    title: "Lulla",
    tag: "featured",
    desc: "A calm, local-first baby & parent tracker — one-tap feeding, sleep, diaper, growth and routine logs with a live timer, WHO growth charts, and optional family sync across devices. Free, no accounts, no ads.",
    tech: ["TypeScript", "React", "Vite", "PWA", "Neon"],
    live: "https://cycoconutz.github.io/lulla-landing/",
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
  { cat: "LANGUAGES", items: ["JavaScript (ES6+)", "TypeScript", "Python"] },
  { cat: "FRONTEND", items: ["React 18/19", "Redux", "HTML5", "CSS3", "Tailwind CSS"] },
  { cat: "BACKEND & DATA", items: ["Node.js / Express", "GraphQL / Apollo", "REST APIs", "MySQL", "MongoDB"] },
  { cat: "TOOLING & WORKFLOW", items: ["Jest", "Vite", "Git / GitHub", "Figma", "AI-Assisted Tooling"] },
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
            <b>~</b>/john-yates <span className="hint">#</span>
          </a>
          <ul className="nav-links">
            {["About", "Projects", "Experience", "Contact"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>
                  <span className="slash">/</span> {item.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {/* Hero */}
          <section id="top" className="hero">
            <div className="cmd reveal">
              <b>~</b> $ whoami
            </div>
            <h1 className="hero-title reveal">
              john yates<span className="cursor" />
            </h1>
            <p className="hero-role reveal">
              &nbsp;&nbsp;&nbsp;=&gt; <b>full-stack web developer</b>
            </p>
            <p className="hero-sub reveal">
              I build fast, modern web applications from front to back —
              clean interfaces, solid APIs, and everything in between.
            </p>
            <div className="hero-cta reveal">
              <a href="#projects" className="btn">
                ls projects <span>&#8595;</span>
              </a>
              <a href="#contact" className="btn-ghost">
                get in touch
              </a>
            </div>
            <div className="hero-meta reveal">
              <div>
                <span className="k">contact:</span> johndyates<span className="k">@</span>gmail.com
              </div>
              <div>
                <span className="k">location:</span> lafayette, la &nbsp;
                <span className="k">status:</span>{" "}
                <span style={{ color: "var(--ok)" }}>available</span>
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about">
            <div className="sec-cmd reveal">
              <b>~</b> $ cat about.txt
            </div>
            <h2 className="sec-title reveal">who_i_am</h2>
            <div className="about-grid">
              <div className="about-text reveal">
                <p>
                  I'm a <strong>full-stack web developer</strong> based in the US, currently
                  building web solutions at <strong>KUKUI</strong> for automotive service
                  businesses. I love turning complex problems into clean, intuitive digital
                  experiences.
                </p>
                <p>
                  My background spans the entire stack — from responsive React frontends to
                  Node/Express APIs backed by MySQL and MongoDB. I care deeply about{" "}
                  <strong>code quality, performance,</strong> and shipping things that actually
                  work.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new frameworks, contributing to
                  side projects, or leveling up my skills in whatever's new and interesting in
                  the dev world.
                </p>
              </div>
              <div className="skills reveal">
                {skillGroups.map((group) => (
                  <div className="skill-group" key={group.cat}>
                    <div className="skill-cat">{group.cat}</div>
                    <div className="chips">
                      {group.items.map((item) => (
                        <span className="chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects">
            <div className="sec-cmd reveal">
              <b>~</b> $ ls projects/
            </div>
            <h2 className="sec-title reveal">selected_projects</h2>

            {projects.map((p) => (
              <div className="project-row reveal" key={p.title}>
                <div className="p-num">{p.num}</div>
                <div>
                  <div className="p-title-row">
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-title-link"
                    >
                      <h3 className="p-title">{p.title}</h3>
                    </a>
                    <span className="p-tag">{p.tag}</span>
                  </div>
                  <p className="p-desc">{p.desc}</p>
                  <ul className="p-tech">
                    {p.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-links">
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
            <div className="sec-cmd reveal">
              <b>~</b> $ cat experience.log
            </div>
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
            <div className="sec-cmd reveal">
              <b>~</b> $ mail --to johndyates
            </div>
            <h2 className="contact-title reveal">let's work together</h2>
            <p className="contact-sub reveal">
              Open to new opportunities, collaborations, and interesting projects.
              Drop me a line — I always respond.
            </p>
            <a href="mailto:johndyates@gmail.com" className="contact-email reveal">
              johndyates@gmail.com
            </a>
            <div className="socials reveal">
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
              <a href="https://github.com/cycoconutz/React-Portfolio" target="_blank" rel="noopener noreferrer">
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
            <span>
              © 2026 <b>john</b>-yates
            </span>
            <span>
              <span className="ok">●</span> exit 0 &nbsp;·&nbsp; built with react
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}