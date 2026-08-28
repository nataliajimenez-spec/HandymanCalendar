"use client";

import { useState, useTransition } from "react";
import { createJob } from "../actions";
import { PropertyUnitSelect } from "@/components/PropertyUnitSelect";

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

export function JobForm({
  properties,
  defaultDate,
}: {
  properties: PropertyOption[];
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
        <a href="/propiedades" className="text-blue-600 underline">
          Propiedades
        </a>
        .
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3 max-w-md">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <PropertyUnitSelect properties={properties} />

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="title">
          Título del trabajo
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Ej. Reparar fuga en baño"
          className="w-full border rounded px-3 py-2 text-sm"
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
          className="w-full border rounded px-3 py-2 text-sm"
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
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Agendando..." : "Agendar trabajo"}
      </button>
    </form>
  );
}
