import Link from "next/link";
import { startOfDay, endOfDay, format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { StatTile } from "@/components/StatTile";
import { JobStatusBadge } from "@/components/JobStatusBadge";

export const dynamic = "force-dynamic";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);

  const jobsToday = await prisma.job.findMany({
    where: { scheduledAt: { gte: dayStart, lte: dayEnd } },
    include: { property: true, unit: true },
    orderBy: { scheduledAt: "asc" },
  });

  const scheduled = jobsToday.filter((j) => j.status === "SCHEDULED").length;
  const completed = jobsToday.filter((j) => j.status === "COMPLETED").length;
  const cancelled = jobsToday.filter((j) => j.status === "CANCELLED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {greeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-gray-500">
            {(() => {
              const label = format(now, "EEEE d 'de' MMMM", { locale: es });
              return label.charAt(0).toUpperCase() + label.slice(1);
            })()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/calendario/semana" className="btn-secondary text-sm px-3 py-1.5">
            Ver semana
          </Link>
          <Link href="/calendario" className="btn-secondary text-sm px-3 py-1.5">
            Ver mes
          </Link>
          <Link href={`/trabajos/nuevo?date=${format(now, "yyyy-MM-dd")}`} className="btn-primary text-sm px-3 py-1.5">
            + Nuevo trabajo
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Trabajos hoy" value={jobsToday.length} />
        <StatTile label="Agendados" value={scheduled} dotClassName="bg-orange-500" />
        <StatTile label="Completados" value={completed} dotClassName="bg-green-500" />
        <StatTile label="Cancelados" value={cancelled} dotClassName="bg-gray-400" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-medium text-gray-900">Trabajos de hoy</h2>
        </div>
        {jobsToday.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No hay trabajos agendados para hoy.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobsToday.map((job) => (
              <Link
                key={job.id}
                href={`/trabajos/${job.id}`}
                className="flex items-center gap-4 px-4 py-3 transition hover:bg-orange-50/40"
              >
                <div className="w-16 shrink-0 text-sm font-medium tabular-nums text-gray-700">
                  {job.scheduledAt.toTimeString().slice(0, 5)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="truncate text-xs text-gray-500">
                    {job.property.name}
                    {job.unit && ` / ${job.unit.label}`}
                  </div>
                </div>
                <JobStatusBadge status={job.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
