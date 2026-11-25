import { ribbonSkills } from "../data";

export default function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="band">
        {[...ribbonSkills, ...ribbonSkills].map((skill, i) => (
          <span key={`${skill}-${i}`} className={"sigitem" + (i % 3 === 0 ? " on" : "")}>
            {skill}
          </span>
        ))}
      </div>
      <span className="scan" />
    </div>
  );
}
