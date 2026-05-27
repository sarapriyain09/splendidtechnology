import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Splendid Technology Ltd",
  description:
    "Privacy Policy for Splendid Technology Ltd — how we collect, use, and protect your personal data in accordance with UK GDPR.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  {
    heading: "1. Who We Are",
    body: [
      "Splendid Technology Ltd is a technology company registered in England and Wales, based in Leicester, UK. We deliver Industrial IoT solutions, predictive maintenance systems, and AI-powered business process automation for manufacturers and industrial SMEs.",
      "For the purposes of UK data protection law, Splendid Technology Ltd is the data controller responsible for your personal data.",
      "Contact: info@splendidtechnology.co.uk | +44 7721 952967",
    ],
  },
  {
    heading: "2. What Personal Data We Collect",
    body: [
      "We may collect the following categories of personal data:",
    ],
    bullets: [
      "Contact details: name, email address, phone number, and company name (when you contact us or submit an enquiry)",
      "Communication data: the content of messages, emails, or enquiries you send us",
      "Technical data: IP address, browser type, device type, pages visited, and time spent on pages (collected via cookies and analytics tools)",
      "Business data: details about your organisation, equipment, or operational requirements shared during a consultation or pilot engagement",
    ],
  },
  {
    heading: "3. How We Collect Your Data",
    body: [
      "We collect personal data through the following means:",
    ],
    bullets: [
      "Contact and enquiry forms on our website",
      "Direct email or telephone communication",
      "On-site visits, pilot programmes, or consultations",
      "Cookies and analytics tools when you browse our website (see our Cookie Policy)",
    ],
  },
  {
    heading: "4. Why We Use Your Data (Lawful Basis)",
    body: [
      "We process your personal data under the following lawful bases as defined by UK GDPR:",
    ],
    bullets: [
      "Legitimate interests — to respond to enquiries, provide information about our services, and improve our website",
      "Contractual necessity — to fulfil obligations under a contract or pilot agreement with you or your organisation",
      "Legal obligation — to comply with applicable laws and regulations",
      "Consent — where you have explicitly opted in (e.g. marketing communications), which you may withdraw at any time",
    ],
  },
  {
    heading: "5. How We Use Your Data",
    body: [
      "We use your personal data to:",
    ],
    bullets: [
      "Respond to your enquiries and provide requested information",
      "Arrange and deliver site visits, pilots, or consultations",
      "Manage our contractual relationships",
      "Send relevant updates about our services (where consent has been given)",
      "Improve our website and understand how visitors use it",
      "Comply with legal and regulatory obligations",
    ],
  },
  {
    heading: "6. Industrial IoT & Monitoring Activities",
    body: [
      "As part of our Industrial IoT services, we may collect and process operational data from equipment installed at your site during pilot engagements and live deployments. This section explains how that data is handled.",
    ],
    bullets: [
      "Machine operational data: vibration, temperature, current draw, and other sensor readings captured from monitored equipment",
      "Predictive maintenance analytics: processed data used to generate condition scores, fault indicators, and maintenance recommendations",
      "Cloud dashboard data: aggregated operational metrics transmitted to secure cloud platforms for analysis and reporting",
      "Pilot engagement data: data collected during agreed trial periods, retained only for the duration of the pilot unless extended by mutual agreement",
      "Site contact data: names and contact details of site personnel involved in the installation or review of monitoring systems",
    ],
    note: "Monitoring insights and predictive maintenance recommendations are intended to support maintenance decision-making and should not replace standard engineering inspections, operational procedures, or safety practices. All operational data is processed under a contractual agreement with your organisation and is not shared with third parties without your consent.",
  },
  {
    heading: "7. Who We Share Your Data With",
    body: [
      "We do not sell your personal data. We may share it with trusted third parties only where necessary:",
    ],
    bullets: [
      "Website hosting and infrastructure providers",
      "Analytics platforms (e.g. Google Analytics — see Cookie Policy)",
      "Email and communication service providers",
      "Professional advisers (legal, accounting) where required",
      "Regulatory or law enforcement authorities where legally required",
    ],
    note: "All third-party processors are required to handle your data securely and in accordance with UK GDPR.",
  },
  {
    heading: "8. International Data Transfers",
    body: [
      "Some of our third-party service providers may process data outside the UK. Where this occurs, we ensure appropriate safeguards are in place — such as adequacy decisions, standard contractual clauses, or equivalent protections — as required by UK GDPR.",
    ],
  },
  {
    heading: "9. How Long We Keep Your Data",
    body: [
      "We retain personal data only for as long as necessary for the purpose it was collected:",
    ],
    bullets: [
      "Enquiry and contact data: up to 2 years from last contact, unless a contract relationship continues",
      "Contractual and project data: 6 years from the end of the contract (in line with UK limitation periods)",
      "Analytics data: as configured in our analytics tools (typically 14–26 months)",
    ],
  },
  {
    heading: "10. Your Rights Under UK GDPR",
    body: [
      "As a UK data subject, you have the following rights:",
    ],
    bullets: [
      "Right of access — request a copy of the personal data we hold about you",
      "Right to rectification — request correction of inaccurate or incomplete data",
      "Right to erasure — request deletion of your data ('right to be forgotten'), subject to legal obligations",
      "Right to restriction — request we limit processing of your data in certain circumstances",
      "Right to data portability — receive your data in a structured, machine-readable format",
      "Right to object — object to processing based on legitimate interests or for direct marketing",
      "Rights related to automated decision-making — we do not make solely automated decisions that produce legal or significant effects",
    ],
    note: "To exercise any of these rights, contact us at info@splendidtechnology.co.uk. We will respond within one calendar month.",
  },
  {
    heading: "11. Keeping Your Data Secure",
    body: [
      "We take appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include encrypted communications, access controls, and secure data storage.",
      "In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify the ICO within 72 hours and you as required by law.",
    ],
  },
  {
    heading: "12. Complaints",
    body: [
      "If you believe we have not handled your personal data lawfully, you have the right to lodge a complaint with the UK's supervisory authority:",
      "Information Commissioner's Office (ICO) | ico.org.uk | 0303 123 1113",
      "We would, however, appreciate the opportunity to address your concern first — please contact us at info@splendidtechnology.co.uk.",
    ],
  },
  {
    heading: "13. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The date at the top of this page reflects the most recent revision. Significant changes will be communicated via our website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      <header className="mb-10 border-b border-black/10 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0b1f3a]/50">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1f3a]">Privacy Policy</h1>
        <p className="mt-3 text-sm text-black/50">
          Splendid Technology Ltd &mdash; Last updated: May 2026
        </p>
        <p className="mt-4 text-sm leading-6 text-black/65">
          This Privacy Policy explains how Splendid Technology Ltd collects, uses,
          and protects your personal data in accordance with the UK General Data
          Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-[#0b1f3a]">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-sm leading-7 text-black/70">{paragraph}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-black/70">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b1f3a]/40" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
            {section.note && (
              <p className="mt-3 rounded-lg bg-[#f7f7f7] px-4 py-3 text-sm leading-6 text-black/65">
                {section.note}
              </p>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-black/10 pt-8 text-sm text-black/50">
        <p>
          <strong className="text-black/70">Data Controller:</strong> Splendid Technology Ltd, Leicester, England
        </p>
        <p className="mt-1">
          <strong className="text-black/70">Contact:</strong>{" "}
          <a className="text-[#0b1f3a] hover:underline" href="mailto:info@splendidtechnology.co.uk">
            info@splendidtechnology.co.uk
          </a>{" "}
          &nbsp;|&nbsp;{" "}
          <a className="text-[#0b1f3a] hover:underline" href="tel:+447721952967">
            +44 7721 952967
          </a>
        </p>
      </footer>

    </div>
  );
}
