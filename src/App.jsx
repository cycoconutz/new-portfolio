import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects, allSkills, usedInExperience } from "./data";
import { useReveal, useFontRefresh, useTypedTitles } from "./motion/hooks";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ribbon from "./components/Ribbon";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ResumeModal from "./components/ResumeModal";

// RESUME_VERSION is bumped by hand whenever public/resume.pdf is replaced.
// The ?v= query busts the CDN/browser cache so recruiters always
// get the current file even though the path stays stable.
const RESUME_VERSION = "1.4.6";
const RESUME_HREF = `${import.meta.env.BASE_URL}resume.pdf?v=${RESUME_VERSION}`;
const EMAIL = "johndyates@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/john-d-yates/";
function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  }, []);
  return [copied, copy];
}

// Summary line for the skills area, derived from the selected skill ids.
function describeSelection(selected, matching) {
  if (selected.size === 0) {
    return { text: "// select a skill to trace it through the projects", goTo: false };
  }
  if (matching.length > 0) {
    const text = `patched to ${matching.length} of ${projects.length} projects`;
    return { text, goTo: true };
  }
  const inExp = allSkills.some((s) => selected.has(s.id) && usedInExperience(s));
  const text = inExp ? "used in experience" : "not highlighted in these projects";
  return { text, goTo: false };
}

export default function Portfolio() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  useTypedTitles(rootRef);
  useFontRefresh();
  const [resumeOpen, setResumeOpen] = useState(false);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const [copied, copyEmail] = useCopyEmail();
  // Phones and tablets get the browser's own PDF viewer in a new tab;
  // most mobile browsers can't render a PDF inside an iframe.
  const openResume = (e) => {
    if (window.matchMedia("(max-width: 860px)").matches) return;
    e.preventDefault();
    setResumeOpen(true);
  };

  const [selected, setSelected] = useState(() => new Set());
  // What the live region announces: changes after every toggle, even if the summary text repeats.
  const [lastAction, setLastAction] = useState(null);
  const toggleSkill = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setLastAction({ id });
  }, []);
  const clearSkills = useCallback(() => {
    // Keep keyboard focus in the skills area when the clear button is about to disappear.
    const a = document.activeElement;
    if (a && a.closest && a.closest(".skills-side, .skills-below")) {
      const first = document.querySelector("#skills .jack");
      if (first) first.focus();
    }
    setSelected(new Set());
    setLastAction({ cleared: true });
  }, []);

  useEffect(() => {
    if (selected.size === 0 || resumeOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") clearSkills(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, resumeOpen, clearSkills]);

  const matching = useMemo(
    () => projects.filter((p) => p.skills.some((s) => selected.has(s))),
    [selected]
  );
  const status = describeSelection(selected, matching);
  let announce = "";
  if (lastAction && lastAction.cleared) announce = "selection cleared";
  else if (lastAction) {
    const skill = allSkills.find((s) => s.id === lastAction.id);
    const summary = selected.size === 0 ? "no skills selected" : status.text;
    announce = `${skill ? skill.name : "skill"} ${selected.has(lastAction.id) ? "on" : "off"}: ${summary}`;
  }
  status.announce = announce;
  const goToProject = () => {
    const el = matching[0] && document.getElementById(`project-${matching[0].id}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={rootRef}>
      <ResumeModal open={resumeOpen} onClose={closeResume} resumeHref={RESUME_HREF} />
      <Nav />

      <div className="wrap">
        <main>
          <Hero email={EMAIL} resumeHref={RESUME_HREF} onOpenResume={openResume} />
        </main>
      </div>

      <Ribbon />

      <div className="wrap">
        <main>
          <About
            selected={selected}
            onToggle={toggleSkill}
            onClear={clearSkills}
            status={status}
            onGoToProject={goToProject}
            linkedinUrl={LINKEDIN_URL}
            resumeHref={RESUME_HREF}
            onOpenResume={openResume}
          />
          <Experience />
          <Projects selected={selected} onToggle={toggleSkill} />
          <Contact
            email={EMAIL}
            copied={copied}
            onCopy={copyEmail}
            resumeHref={RESUME_HREF}
            onOpenResume={openResume}
            linkedinUrl={LINKEDIN_URL}
          />
        </main>

        <Footer email={EMAIL} copied={copied} onCopy={copyEmail} />
      </div>
    </div>
  );
}
