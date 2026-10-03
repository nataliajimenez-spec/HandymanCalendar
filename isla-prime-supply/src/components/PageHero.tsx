export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro: string }) {
  return (
    <section className="bg-shell">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-8 lg:pb-20 lg:pt-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-3 max-w-3xl text-balance text-5xl text-ink sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
      </div>
    </section>
  );
}
