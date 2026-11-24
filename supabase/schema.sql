-- =====================================================================
-- Dulce Victorino · Esquema de base de datos
-- Correr TODO este archivo una sola vez en Supabase:
--   Dashboard → SQL Editor → New query → pegar → Run
-- =====================================================================

-- ---------- Categorías (Materas, Tartas, Box, Tortas, Dulces...) ----------
create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  bajada      text,                       -- frase corta debajo del título
  orden       int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- Productos ----------
-- variantes: [{"nombre": "Limón", "precio": 12000}, {"nombre": "Chocolate", "precio": null}]
--   precio null = "Consultar"
-- incluye: ["2 alfajores", "1 porción de budín"]  (para los box)
create table if not exists public.productos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias(id) on delete set null,
  nombre       text not null,
  descripcion  text,
  precio       numeric,                   -- se usa si NO tiene variantes; null = "Consultar"
  titulo_variantes text,                -- "Sabor", "Tamaño", "Porciones"...
  variantes    jsonb not null default '[]'::jsonb,
  incluye      text[] not null default '{}',
  etiqueta     text,                      -- "Más pedida", "Para regalar"...
  imagen_url   text,
  visible      boolean not null default true,
  destacado    boolean not null default false,
  orden        int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists productos_categoria_idx on public.productos (categoria_id, orden);

-- ---------- Seguridad (RLS) ----------
-- Cualquiera puede LEER el catálogo (solo productos visibles).
-- Solo un usuario logueado (la clienta) puede crear, editar o borrar.
alter table public.categorias enable row level security;
alter table public.productos  enable row level security;

drop policy if exists "categorias lectura publica" on public.categorias;
create policy "categorias lectura publica" on public.categorias
  for select using (true);

drop policy if exists "categorias admin" on public.categorias;
create policy "categorias admin" on public.categorias
  for all to authenticated using (true) with check (true);

drop policy if exists "productos lectura publica" on public.productos;
create policy "productos lectura publica" on public.productos
  for select using (visible = true);

drop policy if exists "productos admin" on public.productos;
create policy "productos admin" on public.productos
  for all to authenticated using (true) with check (true);

-- ---------- Fotos (Storage) ----------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos lectura publica" on storage.objects;
create policy "fotos lectura publica" on storage.objects
  for select using (bucket_id = 'productos');

drop policy if exists "fotos subir admin" on storage.objects;
create policy "fotos subir admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'productos');

drop policy if exists "fotos editar admin" on storage.objects;
create policy "fotos editar admin" on storage.objects
  for update to authenticated using (bucket_id = 'productos');

drop policy if exists "fotos borrar admin" on storage.objects;
create policy "fotos borrar admin" on storage.objects
  for delete to authenticated using (bucket_id = 'productos');

-- ---------- Datos de ejemplo (borrar o editar desde el panel) ----------
insert into public.categorias (nombre, bajada, orden)
select * from (values
  ('Para el mate',     'Roscas, budines, alfajores y cositas para la merienda.', 1),
  ('Tartas y postres', 'Clásicas de siempre, hechas en casa.', 2),
  ('Box y regalos',    'Para regalar o para darte un gusto.', 3),
  ('Tortas y eventos', 'Cumples, mesas dulces y tortas a medida.', 4)
) as v(nombre, bajada, orden)
where not exists (select 1 from public.categorias);
