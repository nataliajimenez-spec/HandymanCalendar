"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canSeePricing } from "@/lib/session";

const lineItemSchema = z.object({
  type: z.enum(["MATERIAL", "LABOR"]),
  catalogItemId: z.string().optional(),
  description: z.string().min(1, "Descripción requerida"),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
  note: z.string().optional(),
});

export async function addLineItem(jobId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const rawCatalogItemId = formData.get("catalogItemId");
  const parsed = lineItemSchema.safeParse({
    type: formData.get("type"),
    catalogItemId: rawCatalogItemId ? String(rawCatalogItemId) : undefined,
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    unitPrice: formData.get("unitPrice"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { catalogItemId, ...rest } = parsed.data;

  // El handyman no ve ni controla los precios que se cobran a los dueños:
  // solo puede registrar cantidades sobre un ítem real del catálogo, y el
  // precio se toma del catálogo en el servidor, nunca de lo que envíe el navegador.
  if (!canSeePricing(user.role)) {
    if (!catalogItemId) {
      return { error: "Selecciona un ítem del catálogo." };
    }
    const catalogItem = await prisma.priceCatalogItem.findUnique({ where: { id: catalogItemId } });
    if (!catalogItem) {
      return { error: "Ese ítem del catálogo ya no existe." };
    }
    rest.type = catalogItem.type;
    rest.description = catalogItem.name;
    rest.unitPrice = Number(catalogItem.unitPrice);
  }

  await prisma.jobLineItem.create({
    data: {
      jobId,
      catalogItemId: catalogItemId || null,
      createdById: user.id,
      ...rest,
    },
  });

  revalidatePath(`/trabajos/${jobId}/completar`);
  return { success: true };
}

export async function removeLineItem(jobId: string, lineItemId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.jobLineItem.delete({ where: { id: lineItemId } });
  revalidatePath(`/trabajos/${jobId}/completar`);
  return { success: true };
}

export async function addMedia(
  jobId: string,
  data: {
    url: string;
    type: "PHOTO" | "VIDEO";
    phase?: "BEFORE" | "AFTER" | "OTHER";
    fileName?: string;
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.jobMedia.create({
    data: {
      jobId,
      url: data.url,
      type: data.type,
      phase: data.phase ?? "OTHER",
      fileName: data.fileName,
      uploadedById: user.id,
    },
  });

  revalidatePath(`/trabajos/${jobId}/completar`);
  return { success: true };
}

export async function removeMedia(jobId: string, mediaId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const media = await prisma.jobMedia.findUnique({ where: { id: mediaId } });
  if (media) {
    await del(media.url).catch(() => {});
    await prisma.jobMedia.delete({ where: { id: mediaId } });
  }

  revalidatePath(`/trabajos/${jobId}/completar`);
  return { success: true };
}

const completeSchema = z.object({
  completionNotes: z.string().optional(),
});

export async function completeJob(jobId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = completeSchema.safeParse({
    completionNotes: formData.get("completionNotes") || undefined,
  });
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const existing = await prisma.job.findUnique({ where: { id: jobId }, select: { completedAt: true } });

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "COMPLETED",
      completedAt: existing?.completedAt ?? new Date(),
      completionNotes: parsed.data.completionNotes,
    },
  });

  revalidatePath("/calendario");
  revalidatePath(`/trabajos/${jobId}`);
  revalidatePath(`/trabajos/${jobId}/completar`);
  return { success: true };
}
