"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { roleLabel } from "@/lib/roles";

const LINKS = [
  { href: "/calendario", label: "Calendario" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/catalogo", label: "Catálogo", officeOnly: true },
  { href: "/reportes", label: "Reportes", officeOnly: true },
  { href: "/usuarios", label: "Usuarios", adminOnly: true },
];

export function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-sm">
              🛠️
            </span>
            <span className="hidden sm:inline">Vendor Management</span>
            <span className="sm:hidden">VM PMI PR</span>
          </span>
          <nav className="flex gap-1 text-sm">
            {LINKS.filter((link) => {
              if (link.adminOnly && session.user.role !== "ADMIN") return false;
              if (link.officeOnly && session.user.role === "HANDYMAN") return false;
              return true;
            }).map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition ${
                    active
                      ? "bg-orange-50 font-semibold text-orange-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap text-sm">
          <span className="hidden text-gray-500 sm:inline">
            {session.user?.name} · {roleLabel(session.user.role)}
          </span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn-secondary px-3 py-1.5 text-sm">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
