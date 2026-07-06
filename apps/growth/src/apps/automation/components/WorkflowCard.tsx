import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    triggers: Array<{ eventName: string }>;
    actions: Array<{ actionType: string }>;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function WorkflowCard({ workflow, onEdit, onDelete }: WorkflowCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{workflow.name}</CardTitle>
            <CardDescription>{workflow.description || "No description"}</CardDescription>
          </div>
          <Badge variant={workflow.active ? "default" : "secondary"}>
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-slate-700">Triggers</p>
            <p className="mt-1 text-slate-500">{workflow.triggers.map((t) => t.eventName).join(", ") || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Actions</p>
            <p className="mt-1 text-slate-500">{workflow.actions.map((a) => a.actionType).join(", ") || "-"}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(workflow.id)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(workflow.id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
