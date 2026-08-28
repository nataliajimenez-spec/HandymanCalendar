"use client";

import { useTransition } from "react";
import { toggleUserActive } from "./actions";

export function ToggleActiveButton({ userId, active }: { userId: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleUserActive(userId, !active);
        })
      }
      className={`text-xs px-2 py-1 rounded border disabled:opacity-50 ${
        active ? "badge-toggle-off" : "badge-toggle-on"
      }`}
    >
      {active ? "Desactivar" : "Activar"}
    </button>
  );
}
