export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
}) {
  return (
    <section className="grain border-b border-palm/10 bg-linen">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-6 max-w-4xl text-5xl text-palm sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-dark">{intro}</p>
      </div>
    </section>
  );
}
