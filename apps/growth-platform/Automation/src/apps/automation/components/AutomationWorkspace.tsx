"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ActionBuilder } from "./ActionBuilder";
import { ConditionBuilder } from "./ConditionBuilder";
import { TriggerSelector } from "./TriggerSelector";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowLogTable } from "./WorkflowLogTable";
import {
  type SupportedEventName,
  type WorkflowActionInput,
  type WorkflowConditionInput,
} from "../types";

type WorkflowRow = {
  id: string;
  companyId: string | null;
  name: string;
  description: string | null;
  active: boolean;
  triggers: Array<{ id: string; eventName: SupportedEventName }>;
  conditions: Array<{ id: string; field: string; operator: WorkflowConditionInput["operator"]; value: string }>;
  actions: Array<{ id: string; actionType: WorkflowActionInput["actionType"]; actionData: Record<string, unknown> | null }>;
};

type WorkflowLogRow = {
  id: string;
  status: string;
  message: string | null;
  executedAt: string;
  workflow: {
    id: string;
    name: string;
  };
};

interface WorkflowFormState {
  id?: string;
  companyId: string;
  name: string;
  description: string;
  active: boolean;
  triggers: SupportedEventName[];
  conditions: WorkflowConditionInput[];
  actions: WorkflowActionInput[];
}

const EMPTY_FORM: WorkflowFormState = {
  companyId: "",
  name: "",
  description: "",
  active: true,
  triggers: ["lead.created"],
  conditions: [{ field: "payload.source", operator: "=", value: "website" }],
  actions: [
    {
      actionType: "assign_user",
      actionData: { leadId: "", assigneeId: "" },
    },
    {
      actionType: "send_email",
      actionData: { to: "", subject: "Welcome", body: "Thanks for your enquiry." },
    },
    {
      actionType: "create_task",
      actionData: { title: "Follow up in 24h", description: "Call lead and qualify needs." },
    },
  ],
};

export function AutomationWorkspace() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowRow[]>([]);
  const [logs, setLogs] = useState<WorkflowLogRow[]>([]);
  const [form, setForm] = useState<WorkflowFormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [samplePayload, setSamplePayload] = useState(
    '{"source":"website","leadId":"","assigneeId":"","to":"lead@example.com"}',
  );

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      const [workflowRes, logRes] = await Promise.all([
        fetch("/api/automation/workflows", { cache: "no-store" }),
        fetch("/api/automation/logs", { cache: "no-store" }),
      ]);

      if (!workflowRes.ok || !logRes.ok) {
        throw new Error("Failed to load automation data.");
      }

      const workflowJson = (await workflowRes.json()) as { data: WorkflowRow[] };
      const logJson = (await logRes.json()) as { data: WorkflowLogRow[] };

      setWorkflows(workflowJson.data || []);
      setLogs(logJson.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load automation data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  function startEdit(workflowId: string) {
    const workflow = workflows.find((item) => item.id === workflowId);
    if (!workflow) return;

    setForm({
      id: workflow.id,
      companyId: workflow.companyId ?? "",
      name: workflow.name,
      description: workflow.description ?? "",
      active: workflow.active,
      triggers: workflow.triggers.map((item) => item.eventName),
      conditions: workflow.conditions.map((item) => ({
        field: item.field,
        operator: item.operator,
        value: item.value,
      })),
      actions: workflow.actions.map((item) => ({
        actionType: item.actionType,
        actionData: item.actionData,
      })),
    });
  }

  async function saveWorkflow() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        companyId: form.companyId.trim() || null,
        name: form.name,
        description: form.description,
        active: form.active,
        triggers: form.triggers,
        conditions: form.conditions,
        actions: form.actions,
      };

      const res = await fetch(
        form.id ? `/api/automation/workflows/${form.id}` : "/api/automation/workflows",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Save failed");
      }

      setMessage(form.id ? "Workflow updated." : "Workflow created.");
      resetForm();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Workflow save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteWorkflow(workflowId: string) {
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/automation/workflows/${workflowId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Delete failed");
      }

      if (form.id === workflowId) resetForm();
      setMessage("Workflow deleted.");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Workflow delete failed.");
    }
  }

  async function runSampleEvent() {
    setRunning(true);
    setError("");
    setMessage("");

    try {
      const payload = JSON.parse(samplePayload) as Record<string, unknown>;
      const eventName = (form.triggers[0] || "lead.created") as SupportedEventName;

      const res = await fetch("/api/automation/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          companyId: form.companyId.trim() || null,
          payload,
        }),
      });

      const data = (await res.json()) as { error?: string; matchedWorkflows?: number; results?: Array<{ status: string }> };
      if (!res.ok) throw new Error(data.error || "Execution failed");

      setMessage(`Event executed. Matched ${data.matchedWorkflows || 0} workflows.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Automation</h1>
        <p className="mt-1 text-sm text-slate-500">
          Build workflows using Trigger -&gt; Condition -&gt; Action and monitor execution logs.
        </p>
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Workflow" : "Create Workflow"}</CardTitle>
          <CardDescription>
            Configure triggers, conditions, and actions for automation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Name</Label>
              <Input
                id="workflow-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Website lead auto-followup"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-id">Company ID (optional)</Label>
              <Input
                id="company-id"
                value={form.companyId}
                onChange={(e) => setForm((prev) => ({ ...prev, companyId: e.target.value }))}
                placeholder="company_cuid"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea
              id="workflow-description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Assign website leads, send welcome email, and create follow-up task"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            />
            <span className="text-sm text-slate-700">Workflow active</span>
          </div>

          <TriggerSelector
            value={form.triggers}
            onChange={(triggers) => setForm((prev) => ({ ...prev, triggers }))}
          />

          <ConditionBuilder
            value={form.conditions}
            onChange={(conditions) => setForm((prev) => ({ ...prev, conditions }))}
          />

          <ActionBuilder
            value={form.actions}
            onChange={(actions) => setForm((prev) => ({ ...prev, actions }))}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={saveWorkflow} disabled={saving || !form.name.trim()}>
              {saving ? "Saving..." : isEditing ? "Update Workflow" : "Create Workflow"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Event</CardTitle>
          <CardDescription>
            Simulate an incoming event to execute matching workflows and generate logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="sample-payload">Sample payload (JSON)</Label>
            <Textarea
              id="sample-payload"
              value={samplePayload}
              onChange={(e) => setSamplePayload(e.target.value)}
            />
          </div>
          <Button type="button" variant="secondary" onClick={runSampleEvent} disabled={running}>
            {running ? "Running..." : "Run Event"}
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Workflow List</h2>
        {loading ? <p className="text-sm text-slate-500">Loading workflows...</p> : null}
        {!loading && !workflows.length ? (
          <p className="text-sm text-slate-500">No workflows yet. Create your first workflow above.</p>
        ) : null}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onEdit={startEdit}
              onDelete={deleteWorkflow}
            />
          ))}
        </div>
      </section>

      <WorkflowLogTable logs={logs} />
    </div>
  );
}
