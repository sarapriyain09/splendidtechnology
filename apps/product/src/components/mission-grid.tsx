import { AIMission } from "@/src/modules/ai/missions";

type MissionGridProps = {
  missions: readonly AIMission[];
};

export function MissionGrid({ missions }: MissionGridProps) {
  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {missions.map((mission, index) => (
          <article
            key={mission.title}
            className={`fade-up ${index % 4 === 0 ? "stagger-1" : index % 4 === 1 ? "stagger-2" : "stagger-3"}`}
            style={{
              border: "1px solid var(--panel-border)",
              background: "var(--panel)",
              borderRadius: 14,
              padding: 14,
              minHeight: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>{mission.title}</h3>
              <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.45 }}>{mission.summary}</p>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Outcome: {mission.outcome}</span>
              <button
                type="button"
                style={{
                  borderRadius: 8,
                  border: "1px solid var(--active)",
                  background: "var(--active)",
                  color: "#fff",
                  fontSize: 12,
                  padding: "6px 9px",
                }}
              >
                Launch
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
