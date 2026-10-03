import Link from "next/link";
import { company, nav } from "@/content/site";
import { UserIcon } from "./Icons";
import { Logo } from "./Logo";
import { SideMenu } from "./SideMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-sea-dark text-white/90">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[0.8rem] sm:px-8">
          <span className="hidden sm:inline">Wholesale supplies for hotels, Airbnbs &amp; property managers in {company.location} · </span>
          <span className="sm:hidden">Wholesale hotel &amp; Airbnb supplies · </span>
          <Link href="/contact" className="font-semibold text-sun underline-offset-4 hover:underline">
            Get a free quote
          </Link>
        </p>
      </div>
      <div className="border-b border-ink/[0.06] bg-cream">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-8">
          <Logo />

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-[0.95rem] font-medium text-ink/80 transition hover:bg-sea-light hover:text-sea">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-4 lg:gap-2">
            <Link href="/sign-in" className="flex h-11 items-center gap-2 rounded-full px-3 text-[0.95rem] font-medium text-ink/80 transition hover:bg-sea-light hover:text-sea" aria-label="Sign in">
              <UserIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link href="/contact" className="btn-primary hidden !py-2.5 md:inline-flex">
              Get a quote
            </Link>
            <SideMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
