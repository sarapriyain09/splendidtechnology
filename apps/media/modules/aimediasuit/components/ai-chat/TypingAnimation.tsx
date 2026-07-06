export function TypingAnimation() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
    </div>
  );
}
