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
  // Datos no secretos para comprobar que la URL y la clave del ERP son del mismo proyecto.
  const erpKey = process.env.ERP_SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const erp = {
    proyecto: process.env.ERP_SUPABASE_URL?.trim().match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] ?? null,
    tipoClave: erpKey.startsWith("sb_secret_")
      ? "secret"
      : erpKey.startsWith("sb_publishable_")
        ? "publishable (no vale)"
        : erpKey.startsWith("eyJ")
          ? jwtRole(erpKey)
          : erpKey
            ? "desconocido"
            : null,
    proyectoClave: erpKey.startsWith("eyJ") ? jwtRef(erpKey) : null,
    espaciosAlPegar: (process.env.ERP_SUPABASE_SERVICE_ROLE_KEY ?? "") !== erpKey,
  };
  try {
    const provider = await getBookingProvider();
    const date = canaryDate(new Date(), 1);
    const slots = await provider.getAvailableSlots(date);
    return NextResponse.json({ ok: true, env, erp, prueba: { dia: date, horasLibres: slots.length } });
  } catch (error) {
    const e = error as { name?: string; message?: string; code?: string; hint?: string };
    return NextResponse.json(
      { ok: false, env, erp, error: { tipo: e.name, codigo: e.code ?? null, mensaje: e.message, pista: e.hint ?? null } },
      // 200 para que el diagnóstico se pueda leer desde cualquier herramienta; el fallo va en `ok`.
      { headers: { "cache-control": "no-store" } },
    );
  }
}

function jwtPayload(token: string): { role?: string; ref?: string } {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  } catch {
    return {};
  }
}
const jwtRole = (token: string) => `jwt ${jwtPayload(token).role ?? "?"}`;
const jwtRef = (token: string) => jwtPayload(token).ref ?? null;
