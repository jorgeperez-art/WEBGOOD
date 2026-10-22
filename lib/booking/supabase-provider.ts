import "server-only";
import { site } from "@/content/site";
import { supabaseAdmin } from "@/lib/supabase/server";
import { freeSlots } from "./slots";
import { canaryDate, canaryToUtc } from "./time";
import { SlotTakenError, type BookingProvider } from "./provider";

export const supabaseProvider: BookingProvider = {
  async getAvailableSlots(date) {
    const db = supabaseAdmin();
    const dayStart = canaryToUtc(date, "00:00").toISOString();
    const dayEnd = canaryToUtc(canaryDate(new Date(`${date}T12:00:00Z`), 1), "00:00").toISOString();

    const [hours, blocked, booked] = await Promise.all([
      db.from("opening_hours").select("weekday, opens_at, closes_at, slot_minutes"),
      db.from("blocked_slots").select("starts_at, ends_at").lt("starts_at", dayEnd).gt("ends_at", dayStart),
      db
        .from("appointments")
        .select("starts_at, ends_at")
        .neq("status", "cancelled")
        .lt("starts_at", dayEnd)
        .gt("ends_at", dayStart),
    ]);
    const error = hours.error ?? blocked.error ?? booked.error;
    if (error) throw error;

    return freeSlots({
      date,
      hours: (hours.data ?? []).map((h) => ({
        weekday: h.weekday,
        opensAt: String(h.opens_at).slice(0, 5),
        closesAt: String(h.closes_at).slice(0, 5),
        slotMinutes: h.slot_minutes,
      })),
      busy: [...(blocked.data ?? []), ...(booked.data ?? [])].map((b) => ({ startsAt: b.starts_at, endsAt: b.ends_at })),
      now: new Date(),
      minNoticeMinutes: site.booking.minNoticeMinutes,
    });
  },

  async createAppointment(input) {
    const { data, error } = await supabaseAdmin()
      .from("appointments")
      .insert({
        reason: input.reason,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        name: input.name,
        phone: input.phone,
        email: input.email,
        notes: input.notes,
        consent_at: input.consentAt,
      })
      .select("id")
      .single();
    // 23P01: la restricción de no solapamiento ha saltado.
    if (error?.code === "23P01") throw new SlotTakenError();
    if (error) throw error;
    return { id: data.id };
  },
};
