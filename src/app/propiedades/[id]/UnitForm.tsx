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
          className="input-field"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <input
          name="notes"
          placeholder="Notas (opcional)"
          className="input-field"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? "Agregando..." : "Agregar unidad"}
      </button>
      {error && <div className="w-full text-sm text-red-600">{error}</div>}
    </form>
  );
}
