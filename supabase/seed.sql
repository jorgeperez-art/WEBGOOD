-- Horario de apertura confirmado (ver content/site.ts).
-- La duración de cada cita (slot_minutes) está por confirmar: 30 minutos provisionalmente.
insert into opening_hours (weekday, opens_at, closes_at, slot_minutes) values
  (0, '09:30', '20:30', 30),
  (1, '09:30', '20:30', 30),
  (2, '09:30', '20:30', 30),
  (3, '09:30', '20:30', 30),
  (4, '09:30', '20:30', 30),
  (5, '10:00', '14:00', 30);
