"use client";

import { useState, useTransition } from "react";
import { completeJob } from "./actions";

export function CompleteForm({
  jobId,
  defaultNotes,
}: {
  jobId: string;
  defaultNotes: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await completeJob(jobId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-2">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <label className="text-sm font-medium block" htmlFor="completionNotes">
        Notas del trabajo realizado
      </label>
      <textarea
        id="completionNotes"
        name="completionNotes"
        rows={3}
        defaultValue={defaultNotes ?? ""}
        placeholder="Ej. Se reemplazó la tubería y se probó que no hay fugas."
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-green-600 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Marcar trabajo como completado"}
      </button>
    </form>
  );
}
