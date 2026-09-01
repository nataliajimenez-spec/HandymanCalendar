"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncGuestyReservations } from "./actions";

export function SyncButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await syncGuestyReservations();
          if (result?.error) {
            alert(result.error);
          } else if (result?.success) {
            router.refresh();
          }
        })
      }
      className="btn-primary text-sm px-3 py-1.5"
    >
      {isPending ? "Sincronizando..." : "Sincronizar con Guesty"}
    </button>
  );
}
