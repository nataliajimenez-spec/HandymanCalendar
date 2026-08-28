import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "./PropertyForm";

export const dynamic = "force-dynamic";

export default async function PropiedadesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { name: "asc" },
    include: { units: true, _count: { select: { jobs: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Propiedades</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <PropertyForm />

        <div className="card divide-y">
          {properties.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              No hay propiedades todavía. Crea la primera con el formulario.
            </div>
          )}
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/propiedades/${p.id}`}
              className="block px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {p.name}
                  {!p.active && <span className="text-gray-400 font-normal"> (inactiva)</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {p.units.length} unidad(es) · {p._count.jobs} trabajo(s)
                </div>
              </div>
              {p.address && <div className="text-xs text-gray-500 mt-0.5">{p.address}</div>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
