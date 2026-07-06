type Props = {
  title: string;
  description: string;
};

export function UploadArea({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <h4 className="text-sm font-semibold text-[color:var(--text)]">{title}</h4>
      <p className="mt-1 text-xs text-[color:var(--muted)]">{description}</p>
      <button
        type="button"
        className="mt-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs text-[color:var(--text)]"
      >
        Upload Files
      </button>
    </div>
  );
}
