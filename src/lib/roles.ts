export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  OFICINA: "Oficina",
  HANDYMAN: "Handyman",
};

export function roleLabel(role: string) {
  return ROLE_LABELS[role] ?? role;
}
