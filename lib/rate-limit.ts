import "server-only";
import { supabaseEnv } from "@/lib/supabase/env";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

const WINDOW_MINUTES = 10;
const MAX_ATTEMPTS = 5;

// Sin Supabase (desarrollo) el límite se guarda en memoria.
const memory = new Map<string, number[]>();

async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconocida";
  const salt = process.env.RATE_LIMIT_SALT ?? "goodview";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Registra un intento de reserva y dice si la IP ha superado el límite. */
export async function isRateLimited(): Promise<boolean> {
  const ipHash = await clientIpHash();
  const since = Date.now() - WINDOW_MINUTES * 60_000;

  if (!supabaseEnv().url) {
    const recent = (memory.get(ipHash) ?? []).filter((t) => t > since);
    recent.push(Date.now());
    memory.set(ipHash, recent);
    return recent.length > MAX_ATTEMPTS;
  }

  const { supabaseAdmin } = await import("@/lib/supabase/server");
  const db = supabaseAdmin();
  const { count, error } = await db
    .from("booking_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(since).toISOString());
  if (error) throw error;
  await db.from("booking_attempts").insert({ ip_hash: ipHash });
  return (count ?? 0) >= MAX_ATTEMPTS;
}
