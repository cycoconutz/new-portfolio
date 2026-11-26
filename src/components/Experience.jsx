import { useRef } from "react";
import { experience } from "../data";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../motion/gsap";

export default function Experience() {
  const wrapRef = useRef(null);

  // A cable draws down the left edge with scroll; each row's LED lights as the head reaches it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const wrap = wrapRef.current;
        const rows = [...wrap.querySelectorAll(".exp-row")];
        const fill = wrap.querySelector(".cable-fill");
        const head = wrap.querySelector(".cable-head");
        if (!rows.length) return undefined;
        wrap.classList.add("cable-on");
        gsap.set(fill, { scaleY: 0 });
        // LED offset within a row, read from the ::after rule (2.1rem); re-read each refresh.
        let ledTop = 34;
        const readLedTop = () => {
          const v = parseFloat(getComputedStyle(rows[0], "::after").top);
          ledTop = Number.isFinite(v) ? v : 34;
        };
        readLedTop();

        const update = (self) => {
          const y = self.progress * wrap.offsetHeight;
          gsap.set(fill, { scaleY: self.progress });
          gsap.set(head, { y, opacity: self.progress > 0 && self.progress < 1 ? 1 : 0 });
          rows.forEach((row) => row.classList.toggle("lit", y >= row.offsetTop + ledTop));
        };
        const st = ScrollTrigger.create({
          trigger: rows[0],
          start: "top 75%",
          endTrigger: rows[rows.length - 1],
          end: "top 60%",
          scrub: true,
          onUpdate: update,
          onRefresh: (self) => {
            readLedTop();
            update(self);
          },
        });

        return () => {
          st.kill();
          wrap.classList.remove("cable-on");
          rows.forEach((row) => row.classList.remove("lit"));
          gsap.set([fill, head], { clearProps: "all" });
        };
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  return (
    <section id="experience">
      <h2 className="sec-title reveal">experience</h2>

      <div className="exp-wrap" ref={wrapRef}>
        <span className="cable-track" aria-hidden="true" />
        <span className="cable-fill" aria-hidden="true" />
        <span className="cable-head" aria-hidden="true" />
        {experience.map((exp) => (
          <div className="exp-row reveal" key={exp.role}>
            <div className="exp-date">
              {exp.date}
              {exp.location ? <span className="exp-loc">{exp.location}</span> : null}
            </div>
            <div>
              <h3 className="exp-role">{exp.role}</h3>
              <div className="exp-company">{exp.company}</div>
              {exp.desc ? <p className="exp-desc">{exp.desc}</p> : null}
              {exp.bullets ? (
                <ul className="exp-list">
                  {exp.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
