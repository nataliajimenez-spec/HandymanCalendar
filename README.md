# Vendor Management at PMI Puerto Rico

App web para agendar y dar seguimiento a los trabajos del handyman de PMI
Puerto Rico. Next.js (App Router) + TypeScript + Prisma + Postgres,
desplegada en Vercel con base de datos en Supabase.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Prisma** ORM sobre **Postgres** (Supabase)
- **NextAuth.js** (credenciales por email/contraseña) con roles: `ADMIN`,
  `OFICINA`, `HANDYMAN` — cualquier rol puede agendar, ver, editar y
  cancelar trabajos (acceso abierto, según lo pedido)
- **Vercel Blob** para fotos/video de los trabajos
- Despliegue en **Vercel**

## Funcionalidad

- **Calendario** (`/calendario`) — vista mensual de todos los trabajos
  agendados. Cualquier usuario logueado puede crear, ver, editar o
  cancelar un trabajo. Cada trabajo muestra quién lo agendó y cuándo.
- **Propiedades** (`/propiedades`) — catálogo de propiedades y sus
  unidades/departamentos.
- **Catálogo de precios** (`/catalogo`) — materiales y mano de obra,
  editable. Se usa para sugerir costos al completar un trabajo.
- **Completar trabajo** (`/trabajos/[id]/completar`) — pensado para
  celular: el handyman registra tiempo, materiales (del catálogo o
  personalizados), sube fotos/video, y marca el trabajo como completado.
- **Reportes** (`/reportes`) — trabajos completados por rango de fechas,
  agrupados por propiedad y unidad, con costo total (mano de obra +
  materiales) para facturar. Exportable a CSV.
- **Usuarios** (`/usuarios`, solo administradores) — crear cuentas del
  equipo y asignar rol.

## Modelo de datos (`prisma/schema.prisma`)

- `User` — usuarios del equipo, con rol.
- `Property` / `Unit` — propiedades y sus unidades/departamentos.
- `Job` — un trabajo agendado: propiedad, unidad opcional, fecha, estado
  (`SCHEDULED` / `COMPLETED` / `CANCELLED`), quién lo creó y cuándo, quién lo
  canceló y por qué.
- `PriceCatalogItem` — catálogo de precios (materiales y mano de obra).
- `JobLineItem` — líneas de costo de un trabajo (material o tiempo/mano de
  obra), con el precio tomado del catálogo al momento de crearse pero
  editable manualmente por trabajo.
- `JobMedia` — fotos/video del trabajo (solo se guarda la URL; el archivo
  vive en Vercel Blob).

## Desarrollo local

Requiere Node 20+ y una base de datos Postgres (local o en la nube).

```bash
npm install
cp .env.example .env   # completa los valores, ver más abajo
npm run db:migrate     # crea las tablas (usa prisma migrate dev)
npm run db:seed        # usuarios + catálogo + propiedad de ejemplo
npm run dev
```

Abre http://localhost:3000 — te redirige a `/login`.

Usuarios de prueba creados por el seed (cambia las contraseñas después del
primer login real):

| Email | Contraseña | Rol |
|---|---|---|
| admin@pmipuertorico.com | CambiaEsta123! | Administrador |
| oficina@pmipuertorico.com | CambiaEsta123! | Oficina |
| handyman@pmipuertorico.com | CambiaEsta123! | Handyman |

### Variables de entorno

Ver `.env.example` para el detalle de cada una:

- `DATABASE_URL` / `DIRECT_URL` — conexión a Postgres (Supabase). La
  primera es la conexión con *pooling* (usada en runtime), la segunda es
  la conexión directa (usada solo por las migraciones de Prisma).
- `NEXTAUTH_SECRET` — secreto para firmar las sesiones. Genera uno con
  `openssl rand -base64 32`.
- `NEXTAUTH_URL` — URL pública de la app.
- `BLOB_READ_WRITE_TOKEN` — token de Vercel Blob para subir fotos/video.

## Despliegue en producción (Vercel + Supabase)

### 1. Crear el proyecto en Supabase

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2. Ve a **Project Settings → Database → Connection string**.
   - Copia la cadena de **Connection pooling** (puerto `6543`, con
     `?pgbouncer=true`) → esta va en `DATABASE_URL`.
   - Copia la cadena de **Direct connection** (puerto `5432`) → esta va
     en `DIRECT_URL`.

### 2. Crear el proyecto en Vercel

1. Importa el repositorio de GitHub en [vercel.com/new](https://vercel.com/new).
2. Framework preset: Next.js (se detecta solo).
3. En **Settings → Environment Variables**, agrega para *Production* (y
   *Preview* si vas a probar en ramas):
   - `DATABASE_URL`, `DIRECT_URL` (de Supabase, paso anterior)
   - `NEXTAUTH_SECRET` (genera uno nuevo para producción)
   - `NEXTAUTH_URL` = la URL que te da Vercel, ej.
     `https://tu-app.vercel.app`
4. En **Storage**, crea un **Blob store** y conéctalo al proyecto — Vercel
   agrega automáticamente `BLOB_READ_WRITE_TOKEN` a las variables de
   entorno.
5. Haz el deploy. El comando de build (`npm run build`) ya incluye
   `prisma migrate deploy`, así que las tablas se crean solas en el
   primer deploy y en cada deploy futuro que agregue migraciones nuevas.

### 3. Cargar los datos iniciales en producción

El seed (`prisma/seed.ts`) solo debe correrse una vez, apuntando a la base
de datos de producción, desde tu computadora:

```bash
# En tu máquina, con las variables de producción (no las de .env local):
DATABASE_URL="<pooled de Supabase>" DIRECT_URL="<directa de Supabase>" npm run db:seed
```

Esto crea:
- Los 3 usuarios de ejemplo (admin/oficina/handyman) — **cambia sus
  contraseñas** apenas entres (no hay pantalla de "cambiar contraseña"
  todavía; pídele a un administrador que cree tu usuario real desde
  `/usuarios` y desactiva o borra los de ejemplo).
- Un catálogo de precios de ejemplo — edítalo o bórralo desde `/catalogo`
  y carga ahí el panfleto de costos real.
- Una propiedad de ejemplo — bórrala o desactívala desde `/propiedades`
  una vez cargues las propiedades reales.

### 4. Crear usuarios y asignar roles

Como administrador, ve a `/usuarios` → **Crear usuario** → nombre, email,
contraseña temporal y rol (`Handyman`, `Oficina` o `Administrador`). El
usuario nuevo puede iniciar sesión de inmediato con esa contraseña.

### 5. Cargar propiedades y unidades

Ve a `/propiedades` → **Nueva propiedad** (nombre, dirección, notas).
Entra a la propiedad creada para agregar sus unidades/departamentos (ej.
"Apto 1A", "Oficina 2").

### 6. Cargar el catálogo de precios

Ve a `/catalogo` → agrega cada material o tarifa de mano de obra (nombre,
unidad de medida, precio). Estos precios se sugieren automáticamente al
registrar tiempo/materiales en un trabajo, y se pueden ajustar por
trabajo sin afectar el catálogo.

## Notas técnicas

- Todas las páginas que leen de la base de datos usan
  `export const dynamic = "force-dynamic"` para que Vercel no las congele
  como contenido estático en el build — siempre muestran datos en vivo.
- La autenticación usa sesiones JWT (sin tabla de sesiones), y cada
  Server Action valida el usuario logueado por su cuenta (no depende solo
  del proxy de rutas), siguiendo la recomendación de Next.js 16.
- Las fotos/video se suben directo del navegador a Vercel Blob (sin pasar
  por el servidor de la app), para que funcione bien con archivos grandes
  desde el celular.
