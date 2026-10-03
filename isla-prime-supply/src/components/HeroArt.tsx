// Illustrated still life: a stack of folded hotel towels in front of an
// Old San Juan–style arch. Stands in for photography until real product
// shots are ready.

type Towel = { y: number; w: number; color: string; band: string };

const towels: Towel[] = [
  { y: 452, w: 268, color: "#e6dccb", band: "#c9b896" },
  { y: 404, w: 262, color: "#fbf9f4", band: "#d9cdb6" },
  { y: 356, w: 266, color: "#bfdad3", band: "#8fbab1" },
  { y: 308, w: 258, color: "#fbf9f4", band: "#d9cdb6" },
];

function FoldedTowel({ y, w, color, band }: Towel) {
  const x = 240 - w / 2;
  const h = 48;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={color} />
      {/* folded edge highlight & shadow */}
      <rect x={x + 6} y={y + 3} width={w - 12} height={4} rx={2} fill="#fff" opacity={0.55} />
      <rect x={x} y={y + h - 8} width={w} height={8} rx={4} fill="#1d2925" opacity={0.06} />
      {/* dobby border */}
      <rect x={x + 18} y={y + 22} width={w - 36} height={2.2} fill={band} />
      <rect x={x + 18} y={y + 28} width={w - 36} height={1} fill={band} />
      {/* soft fold on the right */}
      <path
        d={`M${x + w - 22} ${y + 2} C ${x + w - 4} ${y + 8}, ${x + w - 4} ${y + h - 8}, ${x + w - 22} ${y + h - 2}`}
        stroke="#1d2925"
        strokeOpacity={0.07}
        strokeWidth={2}
        fill="none"
      />
    </g>
  );
}

export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 560"
      className={className}
      role="img"
      aria-label="A stack of folded hotel towels in front of an arched doorway"
    >
      <defs>
        <linearGradient id="arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6e8e3" />
          <stop offset="1" stopColor="#c4ddd6" />
        </linearGradient>
        <linearGradient id="archInner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf6ee" />
          <stop offset="1" stopColor="#efe5d5" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d5732" />
          <stop offset="0.45" stopColor="#a8865a" />
          <stop offset="1" stopColor="#6c4a2a" />
        </linearGradient>
        <radialGradient id="floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1d2925" stopOpacity="0.22" />
          <stop offset="1" stopColor="#1d2925" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* arch */}
      <path d="M40 560V230C40 130.6 120.6 50 220 50h40c99.4 0 180 80.6 180 180v330Z" fill="url(#arch)" />
      <path
        d="M74 560V236c0-80.6 65.4-146 146-146h40c80.6 0 146 65.4 146 146v324Z"
        fill="url(#archInner)"
      />
      <path
        d="M74 560V236c0-80.6 65.4-146 146-146h40c80.6 0 146 65.4 146 146v324"
        fill="none"
        stroke="#2e6b66"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* sun through the doorway */}
      <circle cx="240" cy="190" r="46" fill="#f6d9a6" />

      {/* floor shadow */}
      <ellipse cx="240" cy="506" rx="190" ry="16" fill="url(#floor)" />

      {towels.map((t) => (
        <FoldedTowel key={t.y} {...t} />
      ))}

      {/* rolled hand towels */}
      <g>
        <rect x="150" y="268" width="104" height="40" rx="20" fill="#e6dccb" />
        <circle cx="170" cy="288" r="18" fill="#efe7d9" />
        <path d="M170 288m-9 0a9 9 0 1 1 18 0a5 5 0 1 1 -10 0" stroke="#c9b896" strokeWidth="1.4" fill="none" />
        <rect x="236" y="268" width="104" height="40" rx="20" fill="#fbf9f4" />
        <circle cx="256" cy="288" r="18" fill="#ffffff" />
        <path d="M256 288m-9 0a9 9 0 1 1 18 0a5 5 0 1 1 -10 0" stroke="#d9cdb6" strokeWidth="1.4" fill="none" />
      </g>

      {/* amber amenity bottle */}
      <g>
        <ellipse cx="408" cy="502" rx="34" ry="6" fill="#1d2925" opacity="0.12" />
        <rect x="384" y="392" width="48" height="110" rx="12" fill="url(#glass)" />
        <rect x="396" y="374" width="24" height="20" rx="3" fill="#1d2925" />
        <rect x="404" y="358" width="8" height="18" rx="2" fill="#1d2925" />
        <path d="M412 360h16" stroke="#1d2925" strokeWidth="4" strokeLinecap="round" />
        <rect x="391" y="428" width="34" height="42" rx="2" fill="#f8f5ef" opacity="0.92" />
        <text x="408" y="447" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#1d2925" fontFamily="var(--font-jost), sans-serif">
          ISLA
        </text>
        <text x="408" y="458" textAnchor="middle" fontSize="5" letterSpacing="1" fill="#857b6c" fontFamily="var(--font-jost), sans-serif">
          PRIME
        </text>
        <rect x="389" y="400" width="5" height="90" rx="2.5" fill="#fff" opacity="0.18" />
      </g>

      {/* sprig */}
      <g stroke="#5f6b5f" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M86 506c4-40 10-72 26-104" />
        <path d="M95 462c-12-6-18-14-20-24 12 2 19 10 20 24Z" fill="#8d9a8a" fillOpacity="0.35" />
        <path d="M100 440c10-8 20-11 30-9-4 10-14 14-30 9Z" fill="#8d9a8a" fillOpacity="0.35" />
        <path d="M106 420c-10-8-13-17-12-27 10 5 14 14 12 27Z" fill="#8d9a8a" fillOpacity="0.35" />
      </g>
    </svg>
  );
}
