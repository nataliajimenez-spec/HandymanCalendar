"use client";

import { useRef, useState, useTransition } from "react";
import { createUnit } from "../actions";

export function UnitForm({ propertyId }: { propertyId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createUnit(propertyId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-start gap-2">
      <div className="flex-1 min-w-[160px]">
        <input
          name="label"
          required
          placeholder="Ej. Apto 2B"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <input
          name="notes"
          placeholder="Notas (opcional)"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Agregando..." : "Agregar unidad"}
      </button>
      {error && <div className="w-full text-sm text-red-600">{error}</div>}
    </form>
  );
}
