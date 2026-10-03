import type { CollectionIconName } from "@/content/site";

// Thin-line icons, drawn on a 64×64 grid.
const paths: Record<CollectionIconName, React.ReactNode> = {
  towel: (
    <>
      <rect x="10" y="38" width="44" height="12" rx="4" />
      <rect x="12" y="26" width="40" height="12" rx="4" />
      <rect x="14" y="14" width="36" height="12" rx="4" />
      <path d="M18 21h28M16 33h32M14 45h36" strokeOpacity="0.5" />
    </>
  ),
  bed: (
    <>
      <path d="M8 46V20M56 46V32" />
      <path d="M8 32h48v10H8z" />
      <rect x="12" y="24" width="14" height="8" rx="3" />
      <path d="M8 46h48" />
      <path d="M30 32v10" strokeOpacity="0.5" />
    </>
  ),
  amenity: (
    <>
      <rect x="14" y="24" width="16" height="28" rx="4" />
      <path d="M18 24v-6h8v6M22 18v-5h6" />
      <rect x="36" y="32" width="16" height="20" rx="5" />
      <path d="M40 32v-4h8v4" />
      <path d="M18 36h8M40 42h8" strokeOpacity="0.5" />
    </>
  ),
  room: (
    <>
      <path d="M32 14a4 4 0 1 1 4 4c-2 0-4 1.5-4 4v2" />
      <path d="M32 24 8 40c-2 1.5-1 4 1.5 4h45c2.5 0 3.5-2.5 1.5-4z" />
    </>
  ),
  kitchen: (
    <>
      <circle cx="28" cy="34" r="16" />
      <circle cx="28" cy="34" r="10" strokeOpacity="0.5" />
      <path d="M50 14v14a3 3 0 0 0 3 3v19M47 14v10M56 14v10" />
    </>
  ),
  housekeeping: (
    <>
      <path d="M22 26h16l2 26H20z" />
      <path d="M26 26v-6h8v6M30 20v-6h10" />
      <path d="M40 14l6-2M41 17h6M40 20l6 2" strokeOpacity="0.6" />
      <path d="M23 36h14" strokeOpacity="0.5" />
    </>
  ),
};

export function CollectionIcon({
  name,
  className = "",
}: {
  name: CollectionIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
