import { NextResponse } from "next/server";
import { connection } from "next/server";
import { canaryDate } from "@/lib/booking/time";
import { getBookingProvider } from "@/lib/booking/provider";

/**
 * Diagnóstico de la reserva: dice qué falta sin mostrar ninguna clave.
 * Abrir /api/estado-reservas en el navegador.
 */
export async function GET() {
  await connection();
  const env = {
    BOOKING_PROVIDER: process.env.BOOKING_PROVIDER ?? null,
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
    ERP_SUPABASE_URL: Boolean(process.env.ERP_SUPABASE_URL),
    ERP_SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.ERP_SUPABASE_SERVICE_ROLE_KEY),
    RATE_LIMIT_SALT: Boolean(process.env.RATE_LIMIT_SALT),
  };
  try {
    const provider = await getBookingProvider();
    const date = canaryDate(new Date(), 1);
    const slots = await provider.getAvailableSlots(date);
    return NextResponse.json({ ok: true, env, prueba: { dia: date, horasLibres: slots.length } });
  } catch (error) {
    const e = error as { name?: string; message?: string; code?: string; hint?: string };
    return NextResponse.json(
      { ok: false, env, error: { tipo: e.name, codigo: e.code ?? null, mensaje: e.message, pista: e.hint ?? null } },
      { status: 500 },
    );
  }
}
