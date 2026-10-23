import { addMinutes, canaryToUtc, weekdayOf } from "./time";
import type { OpeningHoursRow, Slot, TimeRange } from "./types";

type Options = {
  /** Día local de Canarias, "YYYY-MM-DD". */
  date: string;
  hours: OpeningHoursRow[];
  /** Franjas bloqueadas y citas activas: ninguna franja libre puede solaparse con ellas. */
  busy: TimeRange[];
  now: Date;
  minNoticeMinutes: number;
};

const overlaps = (a: TimeRange, b: TimeRange) =>
  Date.parse(a.startsAt) < Date.parse(b.endsAt) && Date.parse(b.startsAt) < Date.parse(a.endsAt);

/** Franjas libres de un día a partir del horario, quitando lo ocupado y lo que ya ha pasado. */
export function freeSlots({ date, hours, busy, now, minNoticeMinutes }: Options): Slot[] {
  const weekday = weekdayOf(date);
  const earliest = now.getTime() + minNoticeMinutes * 60_000;
  const slots: Slot[] = [];

  for (const row of hours.filter((h) => h.weekday === weekday)) {
    for (let t = row.opensAt; addMinutes(t, row.slotMinutes) <= row.closesAt; t = addMinutes(t, row.slotMinutes)) {
      const slot = {
        startsAt: canaryToUtc(date, t).toISOString(),
        endsAt: canaryToUtc(date, addMinutes(t, row.slotMinutes)).toISOString(),
      };
      if (Date.parse(slot.startsAt) < earliest) continue;
      if (busy.some((b) => overlaps(slot, b))) continue;
      slots.push(slot);
    }
  }
  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
