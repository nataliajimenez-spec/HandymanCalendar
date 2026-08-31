"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const propertySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function createProperty(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = propertySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const property = await prisma.property.create({ data: parsed.data });
  revalidatePath("/propiedades");
  return { success: true, id: property.id };
}

export async function updateProperty(propertyId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = propertySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.property.update({ where: { id: propertyId }, data: parsed.data });
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${propertyId}`);
  return { success: true };
}

export async function setPropertyActive(propertyId: string, active: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.property.update({ where: { id: propertyId }, data: { active } });
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${propertyId}`);
  return { success: true };
}

const unitSchema = z.object({
  label: z.string().min(1, "Nombre/número de unidad requerido"),
  notes: z.string().optional(),
  managementType: z.enum(["LONG_TERM", "SHORT_TERM"]).default("LONG_TERM"),
});

export async function createUnit(propertyId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = unitSchema.safeParse({
    label: formData.get("label"),
    notes: formData.get("notes") || undefined,
    managementType: formData.get("managementType") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.unit.findFirst({
    where: { propertyId, label: parsed.data.label },
  });
  if (existing) {
    return { error: "Ya existe una unidad con ese nombre en esta propiedad." };
  }

  await prisma.unit.create({ data: { propertyId, ...parsed.data } });
  revalidatePath(`/propiedades/${propertyId}`);
  return { success: true };
}

export async function setUnitActive(propertyId: string, unitId: string, active: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.unit.update({ where: { id: unitId }, data: { active } });
  revalidatePath(`/propiedades/${propertyId}`);
  return { success: true };
}

export async function setUnitManagementType(
  propertyId: string,
  unitId: string,
  managementType: "LONG_TERM" | "SHORT_TERM"
) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.unit.update({ where: { id: unitId }, data: { managementType } });
  revalidatePath(`/propiedades/${propertyId}`);
  return { success: true };
}
