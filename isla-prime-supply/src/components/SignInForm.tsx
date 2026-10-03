"use client";

import Link from "next/link";
import { useState } from "react";

// Sign-in screen for returning customers.
// TODO: connect to real accounts once the online catalog launches.
export function SignInForm() {
  const [notice, setNotice] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setNotice(true);
      }}
      className="card p-6 sm:p-8"
      data-signin
    >
      <h2 className="display text-3xl">Welcome back</h2>
      <p className="mt-2 text-muted">Sign in to reorder and see your account.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="signin-email" className="field-label">Email</label>
          <input id="signin-email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@email.com" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="signin-password" className="field-label">Password</label>
            <Link href="/about#contact" className="text-sm font-medium text-sea hover:underline">Forgot password?</Link>
          </div>
          <input id="signin-password" name="password" type="password" required autoComplete="current-password" className="field" placeholder="••••••••" />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-muted">
          <input type="checkbox" name="remember" className="h-4 w-4 accent-[#2e6b66]" />
          Keep me signed in
        </label>
      </div>

      {notice && (
        <p role="status" data-signin-notice className="mt-5 rounded-xl bg-sun-light p-4 text-sm text-ink">
          Online accounts are opening soon. Until then, we&apos;re happy to take your order by email or phone.
        </p>
      )}

      <button type="submit" className="btn-primary mt-6 w-full">Sign in</button>
      <p className="mt-6 text-center text-sm text-muted">
        New to Isla Prime?{" "}
        <Link href="/contact" className="font-semibold text-sea hover:underline">Request an account</Link>
      </p>
    </form>
  );
}
