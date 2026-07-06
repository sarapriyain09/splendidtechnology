import { MissionGrid } from "@/src/components/mission-grid";
import { AI_MISSIONS } from "@/src/modules/ai/missions";

const pipeline = [
  "Idea",
  "Market Research",
  "Product Requirements",
  "CAD Design",
  "Material Selection",
  "Cost Estimation",
  "Prototype",
  "Manufacturing",
  "Inventory",
  "Sales Channels",
  "Customer Reviews",
  "AI Analysis",
  "Product Version 2",
] as const;

export function MissionDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <section
        className="fade-up"
        style={{
          border: "1px solid var(--panel-border)",
          background: "var(--panel)",
          borderRadius: 16,
          padding: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24 }}>AI Mission Dashboard</h2>
        <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", maxWidth: 760 }}>
          Product-first operating system for turning concepts into profitable, manufacturable products with continuous improvement loops.
        </p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {pipeline.map((step, idx) => (
            <div
              key={step}
              className={`fade-up ${idx % 3 === 0 ? "stagger-1" : idx % 3 === 1 ? "stagger-2" : "stagger-3"}`}
              style={{
                border: "1px solid var(--panel-border)",
                borderRadius: 999,
                padding: "6px 10px",
                background: "var(--panel-strong)",
                fontSize: 12,
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      <section
        className="fade-up stagger-1"
        style={{
          border: "1px solid var(--panel-border)",
          background: "var(--panel)",
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Mission Cards</h3>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Choose a mission to advance the product lifecycle.</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <MissionGrid missions={AI_MISSIONS} />
        </div>
      </section>
    </div>
  );
}
