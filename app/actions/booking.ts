"use server";

import { site } from "@/content/site";
import { BookingNotConfiguredError, SlotTakenError, getBookingProvider } from "@/lib/booking/provider";
import { appointmentSchema, dateSchema, type FieldErrors } from "@/lib/booking/schema";
import { canaryDate } from "@/lib/booking/time";
import type { Slot } from "@/lib/booking/types";
import { sendBookingEmails } from "@/lib/email/send";
import { isRateLimited } from "@/lib/rate-limit";

export type SlotsResult = { ok: true; slots: Slot[] } | { ok: false; error: string };

export async function getSlotsAction(date: string): Promise<SlotsResult> {
  const parsed = dateSchema.safeParse(date);
  const today = canaryDate(new Date());
  const last = canaryDate(new Date(), site.booking.daysAhead);
  if (!parsed.success || date < today || date > last) return { ok: false, error: "Elige un día disponible" };

  try {
    const provider = await getBookingProvider();
    return { ok: true, slots: await provider.getAvailableSlots(date) };
  } catch (error) {
    console.error("[reservas] franjas", error);
    return { ok: false, error: "No hemos podido cargar las horas. Llámanos o inténtalo en unos minutos." };
  }
}

export type BookingState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors }
  | { status: "ok"; startsAt: string; reason: string; name: string; emailed: boolean };

export async function createAppointmentAction(_prev: BookingState, formData: FormData): Promise<BookingState> {
  // Honeypot: los bots rellenan el campo oculto. Fingimos éxito para no darles pistas.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "ok", startsAt: String(formData.get("startsAt") ?? ""), reason: "", name: "", emailed: true };
  }

  if (await isRateLimited()) {
    return {
      status: "error",
      errors: { form: "Has hecho demasiados intentos. Espera unos minutos o llámanos." },
    };
  }

  const parsed = appointmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      errors[key] ??= issue.message;
    }
    return { status: "error", errors };
  }

  const v = parsed.data;
  if (!site.bookingReasons.includes(v.reason)) {
    return { status: "error", errors: { reason: "Elige un motivo de la lista" } };
  }

  const appointment = {
    reason: v.reason,
    startsAt: v.startsAt,
    endsAt: v.endsAt,
    name: v.name,
    phone: v.phone,
    email: v.email,
    notes: v.notes || null,
    consentAt: new Date().toISOString(),
  };

  try {
    const provider = await getBookingProvider();
    // La franja tiene que seguir libre: se comprueba otra vez en el servidor.
    const date = canaryDate(new Date(v.startsAt));
    const free = await provider.getAvailableSlots(date);
    if (!free.some((s) => s.startsAt === v.startsAt && s.endsAt === v.endsAt)) throw new SlotTakenError();
    await provider.createAppointment(appointment);
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return { status: "error", errors: { startsAt: "Esa hora se acaba de ocupar. Elige otra, por favor." } };
    }
    console.error("[reservas] crear", error);
    const message =
      error instanceof BookingNotConfiguredError
        ? "La reserva online aún no está activa. Llámanos para pedir cita."
        : "No hemos podido guardar la cita. Inténtalo de nuevo o llámanos.";
    return { status: "error", errors: { form: message } };
  }

  const emailed = await sendBookingEmails(appointment);
  return { status: "ok", startsAt: v.startsAt, reason: v.reason, name: v.name, emailed };
}
