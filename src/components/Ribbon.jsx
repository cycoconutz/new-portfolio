import { useRef } from "react";
import { ribbonSkills } from "../data";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../motion/gsap";

const N = ribbonSkills.length;
// Three copies so the band stays longer than the viewport plus one loop on wide screens.
const LIST = [...ribbonSkills, ...ribbonSkills, ...ribbonSkills];
const LOOP_SECONDS = N * 3.4; // time for one loop (one copy of the list); keeps the pace as the list grows
const DRAG_THRESHOLD = 6; // px of horizontal travel before a press becomes a drag
const SAMPLE_WINDOW = 80; // ms of pointer history used for release velocity
const MAX_THROW = 4; // px/ms
const DECAY_MS = 325; // throw velocity time constant (iOS-like)

export default function Ribbon() {
  const ribbonRef = useRef(null);
  const bandRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const ribbon = ribbonRef.current;
        const band = bandRef.current;
        const items = band.children;
        const setX = gsap.quickSetter(band, "x", "px");
        // offset: how far the band is shifted left, in px, always within [0, period).
        // resume: eased 0 to 1 after a throw ends so auto-roll fades back in.
        // hover: 0 while hovered. boost: scroll-velocity multiplier, normally 1.
        // v: throw velocity in px/ms (offset space: positive moves the band left).
        const s = {
          offset: 0, period: 0, resume: 1, hover: 1, boost: 1, v: 0,
          visible: true, pressed: false, dragging: false, throwing: false,
        };

        const render = () => {
          if (!s.period) return;
          s.offset = ((s.offset % s.period) + s.period) % s.period;
          setX(-s.offset);
        };
        // Loop length is the distance from item 0 to the first item of the next copy.
        // Re-measured on every ScrollTrigger refresh (resize, fonts) keeping the fraction.
        const measure = () => {
          const period = items[N].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
          if (period <= 0) return;
          const frac = s.period ? s.offset / s.period : 0;
          s.period = period;
          s.offset = frac * period;
          render();
        };
        measure();
        ScrollTrigger.addEventListener("refresh", measure);

        const autoSpeed = () => s.period / LOOP_SECONDS / 1000; // px/ms

        const tick = (time, dt) => {
          if (!s.visible || s.pressed) return;
          const ms = Math.min(dt, 100);
          if (s.throwing) {
            s.offset += s.v * ms;
            s.v *= Math.exp(-ms / DECAY_MS);
            render();
            if (Math.abs(s.v) < autoSpeed()) {
              // Throw has slowed to auto-roll pace: blend back into the normal roll.
              s.throwing = false;
              s.resume = 0;
              gsap.to(s, { resume: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
            }
            return;
          }
          const rate = s.resume * s.hover * s.boost;
          if (!rate) return;
          s.offset += autoSpeed() * ms * rate;
          render();
        };
        gsap.ticker.add(tick);

        // Pause on hover (dragging still works).
        // Mouse only: touch would leave an emulated hover stuck after a tap.
        const over = (e) => {
          if (e.pointerType === "mouse") gsap.to(s, { hover: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        };
        const out = (e) => {
          if (e.pointerType === "mouse") gsap.to(s, { hover: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        };
        ribbon.addEventListener("pointerenter", over);
        ribbon.addEventListener("pointerleave", out);

        // Drag and throw with Pointer Events. Vertical touch scrolling stays native
        // (touch-action: pan-y); a press only becomes a drag once it is clearly horizontal.
        let pid = null;
        let x0 = 0;
        let y0 = 0;
        let lastX = 0;
        let samples = [];

        const endPress = () => {
          if (!s.pressed) return;
          s.pressed = false;
          const wasDragging = s.dragging;
          s.dragging = false;
          pid = null;
          document.body.classList.remove("ribbon-dragging");
          if (!wasDragging) {
            // A tap can interrupt the post-throw blend; make sure auto-roll fully returns.
            if (s.resume < 1) gsap.to(s, { resume: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
            return;
          }
          const now = performance.now();
          const first = samples[0];
          const last = samples[samples.length - 1];
          let v = 0;
          if (first && last && last.t > first.t && now - last.t < 60) {
            v = -(last.x - first.x) / (last.t - first.t);
          }
          v = Math.max(-MAX_THROW, Math.min(MAX_THROW, v));
          if (Math.abs(v) > autoSpeed()) {
            s.v = v;
            s.throwing = true;
          } else {
            s.resume = 0;
            gsap.to(s, { resume: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          }
        };

        const down = (e) => {
          // A press that never saw its end event must not block the next one.
          if (s.pressed) {
            if (e.pointerId === pid) return;
            endPress();
          }
          if (e.pointerType === "mouse" && e.button !== 0) return;
          s.pressed = true;
          s.throwing = false;
          s.v = 0;
          gsap.killTweensOf(s, "resume");
          pid = e.pointerId;
          x0 = lastX = e.clientX;
          y0 = e.clientY;
          samples = [];
          try {
            ribbon.setPointerCapture(pid);
          } catch {
            /* capture can fail if the pointer is already gone */
          }
        };
        const move = (e) => {
          if (!s.pressed || e.pointerId !== pid) return;
          if (!s.dragging) {
            const dx = e.clientX - x0;
            const dy = e.clientY - y0;
            if (Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
              s.dragging = true;
              document.body.classList.add("ribbon-dragging");
            } else if (Math.abs(dy) > DRAG_THRESHOLD) {
              // Vertical gesture: give it back to the page.
              try {
                ribbon.releasePointerCapture(pid);
              } catch {
                /* already released */
              }
              endPress();
              return;
            } else {
              return;
            }
          }
          const now = performance.now();
          s.offset -= e.clientX - lastX;
          lastX = e.clientX;
          render();
          samples.push({ t: now, x: e.clientX });
          while (samples.length > 1 && now - samples[0].t > SAMPLE_WINDOW) samples.shift();
        };
        const up = (e) => {
          if (e.pointerId === pid) endPress();
        };
        ribbon.addEventListener("pointerdown", down);
        ribbon.addEventListener("pointermove", move);
        ribbon.addEventListener("pointerup", up);
        ribbon.addEventListener("pointercancel", up);
        ribbon.addEventListener("lostpointercapture", up);
        const abort = () => endPress();
        const onVisibility = () => {
          if (document.visibilityState === "hidden") endPress();
        };
        window.addEventListener("blur", abort);
        document.addEventListener("visibilitychange", onVisibility);

        // Brief nudge from scroll velocity, in the scroll direction (up runs it backwards).
        let boostTl = null;
        const nudge = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (Math.abs(v) < 200) return;
            const mag = Math.min(1 + Math.abs(v) / 900, 3);
            const target = Math.sign(v) * mag;
            if (boostTl) boostTl.kill();
            boostTl = gsap
              .timeline()
              .to(s, { boost: target, duration: 0.15, ease: "power2.out" })
              .to(s, { boost: 1, duration: 0.6, ease: "power2.out" });
          },
        });

        // Skip work while the ribbon is off screen.
        const vis = ScrollTrigger.create({
          trigger: ribbon,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            s.visible = self.isActive;
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("refresh", measure);
          ribbon.removeEventListener("pointerenter", over);
          ribbon.removeEventListener("pointerleave", out);
          window.removeEventListener("blur", abort);
          document.removeEventListener("visibilitychange", onVisibility);
          ribbon.removeEventListener("pointerdown", down);
          ribbon.removeEventListener("pointermove", move);
          ribbon.removeEventListener("pointerup", up);
          ribbon.removeEventListener("pointercancel", up);
          ribbon.removeEventListener("lostpointercapture", up);
          document.body.classList.remove("ribbon-dragging");
          nudge.kill();
          vis.kill();
          if (boostTl) boostTl.kill();
          gsap.killTweensOf(s);
          gsap.set(band, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: ribbonRef }
  );

  return (
    <div className="ribbon" aria-hidden="true" ref={ribbonRef}>
      <div className="band" ref={bandRef}>
        {LIST.map((skill, i) => (
          <span key={`${skill}-${i}`} className={"sigitem" + ((i % N) % 3 === 0 ? " on" : "")}>
            {skill}
          </span>
        ))}
      </div>
      <span className="scan" />
    </div>
  );
}
