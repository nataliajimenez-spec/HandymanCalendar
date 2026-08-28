import { prisma } from "@/lib/prisma";
import { ItemForm } from "./ItemForm";
import { CatalogRow } from "./CatalogRow";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const items = await prisma.priceCatalogItem.findMany({ orderBy: { name: "asc" } });

  const materials = items.filter((i) => i.type === "MATERIAL");
  const labor = items.filter((i) => i.type === "LABOR");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Catálogo de precios</h1>
        <p className="text-sm text-gray-500">
          Materiales y mano de obra. Estos precios se sugieren automáticamente al
          registrar el trabajo de un handyman, y se pueden ajustar por trabajo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ItemForm />

        <div className="space-y-6">
          <div className="card p-4">
            <h2 className="font-medium mb-1">Mano de obra</h2>
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
            <h2 className="font-medium mb-1">Materiales</h2>
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
    </div>
  );
}
