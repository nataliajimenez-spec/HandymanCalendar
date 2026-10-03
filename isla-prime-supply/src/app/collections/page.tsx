import type { Metadata } from "next";
import Link from "next/link";
import { CollectionIcon } from "@/components/CollectionIcon";
import { PageHero } from "@/components/PageHero";
import { collections } from "@/content/site";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Collections"
        title={<>Curated essentials for <em className="text-brass">exceptional stays.</em></>}
        intro="Our full catalog is coming soon. In the meantime, explore what we carry and request pricing for your property — we'll put together a selection tailored to you."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="divide-y divide-palm/10 border-y border-palm/10">
          {collections.map((c, i) => (
            <article
              key={c.slug}
              id={c.slug}
              className="reveal grid scroll-mt-32 gap-8 py-12 md:grid-cols-12 md:items-center md:gap-10 lg:py-16"
            >
              <div className={`flex aspect-[4/3] items-center justify-center md:col-span-4 ${c.tone}`}>
                <CollectionIcon name={c.icon} className="h-24 w-24 text-palm/70" />
              </div>
              <div className="md:col-span-5">
                <span className="font-serif text-lg italic text-brass">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-serif text-4xl text-palm lg:text-5xl">{c.name}</h2>
                <p className="mt-4 leading-relaxed text-stone-dark">{c.description}</p>
                <span className="mt-6 inline-block border border-brass/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-brass">
                  Catalog coming soon
                </span>
              </div>
              <ul className="space-y-3 md:col-span-3">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-palm">
                    <span className="h-px w-4 bg-brass" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="reveal mt-24 flex flex-col items-center bg-palm px-6 py-16 text-center text-ivory sm:px-12">
          <p className="eyebrow text-brass-light">Wholesale pricing</p>
          <h2 className="display mt-5 max-w-2xl text-4xl sm:text-5xl">
            Need something specific? <em className="text-brass-light">We&apos;ll source it.</em>
          </h2>
          <p className="mt-6 max-w-xl text-ivory/70">
            Share what your property needs and we&apos;ll come back with options and volume pricing.
          </p>
          <Link href="/contact" className="btn-light mt-10">
            Request a Quote <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
