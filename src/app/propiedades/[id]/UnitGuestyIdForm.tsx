"use client";

import { useState, useTransition } from "react";
import { setUnitGuestyListingId } from "../actions";

export function UnitGuestyIdForm({
  propertyId,
  unitId,
  guestyListingId,
}: {
  propertyId: string;
  unitId: string;
  guestyListingId: string | null;
}) {
  const [value, setValue] = useState(guestyListingId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await setUnitGuestyListingId(propertyId, unitId, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-1.5">
      <input
        name="guestyListingId"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Guesty Listing ID"
        title="ID del listing en Guesty, para halar sus check-in/check-out"
        className="input-field-sm w-36"
      />
      <button type="submit" disabled={isPending} className="btn-secondary text-xs px-2 py-1">
        {isPending ? "..." : "Guardar"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
