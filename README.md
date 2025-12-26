Splendid Technology website (starter build) using Next.js + Tailwind.

## Getting Started

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


