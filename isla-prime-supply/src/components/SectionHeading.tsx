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
  const centered = align === "center";
  return (
    <div className={`reveal ${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <p className={`eyebrow ${light ? "text-brass-light" : ""}`}>{eyebrow}</p>
      <h2 className={`display mt-5 text-4xl sm:text-5xl lg:text-6xl ${light ? "text-ivory" : "text-palm"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-6 text-base leading-relaxed sm:text-lg ${light ? "text-ivory/70" : "text-stone-dark"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
