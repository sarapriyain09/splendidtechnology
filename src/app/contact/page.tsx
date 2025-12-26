import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Splendid Technology",
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Send a message and we’ll respond as soon as possible.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <ContactForm />
        <p className="mt-6 text-xs leading-5 text-black/60">
          Note: this starter form stores nothing and only logs submissions on
          the server. Connect an email provider later if you want real delivery.
        </p>
      </section>
    </div>
  );
}
