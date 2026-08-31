"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { addLineItem } from "./actions";

type CatalogItem = {
  id: string;
  type: "MATERIAL" | "LABOR";
  name: string;
  unitLabel: string;
  unitPrice: number | null;
};

export function LineItemForm({
  jobId,
  catalogItems,
  pricesVisible,
}: {
  jobId: string;
  catalogItems: CatalogItem[];
  pricesVisible: boolean;
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
      setUnitPrice(item.unitPrice !== null ? String(item.unitPrice) : "0");
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
        required={!pricesVisible}
        className="input-field-sm w-full"
      >
        <option value="">
          {pricesVisible ? "— Personalizado / no está en el catálogo —" : "— Selecciona —"}
        </option>
        {filtered.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {pricesVisible && c.unitPrice !== null ? ` (${c.unitLabel} — $${c.unitPrice.toFixed(2)})` : ` (${c.unitLabel})`}
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
        readOnly={!pricesVisible}
        className="input-field-sm w-full"
      />

      <div className={pricesVisible ? "grid grid-cols-2 gap-2" : ""}>
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
            className="input-field-sm w-full"
          />
        </div>
        {pricesVisible && (
          <div>
            <label className="text-xs text-gray-500">Precio unitario ($)</label>
            <input
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="input-field-sm w-full"
            />
          </div>
        )}
      </div>
      {!pricesVisible && <input type="hidden" name="unitPrice" value="0" />}

      <input
        name="note"
        placeholder="Nota (opcional)"
        className="input-field-sm w-full"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary py-1.5"
      >
        {isPending ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}
