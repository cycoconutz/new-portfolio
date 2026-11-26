export default function SkillModule({ group, selected, onToggle }) {
  return (
    <div className="mod">
      <div className="name">{group.cat}</div>
      <div className="jacks">
        {group.items.map((item) => {
          const on = selected.has(item.id);
          return (
            <button
              type="button"
              className={"jack" + (on ? " lit" : "")}
              key={item.id}
              title={item.name}
              aria-pressed={on}
              onClick={() => onToggle(item.id)}
            >
              <span className="hole"><i className="seat" aria-hidden="true" /></span>
              <span className="lab">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
