import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { company } from "@/content/site";

export const metadata: Metadata = { title: "Request a Quote" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title={<>Let&apos;s outfit your <em className="text-brass">property.</em></>}
        intro="Tell us about your property and what you need. We'll prepare a tailored selection with wholesale pricing."
      />
      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <aside className="space-y-10 lg:col-span-4">
          {[
            ["Email", <a key="e" href={`mailto:${company.email}`} className="link-underline break-all">{company.email}</a>],
            ["Phone", company.phone],
            ["Hours", company.hours],
            ["Serving", `Hotels, short-term rentals & property managers across ${company.location}`],
          ].map(([label, value]) => (
            <div key={label as string} className="border-t border-palm/10 pt-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-3 font-serif text-2xl leading-snug text-palm">{value}</p>
            </div>
          ))}
        </aside>
        <div className="lg:col-span-7 lg:col-start-6">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
