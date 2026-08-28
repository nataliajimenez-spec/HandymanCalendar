# Handyman Calendar — PMI Puerto Rico

App web para agendar y dar seguimiento a los trabajos del handyman de PMI
Puerto Rico. Next.js (App Router) + TypeScript + Prisma + Postgres, pensada
para desplegarse en Vercel con base de datos en Supabase (o Neon).

> Estado: en construcción por partes. Este README se irá completando junto
> con cada parte de la app (ver secciones más abajo a medida que avanzan).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Prisma** ORM sobre **Postgres** (Supabase o Neon)
- **NextAuth.js** (credenciales por email/contraseña) con roles: `ADMIN`,
  `OFICINA`, `HANDYMAN`
- **Vercel Blob** para fotos/video de los trabajos
- Despliegue en **Vercel**

## Modelo de datos (`prisma/schema.prisma`)

- `User` — usuarios del equipo, con rol.
- `Property` / `Unit` — propiedades y sus unidades/departamentos.
- `Job` — un trabajo agendado: propiedad, unidad opcional, fecha, estado
  (`SCHEDULED` / `COMPLETED` / `CANCELLED`), quién lo creó y cuándo, quién lo
  canceló y por qué.
- `PriceCatalogItem` — catálogo de precios (materiales y mano de obra).
- `JobLineItem` — líneas de costo de un trabajo (material o tiempo/mano de
  obra), con el precio tomado del catálogo al momento de crearse pero
  editable manualmente.
- `JobMedia` — fotos/video del trabajo (solo se guarda la URL; el archivo
  vive en Vercel Blob).

## Desarrollo local

```bash
npm install
cp .env.example .env   # y completa los valores (ver más abajo)
npm run db:migrate     # crea las tablas
npm run db:seed        # usuarios + catálogo + propiedad de ejemplo
npm run dev
```

Abre http://localhost:3000

### Variables de entorno

Ver `.env.example`. Se documentan ahí `DATABASE_URL`/`DIRECT_URL` (Postgres),
`NEXTAUTH_SECRET`/`NEXTAUTH_URL`, y `BLOB_READ_WRITE_TOKEN` (Vercel Blob).

## Despliegue (Vercel + Supabase)

Instrucciones completas de despliegue, creación de usuarios/roles, y carga
del catálogo de precios y propiedades se documentarán en detalle al cerrar
la última parte de la app (ver sección "Puesta en producción" que se añadirá
aquí).
