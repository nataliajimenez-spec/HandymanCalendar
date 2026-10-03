"use client";

import Link from "next/link";
import { useState } from "react";
import { starterItems } from "@/content/site";

type Counts = { bed: number; bath: number; guest: number };

const fields: { key: keyof Counts; label: string; hint: string; min: number; max: number }[] = [
  { key: "bed", label: "Beds", hint: "Across all bedrooms", min: 1, max: 40 },
  { key: "bath", label: "Bathrooms", hint: "Full or half", min: 1, max: 30 },
  { key: "guest", label: "Guests", hint: "Max occupancy", min: 1, max: 80 },
];

export function starterList(c: Counts) {
  return starterItems.map((i) => ({ name: i.name, total: i.qty * c[i.per] }));
}

// Helps a host see what a fully stocked unit needs, then turns it into a quote.
export function StarterPlanner() {
  const [counts, setCounts] = useState<Counts>({ bed: 2, bath: 1, guest: 4 });
  const list = starterList(counts);
  const step = (k: keyof Counts, d: number) => {
    const f = fields.find((x) => x.key === k)!;
    setCounts((c) => ({ ...c, [k]: Math.min(f.max, Math.max(f.min, c[k] + d)) }));
  };
  const summary = `Starter list for ${counts.bed} beds, ${counts.bath} bathrooms, ${counts.guest} guests:\n` +
    list.map((i) => `- ${i.name}: ${i.total}`).join("\n");

  return (
    <div className="card grid overflow-hidden lg:grid-cols-5" data-planner>
      <div className="flex flex-col gap-6 bg-sea p-6 text-white sm:p-8 lg:col-span-2">
        <p className="text-white/80">Tell us about your place:</p>
        {fields.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{f.label}</p>
              <p className="text-sm text-white/65">{f.hint}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
              <button type="button" onClick={() => step(f.key, -1)} data-step={`${f.key}:-1`} className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/20" aria-label={`Fewer ${f.label.toLowerCase()}`}>−</button>
              <output data-count={f.key} className="w-8 text-center text-lg font-semibold tabular-nums" aria-live="polite">{counts[f.key]}</output>
              <button type="button" onClick={() => step(f.key, 1)} data-step={`${f.key}:1`} className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/20" aria-label={`More ${f.label.toLowerCase()}`}>+</button>
            </div>
          </div>
        ))}
        <p className="mt-auto rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/85">
          <strong className="text-sun">Why 3 sets?</strong> Hotels plan for one set in use, one in the wash and one on the shelf, so you&apos;re never caught short between guests.
        </p>
      </div>

      <div className="flex flex-col p-6 sm:p-8 lg:col-span-3">
        <p className="font-display text-2xl">Your starter list</p>
        <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
          {list.map((i) => (
            <li key={i.name} className="flex items-baseline justify-between border-b border-ink/[0.07] py-3">
              <span className="text-ink/85">{i.name}</span>
              <span data-item={i.name} className="font-semibold tabular-nums text-sea">{i.total}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={`/contact?list=${encodeURIComponent(summary)}`} data-quote-link className="btn-primary">
            Get a quote for this list
          </Link>
          <p className="text-sm text-muted">Free, with no commitment. We can adjust anything.</p>
        </div>
      </div>
    </div>
  );
}
