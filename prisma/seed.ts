import { PrismaClient, Role, CatalogType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email: string, name: string, role: Role, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role, passwordHash },
  });
}

async function main() {
  // ---------------------------------------------------------------------
  // Usuarios iniciales — CAMBIA estas contraseñas después del primer login.
  // ---------------------------------------------------------------------
  const admin = await upsertUser(
    "admin@pmipuertorico.com",
    "Administrador",
    Role.ADMIN,
    "CambiaEsta123!"
  );
  await upsertUser("oficina@pmipuertorico.com", "Oficina", Role.OFICINA, "CambiaEsta123!");
  await upsertUser("handyman@pmipuertorico.com", "Handyman", Role.HANDYMAN, "CambiaEsta123!");

  // ---------------------------------------------------------------------
  // Catálogo de precios inicial (ejemplo — reemplaza con tu panfleto real)
  // ---------------------------------------------------------------------
  const catalogItems: Array<{
    type: CatalogType;
    name: string;
    unitLabel: string;
    unitPrice: number;
    sku?: string;
  }> = [
    { type: "LABOR", name: "Mano de obra - regular", unitLabel: "hora", unitPrice: 25 },
    { type: "LABOR", name: "Mano de obra - urgente/fin de semana", unitLabel: "hora", unitPrice: 40 },
    { type: "MATERIAL", name: "Pintura interior (galón)", unitLabel: "galón", unitPrice: 35 },
    { type: "MATERIAL", name: "Bombilla LED", unitLabel: "unidad", unitPrice: 6 },
    { type: "MATERIAL", name: "Sello de inodoro (wax ring)", unitLabel: "unidad", unitPrice: 12 },
    { type: "MATERIAL", name: "Tubo PVC 1/2\" (pie)", unitLabel: "pie", unitPrice: 2.5 },
    { type: "MATERIAL", name: "Cerradura de puerta", unitLabel: "unidad", unitPrice: 28 },
  ];

  for (const item of catalogItems) {
    const existing = await prisma.priceCatalogItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.priceCatalogItem.create({ data: item });
    }
  }

  // ---------------------------------------------------------------------
  // Propiedad de ejemplo con un par de unidades
  // ---------------------------------------------------------------------
  const property = await prisma.property.upsert({
    where: { id: "demo-property" },
    update: {},
    create: {
      id: "demo-property",
      name: "Edificio Demo (ejemplo — bórralo cuando cargues tus propiedades reales)",
      address: "123 Calle Ejemplo, San Juan, PR",
      units: {
        create: [{ label: "Apto 1A" }, { label: "Apto 1B" }, { label: "Oficina Principal" }],
      },
    },
  });

  console.log("Seed completado:");
  console.log(`- Admin: ${admin.email}`);
  console.log(`- ${catalogItems.length} items de catálogo`);
  console.log(`- Propiedad de ejemplo: ${property.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
