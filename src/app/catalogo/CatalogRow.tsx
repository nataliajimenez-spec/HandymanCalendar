"use client";

import { useState, useTransition } from "react";
import { updateCatalogItem, setCatalogItemActive } from "./actions";
import { formatMoney } from "@/lib/money";

export function CatalogRow({
  id,
  name,
  unitLabel,
  unitPrice,
  sku,
  active,
}: {
  id: string;
  name: string;
  unitLabel: string;
  unitPrice: number;
  sku: string | null;
  active: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateCatalogItem(id, formData);
      if (result?.error) setError(result.error);
      else setEditing(false);
    });
  }

  if (editing) {
    return (
      <form action={handleSubmit} className="py-2 space-y-2">
        {error && <div className="text-xs text-red-600">{error}</div>}
        <div className="flex flex-wrap gap-2">
          <input
            name="name"
            defaultValue={name}
            required
            className="flex-1 min-w-[140px] border rounded px-2 py-1 text-sm"
          />
          <input
            name="unitLabel"
            defaultValue={unitLabel}
            required
            className="w-28 border rounded px-2 py-1 text-sm"
          />
          <input
            name="unitPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={unitPrice}
            required
            className="w-24 border rounded px-2 py-1 text-sm"
          />
          <input
            name="sku"
            defaultValue={sku ?? ""}
            placeholder="SKU"
            className="w-24 border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="text-xs bg-blue-600 text-white rounded px-3 py-1 disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs border rounded px-3 py-1"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 gap-2">
      <div>
        <div className="text-sm font-medium">
          {name}
          {!active && <span className="text-gray-400 font-normal"> (inactivo)</span>}
        </div>
        <div className="text-xs text-gray-500">
          {formatMoney(unitPrice)} / {unitLabel}
          {sku && ` · SKU ${sku}`}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs px-2 py-1 rounded border">
          Editar
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await setCatalogItemActive(id, !active);
            })
          }
          className={`text-xs px-2 py-1 rounded border disabled:opacity-50 ${
            active
              ? "text-red-600 border-red-200 hover:bg-red-50"
              : "text-green-700 border-green-200 hover:bg-green-50"
          }`}
        >
          {active ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}
