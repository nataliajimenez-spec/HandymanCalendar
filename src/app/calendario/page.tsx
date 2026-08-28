import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMonthGrid, dateKey } from "@/lib/calendar";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEKDAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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

  const jobs = await prisma.job.findMany({
    where: {
      scheduledAt: {
        gte: gridStart,
        lt: new Date(gridEnd.getFullYear(), gridEnd.getMonth(), gridEnd.getDate() + 1),
      },
    },
    include: { property: true, unit: true, createdBy: true },
    orderBy: { scheduledAt: "asc" },
  });

  const jobsByDay = new Map<string, typeof jobs>();
  for (const job of jobs) {
    const key = dateKey(job.scheduledAt);
    if (!jobsByDay.has(key)) jobsByDay.set(key, []);
    jobsByDay.get(key)!.push(job);
  }

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
            className="border rounded px-3 py-1 hover:bg-gray-50"
          >
            ← Anterior
          </Link>
          <Link href="/calendario" className="border rounded px-3 py-1 hover:bg-gray-50">
            Hoy
          </Link>
          <Link
            href={`/calendario?y=${nextMonth.y}&m=${nextMonth.m}`}
            className="border rounded px-3 py-1 hover:bg-gray-50"
          >
            Siguiente →
          </Link>
          <Link
            href="/trabajos/nuevo"
            className="bg-blue-600 text-white rounded px-3 py-1 font-medium"
          >
            + Nuevo trabajo
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-gray-50 text-xs font-medium text-gray-500">
          {WEEKDAY_NAMES.map((d) => (
            <div key={d} className="px-2 py-2 text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {weeks.flat().map((day) => {
            const key = dateKey(day);
            const isCurrentMonth = day.getMonth() === month;
            const dayJobs = jobsByDay.get(key) ?? [];
            return (
              <div
                key={key}
                className={`min-h-[110px] border-b border-r p-1.5 align-top ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      key === todayKey
                        ? "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        : isCurrentMonth
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <Link
                    href={`/trabajos/nuevo?date=${key}`}
                    className="text-xs text-blue-600 hover:underline"
                    title="Agendar trabajo este día"
                  >
                    +
                  </Link>
                </div>
                <div className="mt-1 space-y-1">
                  {dayJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/trabajos/${job.id}`}
                      className={`block text-[11px] leading-tight rounded px-1 py-0.5 truncate ${
                        job.status === "CANCELLED"
                          ? "bg-gray-100 text-gray-400 line-through"
                          : job.status === "COMPLETED"
                          ? "bg-green-50 text-green-800"
                          : "bg-blue-50 text-blue-800"
                      }`}
                      title={`${job.title} — ${job.property.name}${job.unit ? " / " + job.unit.label : ""}`}
                    >
                      {job.scheduledAt.toTimeString().slice(0, 5)} {job.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Agendado
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
