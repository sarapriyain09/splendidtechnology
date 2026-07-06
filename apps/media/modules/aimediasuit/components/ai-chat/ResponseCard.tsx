import { AudioPlayer } from "@/components/ai-chat/AudioPlayer";
import type { ChatMessageModel } from "@/components/ai-chat/types";

type Props = {
  message: ChatMessageModel;
  onCopyAssetUrl?: (url: string) => void;
  onRegenerate?: () => void;
};

export function ResponseCard({ message, onCopyAssetUrl, onRegenerate }: Props) {
  const asset = message.asset;

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">{message.content}</p>

      {asset?.kind === "audio" ? <AudioPlayer src={asset.url} /> : null}

      {asset ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <a className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50" href={asset.url} download>
            Download
          </a>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
            onClick={() => onCopyAssetUrl?.(asset.url)}
          >
            Copy URL
          </button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50" onClick={onRegenerate}>
            Regenerate
          </button>
        </div>
      ) : null}
    </div>
  );
}
