"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { roleLabel } from "@/lib/roles";

const LINKS = [
  { href: "/calendario", label: "Calendario" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/catalogo", label: "Catálogo de precios" },
  { href: "/reportes", label: "Reportes" },
  { href: "/usuarios", label: "Usuarios", adminOnly: true },
];

export function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="font-semibold whitespace-nowrap">🛠️ Handyman PMI PR</span>
          <nav className="flex gap-4 text-sm">
            {LINKS.filter((link) => !link.adminOnly || session.user.role === "ADMIN").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap ${
                  pathname?.startsWith(link.href)
                    ? "font-semibold text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm whitespace-nowrap">
          <span className="text-gray-500">
            {session.user?.name} · {roleLabel(session.user.role)}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-blue-600 hover:underline"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
