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
        active ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-700 border-green-200 hover:bg-green-50"
      }`}
    >
      {active ? "Desactivar" : "Activar"}
    </button>
  );
}
