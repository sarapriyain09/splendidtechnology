import { ConversationList } from "@/components/ai-chat/ConversationList";
import type { ConversationModel } from "@/components/ai-chat/types";

type Props = {
  open: boolean;
  items: ConversationModel[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function HistoryDrawer({ open, items, activeConversationId, onSelect, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35 lg:hidden" onClick={onClose}>
      <div className="h-full w-[82vw] max-w-sm bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">History</h3>
          <button type="button" className="text-xs text-slate-600" onClick={onClose}>
            Close
          </button>
        </div>

        <ConversationList
          items={items}
          activeConversationId={activeConversationId}
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
