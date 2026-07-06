import { ModuleConfig } from "@/src/types/navigation";

type ModuleWorkspaceProps = {
  module: ModuleConfig;
};

export function ModuleWorkspace({ module }: ModuleWorkspaceProps) {
  return (
    <section
      className="fade-up"
      style={{
        border: "1px solid var(--panel-border)",
        background: "var(--panel)",
        borderRadius: 16,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.8 }}>
          Stage: {module.stage}
        </p>
        <h2 style={{ margin: "4px 0 0", fontSize: 24 }}>{module.label}</h2>
        <p style={{ margin: "8px 0 0", maxWidth: 860, color: "var(--ink-soft)", lineHeight: 1.5 }}>{module.summary}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        <article style={cardStyle} className="fade-up stagger-1">
          <h3 style={cardTitle}>Goals</h3>
          <ul style={cardList}>
            {module.goals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article style={cardStyle} className="fade-up stagger-2">
          <h3 style={cardTitle}>Decisions</h3>
          <ul style={cardList}>
            {module.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article style={cardStyle} className="fade-up stagger-3">
          <h3 style={cardTitle}>AI Questions</h3>
          <ul style={cardList}>
            {module.questions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--panel-border)",
  background: "var(--panel-strong)",
  borderRadius: 12,
  padding: 12,
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
};

const cardList: React.CSSProperties = {
  margin: "8px 0 0",
  paddingLeft: 18,
  fontSize: 13,
  lineHeight: 1.45,
  color: "var(--ink-soft)",
};
