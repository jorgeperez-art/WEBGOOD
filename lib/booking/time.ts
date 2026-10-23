/** Utilidades de fecha en la hora de Canarias, sin dependencias. */
export const TIME_ZONE = "Atlantic/Canary";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Fecha y hora "de pared" en Canarias para un instante dado. */
export function wallTime(date: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return { year: +p.year, month: +p.month, day: +p.day, hour: +p.hour, minute: +p.minute, second: +p.second };
}

function offsetMs(date: Date) {
  const w = wallTime(date);
  return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second) - date.getTime();
}

/** Instante UTC de una fecha y hora locales de Canarias. */
export function canaryToUtc(ymd: string, hhmm: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  const [h, min] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, min);
  let result = guess - offsetMs(new Date(guess));
  // Segundo ajuste por si el cambio de hora cae entre medias.
  result = guess - offsetMs(new Date(result));
  return new Date(result);
}

/** "YYYY-MM-DD" de hoy en Canarias, desplazado `days` días. */
export function canaryDate(base: Date, days = 0): string {
  const w = wallTime(base);
  const d = new Date(Date.UTC(w.year, w.month - 1, w.day + days));
  return d.toISOString().slice(0, 10);
}

/** Día de la semana con 0 = lunes, para una fecha "YYYY-MM-DD". */
export function weekdayOf(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

export function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
