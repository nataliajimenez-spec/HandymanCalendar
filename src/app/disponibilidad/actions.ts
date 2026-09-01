"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { fetchGuestyReservations, isGuestyConfigured } from "@/lib/guesty";

const SYNC_PAST_DAYS = 3;
const SYNC_FUTURE_DAYS = 120;

export async function syncGuestyReservations() {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  if (!isGuestyConfigured()) {
    return {
      error:
        "Guesty no está configurado todavía. Un administrador debe agregar GUESTY_CLIENT_ID y GUESTY_CLIENT_SECRET en las variables de entorno.",
    };
  }

  const units = await prisma.unit.findMany({
    where: { guestyListingId: { not: null }, active: true },
    select: { id: true, guestyListingId: true },
  });
  if (units.length === 0) {
    return { error: "Ninguna unidad tiene un Guesty Listing ID configurado. Agrégalo desde Propiedades." };
  }

  const listingToUnit = new Map(units.map((u) => [u.guestyListingId as string, u.id]));

  const from = new Date();
  from.setDate(from.getDate() - SYNC_PAST_DAYS);
  const to = new Date();
  to.setDate(to.getDate() + SYNC_FUTURE_DAYS);

  let reservations;
  try {
    reservations = await fetchGuestyReservations({
      listingIds: [...listingToUnit.keys()],
      from,
      to,
    });
  } catch (e) {
    return { error: (e as Error).message || "No se pudo sincronizar con Guesty." };
  }

  const matched = reservations
    .map((r) => ({ ...r, unitId: listingToUnit.get(r.listingId) }))
    .filter((r): r is typeof r & { unitId: string } => Boolean(r.unitId));

  await prisma.$transaction(
    matched.map((r) =>
      prisma.guestyReservation.upsert({
        where: { guestyId: r.guestyId },
        create: {
          guestyId: r.guestyId,
          unitId: r.unitId,
          status: r.status,
          guestName: r.guestName,
          checkIn: new Date(r.checkIn),
          checkOut: new Date(r.checkOut),
        },
        update: {
          status: r.status,
          guestName: r.guestName,
          checkIn: new Date(r.checkIn),
          checkOut: new Date(r.checkOut),
          syncedAt: new Date(),
        },
      })
    )
  );

  revalidatePath("/disponibilidad");
  revalidatePath("/calendario");
  revalidatePath("/calendario/semana");
  return { success: true, count: matched.length };
}
