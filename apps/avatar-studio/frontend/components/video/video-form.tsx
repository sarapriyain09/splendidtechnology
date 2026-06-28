const fields = [
  "Avatar",
  "Voice",
  "Language",
  "Script",
  "Background",
  "Brand",
  "Resolution",
];

export function VideoForm() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Video Creator</h2>
        <p className="text-sm text-[color:var(--muted)]">Build AI avatar videos with script, brand controls, and rendering presets.</p>
      </header>

      <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="text-sm text-[color:var(--text)]">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">{field}</span>
            {field === "Script" ? (
              <textarea
                rows={5}
                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
                placeholder="Write or paste script..."
              />
            ) : (
              <input
                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
                placeholder={`Select ${field.toLowerCase()}`}
              />
            )}
          </label>
        ))}
      </div>

      <button type="button" className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white">
        Generate Video
      </button>
    </section>
  );
}
