"use client";

import { useEffect, useMemo, useState } from "react";

import {
  approveMission,
  createMission,
  fetchMission,
  fetchMissions,
  ProductMission,
  runMission,
  SavedAnalysisItem,
} from "@/lib/api";

type MissionHomeWorkspaceProps = {
  recentItems: SavedAnalysisItem[];
};

const QUICK_MISSIONS = [
  "Find Product Opportunities",
  "Analyse Amazon Product",
  "Price Analysis",
  "Manufacturing Cost",
  "Shipping Cost",
  "Find UK Suppliers",
  "Find India Suppliers",
  "Review Analysis",
  "Market Trends",
  "Generate Product Specification",
] as const;

const AGENT_STEPS = [
  "Product Discovery Agent",
  "Market Agent",
  "Review Agent",
  "Pricing Agent",
  "Manufacturing Agent",
  "Decision Agent",
] as const;

const DEFAULT_MISSION =
  "Find premium MDF monitor stands between GBP 70 and GBP 150 with more than 500 reviews and customer complaints about stability.";

export function MissionHomeWorkspace({ recentItems }: MissionHomeWorkspaceProps) {
  const [missionInput, setMissionInput] = useState(DEFAULT_MISSION);
  const [selectedQuickMission, setSelectedQuickMission] = useState<string | null>(null);
  const [missions, setMissions] = useState<ProductMission[]>([]);
  const [activeMission, setActiveMission] = useState<ProductMission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMissions() {
      try {
        const rows = await fetchMissions();
        if (cancelled) {
          return;
        }
        setMissions(rows);
        setActiveMission((previous) => previous ?? rows[0] ?? null);
      } catch {
        if (!cancelled) {
          setErrorMessage("Unable to load missions. Backend may be unavailable.");
        }
      }
    }

    void loadMissions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeMission || activeMission.status !== "running") {
      return;
    }

    const timer = setInterval(async () => {
      try {
        const latest = await fetchMission(activeMission.id);
        setActiveMission(latest);
        if (latest.status !== "running") {
          const rows = await fetchMissions();
          setMissions(rows);
        }
      } catch {
        setErrorMessage("Live mission polling failed. Retrying automatically.");
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [activeMission]);

  async function handleRunMission() {
    if (!missionInput.trim()) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      const created = await createMission({
        mission_text: missionInput,
        quick_mission: selectedQuickMission,
      });
      const running = await runMission(created.id);
      setActiveMission(running);
      const rows = await fetchMissions();
      setMissions(rows);
    } catch {
      setErrorMessage("Mission could not be started. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApproveMission() {
    if (!activeMission) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      const approved = await approveMission(activeMission.id, {
        product_name: activeMission.recommended_product_name ?? undefined,
        sku: activeMission.recommended_sku ?? undefined,
        status: "idea",
      });
      setActiveMission(approved);
      const rows = await fetchMissions();
      setMissions(rows);
    } catch {
      setErrorMessage("Mission approval failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRunning = activeMission?.status === "running";
  const completedRun = activeMission?.status === "pending_approval" || activeMission?.status === "approved";
  const activeStepIndex = activeMission?.current_stage_index ?? -1;

  const missionResultSummary = useMemo(() => {
    if (isRunning) {
      return "Mission running";
    }

    if (activeMission?.status === "pending_approval") {
      return "Mission completed, awaiting approval";
    }

    if (activeMission?.status === "approved") {
      return "Mission approved and product created";
    }

    if (completedRun) {
      return "Mission completed";
    }

    return "Ready to run";
  }, [activeMission?.status, completedRun, isRunning]);

  const recentMissions = useMemo(() => {
    if (missions.length > 0) {
      return missions.slice(0, 4).map((mission) => ({
        id: mission.id,
        name: mission.recommended_product_name || mission.quick_mission || `Mission ${mission.id}`,
        status:
          mission.status === "approved"
            ? "Approved"
            : mission.status === "pending_approval"
              ? "Pending Approval"
              : mission.status === "running"
                ? "Running"
                : "Draft",
        score: Math.round(mission.opportunity_score ?? 0),
      }));
    }

    if (recentItems.length > 0) {
      return recentItems.slice(0, 2).map((item, index) => ({
        id: item.id,
        name: item.product_name,
        status: index === 0 ? "Completed" : "Running",
        score: item.opportunity_score,
      }));
    }

    return [
      { id: 1, name: "Executive Monitor Stand", status: "Completed", score: 92 },
      { id: 2, name: "Laptop Stand", status: "Running", score: 89 },
    ];
  }, [missions, recentItems]);

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="workspace-scroll min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5">
        <div className="mx-auto max-w-4xl">
          <header className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Velynxia Product Studio</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">What would you like to accomplish today?</h1>
            <p className="mt-2 text-sm text-slate-700">State your goal. AI agents handle research, analysis, and recommendation steps before product creation.</p>
            <div className="mt-4 rounded-lg border border-slate-300 bg-white p-3">
              <textarea
                value={missionInput}
                onChange={(event) => setMissionInput(event.target.value)}
                className="h-24 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-[#10213d] focus:ring-2"
                placeholder="Find a profitable office product made from MDF for UK and Amazon channels"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-600">{missionResultSummary}</span>
                <button
                  type="button"
                  onClick={() => {
                    void handleRunMission();
                  }}
                  disabled={isSubmitting}
                  className="rounded-md bg-[#10213d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a335f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Working..." : "Run AI Mission"}
                </button>
              </div>
            </div>
            {errorMessage ? <p className="mt-3 text-xs font-medium text-rose-700">{errorMessage}</p> : null}
          </header>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick Missions</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {QUICK_MISSIONS.map((mission) => {
                const isActive = selectedQuickMission === mission;
                return (
                  <button
                    key={mission}
                    type="button"
                    onClick={() => {
                      setSelectedQuickMission(mission);
                      setMissionInput(mission);
                    }}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "border-[#2f65c8] bg-[#e7f0ff] text-[#10213d]"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {mission}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Recent Missions</h2>
            <div className="mt-3 space-y-2">
              {recentMissions.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded px-2 py-0.5 font-semibold ${
                        item.status === "Completed" || item.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Pending Approval"
                            ? "bg-violet-100 text-violet-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-slate-700">Opportunity Score {item.score ?? "-"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <aside className="workspace-scroll min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Agent Console</h2>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
          <p className="font-semibold text-slate-900">Mission</p>
          <p className="mt-1 text-slate-700">{missionResultSummary}</p>
          {activeMission ? <p className="mt-1 text-slate-500">Mission #{activeMission.id}</p> : null}
        </div>
        <div className="mt-3 space-y-2">
          {AGENT_STEPS.map((step, index) => {
            let status = "Waiting";

            if (isRunning && index < activeStepIndex) {
              status = "Completed";
            } else if (isRunning && index === activeStepIndex) {
              status = "Running";
            } else if (!isRunning && completedRun) {
              status = "Completed";
            }

            const statusClass =
              status === "Completed"
                ? "bg-emerald-100 text-emerald-800"
                : status === "Running"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-700";

            return (
              <div key={step} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold text-slate-800">{step}</p>
                <span className={`mt-1 inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${statusClass}`}>{status}</span>
              </div>
            );
          })}
        </div>

        {activeMission?.status === "pending_approval" ? (
          <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs">
            <p className="font-semibold text-violet-900">Approval Required</p>
            <p className="mt-1 text-violet-900">Recommended Product: {activeMission.recommended_product_name ?? "TBC"}</p>
            <p className="mt-1 text-violet-900">Proposed SKU: {activeMission.recommended_sku ?? "TBC"}</p>
            <p className="mt-1 text-violet-900">Opportunity Score: {activeMission.opportunity_score ?? "-"}</p>
            <button
              type="button"
              onClick={() => {
                void handleApproveMission();
              }}
              disabled={isSubmitting}
              className="mt-2 rounded-md bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Approve And Create Product
            </button>
          </div>
        ) : null}

        {activeMission?.status === "approved" ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs">
            <p className="font-semibold text-emerald-900">Product Created</p>
            <p className="mt-1 text-emerald-900">Product ID: {activeMission.created_product_id ?? "-"}</p>
            <p className="mt-1 text-emerald-900">{activeMission.recommended_product_name ?? "Approved mission"}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
