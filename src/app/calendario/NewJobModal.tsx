"use client";

import { useEffect, useState, useTransition } from "react";
import { createJob } from "../trabajos/actions";
import { PropertyUnitSelect } from "@/components/PropertyUnitSelect";
import { DurationSelect } from "@/components/DurationSelect";
import { JobTypeSelect } from "@/components/JobTypeSelect";
import { JobMediaPicker } from "@/components/JobMediaPicker";

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

type JobType = { id: string; name: string };
type UnitReservation = { checkIn: string; checkOut: string; guestName: string | null };

export function NewJobModal({
  date,
  properties,
  jobTypes,
  availabilityByUnit,
  onClose,
}: {
  date: string | null;
  properties: PropertyOption[];
  jobTypes: JobType[];
  availabilityByUnit?: Record<string, UnitReservation[]>;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!date) return null;

  const defaultDateTime = `${date}T09:00`;
  const rawNiceDate = new Date(`${date}T00:00:00`).toLocaleDateString("es-PR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const niceDate = rawNiceDate.charAt(0).toUpperCase() + rawNiceDate.slice(1);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createJob(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-5 space-y-3 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nuevo trabajo</h2>
            <p className="text-sm text-gray-500">{niceDate}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-sm text-gray-600">
            Primero crea una propiedad en la sección de Propiedades.
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-3">
            {error && <div className="alert-error">{error}</div>}

            <PropertyUnitSelect
              properties={properties}
              availabilityByUnit={availabilityByUnit}
              refDate={date}
            />

            <JobTypeSelect jobTypes={jobTypes} idPrefix="modal-" />

            <div className="space-y-1">
              <label className="field-label" htmlFor="modal-description">
                Detalles del trabajo
              </label>
              <textarea id="modal-description" name="description" rows={3} className="input-field" />
            </div>

            <div className="space-y-1">
              <label className="field-label" htmlFor="modal-scheduledAt">
                Fecha y hora
              </label>
              <input
                id="modal-scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                defaultValue={defaultDateTime}
                className="input-field"
              />
            </div>

            <DurationSelect />

            <div className="space-y-2 border-t border-gray-100 pt-3">
              <p className="field-label">Fotos (opcional)</p>
              <div className="grid grid-cols-2 gap-2">
                <JobMediaPicker fieldName="media_BEFORE" label="Antes" />
                <JobMediaPicker fieldName="media_AFTER" label="Después" />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={isPending} className="btn-primary flex-1">
                {isPending ? "Agendando..." : "Agendar trabajo"}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
