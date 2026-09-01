"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createJob } from "../actions";
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

export function JobForm({
  properties,
  jobTypes,
  defaultDate,
}: {
  properties: PropertyOption[];
  jobTypes: JobType[];
  defaultDate?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const defaultDateTime = defaultDate ? `${defaultDate}T09:00` : "";

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createJob(formData);
      if (result?.error) setError(result.error);
    });
  }

  if (properties.length === 0) {
    return (
      <div className="text-sm text-gray-600">
        Primero crea una propiedad en{" "}
        <Link href="/propiedades" className="text-orange-600 underline">
          Propiedades
        </Link>
        .
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="card p-4 space-y-3 max-w-md">
      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <PropertyUnitSelect properties={properties} />

      <JobTypeSelect jobTypes={jobTypes} />

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Detalles del trabajo
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary"
      >
        {isPending ? "Agendando..." : "Agendar trabajo"}
      </button>
    </form>
  );
}
