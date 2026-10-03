"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { collections, company, nav } from "@/content/site";
import { ArrowIcon, ClockIcon, CloseIcon, MailIcon, MenuIcon, PhoneIcon, UserIcon } from "./Icons";

// Slide-in menu on the right. Built on <details>, so it opens (and the
// backdrop closes it) even before JavaScript loads; script adds the close
// button, Escape key, and closing after a link is chosen.
export function SideMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <details ref={ref} className="drawer">
      <summary className="cursor-pointer list-none" aria-label="Open menu">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-sea hover:text-sea">
          <MenuIcon className="h-5 w-5" />
        </span>
        <span className="drawer-backdrop fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]" aria-hidden />
      </summary>

      <div className="drawer-panel fixed inset-y-0 right-0 z-[70] flex w-[min(24rem,100vw)] flex-col overflow-y-auto bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/[0.06] px-6 py-4">
          <span className="font-display text-xl">Menu</span>
          <button type="button" onClick={close} data-close className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-shell" aria-label="Close menu">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 px-6 py-6">
          <Link href="/sign-in" onClick={close} className="flex items-center gap-4 rounded-2xl bg-sea p-4 text-white transition hover:bg-sea-dark">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <UserIcon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">Sign in</span>
              <span className="block text-sm text-white/75">For returning customers</span>
            </span>
            <ArrowIcon className="h-5 w-5" />
          </Link>

          <nav aria-label="Menu" className="flex flex-col">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className="flex items-center justify-between border-b border-ink/[0.06] py-4 font-display text-2xl text-ink transition hover:text-sea">
                {item.label}
                <ArrowIcon className="h-5 w-5 text-ink/30" />
              </Link>
            ))}
          </nav>

          <div>
            <p className="eyebrow">Shop by category</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {collections.map((c) => (
                <Link key={c.slug} href={`/catalog#${c.slug}`} onClick={close} className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm text-ink/80 transition hover:border-sea hover:text-sea">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl bg-shell p-5">
            <p className="font-display text-lg">Questions? We&apos;re here to help.</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2.5"><MailIcon className="h-4 w-4 text-sea" /><span className="select-all">{company.email}</span></li>
              <li className="flex items-center gap-2.5"><PhoneIcon className="h-4 w-4 text-sea" /><span className="select-all">{company.phone}</span></li>
              <li className="flex items-center gap-2.5"><ClockIcon className="h-4 w-4 text-sea" />{company.hours}</li>
            </ul>
            <Link href="/contact" onClick={close} className="btn-primary mt-5 w-full">Get a free quote</Link>
          </div>
        </div>
      </div>
    </details>
  );
}
