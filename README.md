Splendid Technology website (starter build) using Next.js + Tailwind.

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


