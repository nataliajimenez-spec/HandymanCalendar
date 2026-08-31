import Link from "next/link";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { buildWeekDays, dateKey } from "@/lib/calendar";
import { WeekView } from "./WeekView";

export const dynamic = "force-dynamic";

export default async function SemanaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const refDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const now = new Date();

  const week = buildWeekDays(refDate);
  const weekStart = week[0];
  const weekEnd = week[6];

  const [jobs, properties, jobTypes] = await Promise.all([
    prisma.job.findMany({
      where: {
        scheduledAt: {
          gte: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()),
          lt: new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() + 1),
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
  ]);

  const todayKey = dateKey(now);
  const jobsByDay = new Map<string, typeof jobs>();
  for (const job of jobs) {
    const key = dateKey(job.scheduledAt);
    if (!jobsByDay.has(key)) jobsByDay.set(key, []);
    jobsByDay.get(key)!.push(job);
  }

  const days = week.map((d) => {
    const key = dateKey(d);
    return {
      key,
      label: format(d, "EEE d", { locale: es }),
      isToday: key === todayKey,
      jobs: (jobsByDay.get(key) ?? []).map((j) => ({
        id: j.id,
        title: j.title,
        status: j.status,
        startMinutes: j.scheduledAt.getHours() * 60 + j.scheduledAt.getMinutes(),
        durationMinutes: j.durationMinutes,
        propertyName: j.property.name,
        unitLabel: j.unit?.label ?? null,
      })),
    };
  });

  const prevWeekDate = format(addDays(weekStart, -7), "yyyy-MM-dd");
  const nextWeekDate = format(addDays(weekStart, 7), "yyyy-MM-dd");
  const rangeLabel = `${format(weekStart, "d MMM", { locale: es })} – ${format(weekEnd, "d MMM yyyy", { locale: es })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold capitalize">Semana</h1>
          <p className="text-sm text-gray-500 capitalize">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/calendario/semana?date=${prevWeekDate}`} className="btn-secondary text-sm px-3 py-1">
            ← Anterior
          </Link>
          <Link href="/calendario/semana" className="btn-secondary text-sm px-3 py-1">
            Hoy
          </Link>
          <Link href={`/calendario/semana?date=${nextWeekDate}`} className="btn-secondary text-sm px-3 py-1">
            Siguiente →
          </Link>
          <Link href="/calendario" className="btn-secondary text-sm px-3 py-1">
            Ver mes
          </Link>
        </div>
      </div>

      <WeekView days={days} properties={properties} jobTypes={jobTypes} />
    </div>
  );
}
