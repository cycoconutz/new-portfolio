import { useEffect, useRef, useState } from "react";
import { MOTION } from "../motion/gsap";
import { projects } from "../data";

// The probes also replace the old warm-up pings: Render's free tier sleeps after
// 15 idle minutes, so the first probe on load starts waking the demos.
const TARGETS = [
  { id: "deadwax", name: "Deadwax", url: "https://deadwax-exee.onrender.com/api/health" },
  { id: "ironlog", name: "IronLog", url: "https://ironlog-llgm.onrender.com/actuator/health" },
  { id: "lulla", name: "Lulla", url: "https://lulla.dev/" },
];

const liveUrl = (id) => projects.find((p) => p.id === id).live;

const EVERY_MS = 15000;
const TIMEOUT_MS = 60000;
const WAKING_MS = 3000;
const SESSION_MS = 5 * 60 * 1000; // then stop, to stay polite to the free tiers
const WINDOW_MS = 90000; // time span visible across the scrolling trace
const KEEP = 24;
const BLIP = 28; // px

const format = (ms) => (ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(1)} s`);

// Blip height, 0 to 1, on a log scale from 30 ms to 10 s.
const level = (ms) => Math.min(1, Math.max(0.12, Math.log(ms / 30) / Math.log(10000 / 30)));

function describe(state) {
  if (state.phase === "ok") return `reachable · ${format(state.ms)}`;
  if (state.phase === "down") return "no signal";
  if (state.phase === "waking") return "waking...";
  return "probing...";
}

export default function SignalMonitor() {
  const [status, setStatus] = useState(() => Object.fromEntries(TARGETS.map((t) => [t.id, { phase: "probing" }])));
  const [live, setLive] = useState(true);
  const [beat, setBeat] = useState(0);
  const [readout, setReadout] = useState(null);
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const samples = useRef(Object.fromEntries(TARGETS.map((t) => [t.id, []])));
  const hover = useRef(null); // { lane, x, now }
  const api = useRef({});

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const motion = window.matchMedia(MOTION);
    const css = getComputedStyle(document.documentElement);
    const color = (name) => css.getPropertyValue(name).trim();
    const led = color("--led");
    const cable = color("--cable");
    const alu = color("--alu");

    let alive = true;
    let inView = true;
    let raf = 0;
    let timer = 0;
    let done = false;
    let lastRound = 0;
    let stoppedAt = 0;
    let width = 0;
    let height = 0;
    const inflight = new Map(); // id -> AbortController

    // x position and value of each sample, for drawing and for the hover readout.
    const points = (list, now) =>
      motion.matches
        ? list.map((s) => ({ ...s, x: width - ((now - s.at) / WINDOW_MS) * width - BLIP / 2 }))
        : list.map((s, i) => ({ ...s, x: ((i + 0.5) / Math.max(list.length, 8)) * width }));

    const draw = () => {
      if (!ctx || !width) return;
      ctx.clearRect(0, 0, width, height);
      const laneH = height / TARGETS.length;
      TARGETS.forEach((t, lane) => {
        const held = hover.current && hover.current.lane === lane ? hover.current : null;
        const now = held ? held.now : stoppedAt || performance.now();
        const base = laneH * (lane + 1) - 10;
        const amp = laneH - 38;
        const y = (s) => base - level(s.ms) * amp;
        const pts = points(samples.current[t.id].filter((s) => s.at <= now), now);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(201,204,209,0.12)";
        ctx.beginPath();
        ctx.moveTo(0, base + 0.5);
        ctx.lineTo(width, base + 0.5);
        ctx.stroke();

        ctx.lineWidth = 1.75;
        ctx.lineJoin = "round";
        ctx.strokeStyle = led;
        ctx.shadowColor = led;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        if (motion.matches) {
          // Scrolling trace: flat line with one pulse per successful probe.
          ctx.moveTo(0, base);
          pts.filter((p) => p.ok).forEach((p) => {
            ctx.lineTo(p.x - BLIP / 2, base);
            ctx.lineTo(p.x - BLIP / 6, y(p));
            ctx.lineTo(p.x + BLIP / 6, base + 4);
            ctx.lineTo(p.x + BLIP / 2, base);
          });
          ctx.lineTo(width, base);
        } else {
          // Reduced motion: a still sparkline that gains a point per probe.
          let pen = false;
          pts.forEach((p) => {
            if (!p.ok) pen = false;
            else if (pen) ctx.lineTo(p.x, y(p));
            else {
              ctx.moveTo(p.x, y(p));
              ctx.lineTo(p.x + 1, y(p));
              pen = true;
            }
          });
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = cable;
        pts.filter((p) => !p.ok).forEach((p) => ctx.fillRect(p.x - 2, base - 12, 4, 12));

        if (held) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = alu;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          ctx.moveTo(held.x + 0.5, laneH * lane + 28);
          ctx.lineTo(held.x + 0.5, base + 6);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    };

    const tick = () => {
      draw();
      raf = requestAnimationFrame(tick);
    };
    const animate = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (motion.matches && inView && !document.hidden && !done) raf = requestAnimationFrame(tick);
      else draw();
    };

    const set = (id, next) => setStatus((prev) => ({ ...prev, [id]: next }));

    const probe = (target) => {
      if (inflight.has(target.id)) return;
      const ctrl = new AbortController();
      inflight.set(target.id, ctrl);
      const t0 = performance.now();
      const abort = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const waking = samples.current[target.id].length
        ? 0
        : setTimeout(() => alive && set(target.id, { phase: "waking" }), WAKING_MS);
      const finish = (ok) => {
        clearTimeout(abort);
        clearTimeout(waking);
        inflight.delete(target.id);
        if (!alive) return;
        const at = performance.now();
        const ms = at - t0;
        const list = samples.current[target.id];
        list.push({ at, ms, ok });
        if (list.length > KEEP) list.shift();
        set(target.id, ok ? { phase: "ok", ms } : { phase: "down" });
        setBeat((n) => n + 1);
        if (done) stoppedAt = at;
        if (!raf) draw();
      };
      // no-cors: the response is opaque, so this only proves the app answered.
      fetch(target.url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal }).then(
        () => finish(true),
        () => finish(false)
      );
    };

    const round = () => {
      lastRound = performance.now();
      TARGETS.forEach(probe);
    };

    // Next round only while the monitor is on screen in a visible tab.
    const schedule = () => {
      clearTimeout(timer);
      if (done || !inView || document.hidden) return;
      const wait = Math.max(0, lastRound + EVERY_MS - performance.now());
      timer = setTimeout(() => {
        round();
        schedule();
      }, wait);
    };

    const stop = setTimeout(() => {
      done = true;
      stoppedAt = performance.now();
      clearTimeout(timer);
      setLive(false);
      animate();
    }, SESSION_MS);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = r.width;
      height = r.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting; // newest one wins
      schedule();
      animate();
    });
    io.observe(box);

    const onVisibility = () => {
      schedule();
      animate();
    };
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", animate);

    api.current.move = (e) => {
      const r = canvas.getBoundingClientRect();
      const lane = Math.min(TARGETS.length - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * TARGETS.length)));
      const x = e.clientX - r.left;
      const prev = hover.current;
      const now = prev && prev.lane === lane ? prev.now : stoppedAt || performance.now();
      hover.current = { lane, x, now };
      const target = TARGETS[lane];
      let near = null;
      points(samples.current[target.id].filter((s) => s.at <= now), now).forEach((p) => {
        if (!near || Math.abs(p.x - x) < Math.abs(near.x - x)) near = p;
      });
      setReadout(
        near && {
          id: target.id,
          text: `${near.ok ? format(near.ms) : "no signal"} · ${Math.max(0, Math.round((now - near.at) / 1000))} s earlier`,
        }
      );
      if (!raf) draw();
    };
    api.current.leave = () => {
      hover.current = null;
      setReadout(null);
      if (!raf) draw();
    };

    // The first round always runs, even if the page opened further down: it is the warm-up.
    round();
    schedule();
    animate();

    return () => {
      alive = false;
      clearTimeout(timer);
      clearTimeout(stop);
      cancelAnimationFrame(raf);
      inflight.forEach((c) => c.abort());
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", animate);
    };
  }, []);

  const summary = TARGETS.map((t) => `${t.name} ${describe(status[t.id]).replace(" ·", ",")}`).join(". ");

  return (
    <div className="monitor" ref={boxRef}>
      <div className="mon-head">
        <span>signal monitor</span>
        <span className={live ? "mon-live" : "mon-live off"}>
          <span key={beat} className="mon-led" aria-hidden="true" />
          {live ? "LIVE" : "PAUSED"}
        </span>
      </div>
      <div className="mon-screen">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${summary}.`}
          onPointerMove={(e) => api.current.move(e)}
          onPointerDown={(e) => api.current.move(e)}
          onPointerLeave={() => api.current.leave()}
          onPointerCancel={() => api.current.leave()}
        />
        {TARGETS.map((t, i) => (
          <div className="mon-row" key={t.id} style={{ top: `${(i / TARGETS.length) * 100}%` }}>
            <a className="mon-app" href={liveUrl(t.id)} target="_blank" rel="noopener noreferrer" title={`Open ${t.name} (new tab)`}>
              {t.name}
            </a>
            <span className={`mon-val ${status[t.id].phase}`}>
              {readout && readout.id === t.id ? readout.text : describe(status[t.id])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
