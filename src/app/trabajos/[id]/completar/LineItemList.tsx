"use client";

import { useTransition } from "react";
import { removeLineItem } from "./actions";
import { formatMoney } from "@/lib/money";

type LineItem = {
  id: string;
  type: "MATERIAL" | "LABOR";
  description: string;
  quantity: number;
  unitPrice: number | null;
  note: string | null;
  createdByName: string;
};

export function LineItemList({
  jobId,
  items,
  editable,
  pricesVisible,
}: {
  jobId: string;
  items: LineItem[];
  editable: boolean;
  pricesVisible: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const total = pricesVisible ? items.reduce((sum, i) => sum + i.quantity * (i.unitPrice ?? 0), 0) : 0;

  if (items.length === 0) {
    return <div className="text-sm text-gray-500">Todavía no se ha registrado nada.</div>;
  }

  return (
    <div className="space-y-2">
      <div className="divide-y border rounded-lg">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {item.description}{" "}
                <span className="text-xs font-normal text-gray-500">
                  ({item.type === "LABOR" ? "mano de obra" : "material"})
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {pricesVisible && item.unitPrice !== null ? (
                  <>
                    {item.quantity} × {formatMoney(item.unitPrice)} = {formatMoney(item.quantity * item.unitPrice)}
                  </>
                ) : (
                  <>Cantidad: {item.quantity}</>
                )}
                {item.note && ` · ${item.note}`}
              </div>
            </div>
            {editable && (
              <button
                disabled={isPending}
                onClick={() => startTransition(async () => { await removeLineItem(jobId, item.id); })}
                className="text-xs text-red-600 shrink-0 disabled:opacity-50"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>
      {pricesVisible && <div className="text-right text-sm font-semibold">Total: {formatMoney(total)}</div>}
    </div>
  );
}
