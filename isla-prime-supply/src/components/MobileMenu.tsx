"use client";

import Link from "next/link";
import { useRef } from "react";
import { nav } from "@/content/site";

// Built on <details> so it still opens without JavaScript; the click handler
// just closes it after choosing a link.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  return (
    <details ref={ref} className="menu lg:hidden">
      <summary className="flex h-11 w-11 cursor-pointer items-center justify-center" aria-label="Menu">
        <span className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-palm" />
          <span className="h-px w-full bg-palm" />
          <span className="ml-auto h-px w-2/3 bg-palm" />
        </span>
      </summary>
      <div className="absolute inset-x-0 top-full border-b border-palm/10 bg-ivory px-5 pb-8 pt-4 shadow-[0_30px_60px_-30px_rgba(29,41,37,0.35)]">
        <nav className="flex flex-col" aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} className="border-b border-palm/10 py-4 font-serif text-2xl text-palm">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" onClick={close} className="btn-dark mt-6 w-full">
          Request a Quote
        </Link>
      </div>
    </details>
  );
}
