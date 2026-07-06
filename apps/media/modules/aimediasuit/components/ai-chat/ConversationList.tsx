import { formatDistanceToNow } from "date-fns";
import type { ConversationModel } from "@/components/ai-chat/types";

type Props = {
  items: ConversationModel[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
};

export function ConversationList({ items, activeConversationId, onSelect }: Props) {
  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-xs text-slate-500">No conversations yet.</p>;
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => {
        const active = activeConversationId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${
              active ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="truncate text-sm font-medium text-slate-700">{item.title}</p>
            <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}</p>
          </button>
        );
      })}
    </div>
  );
}
