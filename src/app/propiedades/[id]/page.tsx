import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyEditForm } from "./PropertyEditForm";
import { UnitForm } from "./UnitForm";
import { UnitToggle } from "./UnitToggle";
import { UnitManagementToggle } from "./UnitManagementToggle";
import { UnitGuestyIdForm } from "./UnitGuestyIdForm";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { units: { orderBy: { label: "asc" } } },
  });

  if (!property) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{property.name}</h1>
        <p className="text-sm text-gray-500">Propiedad y sus unidades/departamentos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PropertyEditForm
          propertyId={property.id}
          name={property.name}
          address={property.address}
          notes={property.notes}
          active={property.active}
        />

        <div className="card p-4 space-y-4">
          <h2 className="font-medium">Unidades / departamentos</h2>
          <UnitForm propertyId={property.id} />

          <div className="divide-y">
            {property.units.length === 0 && (
              <div className="text-sm text-gray-500 py-2">
                Esta propiedad no tiene unidades individuales (los trabajos se pueden
                agendar directo a la propiedad).
              </div>
            )}
            {property.units.map((u) => (
              <div key={u.id} className="py-2 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {u.label}
                      {!u.active && <span className="text-gray-400 font-normal"> (inactiva)</span>}
                    </div>
                    {u.notes && <div className="text-xs text-gray-500">{u.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <UnitManagementToggle
                      propertyId={property.id}
                      unitId={u.id}
                      managementType={u.managementType}
                    />
                    <UnitToggle propertyId={property.id} unitId={u.id} active={u.active} />
                  </div>
                </div>
                {u.managementType === "SHORT_TERM" && (
                  <UnitGuestyIdForm
                    propertyId={property.id}
                    unitId={u.id}
                    guestyListingId={u.guestyListingId}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
