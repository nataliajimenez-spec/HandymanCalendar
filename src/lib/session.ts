import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/** Los precios/costos que se cobran a los dueños solo los ve oficina/admin. */
export function canSeePricing(role: string | undefined) {
  return role === "ADMIN" || role === "OFICINA";
}
