"use client";

import { useTransition } from "react";
import { setUnitManagementType } from "../actions";

export function UnitManagementToggle({
  propertyId,
  unitId,
  managementType,
}: {
  propertyId: string;
  unitId: string;
  managementType: "LONG_TERM" | "SHORT_TERM";
}) {
  const [isPending, startTransition] = useTransition();
  const isLongTerm = managementType === "LONG_TERM";

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setUnitManagementType(propertyId, unitId, isLongTerm ? "SHORT_TERM" : "LONG_TERM");
        })
      }
      title="Cambiar tipo de manejo"
      className={`text-xs px-2 py-1 rounded-full border font-medium disabled:opacity-50 ${
        isLongTerm
          ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
          : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
      }`}
    >
      {isLongTerm ? "Long-term" : "Short-term"}
    </button>
  );
}
