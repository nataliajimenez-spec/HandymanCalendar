"use client";

import { useState, useTransition } from "react";
import { updateProperty, setPropertyActive } from "../actions";

export function PropertyEditForm({
  propertyId,
  name,
  address,
  notes,
  active,
}: {
  propertyId: string;
  name: string;
  address: string | null;
  notes: string | null;
  active: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateProperty(propertyId, formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="card p-4 space-y-3 max-w-md">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Datos de la propiedad</h2>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await setPropertyActive(propertyId, !active);
            })
          }
          className={`text-xs px-2 py-1 rounded border disabled:opacity-50 ${
            active ? "badge-toggle-off" : "badge-toggle-on"
          }`}
        >
          {active ? "Desactivar" : "Activar"}
        </button>
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
      {saved && <div className="text-sm text-green-700">Guardado.</div>}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={name}
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="address">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          defaultValue={address ?? ""}
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="notes">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={notes ?? ""}
          className="input-field"
        />
      </div>

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
