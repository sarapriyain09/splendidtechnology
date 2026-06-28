import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkflowLog {
  id: string;
  status: string;
  message: string | null;
  executedAt: string;
  workflow: {
    id: string;
    name: string;
  };
}

interface WorkflowLogTableProps {
  logs: WorkflowLog[];
}

export function WorkflowLogTable({ logs }: WorkflowLogTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Workflow</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-600">{new Date(log.executedAt).toLocaleString()}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{log.workflow.name}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        log.status === "success"
                          ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                          : log.status === "failed"
                            ? "rounded-full bg-red-100 px-2 py-1 text-xs text-red-700"
                            : "rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                      }
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{log.message || "-"}</td>
                </tr>
              ))}
              {!logs.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                    No workflow logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
