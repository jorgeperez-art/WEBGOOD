import "server-only";
import { createClient } from "@supabase/supabase-js";
import { site } from "@/content/site";
import { freeSlots } from "./slots";
import { canaryDate, canaryToUtc } from "./time";
import { SlotTakenError, type BookingProvider } from "./provider";
import type { OpeningHoursRow } from "./types";

/**
 * Reservas dentro de la agenda de goodview-erp: la web lee las citas de su
 * tabla `appointments` y crea ahí las nuevas como "pendiente", así salen
 * directamente en la Agenda de la app. Para bloquear un hueco basta con
 * crear una cita en la app.
 */

/** Columnas de `appointments` en goodview-erp que usa la web. */
type ErpAppointment = { id: string; start_time: string; end_time: string; created_at: string };

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** El horario sale de site.ts: la app no guarda horario de apertura. */
const hours: OpeningHoursRow[] = site.openingHours.flatMap((row) =>
  row.days.map((day) => ({
    weekday: WEEKDAYS.indexOf(day),
    opensAt: row.opens,
    closesAt: row.closes,
    slotMinutes: site.booking.slotMinutes,
  })),
);

/** Motivo de la web → tipo de cita de la app. */
const TYPES: Record<string, string> = {
  "Exámenes y salud visual": "revision",
  "Terapia visual e infancia": "revision",
  "Lentes de contacto": "adaptacion_lentillas",
};

function erpDb() {
  const url = process.env.ERP_SUPABASE_URL;
  const key = process.env.ERP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan ERP_SUPABASE_URL o ERP_SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function overlapping(startsAt: string, endsAt: string) {
  const { data, error } = await erpDb()
    .from("appointments")
    .select("id, start_time, end_time, created_at")
    .neq("status", "cancelada")
    .lt("start_time", endsAt)
    .gt("end_time", startsAt)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ErpAppointment[];
}

/** Ficha existente con ese email o teléfono, para enlazar la cita. */
async function findPatient(email: string, phone: string) {
  const { data, error } = await erpDb()
    .from("patients")
    .select("id")
    .or(`email.eq.${email.toLowerCase()},phone.eq.${phone.replace(/[^\d+]/g, "")}`)
    .limit(1);
  if (error) throw error;
  return data?.[0]?.id ?? null;
}

export const erpProvider: BookingProvider = {
  async getAvailableSlots(date) {
    const dayStart = canaryToUtc(date, "00:00").toISOString();
    const dayEnd = canaryToUtc(canaryDate(new Date(`${date}T12:00:00Z`), 1), "00:00").toISOString();
    const busy = await overlapping(dayStart, dayEnd);
    return freeSlots({
      date,
      hours,
      busy: busy.map((b) => ({ startsAt: b.start_time, endsAt: b.end_time })),
      now: new Date(),
      minNoticeMinutes: site.booking.minNoticeMinutes,
    });
  },

  async createAppointment(input) {
    if ((await overlapping(input.startsAt, input.endsAt)).length) throw new SlotTakenError();

    const notes = [
      "Reserva desde la web",
      `Teléfono: ${input.phone}`,
      `Email: ${input.email}`,
      `Motivo: ${input.reason}`,
      input.notes ? `Comentario: ${input.notes}` : null,
      `Consentimiento: ${input.consentAt}`,
    ].filter(Boolean);

    const { data, error } = await erpDb()
      .from("appointments")
      .insert({
        patient_id: await findPatient(input.email, input.phone),
        type: TYPES[input.reason] ?? "consulta",
        title: `Web · ${input.name}`,
        notes: notes.join("\n"),
        start_time: input.startsAt,
        end_time: input.endsAt,
      })
      .select("id")
      .single();
    if (error) throw error;

    // La app no impide solapes: si otra reserva entró a la vez, gana la primera.
    const clash = await overlapping(input.startsAt, input.endsAt);
    if (clash[0] && clash[0].id !== data.id) {
      await erpDb().from("appointments").delete().eq("id", data.id);
      throw new SlotTakenError();
    }
    return { id: data.id };
  },
};
