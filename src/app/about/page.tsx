export const metadata = {
  title: "About | Splendid Technology",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Splendid Technology builds custom, scalable, production-ready software
          for startups, small businesses, and growing teams.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">What we do</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          We design and build web applications, e-commerce platforms, automation
          systems, and AI integrations — with a focus on reliability,
          performance, and long-term maintainability.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">CodLearn & Splendid Technology</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          CodLearn is our AI-powered platform for idea generation, learning, and
          rapid prototyping. Splendid Technology is the execution partner that
          takes validated prototypes and delivers production-ready systems.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold">How we work</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          Fast kickoff, clear scope, short feedback loops, and deployment-ready
          delivery — with documentation that keeps your team unblocked.
        </p>
      </section>
    </div>
  );
}
