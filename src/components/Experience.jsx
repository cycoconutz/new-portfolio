import { experience } from "../data";

export default function Experience() {
  return (
    <section id="experience">
      <h2 className="sec-title reveal">experience</h2>

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
    </section>
  );
}
