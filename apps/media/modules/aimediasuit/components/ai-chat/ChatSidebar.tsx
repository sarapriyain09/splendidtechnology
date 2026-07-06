import { ConversationList } from "@/components/ai-chat/ConversationList";
import type { ConversationModel } from "@/components/ai-chat/types";
import type { VoiceHistoryItem } from "@/types/media";

type Props = {
  conversations: ConversationModel[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  templates: Array<{ id: string; label: string; prompt: string }>;
  onUseTemplate: (prompt: string) => void;
  history: VoiceHistoryItem[];
};

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  templates,
  onUseTemplate,
  history,
}: Props) {
  const favorites = conversations.filter((item) => item.favorite);

  return (
    <aside className="hidden h-[calc(100vh-180px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block">
      <button
        type="button"
        onClick={onCreateConversation}
        className="mb-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        New Chat
      </button>

      <div className="space-y-4">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Recent Chats</h3>
          <ConversationList items={conversations} activeConversationId={activeConversationId} onSelect={onSelectConversation} />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Favorites</h3>
          <ConversationList items={favorites} activeConversationId={activeConversationId} onSelect={onSelectConversation} />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Templates</h3>
          <div className="space-y-1.5">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onUseTemplate(template.prompt)}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
              >
                {template.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">History</h3>
          <div className="space-y-1.5">
            {history.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs text-slate-600">
                <p className="truncate font-medium text-slate-700">{item.title}</p>
                <p>{item.voice}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
