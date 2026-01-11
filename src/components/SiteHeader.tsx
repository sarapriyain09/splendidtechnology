import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/locations", label: "Locations" },
  { href: "/services#godaddy-products", label: "Products" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="bg-[#0b3d91] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Splendid Technology
        </Link>
        <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 sm:justify-end sm:gap-x-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/95 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
