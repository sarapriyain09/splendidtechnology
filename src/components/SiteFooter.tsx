import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#f0f0f0]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-center text-sm text-black/70 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Splendid Technology |{" "}
          <Link className="text-[#0b3d91] hover:underline" href="/">
            Home
          </Link>{" "}
          |{" "}
          <Link className="text-[#0b3d91] hover:underline" href="/#services">
            Services
          </Link>{" "}
          |{" "}
          <Link className="text-[#0b3d91] hover:underline" href="/#portfolio">
            Portfolio
          </Link>{" "}
          |{" "}
          <Link className="text-[#0b3d91] hover:underline" href="/blog">
            Blog
          </Link>{" "}
          |{" "}
          <Link className="text-[#0b3d91] hover:underline" href="/#contact">
            Contact
          </Link>
        </p>
        <p className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
          <span>
            Email:{" "}
            <a
              className="text-[#0b3d91] hover:underline"
              href="mailto:info@splendidtechnology.co.uk"
            >
              info@splendidtechnology.co.uk
            </a>
          </span>
          <span className="hidden sm:inline">&nbsp;|&nbsp;</span>
          <span>
            Phone:{" "}
            <a className="text-[#0b3d91] hover:underline" href="tel:+447721952967">
              +44 7721952967
            </a>
          </span>
        </p>
        <p className="mt-2">
          <a className="text-[#0b3d91] hover:underline" href="#">
            LinkedIn
          </a>{" "}
          |{" "}
          <a className="text-[#0b3d91] hover:underline" href="#">
            Facebook
          </a>{" "}
          |{" "}
          <a className="text-[#0b3d91] hover:underline" href="#">
            Instagram
          </a>
        </p>
        <p className="mt-3 text-xs text-black/70">
          <span className="font-semibold text-black/80">Innovation Partner:</span>{" "}
          <a
            className="text-[#0b3d91] hover:underline"
            href="https://www.codlearn.com/app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CodLearn
          </a>
          {" "}
          <span className="text-black/60">
            — Idea generation · Rapid prototyping · Learning-first AI tools
          </span>
        </p>
      </div>
    </footer>
  );
}
