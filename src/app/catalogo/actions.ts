"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const itemSchema = z.object({
  type: z.enum(["MATERIAL", "LABOR"]),
  name: z.string().min(1, "Nombre requerido"),
  unitLabel: z.string().min(1, "Unidad requerida (ej. galón, hora, unidad)"),
  unitPrice: z.coerce.number().positive("El precio debe ser mayor a 0"),
  sku: z.string().optional(),
});

export async function createCatalogItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = itemSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    unitLabel: formData.get("unitLabel"),
    unitPrice: formData.get("unitPrice"),
    sku: formData.get("sku") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.priceCatalogItem.create({ data: parsed.data });
  revalidatePath("/catalogo");
  return { success: true };
}

const updateSchema = itemSchema.omit({ type: true });

export async function updateCatalogItem(itemId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    unitLabel: formData.get("unitLabel"),
    unitPrice: formData.get("unitPrice"),
    sku: formData.get("sku") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.priceCatalogItem.update({ where: { id: itemId }, data: parsed.data });
  revalidatePath("/catalogo");
  return { success: true };
}

export async function setCatalogItemActive(itemId: string, active: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.priceCatalogItem.update({ where: { id: itemId }, data: { active } });
  revalidatePath("/catalogo");
  return { success: true };
}
