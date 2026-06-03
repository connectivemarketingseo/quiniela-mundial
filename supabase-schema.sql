-- ════════════════════════════════════════════════════════════════
--  Quiniela Mundial 2026 — Schema Supabase
--  Ejecuta esto en: Supabase → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════

-- 1. Jugadores
create table if not exists jugadores (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  token      text unique not null,
  created_at timestamptz default now()
);

-- 2. Partidos
create table if not exists partidos (
  id         serial primary key,
  fase       text not null,
  local      text not null,       -- código de equipo ej. "MEX"
  visitante  text not null,
  fecha      date not null,
  hora       time not null,
  estadio    text,
  created_at timestamptz default now(),
  unique (fase, local, visitante)
);

-- 3. Predicciones de cada jugador
create table if not exists predicciones (
  id             serial primary key,
  jugador_id     uuid references jugadores(id) on delete cascade,
  partido_id     int references partidos(id) on delete cascade,
  goles_local    int not null default 0,
  goles_visitante int not null default 0,
  created_at     timestamptz default now(),
  unique (jugador_id, partido_id)
);

-- 4. Resultados reales (lo llena el admin)
create table if not exists resultados (
  id              serial primary key,
  partido_id      int references partidos(id) on delete cascade unique,
  goles_local     int not null,
  goles_visitante int not null,
  minuto          int,            -- null = finalizado, número = en vivo
  updated_at      timestamptz default now()
);

-- ── Row Level Security (acceso público de lectura) ────────────────
alter table jugadores   enable row level security;
alter table partidos    enable row level security;
alter table predicciones enable row level security;
alter table resultados  enable row level security;

-- Todos pueden leer jugadores (para la tabla)
create policy "jugadores_read" on jugadores for select using (true);
create policy "jugadores_insert" on jugadores for insert with check (true);
create policy "jugadores_delete" on jugadores for delete using (true);

-- Todos pueden leer y escribir partidos
create policy "partidos_read"   on partidos for select using (true);
create policy "partidos_insert" on partidos for insert with check (true);
create policy "partidos_delete" on partidos for delete using (true);

-- Predicciones: lectura y escritura pública (el token del jugador actúa como auth)
create policy "pred_read"   on predicciones for select using (true);
create policy "pred_insert" on predicciones for insert with check (true);
create policy "pred_update" on predicciones for update using (true);

-- Resultados: lectura pública, escritura desde admin (anon key)
create policy "res_read"   on resultados for select using (true);
create policy "res_insert" on resultados for insert with check (true);
create policy "res_update" on resultados for update using (true);
create policy "res_delete" on resultados for delete using (true);

-- ── Realtime (para marcadores en vivo) ───────────────────────────
alter publication supabase_realtime add table resultados;
