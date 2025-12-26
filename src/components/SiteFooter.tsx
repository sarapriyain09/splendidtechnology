export function SiteFooter() {
  return (
    <footer className="bg-[#f0f0f0]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-center text-sm text-black/70 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Splendid Technology |{" "}
          <a className="text-[#0b3d91] hover:underline" href="/">
            Home
          </a>{" "}
          |{" "}
          <a className="text-[#0b3d91] hover:underline" href="/#services">
            Services
          </a>{" "}
          |{" "}
          <a className="text-[#0b3d91] hover:underline" href="/#portfolio">
            Portfolio
          </a>{" "}
          |{" "}
          <a className="text-[#0b3d91] hover:underline" href="/#contact">
            Contact
          </a>
        </p>
        <p className="mt-2">
          Email:{" "}
          <a
            className="text-[#0b3d91] hover:underline"
            href="mailto:info@splendidtechnology.co.uk"
          >
            info@splendidtechnology.co.uk
          </a>{" "}
          | Phone:{" "}
          <a className="text-[#0b3d91] hover:underline" href="tel:+447721952967">
            +44 7721952967
          </a>
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
      </div>
    </footer>
  );
}
