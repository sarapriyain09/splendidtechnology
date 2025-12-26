export function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-black/70 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Splendid Technology</p>
          <p>Built with Next.js and deployed on Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
