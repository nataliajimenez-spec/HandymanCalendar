import Link from "next/link";
import { collections, company } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-palm text-ivory">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo light />
            <p className="mt-8 max-w-sm font-serif text-2xl font-light leading-snug text-ivory/80">
              Elevated essentials for the properties that make Puerto Rico feel like home.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow text-brass-light">Collections</h3>
            <ul className="mt-6 space-y-3 text-sm text-ivory/70">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections#${c.slug}`} className="link-underline hover:text-ivory">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="eyebrow text-brass-light">Company</h3>
            <ul className="mt-6 space-y-3 text-sm text-ivory/70">
              <li><Link href="/about" className="link-underline hover:text-ivory">About</Link></li>
              <li><Link href="/#industries" className="link-underline hover:text-ivory">Who We Serve</Link></li>
              <li><Link href="/#process" className="link-underline hover:text-ivory">How It Works</Link></li>
              <li><Link href="/contact" className="link-underline hover:text-ivory">Request a Quote</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="eyebrow text-brass-light">Contact</h3>
            <ul className="mt-6 space-y-3 text-sm text-ivory/70">
              <li><a href={`mailto:${company.email}`} className="link-underline break-all hover:text-ivory">{company.email}</a></li>
              <li>{company.phone}</li>
              <li>{company.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}</p>
          <p>Hospitality supply · {company.location}</p>
        </div>
      </div>
    </footer>
  );
}
