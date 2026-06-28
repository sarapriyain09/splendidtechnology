const uploads = ["Upload PowerPoint", "Upload PDF", "Upload Images"];

export function PresentationUploader() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Presentation Studio</h2>
        <p className="text-sm text-[color:var(--muted)]">Convert decks and documents into narrated avatar presentations.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {uploads.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5 text-sm text-[color:var(--text)]"
          >
            {item}
          </button>
        ))}
      </div>

      <button type="button" className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm text-white">
        Convert into Narrated Presentation
      </button>
    </section>
  );
}
