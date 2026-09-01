import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMonthGrid, dateKey } from "@/lib/calendar";
import { CalendarGrid } from "./CalendarGrid";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.y ? parseInt(params.y, 10) : now.getFullYear();
  const month = params.m ? parseInt(params.m, 10) - 1 : now.getMonth();

  const weeks = buildMonthGrid(year, month);
  const gridStart = weeks[0][0];
  const gridEnd = weeks[weeks.length - 1][6];

  const gridEndExclusive = new Date(gridEnd.getFullYear(), gridEnd.getMonth(), gridEnd.getDate() + 1);

  const [jobs, properties, jobTypes, guestyReservations] = await Promise.all([
    prisma.job.findMany({
      where: {
        scheduledAt: {
          gte: gridStart,
          lt: gridEndExclusive,
        },
      },
      include: { property: true, unit: true },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.property.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: { units: { where: { active: true }, orderBy: { label: "asc" } } },
    }),
    prisma.jobType.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.guestyReservation.findMany({
      where: { checkIn: { lt: gridEndExclusive }, checkOut: { gt: gridStart } },
      orderBy: { checkIn: "asc" },
    }),
  ]);

  const availabilityByUnit: Record<string, { checkIn: string; checkOut: string; guestName: string | null }[]> = {};
  for (const p of properties) {
    for (const u of p.units) {
      if (u.guestyListingId) availabilityByUnit[u.id] = [];
    }
  }
  for (const r of guestyReservations) {
    if (!availabilityByUnit[r.unitId]) availabilityByUnit[r.unitId] = [];
    availabilityByUnit[r.unitId].push({
      checkIn: r.checkIn.toISOString(),
      checkOut: r.checkOut.toISOString(),
      guestName: r.guestName,
    });
  }

  const jobsByDay: Record<string, ReturnType<typeof serializeJob>[]> = {};
  function serializeJob(job: (typeof jobs)[number]) {
    return {
      id: job.id,
      title: job.title,
      status: job.status,
      time: job.scheduledAt.toTimeString().slice(0, 5),
      propertyName: job.property.name,
      unitLabel: job.unit?.label ?? null,
    };
  }
  for (const job of jobs) {
    const key = dateKey(job.scheduledAt);
    if (!jobsByDay[key]) jobsByDay[key] = [];
    jobsByDay[key].push(serializeJob(job));
  }

  const days = weeks.flat().map((d) => ({
    key: dateKey(d),
    day: d.getDate(),
    inCurrentMonth: d.getMonth() === month,
  }));

  const prevMonth = month === 0 ? { y: year - 1, m: 12 } : { y: year, m: month };
  const nextMonth = month === 11 ? { y: year + 1, m: 1 } : { y: year, m: month + 2 };
  const todayKey = dateKey(now);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">
          {MONTH_NAMES[month]} {year}
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/calendario?y=${prevMonth.y}&m=${prevMonth.m}`}
            className="btn-secondary text-sm px-3 py-1"
          >
            ← Anterior
          </Link>
          <Link href="/calendario" className="btn-secondary text-sm px-3 py-1">
            Hoy
          </Link>
          <Link
            href={`/calendario?y=${nextMonth.y}&m=${nextMonth.m}`}
            className="btn-secondary text-sm px-3 py-1"
          >
            Siguiente →
          </Link>
          <Link href="/calendario/semana" className="btn-primary text-sm px-3 py-1">
            Ver semana
          </Link>
        </div>
      </div>

      <CalendarGrid
        days={days}
        todayKey={todayKey}
        jobsByDay={jobsByDay}
        properties={properties}
        jobTypes={jobTypes}
        availabilityByUnit={availabilityByUnit}
      />

      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Agendado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Completado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" /> Cancelado
        </span>
      </div>
    </div>
  );
}
