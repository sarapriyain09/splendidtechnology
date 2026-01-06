import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Portfolio | Splendid Technology",
};

const projects = [
  {
    title: "Home-Kitchen UK",
    description: "E-commerce kitchen supplies — mobile-first design, shopping cart.",
    href: "https://home-kitchen.uk/",
    imageSrc: "/images/projects/homekitchen.png",
  },
  {
    title: "MendForWorks",
    description:
      "Mentor–mentee connection platform — profiles, matching, and secure user access.",
    href: "https://www.mendforworks.com/",
    imageSrc: "/images/projects/mendforworks.jpg",
  },
  {
    title: "Kodi Supermarket",
    description:
      "Online supermarket catalog — booking/order system integrated.",
    href: "https://kodisupermarket.co.uk/",
    imageSrc: "/images/projects/kodisupermarket.png",
  },
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          A few recent projects across e-commerce and custom platforms.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            className="group rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[.02]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5">
              <Image
                src={project.imageSrc}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{project.title}</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              {project.description}
            </p>
            <p className="mt-3 text-sm font-medium text-blue-700 group-hover:underline">
              View project
            </p>
          </a>
        ))}
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
        href="/contact"
      >
        Get a Custom App Built
      </Link>
    </div>
  );
}
