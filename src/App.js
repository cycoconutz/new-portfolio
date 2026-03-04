import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080b10;
    --surface: #0e1319;
    --border: rgba(255,255,255,0.07);
    --accent: #00e5ff;
    --accent2: #ff6b35;
    --text: #e8edf2;
    --muted: #64748b;
    --card: #111820;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    width: 32px; height: 32px;
    border: 1px solid var(--accent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.15s ease;
    opacity: 0.5;
  }

  /* Noise overlay */
  .noise {
    position: fixed;
    inset: 0;
    z-index: 1;
    opacity: 0.025;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px;
  }

  /* Nav */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 4rem;
    transition: background 0.3s, backdrop-filter 0.3s;
  }
  nav.scrolled {
    background: rgba(8,11,16,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.08em;
    color: var(--text);
    text-decoration: none;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--accent);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::after { width: 100%; }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 4rem;
    position: relative;
    overflow: hidden;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-glow {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%);
    left: -100px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 2; max-width: 900px; }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.5rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.2s;
  }
  .hero-eyebrow::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--accent);
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 12vw, 11rem);
    line-height: 0.9;
    letter-spacing: 0.02em;
    color: var(--text);
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.4s;
  }
  .hero-title .accent-line { color: var(--accent); display: block; }
  .hero-sub {
    margin-top: 2rem;
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.7;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.6s;
  }
  .hero-cta {
    margin-top: 3rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.8s;
  }
  .btn-primary {
    background: var(--accent);
    color: var(--bg);
    padding: 0.85rem 2.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  .btn-primary:hover { background: #33ecff; transform: translateY(-2px); }
  .btn-ghost {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
  }
  .btn-ghost:hover { color: var(--text); }
  .btn-ghost svg { transition: transform 0.2s; }
  .btn-ghost:hover svg { transform: translateX(4px); }

  /* Scroll indicator */
  .scroll-indicator {
    position: absolute;
    bottom: 3rem; left: 4rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    animation: fadeUp 1s ease forwards 1.2s;
  }
  .scroll-line {
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, transparent, var(--muted));
    animation: scrollPulse 2s ease infinite;
  }
  .scroll-text {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    writing-mode: vertical-rl;
  }

  /* Sections */
  section {
    padding: 8rem 4rem;
    position: relative;
    z-index: 2;
  }
  .section-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1rem;
  }
  .section-label::before {
    content: '';
    width: 30px; height: 1px;
    background: var(--accent);
  }
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 1;
    letter-spacing: 0.03em;
    color: var(--text);
    margin-bottom: 4rem;
  }

  /* About */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
    max-width: 1200px;
  }
  .about-text {
    font-size: 1.1rem;
    font-weight: 300;
    line-height: 1.85;
    color: #a0aec0;
  }
  .about-text p + p { margin-top: 1.5rem; }
  .about-text strong { color: var(--text); font-weight: 500; }
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .skill-item {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 1rem 1.25rem;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--muted);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .skill-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: var(--accent);
    transform: scaleY(0);
    transition: transform 0.2s;
  }
  .skill-item:hover { color: var(--text); border-color: rgba(0,229,255,0.2); }
  .skill-item:hover::before { transform: scaleY(1); }

  /* Projects */
  .projects-section { background: var(--surface); }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5px;
    background: var(--border);
    border: 1px solid var(--border);
    max-width: 1400px;
  }
  .project-card {
    background: var(--card);
    padding: 2.5rem;
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: block;
    cursor: pointer;
  }
  .project-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,229,255,0.04) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .project-card:hover { background: #141e28; }
  .project-card:hover::after { opacity: 1; }
  .project-card.featured {
    grid-column: span 2;
    background: #0d1920;
  }
  .project-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.25rem;
  }
  .project-tag.new { color: var(--accent2); }
  .project-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4rem;
    color: rgba(255,255,255,0.04);
    line-height: 1;
    position: absolute;
    top: 1.5rem; right: 2rem;
    letter-spacing: 0.05em;
    pointer-events: none;
  }
  .project-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 0.04em;
    color: var(--text);
    margin-bottom: 0.75rem;
    transition: color 0.2s;
  }
  .project-card:hover .project-title { color: var(--accent); }
  .project-desc {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tech-pill {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.3rem 0.75rem;
  }
  .project-link-icon {
    position: absolute;
    bottom: 2rem; right: 2rem;
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  .project-card:hover .project-link-icon {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
  }

  /* Experience */
  .experience-list { max-width: 800px; }
  .exp-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 3rem;
    padding: 2.5rem 0;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .exp-item:first-child { border-top: 1px solid var(--border); }
  .exp-date {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 0.2rem;
  }
  .exp-role {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 0.04em;
    color: var(--text);
    margin-bottom: 0.25rem;
  }
  .exp-company {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }
  .exp-desc {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.7;
  }

  /* Contact */
  .contact-section {
    background: var(--surface);
    text-align: center;
  }
  .contact-big {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 10vw, 9rem);
    line-height: 0.9;
    letter-spacing: 0.02em;
    color: rgba(255,255,255,0.06);
    margin-bottom: -2rem;
    pointer-events: none;
    user-select: none;
  }
  .contact-email {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 5vw, 4rem);
    letter-spacing: 0.05em;
    color: var(--text);
    text-decoration: none;
    position: relative;
    display: inline-block;
    transition: color 0.2s;
  }
  .contact-email::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.3s;
  }
  .contact-email:hover { color: var(--accent); }
  .contact-email:hover::after { transform: scaleX(1); }
  .social-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 3rem;
  }
  .social-link {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .social-link:hover { color: var(--accent); }

  /* Footer */
  footer {
    padding: 2rem 4rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  footer span {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* Divider */
  .divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 0;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  /* Intersection observer reveal */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  /* Responsive */
  @media (max-width: 900px) {
    nav { padding: 1.5rem 2rem; }
    .nav-links { display: none; }
    section { padding: 6rem 2rem; }
    .hero { padding: 0 2rem; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .projects-grid { grid-template-columns: 1fr; }
    .project-card.featured { grid-column: span 1; }
    .exp-item { grid-template-columns: 1fr; gap: 0.5rem; }
    footer { padding: 2rem; flex-direction: column; gap: 1rem; text-align: center; }
    .scroll-indicator { display: none; }
  }
`;

const projects = [
  {
    id: "01",
    tag: "Latest Project",
    tagClass: "new",
    title: "TwilightVotes",
    desc: "A community-driven polling and voting platform where users can create, share, and participate in real-time polls. Features live vote tallying, category browsing, and an intuitive UI designed to make public opinion feel engaging and immediate.",
    tech: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    link: "https://www.twilightvotes.com/",
    featured: true,
  },
  {
    id: "02",
    tag: "Project",
    title: "Developer Portfolio",
    desc: "This portfolio site — a React SPA showcasing projects, skills, and experience with a clean, modern design.",
    tech: ["React", "CSS3", "GitHub Pages"],
    link: "https://www.johndyates.com/",
  },
  {
    id: "03",
    tag: "Project",
    title: "Full-Stack CRUD App",
    desc: "A full-stack application featuring user authentication, database persistence, and a responsive frontend interface built with React and Node.",
    tech: ["React", "Node.js", "MySQL", "Express", "JWT"],
    link: "https://github.com/cycoconutz",
  },
  {
    id: "04",
    tag: "Project",
    title: "E-Commerce Platform",
    desc: "A feature-rich e-commerce storefront with cart management, product filtering, and integrated payment flow.",
    tech: ["React", "Redux", "MongoDB", "Stripe"],
    link: "https://github.com/cycoconutz",
  },
  {
    id: "05",
    tag: "Project",
    title: "GraphQL API",
    desc: "RESTful to GraphQL migration for a social platform backend, enabling flexible client-driven data queries and real-time subscriptions.",
    tech: ["GraphQL", "Apollo", "Node.js", "MongoDB"],
    link: "https://github.com/cycoconutz",
  },
];

const skills = [
  "JavaScript (ES6+)", "React.js", "Node.js", "Express.js",
  "MySQL", "MongoDB", "GraphQL", "REST APIs",
  "jQuery", "HTML5 / CSS3", "Git / GitHub", "Figma",
  "Jest / Testing", "Handlebars", "Salesforce", "IndexedDB",
];

const experience = [
  {
    date: "2022 — Present",
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
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      setCursor({ x: e.clientX - 4, y: e.clientY - 4 });
      const target = { x: e.clientX - 16, y: e.clientY - 16 };
      const animate = () => {
        ringRef.current.x += (target.x - ringRef.current.x) * 0.12;
        ringRef.current.y += (target.y - ringRef.current.y) * 0.12;
        setRing({ x: ringRef.current.x, y: ringRef.current.y });
        animRef.current = requestAnimationFrame(animate);
      };
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />

      {/* Custom Cursor */}
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-ring" style={{ left: ring.x, top: ring.y }} />

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#top" className="nav-logo">
          J<span>.</span>YATES
        </a>
        <ul className="nav-links">
          {["About", "Projects", "Experience", "Contact"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <section id="top" className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-eyebrow">Full-Stack Web Developer</div>
          <h1 className="hero-title">
            John
            <span className="accent-line">Yates</span>
          </h1>
          <p className="hero-sub">
            I build fast, modern web applications from front to back —
            clean interfaces, solid APIs, and everything in between.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn-primary">View Work</a>
            <a href="#contact" className="btn-ghost">
              Get In Touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      <div className="divider" />

      {/* About */}
      <section id="about">
        <div className="section-label reveal">About</div>
        <h2 className="section-title reveal">Who I Am</h2>
        <div className="about-grid">
          <div className="about-text reveal">
            <p>
              I'm a <strong>full-stack web developer</strong> based in the US,
              currently building web solutions at <strong>KUKUI</strong> for automotive
              service businesses. I love turning complex problems into clean,
              intuitive digital experiences.
            </p>
            <p>
              My background spans the entire stack — from responsive React frontends
              to Node/Express APIs backed by MySQL and MongoDB. I care deeply about
              <strong> code quality, performance,</strong> and shipping things
              that actually work.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new frameworks,
              contributing to side projects, or leveling up my skills in whatever's
              new and interesting in the dev world.
            </p>
          </div>
          <div>
            <div className="section-label reveal" style={{ marginBottom: "1.5rem" }}>Tech Stack</div>
            <div className="skills-grid reveal">
              {skills.map((skill, i) => (
                <div key={skill} className={`skill-item reveal-delay-${(i % 4) + 1}`}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Projects */}
      <section id="projects" className="projects-section">
        <div className="section-label reveal">Work</div>
        <h2 className="section-title reveal">Selected Projects</h2>
        <div className="projects-grid reveal">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card${p.featured ? " featured" : ""}`}
            >
              <div className="project-number">{p.id}</div>
              <div className={`project-tag${p.tagClass ? ` ${p.tagClass}` : ""}`}>
                {p.tag}
              </div>
              <div className="project-title">{p.title}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-tech">
                {p.tech.map((t) => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>
              <div className="project-link-icon">↗</div>
            </a>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Experience */}
      <section id="experience">
        <div className="section-label reveal">Career</div>
        <h2 className="section-title reveal">Experience</h2>
        <div className="experience-list">
          {experience.map((exp, i) => (
            <div key={i} className={`exp-item reveal reveal-delay-${i + 1}`}>
              <div className="exp-date">{exp.date}</div>
              <div>
                <div className="exp-role">{exp.role}</div>
                <div className="exp-company">{exp.company}</div>
                <div className="exp-desc">{exp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="contact-big">Let's Talk</div>
        <div className="section-label reveal" style={{ justifyContent: "center" }}>
          Contact
        </div>
        <h2 className="section-title reveal" style={{ marginBottom: "1.5rem" }}>
          Get In Touch
        </h2>
        <p className="reveal" style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
          Open to new opportunities, collaborations, and interesting projects.
          Drop me a line — I always respond.
        </p>
        <a href="mailto:johndannelyates@gmail.com" className="contact-email reveal">
          johndyates@gmail.com
        </a>
        <div className="social-links reveal">
          <a href="https://github.com/cycoconutz" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/danny-yates/" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0z"/>
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/cycoconutz/React-Portfolio" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Source Code
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <span>© 2025 John Yates</span>
        <span>Built with React</span>
      </footer>
    </>
  );
}
