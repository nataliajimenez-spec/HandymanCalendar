"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const jobSchema = z.object({
  propertyId: z.string().min(1, "Selecciona una propiedad"),
  unitId: z.string().optional(),
  jobTypeId: z.string().optional(),
  title: z.string().min(1, "Título requerido"),
  description: z.string().optional(),
  scheduledAt: z.coerce.date({ message: "Fecha y hora inválidas" }),
  durationMinutes: z.coerce.number().int().positive().default(60),
});

export async function createJob(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const rawUnitId = formData.get("unitId");
  const rawJobTypeId = formData.get("jobTypeId");
  const parsed = jobSchema.safeParse({
    propertyId: formData.get("propertyId"),
    unitId: rawUnitId ? String(rawUnitId) : undefined,
    jobTypeId: rawJobTypeId ? String(rawJobTypeId) : undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    scheduledAt: formData.get("scheduledAt"),
    durationMinutes: formData.get("durationMinutes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { unitId, jobTypeId, ...rest } = parsed.data;

  const job = await prisma.job.create({
    data: {
      ...rest,
      unitId: unitId || null,
      jobTypeId: jobTypeId || null,
      createdById: user.id,
    },
  });

  revalidatePath("/calendario");
  redirect(`/trabajos/${job.id}`);
}

export async function updateJob(jobId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const rawUnitId = formData.get("unitId");
  const rawJobTypeId = formData.get("jobTypeId");
  const parsed = jobSchema.safeParse({
    propertyId: formData.get("propertyId"),
    unitId: rawUnitId ? String(rawUnitId) : undefined,
    jobTypeId: rawJobTypeId ? String(rawJobTypeId) : undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    scheduledAt: formData.get("scheduledAt"),
    durationMinutes: formData.get("durationMinutes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { unitId, jobTypeId, ...rest } = parsed.data;

  await prisma.job.update({
    where: { id: jobId },
    data: { ...rest, unitId: unitId || null, jobTypeId: jobTypeId || null },
  });

  revalidatePath("/calendario");
  revalidatePath(`/trabajos/${jobId}`);
  return { success: true };
}

export async function cancelJob(jobId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "CANCELLED",
      cancelledById: user.id,
      cancelledAt: new Date(),
      cancelReason: reason || null,
    },
  });

  revalidatePath("/calendario");
  revalidatePath(`/trabajos/${jobId}`);
  return { success: true };
}

export async function reopenJob(jobId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "SCHEDULED", cancelledById: null, cancelledAt: null, cancelReason: null },
  });

  revalidatePath("/calendario");
  revalidatePath(`/trabajos/${jobId}`);
  return { success: true };
}

export async function rescheduleJob(jobId: string, newScheduledAtISO: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const scheduledAt = new Date(newScheduledAtISO);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "Fecha inválida." };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId }, select: { status: true } });
  if (!job) return { error: "Trabajo no encontrado." };
  if (job.status !== "SCHEDULED") {
    return { error: "Solo se pueden mover trabajos agendados." };
  }

  await prisma.job.update({ where: { id: jobId }, data: { scheduledAt } });

  revalidatePath("/calendario");
  revalidatePath("/calendario/semana");
  revalidatePath(`/trabajos/${jobId}`);
  return { success: true };
}
