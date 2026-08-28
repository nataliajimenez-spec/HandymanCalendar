"use client";

import { useTransition } from "react";
import { setUnitActive } from "../actions";

export function UnitToggle({
  propertyId,
  unitId,
  active,
}: {
  propertyId: string;
  unitId: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setUnitActive(propertyId, unitId, !active);
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
