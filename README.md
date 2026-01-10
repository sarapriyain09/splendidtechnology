Splendid Technology website (starter build) using Next.js + Tailwind.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


