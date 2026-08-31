"use client";

import { useRef, useState, useTransition } from "react";
import { createJobType } from "./actions";

export function JobTypeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createJobType(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-start gap-2">
      <div className="flex-1 min-w-[200px]">
        <input
          name="name"
          required
          placeholder="Ej. Plomería, Electricidad, Pintura..."
          className="input-field"
        />
      </div>
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Agregando..." : "Agregar"}
      </button>
      {error && <div className="w-full text-sm text-red-600">{error}</div>}
    </form>
  );
}
