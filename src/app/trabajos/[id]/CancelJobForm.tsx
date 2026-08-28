"use client";

import { useState, useTransition } from "react";
import { cancelJob, reopenJob } from "../actions";

export function CancelJobForm({ jobId, status }: { jobId: string; status: string }) {
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (status === "CANCELLED") {
    return (
      <button
        disabled={isPending}
        onClick={() => startTransition(async () => { await reopenJob(jobId); })}
        className="btn-secondary text-sm px-3 py-1.5"
      >
        Reabrir trabajo
      </button>
    );
  }

  if (status === "COMPLETED") return null;

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="btn-danger-outline"
      >
        Cancelar trabajo
      </button>
    );
  }

  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-3 space-y-2 max-w-sm">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <label className="text-sm font-medium block">Motivo de cancelación (opcional)</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        className="input-field-sm w-full"
      />
      <div className="flex gap-2">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await cancelJob(jobId, reason);
              if (result?.error) setError(result.error);
            })
          }
          className="btn-danger"
        >
          {isPending ? "Cancelando..." : "Confirmar cancelación"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="btn-secondary text-sm px-3 py-1.5"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
