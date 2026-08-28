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
      className="card p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Nueva propiedad</h2>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="input-field" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="address">
          Dirección
        </label>
        <input id="address" name="address" className="input-field" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="notes">
          Notas
        </label>
        <textarea id="notes" name="notes" rows={2} className="input-field" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary"
      >
        {isPending ? "Creando..." : "Crear propiedad"}
      </button>
    </form>
  );
}
