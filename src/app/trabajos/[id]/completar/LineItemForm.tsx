"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { addLineItem } from "./actions";

type CatalogItem = {
  id: string;
  type: "MATERIAL" | "LABOR";
  name: string;
  unitLabel: string;
  unitPrice: number;
};

export function LineItemForm({
  jobId,
  catalogItems,
}: {
  jobId: string;
  catalogItems: CatalogItem[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"MATERIAL" | "LABOR">("LABOR");
  const [catalogItemId, setCatalogItemId] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => catalogItems.filter((c) => c.type === type), [catalogItems, type]);

  function handleCatalogChange(id: string) {
    setCatalogItemId(id);
    const item = catalogItems.find((c) => c.id === id);
    if (item) {
      setDescription(item.name);
      setUnitPrice(String(item.unitPrice));
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addLineItem(jobId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        setCatalogItemId("");
        setDescription("");
        setUnitPrice("");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-2 border rounded-lg p-3 bg-gray-50">
      {error && <div className="text-xs text-red-600">{error}</div>}

      <div className="flex gap-2">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="type"
            value="LABOR"
            checked={type === "LABOR"}
            onChange={() => {
              setType("LABOR");
              setCatalogItemId("");
              setDescription("");
              setUnitPrice("");
            }}
          />
          Mano de obra / tiempo
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="type"
            value="MATERIAL"
            checked={type === "MATERIAL"}
            onChange={() => {
              setType("MATERIAL");
              setCatalogItemId("");
              setDescription("");
              setUnitPrice("");
            }}
          />
          Material
        </label>
      </div>

      <select
        value={catalogItemId}
        onChange={(e) => handleCatalogChange(e.target.value)}
        className="w-full border rounded px-2 py-1.5 text-sm"
      >
        <option value="">— Personalizado / no está en el catálogo —</option>
        {filtered.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.unitLabel} — ${c.unitPrice.toFixed(2)})
          </option>
        ))}
      </select>
      <input type="hidden" name="catalogItemId" value={catalogItemId} />

      <input
        name="description"
        required
        placeholder={type === "LABOR" ? "Ej. Mano de obra - regular" : "Ej. Bombilla LED"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-2 py-1.5 text-sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">
            {type === "LABOR" ? "Horas" : "Cantidad"}
          </label>
          <input
            name="quantity"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">
            Precio unitario ($){" "}
          </label>
          <input
            name="unitPrice"
            type="number"
            step="0.01"
            min="0"
            required
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <input
        name="note"
        placeholder="Nota (opcional)"
        className="w-full border rounded px-2 py-1.5 text-sm"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded py-1.5 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}
