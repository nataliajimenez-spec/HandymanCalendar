import Link from "next/link";
import { CollectionIcon } from "@/components/CollectionIcon";
import { HeroArt } from "@/components/HeroArt";
import { ArrowIcon, BenefitGlyph, CheckIcon, ClockIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { StarterPlanner } from "@/components/StarterPlanner";
import { accountPerks, audiences, benefits, collections, company, steps } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-14">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-sea-light px-3.5 py-1.5 text-sm font-medium text-sea">
              <span className="h-2 w-2 rounded-full bg-sun" aria-hidden />
              Hotel &amp; Airbnb supplies in {company.location}
            </p>
            <h1 className="display mt-6 text-balance text-[2.9rem] text-ink sm:text-6xl xl:text-7xl">
              Hotel-quality supplies, at prices that <em className="text-sea">make sense.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Towels, sheets, amenities and everything in between, at wholesale prices. Whether you host one
              Airbnb or run a full hotel, we&apos;ll help you stock it right.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalog" className="btn-primary">
                Browse the catalog <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">Get a free quote</Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Already a customer?{" "}
              <Link href="/sign-in" className="font-semibold text-sea hover:underline">Sign in to reorder</Link>
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              <HeroArt className="h-auto w-full" />
              <div className="absolute -left-2 bottom-8 hidden items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-[0_20px_40px_-20px_rgba(31,42,41,0.35)] sm:flex lg:-left-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sun-light text-[#b5761c]">
                  <BenefitGlyph name="tag" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">Wholesale pricing</span>
                  <span className="block text-sm text-muted">For hosts of every size</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
          <ul className="grid gap-3 rounded-3xl bg-shell p-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3.5 rounded-2xl bg-white/70 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-light text-sea">
                  <BenefitGlyph name={b.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{b.title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">{b.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Shop by category" title="Everything your rooms need, in one place." />
          <Link href="/catalog" className="reveal inline-flex items-center gap-2 font-semibold text-sea hover:underline">
            See the full catalog <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} href={`/catalog#${c.slug}`} className="card group reveal flex items-center gap-5 p-5 transition hover:-translate-y-0.5 hover:border-sea/30 hover:shadow-[0_18px_40px_-24px_rgba(31,42,41,0.35)] sm:p-6">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${c.tint}`}>
                <CollectionIcon name={c.icon} className="h-12 w-12" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl">{c.name}</span>
                <span className="mt-1 block text-sm leading-snug text-muted">{c.description}</span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 text-ink/25 transition group-hover:translate-x-1 group-hover:text-sea" />
            </Link>
          ))}
        </div>
      </section>

      {/* Starter list planner */}
      <section id="planner" className="scroll-mt-28 bg-sea-light/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Not sure where to start?"
            title="Build your starter list in seconds."
            intro="Set up a new rental or refresh an old one. Tell us the size of your place and we'll show you how much to stock."
          />
          <div className="reveal mt-10">
            <StarterPlanner />
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <SectionHeading align="center" eyebrow="Who we help" title="Made for hosts of every size." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className="card reveal flex flex-col p-7 sm:p-8">
              <h3 className="font-display text-2xl">{a.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{a.body}</p>
              <ul className="mt-6 space-y-2.5">
                {a.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <CheckIcon className="h-5 w-5 shrink-0 text-sea" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* How ordering works */}
      <section className="bg-shell">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
          <SectionHeading eyebrow="How ordering works" title="Simple from the first message." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal rounded-3xl bg-white/70 p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sun font-display text-xl text-ink">{i + 1}</span>
                <h3 className="mt-5 font-display text-xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Returning customers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="reveal grid items-center gap-10 overflow-hidden rounded-[2rem] bg-sea p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-sun">For frequent customers</p>
            <h2 className="display mt-3 text-balance text-4xl sm:text-5xl">Order often? Make it effortless.</h2>
            <p className="mt-4 max-w-md text-lg text-white/80">
              With an Isla Prime account, restocking your properties takes minutes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-in" className="btn-sun">Sign in</Link>
              <Link href="/contact" className="btn-ghost-light">Request an account</Link>
            </div>
          </div>
          <ul className="grid gap-3">
            {accountPerks.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4">
                <CheckIcon className="h-5 w-5 shrink-0 text-sun" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-ink/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="display text-3xl sm:text-4xl">Questions? Just ask.</h2>
            <p className="mt-2 text-muted">Real people, happy to help you figure out what you need.</p>
          </div>
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            <li className="flex items-center gap-2.5"><MailIcon className="h-5 w-5 text-sea" /><span className="select-all">{company.email}</span></li>
            <li className="flex items-center gap-2.5"><PhoneIcon className="h-5 w-5 text-sea" /><span className="select-all">{company.phone}</span></li>
            <li className="flex items-center gap-2.5"><ClockIcon className="h-5 w-5 text-sea" />{company.hours}</li>
          </ul>
        </div>
      </section>
    </>
  );
}
