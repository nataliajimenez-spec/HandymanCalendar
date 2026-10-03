import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { company, nav } from "@/content/site";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-palm text-ivory/80">
        <p className="mx-auto max-w-7xl px-5 py-2 text-center font-sans text-[0.62rem] uppercase tracking-[0.3em] sm:px-8">
          <span className="hidden sm:inline">Wholesale supply for hotels &amp; short-term rentals · </span>
          <span className="sm:hidden">Hotel &amp; STR wholesale supply · </span>
          {company.location}
        </p>
      </div>
      <div className="border-b border-palm/10 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline font-sans text-[0.7rem] font-medium uppercase tracking-[0.24em] text-palm/80 hover:text-palm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contact" className="btn-dark">
              Request a Quote
            </Link>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
