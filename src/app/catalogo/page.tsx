import { prisma } from "@/lib/prisma";
import { getCurrentUser, canSeePricing } from "@/lib/session";
import { ItemForm } from "./ItemForm";
import { CatalogRow } from "./CatalogRow";
import { JobTypeForm } from "./JobTypeForm";
import { JobTypeRow } from "./JobTypeRow";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const user = await getCurrentUser();

  if (!user || !canSeePricing(user.role)) {
    return (
      <div className="text-sm text-gray-600">
        Solo administración/oficina puede ver el catálogo de precios.
      </div>
    );
  }

  const [items, jobTypes] = await Promise.all([
    prisma.priceCatalogItem.findMany({ orderBy: { name: "asc" } }),
    prisma.jobType.findMany({ orderBy: { name: "asc" } }),
  ]);

  const materials = items.filter((i) => i.type === "MATERIAL");
  const labor = items.filter((i) => i.type === "LABOR");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Catálogo</h1>
        <p className="text-sm text-gray-500">
          Tipos de trabajo y precios internos. El handyman ve los tipos de trabajo pero no
          estos precios.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium">Tipos de trabajo</h2>
        <p className="text-sm text-gray-500">
          Lista de categorías de trabajo que se pueden elegir al agendar (ej. Plomería,
          Electricidad). Si un trabajo no encaja en ninguna, se puede escribir manualmente al
          agendarlo.
        </p>
        <div className="card p-4 max-w-2xl">
          <JobTypeForm />
          <div className="divide-y mt-2">
            {jobTypes.length === 0 && (
              <div className="text-sm text-gray-500 py-2">Sin tipos de trabajo todavía.</div>
            )}
            {jobTypes.map((jt) => (
              <JobTypeRow key={jt.id} id={jt.id} name={jt.name} active={jt.active} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Precios (materiales y mano de obra)</h2>
        <p className="text-sm text-gray-500">
          Estos precios se sugieren automáticamente al registrar el trabajo, y se pueden
          ajustar por trabajo. Solo visibles para administración/oficina.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <ItemForm />

          <div className="space-y-6">
            <div className="card p-4">
              <h3 className="font-medium mb-1">Mano de obra</h3>
              <div className="divide-y">
                {labor.length === 0 && (
                  <div className="text-sm text-gray-500 py-2">Sin tarifas de mano de obra.</div>
                )}
                {labor.map((i) => (
                  <CatalogRow
                    key={i.id}
                    id={i.id}
                    name={i.name}
                    unitLabel={i.unitLabel}
                    unitPrice={Number(i.unitPrice)}
                    sku={i.sku}
                    active={i.active}
                  />
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-medium mb-1">Materiales</h3>
              <div className="divide-y">
                {materials.length === 0 && (
                  <div className="text-sm text-gray-500 py-2">Sin materiales en el catálogo.</div>
                )}
                {materials.map((i) => (
                  <CatalogRow
                    key={i.id}
                    id={i.id}
                    name={i.name}
                    unitLabel={i.unitLabel}
                    unitPrice={Number(i.unitPrice)}
                    sku={i.sku}
                    active={i.active}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
