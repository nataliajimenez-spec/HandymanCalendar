"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { rescheduleJob } from "../../trabajos/actions";
import { NewJobModal } from "../NewJobModal";

const START_HOUR = 7;
const END_HOUR = 20; // exclusivo
const PX_PER_MIN = 1;
const TOTAL_MIN = (END_HOUR - START_HOUR) * 60;

type WeekJob = {
  id: string;
  title: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  startMinutes: number; // minutos desde medianoche
  durationMinutes: number;
  propertyName: string;
  unitLabel: string | null;
};

type DayColumn = {
  key: string; // yyyy-mm-dd
  label: string; // "Dom 31"
  isToday: boolean;
  jobs: WeekJob[];
};

type PropertyOption = { id: string; name: string; units: { id: string; label: string }[] };
type JobType = { id: string; name: string };
type UnitReservation = { checkIn: string; checkOut: string; guestName: string | null };

const STATUS_STYLE: Record<WeekJob["status"], string> = {
  SCHEDULED: "bg-orange-100 border-orange-300 text-orange-900",
  COMPLETED: "bg-green-100 border-green-300 text-green-900",
  CANCELLED: "bg-gray-100 border-gray-300 text-gray-400 line-through",
};

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${period}`;
}

export function WeekView({
  days,
  properties,
  jobTypes,
  availabilityByUnit,
}: {
  days: DayColumn[];
  properties: PropertyOption[];
  jobTypes: JobType[];
  availabilityByUnit?: Record<string, UnitReservation[]>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const dragRef = useRef<{ jobId: string; grabOffsetMin: number; durationMinutes: number } | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function handleDragStart(e: React.DragEvent, job: WeekJob, columnEl: HTMLDivElement) {
    const rect = columnEl.getBoundingClientRect();
    const grabY = e.clientY - rect.top;
    const blockTop = (job.startMinutes - START_HOUR * 60) * PX_PER_MIN;
    dragRef.current = {
      jobId: job.id,
      grabOffsetMin: (grabY - blockTop) / PX_PER_MIN,
      durationMinutes: job.durationMinutes,
    };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", job.id);
  }

  function handleDrop(e: React.DragEvent, dayKey: string) {
    e.preventDefault();
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;

    const columnEl = columnRefs.current[dayKey];
    if (!columnEl) return;
    const rect = columnEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let minutesFromStart = y / PX_PER_MIN - drag.grabOffsetMin;
    minutesFromStart = Math.round(minutesFromStart / 15) * 15;
    minutesFromStart = Math.max(0, Math.min(minutesFromStart, TOTAL_MIN - drag.durationMinutes));

    const newStartMinutes = START_HOUR * 60 + minutesFromStart;
    const [year, month, day] = dayKey.split("-").map(Number);
    const newDate = new Date(year, month - 1, day, 0, newStartMinutes, 0, 0);

    setError(null);
    startTransition(async () => {
      const result = await rescheduleJob(drag.jobId, newDate.toISOString());
      if (result?.error) setError(result.error);
      router.refresh();
    });
  }

  const hourMarks = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <div className="space-y-2">
      {error && <div className="alert-error">{error}</div>}
      <p className="text-xs text-gray-500">
        Arrastra un trabajo agendado a otro día u hora para moverlo. Haz clic en un espacio vacío
        para agendar uno nuevo.
      </p>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
          <div />
          {days.map((d) => (
            <div
              key={d.key}
              className={`px-1 py-2 text-center capitalize ${d.isToday ? "text-orange-700 font-semibold" : ""}`}
            >
              {d.label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[48px_repeat(7,1fr)]">
          <div className="relative" style={{ height: TOTAL_MIN * PX_PER_MIN }}>
            {hourMarks.map((h) => (
              <div
                key={h}
                className="absolute right-1 -translate-y-1/2 text-[10px] text-gray-400"
                style={{ top: (h - START_HOUR) * 60 * PX_PER_MIN }}
              >
                {minutesToLabel(h * 60)}
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div
              key={day.key}
              ref={(el) => { columnRefs.current[day.key] = el; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, day.key)}
              onClick={(e) => {
                if (e.target === e.currentTarget) setModalDate(day.key);
              }}
              className={`relative border-l border-gray-100 cursor-pointer ${
                day.isToday ? "bg-orange-50/30" : ""
              }`}
              style={{ height: TOTAL_MIN * PX_PER_MIN }}
            >
              {hourMarks.slice(0, -1).map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-gray-100"
                  style={{ top: (h - START_HOUR) * 60 * PX_PER_MIN }}
                />
              ))}

              {day.jobs.map((job) => {
                const top = Math.max(0, job.startMinutes - START_HOUR * 60) * PX_PER_MIN;
                const height = Math.max(job.durationMinutes * PX_PER_MIN, 20);
                const draggableJob = job.status === "SCHEDULED";
                return (
                  <div
                    key={job.id}
                    draggable={draggableJob}
                    onDragStart={(e) => {
                      const col = columnRefs.current[day.key];
                      if (col) handleDragStart(e, job, col);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/trabajos/${job.id}`);
                    }}
                    title={`${job.title} — ${job.propertyName}${job.unitLabel ? " / " + job.unitLabel : ""}`}
                    className={`absolute left-0.5 right-0.5 overflow-hidden rounded-md border px-1.5 py-0.5 text-[11px] leading-tight shadow-sm transition hover:brightness-95 ${
                      STATUS_STYLE[job.status]
                    } ${draggableJob ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                    style={{ top, height }}
                  >
                    <div className="truncate font-medium">{job.title}</div>
                    <div className="truncate opacity-80">
                      {job.propertyName}
                      {job.unitLabel && ` / ${job.unitLabel}`}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <NewJobModal
        date={modalDate}
        properties={properties}
        jobTypes={jobTypes}
        availabilityByUnit={availabilityByUnit}
        onClose={() => setModalDate(null)}
      />
    </div>
  );
}
