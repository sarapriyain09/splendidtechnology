import { ResponseCard } from "@/components/ai-chat/ResponseCard";
import { TypingAnimation } from "@/components/ai-chat/TypingAnimation";
import type { ChatMessageModel } from "@/components/ai-chat/types";

type Props = {
  message: ChatMessageModel;
  onCopyAssetUrl?: (url: string) => void;
  onRegenerate?: () => void;
};

export function ChatMessage({ message, onCopyAssetUrl, onRegenerate }: Props) {
  if (message.type === "generation-status") {
    return (
      <div className="my-2 flex items-center gap-2 text-xs text-slate-500">
        <TypingAnimation />
        <span className="capitalize">{message.phase ?? "thinking"}...</span>
      </div>
    );
  }

  if (message.role === "assistant") {
    return <ResponseCard message={message} onCopyAssetUrl={onCopyAssetUrl} onRegenerate={onRegenerate} />;
  }

  return (
    <div className="ml-auto max-w-3xl rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white shadow-sm">
      <p className="whitespace-pre-wrap leading-6">{message.content}</p>
    </div>
  );
}
