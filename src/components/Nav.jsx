import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "../motion/gsap";

const ITEMS = ["about", "skills", "experience", "projects", "contact"];

export default function Nav() {
  const [active, setActive] = useState(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const indRef = useRef(null);
  const wasShown = useRef(false);

  // Track which section is in view. Later nav items win when ranges overlap
  // (skills sits inside about).
  useGSAP(() => {
    const on = new Set();
    const sync = () => {
      const last = [...ITEMS].reverse().find((id) => on.has(id));
      setActive(last || null);
    };
    ITEMS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const vars = { trigger: el, start: "top 40%", end: "bottom 40%" };
      if (id === "skills") {
        // The skills area is #skills (top row) through the end of .skills-below. On desktop
        // it shares its top row with the about text, so it only takes over from "about"
        // once it has scrolled up to the header.
        vars.start = () => `top ${headerRef.current.offsetHeight + 48}px`;
        vars.endTrigger = document.querySelector(".skills-below") || el;
      }
      ScrollTrigger.create({
        ...vars,
        onToggle: (self) => {
          if (self.isActive) on.add(id);
          else on.delete(id);
          sync();
        },
      });
    });
  });

  // Expose the real header height so scroll offsets match it at any width.
  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return undefined;
    const set = () => document.documentElement.style.setProperty("--topbar-h", `${header.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Slide the indicator under the active link (transform and opacity only).
  useEffect(() => {
    const place = () => {
      const ind = indRef.current;
      const nav = navRef.current;
      const link = active && nav.querySelector(`.nav-links a[href="#${active}"]`);
      if (!ind) return;
      if (!link) {
        ind.style.opacity = "0";
        wasShown.current = false;
        return;
      }
      const n = nav.getBoundingClientRect();
      const l = link.getBoundingClientRect();
      if (!wasShown.current) ind.style.transition = "opacity .25s ease";
      ind.style.transform = `translate(${l.left - n.left}px, ${l.bottom - n.top - 2}px) scaleX(${l.width})`;
      ind.style.opacity = "1";
      if (!wasShown.current) {
        // restore the CSS transition for later moves
        requestAnimationFrame(() => {
          ind.style.transition = "";
        });
      }
      wasShown.current = true;
    };
    place();
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <header className="topbar" ref={headerRef}>
      <div className="wrap">
        <nav aria-label="Primary" ref={navRef}>
          <a href="#top" className="brand">
            <span className="led" /> JOHN YATES
          </a>
          <ul className="nav-links">
            {ITEMS.map((item) => (
              <li key={item}>
                <a href={`#${item}`} aria-current={active === item ? "true" : undefined}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <span className="nav-ind" ref={indRef} aria-hidden="true" />
        </nav>
      </div>
    </header>
  );
}
