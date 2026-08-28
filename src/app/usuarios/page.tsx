import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { roleLabel } from "@/lib/roles";
import { UserForm } from "./UserForm";
import { ToggleActiveButton } from "./ToggleActiveButton";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="text-sm text-gray-600">
        Solo un administrador puede ver y gestionar usuarios.
      </div>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Usuarios</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <UserForm />

        <div className="bg-white border rounded-lg divide-y">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium">{u.name}</div>
                <div className="text-xs text-gray-500">
                  {u.email} · {roleLabel(u.role)}
                  {!u.active && " · inactivo"}
                </div>
              </div>
              <ToggleActiveButton userId={u.id} active={u.active} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
