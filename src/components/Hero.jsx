import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION, DESKTOP } from "../motion/gsap";

const WORDS = ["connected.", "tested.", "shipped.", "connected."];
const GLYPHS = "!<>-_/[]{}=+*^?#";
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Frame of the scramble at overall scroll progress p (0 to 1) across the word list.
function frame(p) {
  const steps = WORDS.length - 1;
  const seg = Math.min(Math.floor(p * steps), steps - 1);
  const local = p * steps - seg;
  const t = Math.min(local / 0.6, 1); // last 40% of each step holds the word
  const from = WORDS[seg];
  const to = WORDS[seg + 1];
  if (t <= 0) return from;
  if (t >= 1) return to;
  const len = Math.max(from.length, to.length);
  let out = "";
  for (let i = 0; i < len; i++) {
    if (t >= (i + 1) / (len + 1)) out += to[i] || "";
    else out += glyph();
  }
  return out;
}

export default function Hero({ email, resumeHref, onOpenResume }) {
  const heroRef = useRef(null);
  const swapRef = useRef(null);
  const visRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const swap = swapRef.current;
        const vis = visRef.current;
        swap.classList.add("on");
        vis.textContent = WORDS[0];
        const st = ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            vis.textContent = frame(self.progress);
          },
        });
        return () => {
          st.kill();
          swap.classList.remove("on");
          vis.textContent = "";
        };
      });
      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section id="top" className="hero" ref={heroRef}>
      <div className="reveal">
        <p className="kicker">{"// full-stack engineer · Lafayette, LA"}</p>
        <h1 className="hero-title">
          Everything<br />
          <em className="swap" ref={swapRef}>
            <span className="swap-real">connected.</span>
            <span className="swap-vis" ref={visRef} aria-hidden="true" />
          </em>
        </h1>
        <p className="hero-sub">
          I'm John Yates. I've spent four years shipping products at <b>KUKUI</b> that
          were used daily by thousands of people across hundreds of customer websites.
          My primary stack focus is <b>MERN-SQL</b>. In my personal time I enjoy
          learning and building with new technologies and languages. You can view{" "}
          <a href="#projects" className="inline-link">these projects</a> below.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn">
            See the work
          </a>
          <a href={resumeHref} className="btn-ghost" target="_blank" rel="noopener noreferrer" onClick={onOpenResume}>
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
            <span className="k">contact:</span> <a href={`mailto:${email}`} style={{ color: "inherit", textDecoration: "none" }}>johndyates<span className="k">@</span>gmail.com</a>
          </div>
          <div>
            <span className="k">location:</span> Lafayette, LA &nbsp;
            <span className="k">status:</span> <span className="ok">available</span>
          </div>
          <div>
            <span className="k">remote:</span> open to remote (US)
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
      </div>
    </section>
  );
}
