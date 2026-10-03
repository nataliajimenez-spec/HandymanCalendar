"use client";

import { useState } from "react";
import { collections, company, propertyTypes } from "@/content/site";
import { CheckIcon } from "./Icons";

// For now the form opens the visitor's email app with everything filled in.
// TODO: send it straight to the inbox (e.g. a server action + email service).
export function QuoteForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      `Name: ${data.get("name")}`,
      `Company / property: ${data.get("company") || "—"}`,
      `Property type: ${data.get("type")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "—"}`,
      `Interested in: ${data.getAll("interests").join(", ") || "—"}`,
      "",
      `${data.get("message") || ""}`,
    ];
    const subject = `Quote request from ${data.get("company") || data.get("name")}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sea-light text-sea">
          <CheckIcon className="h-7 w-7" />
        </span>
        <p className="display mt-5 text-3xl">Almost done!</p>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Your email app should open with your request ready. Just hit send. If it didn&apos;t open, write to us at{" "}
          <span className="select-all font-medium text-ink">{company.email}</span>.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-secondary mt-6">Back to the form</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <label htmlFor="name" className="field-label">Your name *</label>
        <input id="name" name="name" required autoComplete="name" className="field" placeholder="María Rivera" />
      </div>
      <div>
        <label htmlFor="company" className="field-label">Property or company</label>
        <input id="company" name="company" autoComplete="organization" className="field" placeholder="Casa Playa Rentals" />
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@email.com" />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">Phone</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder="(787) 555-0123" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="type" className="field-label">What kind of property? *</label>
        <select id="type" name="type" required defaultValue="" className="field cursor-pointer">
          <option value="" disabled>Choose one</option>
          {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="field-label">What are you looking for?</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {collections.map((c) => (
            <label key={c.slug} className="cursor-pointer">
              <input type="checkbox" name="interests" value={c.name} className="peer sr-only" />
              <span className="inline-flex items-center rounded-full border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 transition peer-checked:border-sea peer-checked:bg-sea peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-sea/20">
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label htmlFor="message" className="field-label">Anything else?</label>
        <textarea id="message" name="message" rows={defaultMessage ? 8 : 4} defaultValue={defaultMessage} className="field resize-y" placeholder="Quantities, dates, or questions. Whatever helps." />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Free quote · No commitment</p>
        <button type="submit" className="btn-primary">Send my request</button>
      </div>
    </form>
  );
}
