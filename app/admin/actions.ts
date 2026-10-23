"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { endSession, isStaff, requireStaff, startSession } from "@/lib/admin/session";
import { isRateLimited } from "@/lib/rate-limit";
import { canaryToUtc } from "@/lib/booking/time";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: "Escribe tu email y tu contraseña.", email };
  try {
    if (await isRateLimited("acceso")) return { error: "Demasiados intentos. Espera unos minutos.", email };
    const { data, error } = await supabaseAdmin().auth.signInWithPassword(parsed.data);
    if (error || !data.user) return { error: "Email o contraseña incorrectos.", email };
    if (!(await isStaff(data.user.id))) return { error: "Esta cuenta no tiene acceso al panel.", email };
    await startSession({ userId: data.user.id, email: data.user.email ?? parsed.data.email });
  } catch (error) {
    console.error("[panel] acceso", error);
    return { error: "No se ha podido entrar. Inténtalo de nuevo en unos minutos.", email };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/acceso");
}

const statusSchema = z.object({ id: z.uuid(), status: z.enum(["pending", "confirmed", "cancelled"]) });

export async function setStatusAction(formData: FormData) {
  await requireStaff();
  const v = statusSchema.parse({ id: formData.get("id"), status: formData.get("status") });
  const { error } = await supabaseAdmin().from("appointments").update({ status: v.status }).eq("id", v.id);
  if (error) throw error;
  revalidatePath("/admin");
}

const hhmm = z.string().regex(/^\d{2}:\d{2}$/);
const blockSchema = z
  .object({ date: z.iso.date(), from: hhmm, to: hhmm, reason: z.string().max(120).optional() })
  .refine((v) => v.from < v.to, { message: "La hora de fin debe ser posterior a la de inicio." });

export type BlockState = { error?: string; ok?: boolean };

export async function addBlockAction(_prev: BlockState, formData: FormData): Promise<BlockState> {
  await requireStaff();
  const parsed = blockSchema.safeParse({
    date: formData.get("date"),
    from: formData.get("from"),
    to: formData.get("to"),
    reason: String(formData.get("reason") ?? "").trim() || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa el día y las horas." };
  const v = parsed.data;
  const { error } = await supabaseAdmin()
    .from("blocked_slots")
    .insert({
      starts_at: canaryToUtc(v.date, v.from).toISOString(),
      ends_at: canaryToUtc(v.date, v.to).toISOString(),
      reason: v.reason ?? null,
    });
  if (error) return { error: "No se ha podido guardar el bloqueo." };
  revalidatePath("/admin");
  return { ok: true };
}

export async function removeBlockAction(formData: FormData) {
  await requireStaff();
  const id = z.uuid().parse(formData.get("id"));
  const { error } = await supabaseAdmin().from("blocked_slots").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}
