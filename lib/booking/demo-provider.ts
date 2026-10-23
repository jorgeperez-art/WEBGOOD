import "server-only";
import { site } from "@/content/site";
import { freeSlots } from "./slots";
import { SlotTakenError, type BookingProvider } from "./provider";
import type { OpeningHoursRow, TimeRange } from "./types";

// Solo para desarrollo sin Supabase: horario de site.ts y citas en memoria.
const dayIndex: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };

const hours: OpeningHoursRow[] = site.openingHours.flatMap((h) =>
  h.days.map((d) => ({
    weekday: dayIndex[d],
    opensAt: h.opens,
    closesAt: h.closes,
    slotMinutes: site.booking.slotMinutes,
  })),
);

const booked: TimeRange[] = [];

export const demoProvider: BookingProvider = {
  async getAvailableSlots(date) {
    return freeSlots({ date, hours, busy: booked, now: new Date(), minNoticeMinutes: site.booking.minNoticeMinutes });
  },
  async createAppointment(input) {
    const clash = booked.some(
      (b) => Date.parse(input.startsAt) < Date.parse(b.endsAt) && Date.parse(b.startsAt) < Date.parse(input.endsAt),
    );
    if (clash) throw new SlotTakenError();
    booked.push({ startsAt: input.startsAt, endsAt: input.endsAt });
    return { id: `demo-${booked.length}` };
  },
};
