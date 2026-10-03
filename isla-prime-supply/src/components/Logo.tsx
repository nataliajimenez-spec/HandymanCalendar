import Link from "next/link";

// Arch monogram: a nod to the colonial doorways of Old San Juan.
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden className={className}>
      <path d="M3 46V20C3 10.6 10.6 3 20 3s17 7.6 17 17v26Z" fill="currentColor" />
      <circle cx="20" cy="21" r="5.5" fill="#e9a23b" />
      <path d="M9 46c3.5-6 7-6 11-6s7.5 0 11 6" stroke="#fbf8f3" strokeWidth="1.6" fill="none" />
      <path d="M12 38.5c2.5-3 5-3 8-3s5.5 0 8 3" stroke="#fbf8f3" strokeWidth="1.2" fill="none" opacity="0.7" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Isla Prime home" className="group flex items-center gap-2.5">
      <Monogram className={`h-10 w-auto transition-transform duration-300 group-hover:-translate-y-0.5 ${light ? "text-sea-light/90" : "text-sea"}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.45rem] font-medium tracking-[-0.01em] ${light ? "text-white" : "text-ink"}`}>
          Isla Prime
        </span>
        <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${light ? "text-white/60" : "text-muted"}`}>
          Property Management Supply Co.
        </span>
      </span>
    </Link>
  );
}
