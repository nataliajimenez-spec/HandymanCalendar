"use client";

import { FormEvent, Suspense, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_ACCOUNTS = [
  { label: "Administrador", email: "admin@pmipuertorico.com", emoji: "🗂️" },
  { label: "Oficina", email: "oficina@pmipuertorico.com", emoji: "🏢" },
  { label: "Handyman", email: "handyman@pmipuertorico.com", emoji: "🛠️" },
];
const DEMO_PASSWORD = "CambiaEsta123!";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/calendario";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoPending, startDemoTransition] = useTransition();
  const [demoLoadingEmail, setDemoLoadingEmail] = useState<string | null>(null);

  async function doSignIn(emailValue: string, passwordValue: string) {
    setError(null);

    const res = await signIn("credentials", {
      email: emailValue,
      password: passwordValue,
      redirect: false,
    });

    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await doSignIn(email, password);
    setLoading(false);
  }

  function handleDemoLogin(demoEmail: string) {
    setDemoLoadingEmail(demoEmail);
    startDemoTransition(async () => {
      await doSignIn(demoEmail, DEMO_PASSWORD);
      setDemoLoadingEmail(null);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-orange-50 px-4 py-10">
      <div className="w-full max-w-sm space-y-4">
        <form onSubmit={handleSubmit} className="card p-6 sm:p-7 space-y-4">
          <div className="text-center space-y-1.5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-2xl shadow-sm">
              🛠️
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Vendor Management at PMI Puerto Rico</h1>
            <p className="text-sm text-gray-500">Inicia sesión para continuar</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="space-y-1">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="field-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="card p-4 space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-gray-400">
            Acceso demo
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                disabled={demoPending}
                onClick={() => handleDemoLogin(account.email)}
                className="btn-secondary flex-col gap-1 py-2.5 text-xs disabled:opacity-50"
              >
                <span className="text-lg leading-none">{account.emoji}</span>
                <span>
                  {demoLoadingEmail === account.email ? "Entrando..." : account.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
