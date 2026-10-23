import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Sesión del panel: cookie httpOnly firmada con HMAC. La contraseña la
 * comprueba Supabase Auth y el acceso se limita a los usuarios de la tabla staff.
 */
const COOKIE = "gv_admin";
const HOURS = 12;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET ?? process.env.RATE_LIMIT_SALT;
  if (!s || s.length < 16) throw new Error("Falta ADMIN_SESSION_SECRET (o RATE_LIMIT_SALT) de al menos 16 caracteres");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export type StaffSession = { userId: string; email: string };

export async function startSession(session: StaffSession) {
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + HOURS * 3_600_000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

async function readSession(): Promise<StaffSession | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as StaffSession & { exp: number };
  if (data.exp < Date.now()) return null;
  return { userId: data.userId, email: data.email };
}

export async function isStaff(userId: string) {
  const { data, error } = await supabaseAdmin().from("staff").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** Para páginas y acciones del panel: devuelve la sesión o manda al acceso. */
export async function requireStaff(): Promise<StaffSession> {
  // Siempre en el momento de la petición: la sesión caduca y depende de la hora.
  await connection();
  const session = await readSession();
  // Se comprueba en cada petición para que quitar a alguien de staff tenga efecto inmediato.
  if (!session || !(await isStaff(session.userId))) redirect("/admin/acceso");
  return session;
}
