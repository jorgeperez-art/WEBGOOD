import { supabaseEnv } from "@/lib/supabase/env";
import type { AppointmentInput, Slot } from "./types";

/**
 * La web solo habla con esta interfaz. Cambiar de Supabase a Cal.com es
 * cambiar BOOKING_PROVIDER, sin tocar el asistente ni los Server Actions.
 */
export interface BookingProvider {
  getAvailableSlots(date: string): Promise<Slot[]>;
  /** Lanza SlotTakenError si la franja se ha ocupado mientras tanto. */
  createAppointment(input: AppointmentInput): Promise<{ id: string }>;
}

export class SlotTakenError extends Error {
  constructor() {
    super("La franja ya está ocupada");
  }
}

export class BookingNotConfiguredError extends Error {}


export async function getBookingProvider(): Promise<BookingProvider> {
  const choice = process.env.BOOKING_PROVIDER ?? (supabaseEnv().url ? "supabase" : "demo");
  switch (choice) {
    case "supabase":
      return (await import("./supabase-provider")).supabaseProvider;
    case "calcom":
      return (await import("./calcom-provider")).calcomProvider;
    case "demo":
      if (process.env.NODE_ENV === "production" && process.env.BOOKING_PROVIDER !== "demo") {
        throw new BookingNotConfiguredError("Faltan las variables de Supabase");
      }
      return (await import("./demo-provider")).demoProvider;
    default:
      throw new BookingNotConfiguredError(`BOOKING_PROVIDER desconocido: ${choice}`);
  }
}
