"use client";

import { useState } from "react";

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

export function PropertyUnitSelect({
  properties,
  defaultPropertyId,
  defaultUnitId,
}: {
  properties: PropertyOption[];
  defaultPropertyId?: string;
  defaultUnitId?: string;
}) {
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const selected = properties.find((p) => p.id === propertyId);

  return (
    <>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="propertyId">
          Propiedad
        </label>
        <select
          id="propertyId"
          name="propertyId"
          required
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          className="input-field"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="unitId">
          Unidad / departamento (opcional)
        </label>
        <select
          id="unitId"
          name="unitId"
          defaultValue={defaultUnitId ?? ""}
          className="input-field"
        >
          <option value="">— Toda la propiedad —</option>
          {selected?.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
