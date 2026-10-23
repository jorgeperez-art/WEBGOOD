import "server-only";
import { createClient } from "@supabase/supabase-js";
import { site } from "@/content/site";
import { freeSlots } from "./slots";
import { canaryToUtc, wallTime } from "./time";
import { SlotTakenError, type BookingProvider } from "./provider";
import type { OpeningHoursRow } from "./types";

/**
 * Reservas dentro de la agenda de goodview-erp: la web lee las citas de su
 * tabla `appointments` y crea ahí las nuevas con el estado por defecto, así salen
 * directamente en la Agenda de la app. Para bloquear un hueco basta con
 * crear una cita en la app.
 */

/**
 * Columnas de `appointments` en goodview-erp que usa la web. La fecha y las
 * horas son locales de Canarias.
 */
type ErpAppointment = { id: string; date: string; time_start: string; time_end: string; created_at: string };

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

/** Día y hora locales ("YYYY-MM-DD", "HH:MM:SS") de un instante ISO. */
function local(iso: string) {
  const w = wallTime(new Date(iso));
  const pad = (n: number) => String(n).padStart(2, "0");
  return { date: `${w.year}-${pad(w.month)}-${pad(w.day)}`, time: `${pad(w.hour)}:${pad(w.minute)}:00` };
}

function erpDb() {
  // Se recortan espacios y saltos de línea que a veces se cuelan al pegar en Vercel.
  const url = process.env.ERP_SUPABASE_URL?.trim();
  const key = process.env.ERP_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Faltan ERP_SUPABASE_URL o ERP_SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Citas no canceladas de un día; con `from`/`to` ("HH:MM:SS"), solo las que se solapan. */
async function dayAppointments(date: string, from?: string, to?: string) {
  let query = erpDb()
    .from("appointments")
    .select("id, date, time_start, time_end, created_at")
    .eq("date", date)
    .neq("status", "cancelada");
  if (from && to) query = query.lt("time_start", to).gt("time_end", from);
  const { data, error } = await query
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ErpAppointment[];
}

/** Ficha existente con ese email o teléfono, para enlazar la cita. */
async function findPatientStrict(email: string, phone: string): Promise<string | null> {
  const { data, error } = await erpDb()
    .from("patients")
    .select("id")
    .or(`email.eq.${email.toLowerCase()},phone.eq.${phone.replace(/[^\d+]/g, "")}`)
    .limit(1);
  if (error) throw error;
  return data?.[0]?.id ?? null;
}

/** Enlazar la ficha es un extra: si falla, la cita se crea igual sin paciente. */
const findPatient = (email: string, phone: string) => findPatientStrict(email, phone).catch(() => null);

export const erpProvider: BookingProvider = {
  async getAvailableSlots(date) {
    const busy = await dayAppointments(date);
    return freeSlots({
      date,
      hours,
      busy: busy.map((b) => ({
        startsAt: canaryToUtc(b.date, b.time_start.slice(0, 5)).toISOString(),
        endsAt: canaryToUtc(b.date, b.time_end.slice(0, 5)).toISOString(),
      })),
      now: new Date(),
      minNoticeMinutes: site.booking.minNoticeMinutes,
    });
  },

  async createAppointment(input) {
    const start = local(input.startsAt);
    const end = local(input.endsAt);
    const clashes = () => dayAppointments(start.date, start.time, end.time);
    if ((await clashes()).length) throw new SlotTakenError();

    const notes = [
      `Reserva desde la web: ${input.name}`,
      `Teléfono: ${input.phone}`,
      `Email: ${input.email}`,
      `Motivo: ${input.reason}`,
      input.notes ? `Comentario: ${input.notes}` : null,
      `Consentimiento: ${input.consentAt}`,
    ].filter(Boolean);

    const row = {
      patient_id: await findPatient(input.email, input.phone),
      type: TYPES[input.reason] ?? "otro",
      // Sin estado: la agenda pone el suyo por defecto (sus estados no coinciden con la documentación).
      notes: notes.join("\n"),
      date: start.date,
      time_start: start.time,
      time_end: end.time,
    };
    const insert = (values: typeof row) => erpDb().from("appointments").insert(values).select("id").single();
    let { data, error } = await insert(row);
    // 23514: la agenda no acepta ese tipo de cita; se guarda como "otro" para no perder la reserva.
    if (error?.code === "23514" && row.type !== "otro") ({ data, error } = await insert({ ...row, type: "otro" }));
    if (error || !data) throw error ?? new Error("La agenda no devolvió la cita creada");

    // La app no impide solapes: si otra reserva entró a la vez, gana la primera.
    const clash = await clashes();
    if (clash[0] && clash[0].id !== data.id) {
      await erpDb().from("appointments").delete().eq("id", data.id);
      throw new SlotTakenError();
    }
    return { id: data.id };
  },
};

/**
 * Diagnóstico: crea y borra al momento una cita de prueba (año 2000,
 * cancelada) con los mismos campos que una reserva real, para ver por qué
 * falla el guardado sin tener que reservar.
 */
export async function erpInsertCheck() {
  const results: Record<string, unknown> = {};
  for (const type of ["otro", ...new Set(Object.values(TYPES))]) {
    const { data, error } = await erpDb()
      .from("appointments")
      .insert({
        patient_id: null,
        type,
        notes: "Prueba de diagnóstico de la web (se borra sola)",
        date: "2000-01-01",
        time_start: "09:00:00",
        time_end: "09:30:00",
      })
      .select("id")
      .single();
    if (error) {
      results[type] = { ok: false, codigo: error.code, mensaje: error.message, detalle: error.details };
      continue;
    }
    const removed = await erpDb().from("appointments").delete().eq("id", data.id);
    results[type] = { ok: true, borrada: !removed.error };
  }
  try {
    results.buscarPaciente = { ok: true, encontrado: Boolean(await findPatientStrict("prueba@example.com", "600000000")) };
  } catch (error) {
    results.buscarPaciente = { ok: false, mensaje: (error as Error).message };
  }
  return results;
}
