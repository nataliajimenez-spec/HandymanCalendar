"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const createUserSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["ADMIN", "OFICINA", "HANDYMAN"]),
});

export async function createUser(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Solo un administrador puede crear usuarios." };
  }

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    return { error: "Ya existe un usuario con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email: email.toLowerCase().trim(), passwordHash, role },
  });

  revalidatePath("/usuarios");
  return { success: true };
}

export async function toggleUserActive(userId: string, active: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Solo un administrador puede modificar usuarios." };
  }
  if (user.id === userId) {
    return { error: "No puedes desactivar tu propia cuenta." };
  }

  await prisma.user.update({ where: { id: userId }, data: { active } });
  revalidatePath("/usuarios");
  return { success: true };
}
