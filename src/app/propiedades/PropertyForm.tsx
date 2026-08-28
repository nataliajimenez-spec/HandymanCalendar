"use client";

import { useRef, useState, useTransition } from "react";
import { createProperty } from "./actions";

export function PropertyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createProperty(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white border rounded-lg p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Nueva propiedad</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="address">
          Dirección
        </label>
        <input id="address" name="address" className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="notes">
          Notas
        </label>
        <textarea id="notes" name="notes" rows={2} className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear propiedad"}
      </button>
    </form>
  );
}
