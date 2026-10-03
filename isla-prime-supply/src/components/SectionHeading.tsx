export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`reveal ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <p className={`eyebrow ${light ? "!text-sun" : ""}`}>{eyebrow}</p>
      <h2 className={`display mt-3 text-balance text-4xl sm:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/75" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
