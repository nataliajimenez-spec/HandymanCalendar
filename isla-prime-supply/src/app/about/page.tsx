import type { Metadata } from "next";
import Link from "next/link";
import { BenefitGlyph, ClockIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { Monogram } from "@/components/Logo";
import { PageHero } from "@/components/PageHero";
import { benefits, company } from "@/content/site";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  const contact = [
    { icon: MailIcon, label: "Email", value: company.email },
    { icon: PhoneIcon, label: "Phone", value: company.phone },
    { icon: ClockIcon, label: "Hours", value: company.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Your neighbors in hospitality supply."
        intro={`${company.legalName} helps hotels, Airbnb hosts and property managers in ${company.location} stock their properties with quality supplies at fair prices.`}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="reveal flex items-center justify-center rounded-[2rem] bg-sea-light py-16 lg:col-span-5">
          <Monogram className="h-48 w-auto text-sea" />
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Our story</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">From the island, for the island.</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              We know what it takes to welcome guests in Puerto Rico. A great stay comes down to small things
              done right, like soft towels, a well-made bed and a bathroom that&apos;s ready to go.
            </p>
            <p>
              We started Isla Prime to make those things easy to get. You get quality you can count on,
              honest wholesale prices and a local team that answers when you call.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-shell">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="reveal rounded-3xl bg-white/70 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sea-light text-sea"><BenefitGlyph name={b.icon} className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-xl">{b.title}</h3>
              <p className="mt-1.5 text-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">We&apos;d love to hear from you.</h2>
            <p className="mt-4 text-lg text-muted">
              Questions about products, prices or an order? Reach out any way you like.
            </p>
            <Link href="/contact" className="btn-primary mt-8">Get a free quote</Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
            {contact.map(({ icon: Icon, label, value }) => (
              <li key={label} className="card flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sea-light text-sea"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block select-all break-words font-semibold">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
