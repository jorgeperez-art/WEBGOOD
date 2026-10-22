-- Reservas de goodview: citas, horario, bloqueos y personal del panel.
-- RLS activado en todas las tablas. El público no tiene ninguna política:
-- la web inserta y consulta solo desde el servidor con la service role.

create extension if not exists btree_gist;

create type appointment_status as enum ('pending', 'confirmed', 'cancelled');

create table appointments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  reason      text not null check (char_length(reason) between 1 and 120),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null check (ends_at > starts_at),
  name        text not null check (char_length(name) between 2 and 120),
  phone       text not null check (char_length(phone) between 6 and 30),
  email       text not null check (char_length(email) between 5 and 200),
  notes       text check (char_length(notes) <= 1000),
  status      appointment_status not null default 'pending',
  consent_at  timestamptz not null,
  -- Dos citas activas no pueden solaparse, aunque lleguen a la vez.
  constraint appointments_no_overlap
    exclude using gist (tstzrange(starts_at, ends_at) with &&) where (status <> 'cancelled')
);

create index appointments_starts_at_idx on appointments (starts_at);

-- weekday: 0 = lunes … 6 = domingo. Varias filas por día permiten horario partido.
-- Las horas son locales de Canarias (Atlantic/Canary).
create table opening_hours (
  id            smallint generated always as identity primary key,
  weekday       smallint not null check (weekday between 0 and 6),
  opens_at      time not null,
  closes_at     time not null check (closes_at > opens_at),
  slot_minutes  smallint not null default 30 check (slot_minutes between 10 and 240)
);

create table blocked_slots (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null,
  ends_at    timestamptz not null check (ends_at > starts_at),
  reason     text
);

create index blocked_slots_starts_at_idx on blocked_slots (starts_at);

-- Intentos de reserva para el límite de peticiones (IP con hash, nunca en claro).
create table booking_attempts (
  id          bigint generated always as identity primary key,
  ip_hash     text not null,
  created_at  timestamptz not null default now()
);

create index booking_attempts_ip_idx on booking_attempts (ip_hash, created_at);

-- Personal con acceso al panel /admin.
create table staff (
  user_id uuid primary key references auth.users on delete cascade
);

alter table appointments     enable row level security;
alter table opening_hours    enable row level security;
alter table blocked_slots    enable row level security;
alter table booking_attempts enable row level security;
alter table staff            enable row level security;

create function is_staff() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from staff where user_id = auth.uid()) $$;

create policy staff_all on appointments  for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on opening_hours for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_all on blocked_slots for all to authenticated using (is_staff()) with check (is_staff());
create policy staff_self on staff for select to authenticated using (user_id = auth.uid());
