import Link from "next/link";
import { collections, company } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-sea-dark text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-xs text-white/70">
              Quality hotel and rental supplies at fair wholesale prices, right here in {company.location}.
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-sun">Catalog</h3>
            <ul className="mt-4 space-y-2.5 text-white/75">
              {collections.map((c) => (
                <li key={c.slug}><Link href={`/catalog#${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-sun">Company</h3>
            <ul className="mt-4 space-y-2.5 text-white/75">
              <li><Link href="/about" className="hover:text-white">About us</Link></li>
              <li><Link href="/about#contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-white">Get a quote</Link></li>
              <li><Link href="/sign-in" className="hover:text-white">Sign in</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-sun">Say hello</h3>
            <ul className="mt-4 space-y-2.5 text-white/75">
              <li className="break-all select-all">{company.email}</li>
              <li className="select-all">{company.phone}</li>
              <li>{company.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}</p>
          <p>Proudly based in {company.location}</p>
        </div>
      </div>
    </footer>
  );
}
