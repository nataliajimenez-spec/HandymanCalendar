import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/Logo";
import { PageHero } from "@/components/PageHero";
import { company, pillars } from "@/content/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>Hospitality, supplied <em className="text-brass">with care.</em></>}
        intro={`${company.legalName} supplies the linens, amenities and essentials behind memorable stays — for hotels, short-term rentals and property managers in ${company.location}.`}
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <div className="reveal flex items-center justify-center bg-sand-100 py-20 lg:col-span-5">
          <Monogram className="h-56 w-auto text-brass" />
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Our story</p>
          <h2 className="display mt-5 text-4xl text-palm sm:text-5xl">
            Born on the island, <em className="text-brass">built for its hosts.</em>
          </h2>
          <div className="mt-8 space-y-5 leading-relaxed text-stone-dark">
            <p>
              We work alongside the people who welcome guests to Puerto Rico every day. We know
              that a great stay is made of small things done right — and that running out of
              towels on a full weekend is never an option.
            </p>
            <p>
              That&apos;s why we focus on hotel-grade products, honest wholesale pricing and
              dependable local service, so you can spend less time sourcing and more time
              hosting.
            </p>
          </div>
          <Link href="/contact" className="btn-dark mt-10">
            Work with us <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-t border-palm/10 bg-linen">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="eyebrow text-center">What we stand for</p>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="reveal border-t border-brass/50 pt-6">
                <h3 className="font-serif text-2xl text-palm">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-dark">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
