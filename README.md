# Dulce Victorino

Landing page con catálogo de productos, pedidos por WhatsApp y panel de administración para **Dulce Victorino**.

## 🚀 Requisitos previos

- Node.js 20.9 o superior
- npm

## ⚙️ Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto basándose en `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

> **Nota:** El archivo `.env.local` está ignorado en Git para proteger las credenciales.

## 🗄️ Supabase (una sola vez)

1. En Supabase → **SQL Editor**, pegá todo `supabase/schema.sql` y dale **Run** (crea tablas, permisos y el bucket de fotos).
2. En **Authentication → Users → Add user**, creá el usuario de la clienta (email + contraseña) con *Auto Confirm*.
3. En **Project Settings → API** copiá la URL y la clave **anon / publishable** al `.env.local`. Nunca la `service_role`.

Sin `.env.local`, la landing muestra un catálogo de ejemplo y `/admin` avisa que falta configurar.

## 🗂️ Estructura

- `src/config/sitio.ts`: WhatsApp, redes y textos fijos de la página.
- `src/components/catalogo/`: catálogo, tarjetas y armado del mensaje de WhatsApp.
- `src/components/admin/`: login, lista de productos, formulario y categorías.
- `supabase/schema.sql`: base de datos.

## 📦 Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

## 💻 Desarrollo local

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación:
- Catálogo: `/`
- Panel de administración: `/admin`

## 🗄️ Configurar Supabase (una sola vez)

1. En Supabase → **SQL Editor** → New query → pegar todo `supabase/schema.sql` → **Run**.
   Crea las tablas, la seguridad (RLS), el bucket de fotos y las 4 categorías de ejemplo.
2. **Authentication → Sign In / Providers**: desactivar *Allow new users to sign up*
   (así nadie más puede crearse una cuenta y editar el catálogo).
3. **Authentication → Users → Add user**: crear el usuario de la clienta (email + contraseña).
4. Copiar `.env.local.example` a `.env.local` y completar la URL y la clave **anon / publishable**
   (Project Settings → API). Nunca usar la `service_role`.

Sin `.env.local` la landing muestra productos de ejemplo para poder ver el diseño.

## 📁 Dónde se edita cada cosa

- Textos, WhatsApp y redes: `src/config/sitio.ts`
- Colores: `src/app/globals.css` (`@theme`)
- Landing: `src/app/page.tsx` y `src/components/catalogo/`
- Panel: `src/app/admin/page.tsx` y `src/components/admin/`

## 🏗️ Compilación (Build estático)

El proyecto está configurado para exportación estática (`output: 'export'`), compatible con Vercel y Cloudflare Pages:

```bash
npm run build
```

Esto generará la carpeta `out/` con todos los archivos estáticos listos para desplegar.
