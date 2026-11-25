import { projects, techSkill } from "../data";

export default function Projects({ selected, onToggle }) {
  const any = selected.size > 0;
  return (
    <section id="projects">
      <h2 className="sec-title reveal">selected_projects</h2>

      {projects.map((p) => {
        const match = any && p.skills.some((s) => selected.has(s));
        // Static className: useReveal adds .visible imperatively and React must not drop it.
        const state = match ? "lit" : any ? "dim" : undefined;
        return (
          <div className="route reveal" data-state={state} id={`project-${p.id}`} key={p.id}>
            <span className="port">OUT {p.num}</span>
            <div>
              <h3>
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="nm">
                  {p.title}
                </a>
              </h3>
              <span className="tag">{p.tag}</span>
              <p className="ds">{p.desc}</p>
              {p.proof ? (
                <ul className="proof">
                  {p.proof.map(([value, label]) => (
                    <li key={label}><b>{value}</b>{label}</li>
                  ))}
                </ul>
              ) : null}
              <ul className="tech">
                {p.tech.map((t) => {
                  const id = techSkill[t];
                  const on = id && selected.has(id);
                  return (
                    <li key={t} className={on ? "lit" : undefined}>
                      {id ? (
                        <button type="button" aria-pressed={on} onClick={() => onToggle(id)}>{t}</button>
                      ) : (
                        t
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="links">
              <a href={p.live} target="_blank" rel="noopener noreferrer">
                open &#8599;
              </a>
              <a href={p.repo} target="_blank" rel="noopener noreferrer">
                source &#8599;
              </a>
            </div>
          </div>
        );
      })}

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
  );
}
