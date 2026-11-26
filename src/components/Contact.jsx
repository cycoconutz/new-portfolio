import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../motion/gsap";

export default function Contact({ email, copied, onCopy, resumeHref, onOpenResume, linkedinUrl }) {
  const headRef = useRef(null);

  // Cable-draw underline, once, after the title starts typing in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const line = headRef.current.querySelector(".cable-draw");
        gsap.set(line, { scaleX: 0 });
        ScrollTrigger.create({
          trigger: headRef.current,
          start: "top 88%",
          end: "max",
          once: true,
          onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }),
        });
        return () => gsap.set(line, { clearProps: "transform" });
      });
      return () => mm.revert();
    },
    { scope: headRef }
  );

  return (
    <section id="contact" className="contact">
      <div className="contact-head" ref={headRef}>
        <h2 className="contact-title reveal">Let's connect.</h2>
        <span className="cable-draw" aria-hidden="true" />
      </div>
      <p className="contact-sub reveal">
        Open to new opportunities, collaborations, and interesting projects.
        Drop me a line: I always respond.
      </p>
      <a href={`mailto:${email}`} onClick={onCopy} className="contact-email reveal">
        {email}
      </a>
      <span className="copied" aria-live="polite">{copied ? "copied to clipboard" : ""}</span>
      <div className="socials reveal">
        <a href={resumeHref} target="_blank" rel="noopener noreferrer" onClick={onOpenResume}>
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
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
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
  );
}
