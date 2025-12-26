export function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-black/70 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-medium text-black">Splendid Technology</p>
            <p>© {new Date().getFullYear()} Splendid Technology</p>
            <p className="text-xs">Built with Next.js and deployed on Vercel.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-black">Links</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a className="hover:text-black" href="/">
                Home
              </a>
              <a className="hover:text-black" href="/services">
                Services
              </a>
              <a className="hover:text-black" href="/portfolio">
                Portfolio
              </a>
              <a className="hover:text-black" href="/contact">
                Contact
              </a>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-black">Contact</p>
            <p>
              <a className="hover:text-black" href="mailto:info@splendidtechnology.co.uk">
                info@splendidtechnology.co.uk
              </a>
            </p>
            <p>+44 XXXXX XXXXX</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
