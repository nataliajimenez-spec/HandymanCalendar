"use client";

import { useState, useTransition } from "react";
import { updateJob } from "../actions";
import { PropertyUnitSelect } from "@/components/PropertyUnitSelect";
import { DurationSelect } from "@/components/DurationSelect";

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

export function JobEditForm({
  jobId,
  properties,
  title,
  description,
  scheduledAtLocal,
  propertyId,
  unitId,
  durationMinutes,
}: {
  jobId: string;
  properties: PropertyOption[];
  title: string;
  description: string | null;
  scheduledAtLocal: string;
  propertyId: string;
  unitId: string | null;
  durationMinutes: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateJob(jobId, formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="card p-4 space-y-3">
      <h2 className="font-medium">Editar trabajo</h2>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
      {saved && <div className="text-sm text-green-700">Guardado.</div>}

      <PropertyUnitSelect
        properties={properties}
        defaultPropertyId={propertyId}
        defaultUnitId={unitId ?? undefined}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={title}
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={description ?? ""}
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="scheduledAt">
          Fecha y hora
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          defaultValue={scheduledAtLocal}
          className="input-field"
        />
      </div>

      <DurationSelect defaultValue={durationMinutes} />

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
