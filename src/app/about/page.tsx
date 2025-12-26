export const metadata = {
  title: "About | Splendid Technology",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Add your company background, values, and experience here. Keep it
          concise and focused on what outcomes you deliver.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">What we do</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          We partner with teams to design, build, and run software systems.
          Typical engagements include new product builds, re-platforming,
          improving delivery pipelines, and ongoing support.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">How we work</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Clear scope, short feedback loops, and documentation that keeps your
          team unblocked.
        </p>
      </section>
    </div>
  );
}
