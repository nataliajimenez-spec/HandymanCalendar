import type { Metadata } from "next";
import { CheckIcon } from "@/components/Icons";
import { SignInForm } from "@/components/SignInForm";
import { accountPerks } from "@/content/site";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <section className="bg-shell">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Customer account</p>
          <h1 className="display mt-3 text-balance text-4xl sm:text-5xl">Restocking, made simple.</h1>
          <p className="mt-4 text-lg text-muted">Your Isla Prime account keeps everything for your properties in one place.</p>
          <ul className="mt-8 space-y-3">
            {accountPerks.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea-light text-sea"><CheckIcon className="h-4 w-4" /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
