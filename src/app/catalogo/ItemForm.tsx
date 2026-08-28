"use client";

import { useRef, useState, useTransition } from "react";
import { createCatalogItem } from "./actions";

export function ItemForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCatalogItem(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white border rounded-lg p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Nuevo item de catálogo</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="type">
          Tipo
        </label>
        <select id="type" name="type" className="w-full border rounded px-3 py-2 text-sm">
          <option value="MATERIAL">Material</option>
          <option value="LABOR">Mano de obra</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="unitLabel">
            Unidad
          </label>
          <input
            id="unitLabel"
            name="unitLabel"
            required
            placeholder="hora, galón, unidad..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="unitPrice">
            Precio unitario ($)
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            step="0.01"
            min="0"
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="sku">
          SKU / código (opcional)
        </label>
        <input id="sku" name="sku" className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Agregando..." : "Agregar al catálogo"}
      </button>
    </form>
  );
}
