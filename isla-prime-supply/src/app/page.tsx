import Link from "next/link";
import { CollectionIcon } from "@/components/CollectionIcon";
import { HeroArt } from "@/components/HeroArt";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";
import { collections, company, industries, pillars, steps } from "@/content/site";

const audiences = [
  "Hotels",
  "Boutique Inns",
  "Resorts",
  "Airbnb Hosts",
  "VRBO Hosts",
  "Property Managers",
  "Guest Houses",
  "Vacation Villas",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="grain overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="lg:col-span-6">
            <p className="eyebrow">{company.tagline} · {company.location}</p>
            <h1 className="display mt-7 text-[3.4rem] text-palm sm:text-7xl xl:text-[5.6rem]">
              The quiet luxury of a{" "}
              <em className="font-normal text-brass">well-made</em> stay.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-stone-dark">
              Hotel-grade linens, towels, amenities and room essentials — curated for
              hotels, short-term rentals and property managers across the island.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="btn-dark">
                Request a Quote <span aria-hidden>→</span>
              </Link>
              <Link href="/collections" className="btn-outline">
                Explore Collections
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-palm/10 pt-8">
              {[
                ["Hotel", "grade quality"],
                ["Wholesale", "volume pricing"],
                ["Local", "island supply"],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt className="font-serif text-2xl text-palm sm:text-3xl">{a}</dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-stone">{b}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <HeroArt className="relative z-10 h-auto w-full" />
              <div className="absolute -left-2 bottom-2 z-20 hidden bg-ivory/95 px-6 py-5 shadow-[0_25px_50px_-20px_rgba(29,41,37,0.3)] backdrop-blur sm:block lg:-left-16">
                <p className="eyebrow">Made for turnover</p>
                <p className="mt-2 max-w-[13rem] font-serif text-xl leading-snug text-palm">
                  Soft for guests. Tough enough for commercial laundry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience ribbon */}
      <section aria-label="Who we supply" className="overflow-hidden border-y border-palm/10 bg-linen py-6">
        <div className="marquee-track flex w-max">
          {[...audiences, ...audiences].map((a, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-8 font-serif text-2xl italic text-palm/70">
              {a}
              <span className="ml-16 text-xs not-italic text-brass" aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Collections"
            title={<>Everything a room needs, <em className="text-brass">beautifully sourced.</em></>}
          />
          <Link href="/collections" className="link-underline reveal self-start text-[0.72rem] font-medium uppercase tracking-[0.24em] text-palm md:self-end">
            View all collections →
          </Link>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections#${c.slug}`} className="group reveal block">
              <div className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden ${c.tone}`}>
                <CollectionIcon
                  name={c.icon}
                  className="h-24 w-24 text-palm/70 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="absolute left-5 top-5 text-[0.62rem] uppercase tracking-[0.28em] text-stone">
                  {String(collections.indexOf(c) + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-500 group-hover:scale-x-100" />
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-3xl text-palm">{c.name}</h3>
                <span className="text-brass transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-dark">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Isla Prime */}
      <section className="bg-palm text-ivory">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-5">
            <SectionHeading
              light
              eyebrow="Why Isla Prime"
              title={<>Five-star standards, <em className="text-brass-light">island-made service.</em></>}
              intro="Guests notice the details — the weight of a towel, the crispness of a sheet, the scent in the shower. We help you get every one of them right, every time."
            />
          </div>
          <div className="grid gap-px self-end bg-ivory/10 sm:grid-cols-2 lg:col-span-7">
            {pillars.map((p, i) => (
              <div key={p.title} className="reveal bg-palm p-8 sm:p-10">
                <span className="font-serif text-lg italic text-brass-light">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          align="center"
          eyebrow="Who we serve"
          title={<>Built for every kind of <em className="text-brass">stay.</em></>}
          intro="From a single beachfront apartment to a full-service resort, we tailor supply to the way your property runs."
        />
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {industries.map((ind) => (
            <article key={ind.title} className="reveal group flex flex-col border border-palm/10 bg-white/40 p-9 transition-colors duration-500 hover:border-brass/50 hover:bg-white/80 sm:p-10">
              <span className="font-serif text-5xl font-light text-sand">{ind.eyebrow}</span>
              <h3 className="mt-8 font-serif text-3xl text-palm">{ind.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-stone-dark">{ind.body}</p>
              <ul className="mt-8 space-y-3 border-t border-palm/10 pt-8">
                {ind.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-sm text-palm">
                    <span className="h-px w-5 bg-brass" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-28 border-t border-palm/10 bg-linen">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="How it works"
            title={<>Stocked in <em className="text-brass">three simple steps.</em></>}
          />
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal relative">
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brass font-serif text-2xl text-brass">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-palm/15 md:block" aria-hidden />}
                </div>
                <h3 className="mt-8 font-serif text-2xl text-palm">{s.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-dark">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="scroll-mt-28 bg-palm-soft text-ivory">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-4">
            <SectionHeading
              light
              eyebrow="Wholesale inquiries"
              title={<>Let&apos;s outfit your <em className="text-brass-light">property.</em></>}
              intro="Tell us a little about your property and we'll prepare a tailored selection with wholesale pricing."
            />
            <div className="reveal mt-10 space-y-2 text-sm text-ivory/70">
              <p><a href={`mailto:${company.email}`} className="link-underline">{company.email}</a></p>
              <p>{company.phone}</p>
              <p className="text-ivory/45">{company.hours}</p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <QuoteForm dark />
          </div>
        </div>
      </section>
    </>
  );
}
