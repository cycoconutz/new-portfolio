import { Fragment } from "react";
import SkillModule from "./SkillModule";
import { skillGroups, alsoSkills } from "../data";

export default function About({ selected, onToggle, onClear, status, onGoToProject, linkedinUrl, resumeHref, onOpenResume }) {
  return (
    <section id="about">
      <h2 className="sec-title reveal">who_i_am</h2>
      <div className="about-grid">
        <div className="about-text reveal">
          <p>
            I'm a <strong>full-stack engineer</strong> based in Lafayette, LA.
            I spent the last four years building web solutions at{" "}
            <strong>KUKUI</strong> for automotive service businesses, and I love
            turning complex problems into clean, intuitive digital experiences.
          </p>
          <p>
            My background spans the entire stack, from responsive React frontends to
            Node/Express APIs backed by MySQL and MongoDB. I care deeply about{" "}
            <strong>code quality, performance,</strong> and shipping things that actually
            work.
          </p>
          <p>
            Find my code on{" "}
            <a href="https://github.com/cycoconutz" target="_blank" rel="noopener noreferrer">GitHub</a>
            , connect on{" "}
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            , read my{" "}
            <a href={resumeHref} target="_blank" rel="noopener noreferrer" onClick={onOpenResume}>résumé</a>
            , or browse the full{" "}
            <a href="https://cycoconutz.github.io/portfolio-tabs/" target="_blank" rel="noopener noreferrer">project catalog</a>.
          </p>
        </div>
        <div className="skills-side reveal" id="skills" role="group" aria-label="Skills" aria-describedby="patch-hint">
          {skillGroups.slice(0, 2).map((group) => (
            <SkillModule key={group.cat} group={group} selected={selected} onToggle={onToggle} />
          ))}
        </div>
        <div className="skills-below reveal" role="group" aria-label="More skills" aria-describedby="patch-hint">
          {skillGroups.slice(2).map((group) => (
            <SkillModule key={group.cat} group={group} selected={selected} onToggle={onToggle} />
          ))}
          <p className="also">
            <span className="k">also:</span>
            {alsoSkills.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 ? <span className="sep" aria-hidden="true">·</span> : null}
                <button type="button" className="chip" aria-pressed={selected.has(s.id)} onClick={() => onToggle(s.id)}>
                  {s.name}
                </button>
              </Fragment>
            ))}
          </p>
          <div className="patch-status">
            <span className="sr-only" aria-live="polite">{status.announce}</span>
            {status.goTo ? (
              <button type="button" id="patch-hint" className="patch-go" onClick={onGoToProject}>{status.text} &rarr;</button>
            ) : (
              <span id="patch-hint">{status.text}</span>
            )}
            <button type="button" className="patch-clear" onClick={onClear} disabled={selected.size === 0}>clear (esc)</button>
          </div>
        </div>
      </div>
    </section>
  );
}
