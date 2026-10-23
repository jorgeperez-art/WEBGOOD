import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/** Cliente con la service role. Solo en el servidor: salta RLS. */
export function supabaseAdmin() {
  const { url, key } = supabaseEnv();
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}
