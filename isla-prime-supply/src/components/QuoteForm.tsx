"use client";

import { useState } from "react";
import { collections, company, propertyTypes } from "@/content/site";

// For now the form opens the visitor's email app with everything filled in.
// TODO: send it straight to the inbox (e.g. a server action + email service).
export function QuoteForm({ dark = false }: { dark?: boolean }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const interests = data.getAll("interests").join(", ") || "—";
    const lines = [
      `Name: ${data.get("name")}`,
      `Company / property: ${data.get("company") || "—"}`,
      `Property type: ${data.get("type")}`,
      `Rooms / units: ${data.get("units") || "—"}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "—"}`,
      `Interested in: ${interests}`,
      "",
      `${data.get("message") || ""}`,
    ];
    const subject = `Quote request — ${data.get("company") || data.get("name")}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const text = dark ? "text-ivory" : "text-palm";
  const field = dark
    ? "field border-ivory/25 text-ivory placeholder:text-ivory/40 focus:border-brass-light"
    : "field";
  const label = dark ? "field-label text-ivory/60" : "field-label";
  const chip = dark
    ? "border-ivory/25 text-ivory/80 peer-checked:border-brass-light peer-checked:bg-brass-light peer-checked:text-palm"
    : "border-palm/20 text-palm/80 peer-checked:border-palm peer-checked:bg-palm peer-checked:text-ivory";

  if (sent) {
    return (
      <div className={`py-10 ${text}`}>
        <p className="eyebrow">Thank you</p>
        <p className="mt-4 font-serif text-3xl font-light">
          Your email app should open with your request ready to send.
        </p>
        <p className={`mt-4 text-sm ${dark ? "text-ivory/60" : "text-stone"}`}>
          Didn&apos;t open? Write to us at{" "}
          <a className="underline" href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
        <button type="button" onClick={() => setSent(false)} className={`mt-8 ${dark ? "btn-outline-light" : "btn-outline"}`}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      action={`mailto:${company.email}`}
      method="post"
      encType="text/plain"
      className={`grid gap-x-8 gap-y-8 sm:grid-cols-2 ${text}`}
    >
      <div>
        <label htmlFor="name" className={label}>Full name *</label>
        <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="company" className={label}>Company / property</label>
        <input id="company" name="company" autoComplete="organization" className={field} placeholder="Property or company name" />
      </div>
      <div>
        <label htmlFor="email" className={label}>Email *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
      </div>
      <div>
        <label htmlFor="phone" className={label}>Phone</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="(787) 000-0000" />
      </div>
      <div>
        <label htmlFor="type" className={label}>Property type *</label>
        <select id="type" name="type" required defaultValue="" className={`${field} cursor-pointer`}>
          <option value="" disabled>Select one</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t} className="text-palm">{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="units" className={label}>Rooms / units</label>
        <input id="units" name="units" inputMode="numeric" className={field} placeholder="e.g. 12" />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className={label}>I&apos;m interested in</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {collections.map((c) => (
            <label key={c.slug} className="cursor-pointer">
              <input type="checkbox" name="interests" value={c.name} className="peer sr-only" />
              <span className={`inline-block border px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brass ${chip}`}>
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>Tell us more</label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={`${field} resize-none`}
          placeholder="Quantities, timelines, or anything you'd like us to know"
        />
      </div>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-xs ${dark ? "text-ivory/50" : "text-stone"}`}>
          We typically reply within one business day.
        </p>
        <button type="submit" className={dark ? "btn-light" : "btn-dark"}>
          Request a Quote <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
