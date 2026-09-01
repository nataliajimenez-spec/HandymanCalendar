import { format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { isGuestyConfigured } from "@/lib/guesty";
import { SyncButton } from "./SyncButton";

export const dynamic = "force-dynamic";

export default async function DisponibilidadPage() {
  const now = new Date();

  const units = await prisma.unit.findMany({
    where: { managementType: "SHORT_TERM", active: true },
    orderBy: [{ property: { name: "asc" } }, { label: "asc" }],
    include: {
      property: true,
      guestyReservations: {
        where: { checkOut: { gte: now } },
        orderBy: { checkIn: "asc" },
      },
    },
  });

  const lastSync = await prisma.guestyReservation.aggregate({ _max: { syncedAt: true } });

  const configured = isGuestyConfigured();
  const unitsWithoutListing = units.filter((u) => !u.guestyListingId);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold">Disponibilidad (Guesty)</h1>
          <p className="text-sm text-gray-500">
            Check-in/check-out de las unidades short-term, para agendar arreglos donde no
            afecten a un huésped.
          </p>
        </div>
        <SyncButton />
      </div>

      {!configured && (
        <div className="alert-error">
          Guesty no está configurado todavía. Un administrador debe agregar{" "}
          <code>GUESTY_CLIENT_ID</code> y <code>GUESTY_CLIENT_SECRET</code> en las variables de
          entorno (ver README).
        </div>
      )}

      {configured && lastSync._max.syncedAt && (
        <p className="text-xs text-gray-400">
          Última sincronización: {format(lastSync._max.syncedAt, "d 'de' MMMM, h:mm a", { locale: es })}
        </p>
      )}
      {configured && !lastSync._max.syncedAt && (
        <p className="text-xs text-gray-400">Todavía no se ha sincronizado. Presiona &quot;Sincronizar con Guesty&quot;.</p>
      )}

      {unitsWithoutListing.length > 0 && (
        <div className="alert-error">
          {unitsWithoutListing.length === 1 ? "Esta unidad no tiene" : "Estas unidades no tienen"}{" "}
          Guesty Listing ID configurado, así que no se puede sincronizar su disponibilidad:{" "}
          {unitsWithoutListing.map((u) => `${u.property.name} / ${u.label}`).join(", ")}. Agrégalo
          desde Propiedades.
        </div>
      )}

      {units.length === 0 && (
        <div className="card p-4 text-sm text-gray-500">
          No hay unidades marcadas como short-term todavía. Márcalas desde Propiedades.
        </div>
      )}

      <div className="space-y-3">
        {units
          .filter((u) => u.guestyListingId)
          .map((unit) => {
            const current = unit.guestyReservations.find((r) => r.checkIn <= now && r.checkOut > now);
            const upcoming = unit.guestyReservations.filter((r) => r.checkOut > now).slice(0, 5);

            return (
              <div key={unit.id} className="card p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-medium text-sm">
                      {unit.property.name} / {unit.label}
                    </div>
                  </div>
                  {current ? (
                    <span className="rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-2.5 py-1">
                      Ocupada — huésped hasta{" "}
                      {format(current.checkOut, "d MMM, h:mm a", { locale: es })}
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1">
                      Disponible ahora
                    </span>
                  )}
                </div>

                {upcoming.length === 0 ? (
                  <p className="text-xs text-gray-400">Sin reservas próximas en los siguientes días.</p>
                ) : (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {upcoming.map((r) => (
                      <li key={r.id} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                        {format(r.checkIn, "d MMM", { locale: es })} –{" "}
                        {format(r.checkOut, "d MMM", { locale: es })}
                        {r.guestName && <span className="text-gray-400">· {r.guestName}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
