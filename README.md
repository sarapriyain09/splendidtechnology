Splendid Technology website (starter build) using Next.js + Tailwind.

## Repository layout (committed target)

```
apps/
├── website
├── workspace
├── admin
├── engineering
├── commerce
├── growth
└── media
```

Platform intent:

- `apps/website`: public website and customer entry points.
- `apps/workspace`: internal operations workspace hosting cross-functional business modules.
- `apps/admin`: cross-platform governance and administration surface.
- `apps/engineering`: AI-powered engineering simulation platform (torsional first, then broader rotating machinery modules).
- `apps/commerce`: product-first commerce operating system and product workspace modules.
- `apps/growth`: sales and marketing operating system (CRM, sales, customer success, automation).
- `apps/media`: AI-native media platform (video, avatar, voice, image, subtitle, presentation, assets).

All additional capabilities should be implemented as modules under these parent apps.

Deployment scripts:

- Website to Pi: `scripts/deploy-pi.ps1`
- Growth platform to Pi: `scripts/deploy-pi-growth-platform.ps1`

Migration notes: `docs/ops/apps-folder-migration.md`

Contributor onboarding: `docs/ops/contributor-onboarding.md`

AI platform roadmap: `docs/strategy/velynxia-ai-media-suite-phased-development-plan.md`

Portfolio staged strategy: `docs/strategy/velynxia-three-business-staged-strategy.md`

## SEO keyword strategy (UK + Leicester)

This is a practical keyword set designed for UK intent + service intent + quick wins.

- 90-day content calendar: see `docs/seo/90-day-content-calendar.md`

### High-intent core keywords (use on Home, Services, Contact)

- web development company uk
- website development services uk
- custom web development uk
- web app development uk
- ecommerce website development uk
- ai integration services uk
- automation services for small business uk
- startup web development uk
- affordable web development uk

### Service-specific keywords (use in service page sections + headings)

Web & app development

- custom web app development uk
- react web development uk
- fastapi backend development uk
- scalable web applications uk

E-commerce

- ecommerce website developer uk
- shopify website development uk
- custom ecommerce solutions uk
- online store development uk

AI & automation

- ai powered web applications uk
- business automation services uk
- workflow automation uk
- ai tools for small business uk

### Local SEO keywords (add to copy + location sections)

- web development company leicester
- web developers leicester uk
- website development leicester
- ecommerce developer leicester
- ai automation services leicester

### Blog keywords (1/week, 800–1200 words)

- how much does a website cost in uk
- how to build ecommerce website uk
- web app vs website differences
- benefits of ai automation for business
- best tech stack for startups
- how to automate small business operations

### Long-tail conversion keywords

- small business web development uk
- startup friendly web development uk
- affordable ecommerce developer uk
- custom ai tools for startups
- white label web development uk

### Page → primary keyword mapping

| Page | Primary keyword |
| --- | --- |
| Home | web development company uk |
| Services | custom web development uk |
| Services (Web Apps section) | web app development uk |
| Services (E-commerce section) | ecommerce website development uk |
| Services (AI/Automation section) | ai integration services uk |
| Contact | website developers leicester |

### Implementation checklist

1. Use 1 primary keyword per page.
2. Include it naturally in: title tag, H1, first paragraph, meta description, image alt text.
3. Internally link blog posts to relevant service sections.
4. Set `NEXT_PUBLIC_SITE_URL` in production (used for canonical/sitemap URLs).

## Getting Started

## First-time install (new user)

### Prerequisites

- **Node.js**: install the current **LTS** release (recommended). After installing, restart your terminal.
- **npm**: comes with Node.js.

To verify:

```bash
node --version
npm --version
```

### Install + run locally

1. Download/clone this project.
2. Open a terminal in this folder (the folder that contains `package.json`).
3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

### Common first-time issues

- **“node is not recognized” / “npm is not recognized” (Windows)**: Node.js is not installed or your terminal hasn’t been restarted since install.
- **Port 3000 already in use**: stop the other app using the port, or run `npm run dev -- -p 3001`.

From this folder:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key routes:

- `/` Home
- `/services`
- `/about`
- `/contact`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## GitHub (repo)

1. Create a new empty repository on GitHub.
2. In a terminal from this folder:

```bash
git init
git add -A
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/<YOUR_ORG_OR_USER>/<YOUR_REPO>.git
git push -u origin main
```

## Deploy (Vercel)

1. Sign in to Vercel and click **Add New → Project**.
2. Import your GitHub repo.
3. Set **Root Directory** to `splendidtechnology` (this project folder).
4. Deploy.

If you later add environment variables (email provider keys, etc.), configure them in Vercel **Project Settings → Environment Variables**.

## Notes

- The contact form currently logs submissions on the server and returns success; it does not send email yet.
- The chat window posts to `/api/chat`. To forward chat messages into your CRM, set `CRM_WEBHOOK_URL`.

## Stripe + Pi provisioning automation

Pricing checkout is wired through Stripe and supports post-payment provisioning to apps running on Raspberry Pi.

### Required environment variables (Vercel)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

For plan resolution, configure at least one strategy per plan:

- `STRIPE_PRICE_ID_*` (recommended)
- `STRIPE_PRODUCT_ID_*`
- `STRIPE_LOOKUP_*`

The app checks in this order: Price ID -> lookup key -> Product ID.

### Pi provisioning webhook variables (Vercel)

- `PI_PROVISIONING_WEBHOOK_URL` (Cloudflare Tunnel URL that reaches your Pi provisioning service)
- `PI_PROVISIONING_WEBHOOK_TOKEN` (shared secret sent as Bearer token)
- `PI_PROVISIONING_TIMEOUT_MS` (optional, default 10000)

### App permission sync variables (Vercel)

- `APP_PERMISSION_SYNC_URL` (default: `https://app.velynxia.com/api/licensing/payment-sync`)
- `APP_PERMISSION_SYNC_SECRET` (must match `VELYNXIA_PAYMENT_SYNC_SECRET` in app-growth)

Stripe webhook now syncs paid users directly to app permissions using this payload:

- `email`
- `plan` (mapped to app license tiers)
- `status` (`paid`)

Plan mapping used by default:

- `creator -> Starter`
- `professional -> Growth`
- `business -> Professional`
- `enterprise -> Enterprise`

If direct app sync fails and legacy Pi provisioning variables are configured,
the webhook falls back to the old provisioning endpoint.

### Stripe webhook route

- Endpoint: `/api/stripe/webhook`
- Event used: `checkout.session.completed`

After a successful subscription checkout, the webhook sends this payload to your Pi provisioning service:

- `stripeEventId`
- `stripeSessionId`
- `stripeCustomerId`
- `stripeSubscriptionId`
- `customerEmail`
- `customerName`
- `plan`
- `targetApp` (`growth` or `aimedia`)
- `paidAt`

The webhook includes `X-Idempotency-Key` set to Stripe session ID to help deduplicate provisioning jobs on the Pi side.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


