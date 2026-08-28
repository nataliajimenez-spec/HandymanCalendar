import Link from "next/link";
import { format, startOfMonth } from "date-fns";
import { getReportData } from "@/lib/reports";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

function parseRange(startParam?: string, endParam?: string) {
  const now = new Date();
  const start = startParam ? new Date(`${startParam}T00:00:00`) : startOfMonth(now);
  const end = endParam ? new Date(`${endParam}T23:59:59.999`) : new Date(now.setHours(23, 59, 59, 999));
  return { start, end };
}

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const params = await searchParams;
  const { start, end } = parseRange(params.start, params.end);
  const startStr = format(start, "yyyy-MM-dd");
  const endStr = format(end, "yyyy-MM-dd");

  const { properties, grandTotal, jobCount } = await getReportData(start, end);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Reportes</h1>
        <p className="text-sm text-gray-500">
          Trabajos completados por propiedad y unidad, con el costo para facturar.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-2 bg-white border rounded-lg p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="start">
            Desde
          </label>
          <input
            id="start"
            name="start"
            type="date"
            defaultValue={startStr}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="end">
            Hasta
          </label>
          <input
            id="end"
            name="end"
            type="date"
            defaultValue={endStr}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium">
          Generar reporte
        </button>
        <Link
          href={`/api/reportes/export?start=${startStr}&end=${endStr}`}
          className="border rounded px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Exportar CSV
        </Link>
      </form>

      <div className="text-sm text-gray-600">
        {jobCount} trabajo(s) completado(s) entre {format(start, "d/M/yyyy")} y {format(end, "d/M/yyyy")} ·{" "}
        <span className="font-semibold">Total: {formatMoney(grandTotal)}</span>
      </div>

      {properties.length === 0 && (
        <div className="text-sm text-gray-500 bg-white border rounded-lg p-6">
          No hay trabajos completados en este rango de fechas.
        </div>
      )}

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.propertyId} className="bg-white border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
              <h2 className="font-medium">{property.propertyName}</h2>
              <span className="text-sm font-semibold">{formatMoney(property.subtotal)}</span>
            </div>
            {property.units.map((unit) => (
              <div key={unit.unitId ?? "sin-unidad"} className="px-4 py-2 border-b last:border-b-0">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>{unit.unitLabel}</span>
                  <span>{formatMoney(unit.subtotal)}</span>
                </div>
                <div className="mt-1 space-y-1">
                  {unit.jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between text-xs text-gray-500 pl-2">
                      <span>
                        {format(job.completedAt, "d/M/yyyy")} — {job.title} ({job.createdByName})
                      </span>
                      <span>
                        {formatMoney(job.total)}{" "}
                        <span className="text-gray-400">
                          (M.O. {formatMoney(job.laborCost)} + Mat. {formatMoney(job.materialCost)})
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
