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
      className="card p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Nuevo item de catálogo</h2>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="type">
          Tipo
        </label>
        <select id="type" name="type" className="input-field">
          <option value="MATERIAL">Material</option>
          <option value="LABOR">Mano de obra</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="input-field" />
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
            className="input-field"
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
            className="input-field"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="sku">
          SKU / código (opcional)
        </label>
        <input id="sku" name="sku" className="input-field" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary"
      >
        {isPending ? "Agregando..." : "Agregar al catálogo"}
      </button>
    </form>
  );
}
