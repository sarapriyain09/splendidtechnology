import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Portfolio | Splendid Technology",
};

const projects = [
  {
    title: "Home-Kitchen UK",
    description: "E-commerce kitchen supplies — mobile-first design, shopping cart.",
    href: "#",
    imageSrc: "/images/projects/homekitchen.png",
  },
  {
    title: "MendForWorks",
    description:
      "Workforce management & booking system — dashboard, multi-user login.",
    href: "#",
    imageSrc: "/images/projects/mendforworks.png",
  },
  {
    title: "Kodi Supermarket",
    description:
      "Online supermarket catalog — booking/order system integrated.",
    href: "#",
    imageSrc: "/images/projects/kodisupermarket.png",
  },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          A few recent projects. Replace the placeholders with real links and
          screenshots.
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
        Request Free Website Review
      </Link>
    </div>
  );
}
