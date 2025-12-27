import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "JWeller Shopify Theme | Splendid Technology",
};

export default function JWellerShopifyThemeDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">JWeller Shopify Theme</h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Premium Shopify Online Store 2.0 theme scaffold for jewellery brands.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { src: "/images/projects/them1.png", alt: "JWeller theme preview 1" },
            { src: "/images/projects/them2.png", alt: "JWeller theme preview 2" },
          ].map((img) => (
            <div
              key={img.src}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 bg-black/5"
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Highlights</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
          <li>Minimal and app-free theme structure</li>
          <li>Homepage demo defaults to a “Best sellers” collection handle</li>
          <li>Product page supports a configurable Size guide and Care tab</li>
          <li>Instagram section uses manual image/link blocks (no API)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Purchase</h2>
        <p className="max-w-2xl text-sm leading-6 text-black/70">
          Contact us for pricing and to purchase this theme.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            href="/contact"
          >
            Contact us to purchase
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-black hover:bg-black/[.02]"
            href="/services#godaddy-products"
          >
            Back to Products
          </Link>
        </div>
      </section>
    </div>
  );
}
