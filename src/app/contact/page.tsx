import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Splendid Technology",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Tell us what you want to build. If you started with CodLearn, share
          your prototype or notes — we can take it to production.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <ContactForm />
        <p className="mt-6 text-xs leading-5 text-black/60">
          Tip: include your goals, timeline, and any links (CodLearn, docs, or
          examples) so we can scope accurately.
        </p>
      </section>
    </div>
  );
}
