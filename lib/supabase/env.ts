/**
 * Variables de Supabase. Se aceptan también los nombres que crea la
 * integración de Supabase en Vercel, para no depender de cómo se añadieron.
 */
export function supabaseEnv() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  return { url, key };
}
