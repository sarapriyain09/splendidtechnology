export function ExportDialog() {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <h3 className="text-sm font-semibold text-[color:var(--text)]">Export</h3>
      <p className="mt-1 text-xs text-[color:var(--muted)]">Choose output format and caption behavior before publishing.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--text)]">
          MP4
        </button>
        <button type="button" className="rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--text)]">
          WebM
        </button>
        <button type="button" className="rounded-lg bg-[color:var(--accent)] px-3 py-2 text-xs text-white">
          Export Now
        </button>
      </div>
    </div>
  );
}
