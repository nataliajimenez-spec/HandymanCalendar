import type { Metadata } from "next";
import Link from "next/link";
import { CollectionIcon } from "@/components/CollectionIcon";
import { ArrowIcon, CheckIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { collections } from "@/content/site";

export const metadata: Metadata = { title: "Catalog" };

export default function CatalogPage() {
  return (
    <>
      <PageHero
        eyebrow="Catalog"
        title="Quality supplies for every room."
        intro="Our full online catalog with prices is on its way. For now, browse what we carry and ask for a quote on anything you need."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
        <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {collections.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="shrink-0 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-sea hover:text-sea">
              {c.name}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {collections.map((c) => (
            <article key={c.slug} id={c.slug} className="card reveal flex scroll-mt-32 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-5">
                <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${c.tint}`}>
                  <CollectionIcon name={c.icon} className="h-12 w-12" />
                </span>
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl">{c.name}</h2>
                  <span className="mt-1.5 inline-block rounded-full bg-sun-light px-2.5 py-0.5 text-xs font-semibold text-[#9a6414]">
                    Online catalog coming soon
                  </span>
                </div>
              </div>
              <p className="mt-5 text-muted">{c.description}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckIcon className="h-4 w-4 shrink-0 text-sea" />{item}</li>
                ))}
              </ul>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-sea hover:underline">
                Ask for prices <ArrowIcon className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col items-start gap-6 rounded-3xl bg-shell p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="display text-3xl">Can&apos;t find what you need?</h2>
            <p className="mt-2 max-w-lg text-muted">Tell us. If it belongs in a hotel or rental, there&apos;s a good chance we can get it for you.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Ask us</Link>
        </div>
      </section>
    </>
  );
}
