"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canSeePricing } from "@/lib/session";

const itemSchema = z.object({
  type: z.enum(["MATERIAL", "LABOR"]),
  name: z.string().min(1, "Nombre requerido"),
  unitLabel: z.string().min(1, "Unidad requerida (ej. galón, hora, unidad)"),
  unitPrice: z.coerce.number().positive("El precio debe ser mayor a 0"),
  sku: z.string().optional(),
});

export async function createCatalogItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

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
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

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
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

  await prisma.priceCatalogItem.update({ where: { id: itemId }, data: { active } });
  revalidatePath("/catalogo");
  return { success: true };
}

const jobTypeSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
});

export async function createJobType(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

  const parsed = jobTypeSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.jobType.findFirst({ where: { name: parsed.data.name } });
  if (existing) return { error: "Ya existe un tipo de trabajo con ese nombre." };

  await prisma.jobType.create({ data: parsed.data });
  revalidatePath("/catalogo");
  return { success: true };
}

export async function updateJobType(jobTypeId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

  const parsed = jobTypeSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.jobType.update({ where: { id: jobTypeId }, data: parsed.data });
  revalidatePath("/catalogo");
  return { success: true };
}

export async function setJobTypeActive(jobTypeId: string, active: boolean) {
  const user = await getCurrentUser();
  if (!user || !canSeePricing(user.role)) return { error: "No autorizado." };

  await prisma.jobType.update({ where: { id: jobTypeId }, data: { active } });
  revalidatePath("/catalogo");
  return { success: true };
}
