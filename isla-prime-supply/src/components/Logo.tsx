import Link from "next/link";

// Arch monogram: a nod to the colonial archways of Old San Juan.
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden className={className}>
      <path
        d="M2 47V20C2 10.06 10.06 2 20 2s18 8.06 18 18v27"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 47V21c0-6.63 5.37-12 12-12s12 5.37 12 12v26"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.6"
      />
      <text
        x="20"
        y="34"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="17"
        fontStyle="italic"
        fill="currentColor"
      >
        IP
      </text>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Isla Prime — home"
      className={`group flex items-center gap-3 ${light ? "text-ivory" : "text-palm"}`}
    >
      <Monogram className="h-10 w-auto text-brass transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.55rem] font-medium tracking-[0.16em]">ISLA PRIME</span>
        <span
          className={`mt-1 font-sans text-[0.5rem] font-medium uppercase tracking-[0.3em] ${
            light ? "text-ivory/60" : "text-stone"
          }`}
        >
          Property Management Supply Co.
        </span>
      </span>
    </Link>
  );
}
