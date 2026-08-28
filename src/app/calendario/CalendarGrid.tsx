"use client";

import { useState } from "react";
import Link from "next/link";
import { NewJobModal } from "./NewJobModal";

type CalendarJob = {
  id: string;
  title: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  time: string;
  propertyName: string;
  unitLabel: string | null;
};

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

const WEEKDAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function CalendarGrid({
  days,
  todayKey,
  jobsByDay,
  properties,
}: {
  days: { key: string; day: number; inCurrentMonth: boolean }[];
  todayKey: string;
  jobsByDay: Record<string, CalendarJob[]>;
  properties: PropertyOption[];
}) {
  const [modalDate, setModalDate] = useState<string | null>(null);

  return (
    <>
      <div className="flex justify-end">
        <button onClick={() => setModalDate(todayKey)} className="btn-primary text-sm px-3 py-1.5">
          + Nuevo trabajo
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
          {WEEKDAY_NAMES.map((d) => (
            <div key={d} className="px-2 py-2 text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map(({ key, day, inCurrentMonth }) => {
            const dayJobs = jobsByDay[key] ?? [];
            const isToday = key === todayKey;
            return (
              <div
                key={key}
                className={`min-h-[110px] border-b border-r border-gray-100 p-1.5 align-top transition ${
                  inCurrentMonth ? "bg-white hover:bg-orange-50/40" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setModalDate(key)}
                    title="Agendar trabajo este día"
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
                      isToday
                        ? "bg-orange-600 font-semibold text-white"
                        : inCurrentMonth
                        ? "text-gray-700 hover:bg-orange-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                  <button
                    onClick={() => setModalDate(key)}
                    className="text-xs text-orange-600 hover:text-orange-700"
                    title="Agendar trabajo este día"
                  >
                    +
                  </button>
                </div>
                <div className="mt-1 space-y-1">
                  {dayJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/trabajos/${job.id}`}
                      className={`block truncate rounded px-1 py-0.5 text-[11px] leading-tight ${
                        job.status === "CANCELLED"
                          ? "bg-gray-100 text-gray-400 line-through"
                          : job.status === "COMPLETED"
                          ? "bg-green-50 text-green-800"
                          : "bg-orange-50 text-orange-800"
                      }`}
                      title={`${job.title} — ${job.propertyName}${job.unitLabel ? " / " + job.unitLabel : ""}`}
                    >
                      {job.time} {job.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewJobModal date={modalDate} properties={properties} onClose={() => setModalDate(null)} />
    </>
  );
}
