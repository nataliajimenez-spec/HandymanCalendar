"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type PropertyOption = {
  id: string;
  name: string;
  units: { id: string; label: string }[];
};

type UnitReservation = { checkIn: string; checkOut: string; guestName: string | null };

export function PropertyUnitSelect({
  properties,
  defaultPropertyId,
  defaultUnitId,
  availabilityByUnit,
  refDate,
}: {
  properties: PropertyOption[];
  defaultPropertyId?: string;
  defaultUnitId?: string;
  /** Reservas de Guesty por unidad (solo para unidades short-term sincronizadas). */
  availabilityByUnit?: Record<string, UnitReservation[]>;
  /** Día (yyyy-mm-dd) para el que se está agendando, usado para el aviso de ocupación. */
  refDate?: string;
}) {
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? properties[0]?.id ?? "");
  const [unitId, setUnitId] = useState(defaultUnitId ?? "");
  const selected = properties.find((p) => p.id === propertyId);

  const tracked = unitId ? Boolean(availabilityByUnit && unitId in availabilityByUnit) : false;
  const refDateObj = refDate ? new Date(`${refDate}T00:00:00`) : null;
  const overlapping =
    tracked && refDateObj
      ? (availabilityByUnit![unitId] ?? []).find(
          (r) => new Date(r.checkIn) <= refDateObj && new Date(r.checkOut) > refDateObj
        )
      : undefined;

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
          onChange={(e) => {
            setPropertyId(e.target.value);
            setUnitId("");
          }}
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
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          className="input-field"
        >
          <option value="">— Toda la propiedad —</option>
          {selected?.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
        {tracked && refDateObj && (
          <p className={`text-xs ${overlapping ? "text-red-600" : "text-green-600"}`}>
            {overlapping
              ? `⚠️ Ocupada (Guesty) hasta el ${format(new Date(overlapping.checkOut), "d 'de' MMM", { locale: es })}${
                  overlapping.guestName ? ` — ${overlapping.guestName}` : ""
                }`
              : "✓ Disponible en Guesty ese día"}
          </p>
        )}
      </div>
    </>
  );
}
