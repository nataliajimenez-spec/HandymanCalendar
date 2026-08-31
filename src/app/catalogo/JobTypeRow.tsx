"use client";

import { useState, useTransition } from "react";
import { updateJobType, setJobTypeActive } from "./actions";

export function JobTypeRow({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateJobType(id, formData);
      if (result?.error) setError(result.error);
      else setEditing(false);
    });
  }

  if (editing) {
    return (
      <form action={handleSubmit} className="flex items-center gap-2 py-2">
        <input name="name" defaultValue={name} required className="input-field-sm flex-1" />
        <button type="submit" disabled={isPending} className="btn-primary text-xs px-3 py-1">
          Guardar
        </button>
        <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-xs px-3 py-1">
          Cancelar
        </button>
        {error && <div className="w-full text-xs text-red-600">{error}</div>}
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">
        {name}
        {!active && <span className="text-gray-400 font-normal"> (inactivo)</span>}
      </span>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="btn-secondary text-xs px-3 py-1">
          Editar
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(async () => { await setJobTypeActive(id, !active); })}
          className={`text-xs px-2 py-1 rounded border disabled:opacity-50 ${
            active ? "badge-toggle-off" : "badge-toggle-on"
          }`}
        >
          {active ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}
