import type { Metadata } from "next";
import { CheckIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { company } from "@/content/site";

export const metadata: Metadata = { title: "Get a quote" };

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { list } = await searchParams;
  const starterList = typeof list === "string" ? list : "";

  return (
    <>
      <PageHero
        eyebrow="Get a free quote"
        title="Tell us what you need."
        intro="Fill this out and we'll send you wholesale pricing. It's free, and there's no commitment."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-8">
          <QuoteForm defaultMessage={starterList} />
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl bg-sea-light p-6">
            <h2 className="font-display text-xl">What happens next</h2>
            <ul className="mt-4 space-y-3">
              {["We review your request", "We send pricing and options", "You decide. No pressure."].map((s) => (
                <li key={s} className="flex items-center gap-2.5"><CheckIcon className="h-5 w-5 shrink-0 text-sea" />{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-shell p-6">
            <h2 className="font-display text-xl">Prefer to talk?</h2>
            <p className="mt-3 select-all font-semibold">{company.phone}</p>
            <p className="mt-1 select-all break-words font-semibold">{company.email}</p>
            <p className="mt-2 text-sm text-muted">{company.hours}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
