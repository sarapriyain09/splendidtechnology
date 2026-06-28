import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Velynxia Ltd",
  description:
    "Cookie Policy for Splendid Technology Ltd — what cookies we use, why, and how to control them.",
  alternates: {
    canonical: "/cookie-policy",
  },
};

const cookieTable = [
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics",
    purpose: "Distinguishes unique users and tracks sessions for website analytics.",
    type: "Analytics",
    duration: "2 years",
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    purpose: "Distinguishes users — used to throttle request rate.",
    type: "Analytics",
    duration: "24 hours",
  },
  {
    name: "__Secure-next-auth.session-token",
    provider: "Splendid Technology",
    purpose: "Maintains your session state if you are authenticated.",
    type: "Essential",
    duration: "Session",
  },
  {
    name: "cookie_consent",
    provider: "Splendid Technology",
    purpose: "Stores your cookie consent preference to avoid repeated prompts.",
    type: "Essential",
    duration: "1 year",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      <header className="mb-10 border-b border-black/10 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1f3a]">Cookie Policy</h1>
        <p className="mt-3 text-sm text-black/50">
          Splendid Technology Ltd &mdash; Last updated: May 2026
        </p>
        <p className="mt-4 text-sm leading-6 text-black/65">
          This Cookie Policy explains what cookies are, how Splendid Technology Ltd uses
          them on this website, and how you can control your preferences. It should be
          read alongside our{" "}
          <a href="/privacy-policy" className="text-[#0b1f3a] underline hover:text-[#0b3d91]">
            Privacy Policy
          </a>.
        </p>
      </header>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">1. What Are Cookies?</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            Cookies are small text files placed on your device when you visit a website.
            They are widely used to make websites work efficiently and to provide
            information to the website owner. Cookies do not contain any information that
            personally identifies you by itself, but they may be linked to personal data
            we hold about you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">2. Types of Cookies We Use</h2>
          <div className="mt-4 space-y-4">
            {[
              {
                type: "Essential Cookies",
                colour: "bg-[#0b1f3a]/10 text-[#0b1f3a]",
                description:
                  "These cookies are necessary for the website to function and cannot be switched off. They are set in response to actions you take, such as filling in forms or setting preferences. You can set your browser to block these cookies, but some parts of the site may not then work.",
              },
              {
                type: "Analytics Cookies",
                colour: "bg-blue-50 text-blue-800",
                description:
                  "These cookies allow us to measure and improve the performance of our website by counting visits and traffic sources. All information these cookies collect is aggregated and anonymous. We use Google Analytics for this purpose.",
              },
              {
                type: "Marketing / Targeting Cookies",
                colour: "bg-amber-50 text-amber-800",
                description:
                  "We do not currently use marketing or targeting cookies on this website. If this changes, this policy will be updated and your consent will be obtained before any such cookies are set.",
              },
            ].map((item) => (
              <div key={item.type} className="rounded-xl border border-black/10 bg-white p-5">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${item.colour}`}>
                  {item.type}
                </span>
                <p className="mt-3 text-sm leading-6 text-black/70">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">3. Cookies We Set</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            The following table lists the specific cookies used on this website:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1f3a] text-left text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th className="px-4 py-3">Cookie Name</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 bg-white">
                {cookieTable.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-3 font-mono text-xs text-[#0b1f3a]">{row.name}</td>
                    <td className="px-4 py-3 text-black/70">{row.provider}</td>
                    <td className="px-4 py-3 text-black/70">{row.purpose}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.type === "Essential"
                          ? "bg-[#0b1f3a]/10 text-[#0b1f3a]"
                          : "bg-blue-50 text-blue-800"
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black/70">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">4. Third-Party Cookies</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            We use Google Analytics to understand how visitors interact with our website.
            Google may set its own cookies and collect data in accordance with its own
            privacy policy. You can learn more and opt out at{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0b1f3a] underline hover:text-[#0b3d91]"
            >
              tools.google.com/dlpage/gaoptout
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">5. How to Control Cookies</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            You can control and manage cookies in several ways:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "Browser settings — most browsers allow you to refuse or delete cookies. The method varies by browser; check your browser's Help section for guidance.",
              "Google Analytics opt-out — install the Google Analytics opt-out browser add-on at tools.google.com/dlpage/gaoptout.",
              "Our cookie banner — when you first visit our site, you can accept or decline non-essential cookies via the consent banner.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-black/70">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b1f3a]/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-[#f7f7f7] px-4 py-3 text-sm leading-6 text-black/65">
            Please note: disabling certain cookies may affect the functionality of this website.
            Essential cookies cannot be disabled as they are required for the site to operate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">6. Legal Basis for Cookie Use</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            Under UK GDPR and the Privacy and Electronic Communications Regulations (PECR):
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "Essential cookies are placed on the basis of legitimate interests — they are strictly necessary for the website to function.",
              "Analytics cookies are placed on the basis of your consent, obtained via our cookie banner when you first visit.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-black/70">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b1f3a]/40" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">7. Changes to This Policy</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            We may update this Cookie Policy from time to time to reflect changes in
            technology, legislation, or our practices. The date at the top of this page
            reflects the most recent revision. We encourage you to review this page
            periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0b1f3a]">8. Contact Us</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            If you have any questions about our use of cookies or this policy, please contact us:
          </p>
          <div className="mt-3 rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-black/70">
            <p><strong className="text-[#0b1f3a]">Splendid Technology Ltd</strong></p>
            <p className="mt-1">36 Glazebrook Road, Leicester, LE3 9NT</p>
            <p className="mt-1">Company No. 17245651 (Registered in England &amp; Wales)</p>
            <p className="mt-1">
              <a className="text-[#0b1f3a] underline hover:text-[#0b3d91]" href="mailto:info@velynxia.com">
                info@velynxia.com
              </a>
            </p>
            <p className="mt-1">
              <a className="text-[#0b1f3a] underline hover:text-[#0b3d91]" href="tel:+447723144910">
                +44 7723 144910
              </a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
