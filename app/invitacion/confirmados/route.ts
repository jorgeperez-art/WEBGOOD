import { connection } from "next/server";

/**
 * Lista de respuestas a la invitación de la inauguración.
 * Lee las respuestas del formulario de Jotform (no guarda nada en la web).
 * Abrir /invitacion/confirmados?clave=... (clave = INVITACION_CLAVE en Vercel).
 * Necesita JOTFORM_API_KEY en Vercel.
 */
const FORM_ID = "262972969724072";
// Cuentas de Jotform en EE. UU. o en la UE usan servidores distintos; se prueban los dos.
const API_HOSTS = ["https://api.jotform.com", "https://eu-api.jotform.com"];

type Respuesta = {
  fecha: string;
  nombre: string;
  asiste: boolean;
  personas: number;
  telefono: string;
  comentario: string;
  invitado: string;
};

type Answer = { answer?: unknown; prettyFormat?: string };

export async function GET(request: Request) {
  await connection();
  const clave = process.env.INVITACION_CLAVE?.trim();
  const apiKey = process.env.JOTFORM_API_KEY?.trim();
  const dada = new URL(request.url).searchParams.get("clave") ?? "";

  if (!clave) return page("Falta configurar", "<p>Falta la variable <b>INVITACION_CLAVE</b> en Vercel.</p>");
  if (dada !== clave) {
    return page(
      "Confirmaciones",
      `${dada ? '<p class="err">Clave incorrecta.</p>' : ""}
      <form method="get"><label for="c">Clave</label><input id="c" name="clave" type="password" autofocus><button>Ver lista</button></form>`,
      dada ? 401 : 200,
    );
  }
  if (!apiKey) return page("Falta configurar", "<p>Falta la variable <b>JOTFORM_API_KEY</b> en Vercel.</p>");

  let respuestas: Respuesta[];
  try {
    respuestas = await leerJotform(apiKey);
  } catch (error) {
    return page("No se pudo leer Jotform", `<p class="err">${esc((error as Error).message)}</p>`, 502);
  }

  const si = respuestas.filter((r) => r.asiste);
  const no = respuestas.filter((r) => !r.asiste);
  const personas = si.reduce((n, r) => n + r.personas, 0);
  const filas = (lista: Respuesta[], conPersonas: boolean) =>
    lista.length
      ? `<table><thead><tr><th>Nombre</th>${conPersonas ? "<th>Personas</th>" : ""}<th>Teléfono</th><th>Comentario</th><th>Enlace</th><th>Fecha</th></tr></thead><tbody>${lista
          .map(
            (r) =>
              `<tr><td>${esc(r.nombre)}</td>${conPersonas ? `<td>${r.personas}</td>` : ""}<td><a href="tel:${esc(r.telefono.replace(/[^+\d]/g, ""))}">${esc(r.telefono)}</a></td><td>${esc(r.comentario)}</td><td>${esc(r.invitado)}</td><td>${esc(r.fecha)}</td></tr>`,
          )
          .join("")}</tbody></table>`
      : "<p>Nadie todavía.</p>";

  return page(
    "Confirmaciones",
    `<div class="tot"><div><b>${personas}</b><span>personas vienen</span></div><div><b>${si.length}</b><span>confirmaciones</span></div><div><b>${no.length}</b><span>no podrán ir</span></div></div>
    <h2>Vienen (${si.length})</h2>${filas(si, true)}
    <h2>No podrán ir (${no.length})</h2>${filas(no, false)}`,
  );
}

async function leerJotform(apiKey: string): Promise<Respuesta[]> {
  let ultimo = "";
  for (const host of API_HOSTS) {
    const url = `${host}/form/${FORM_ID}/submissions?limit=1000&orderby=created_at`;
    const res = await fetch(url, { headers: { APIKEY: apiKey }, cache: "no-store" });
    const json = (await res.json().catch(() => null)) as {
      responseCode?: number;
      message?: string;
      content?: { created_at: string; status: string; answers: Record<string, Answer> }[];
    } | null;
    if (res.ok && json?.responseCode === 200 && Array.isArray(json.content)) {
      return json.content
        .filter((s) => s.status !== "DELETED")
        .map((s) => {
          const a = s.answers ?? {};
          const asistencia = texto(a["3"]);
          const asiste = /^s[ií]/i.test(asistencia);
          return {
            fecha: s.created_at?.slice(0, 16) ?? "",
            nombre: texto(a["2"]),
            asiste,
            personas: asiste ? Math.max(1, Number(texto(a["4"])) || 1) : 0,
            telefono: texto(a["5"]),
            comentario: texto(a["6"]),
            invitado: texto(a["8"]),
          };
        });
    }
    ultimo = json?.message ?? `HTTP ${res.status}`;
  }
  throw new Error(`Jotform respondió: ${ultimo}`);
}

function texto(a: Answer | undefined): string {
  if (!a) return "";
  if (a.prettyFormat) return a.prettyFormat;
  if (typeof a.answer === "string" || typeof a.answer === "number") return String(a.answer);
  if (a.answer && typeof a.answer === "object") return Object.values(a.answer as Record<string, unknown>).join(" ");
  return "";
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function page(titulo: string, cuerpo: string, status = 200): Response {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${titulo} · Goodview</title>
<style>
:root{--ter:#843D25;--alg:#EFECE8}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Fustat',system-ui,sans-serif;color:var(--ter);background:var(--alg);padding:28px 16px}
main{max-width:900px;margin:0 auto}h1{font-weight:300;font-size:32px;margin-bottom:16px}h2{font-size:18px;margin:26px 0 10px}
.tot{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.tot div{background:#fff;border-radius:10px;padding:14px;text-align:center}
.tot b{display:block;font-size:30px}.tot span{font-size:13px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;font-size:14px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid #E5E0D8;vertical-align:top}th{font-weight:600;font-size:12.5px}
td a{color:inherit}.err{color:#8a2a12;margin-bottom:12px}
form{display:grid;gap:8px;max-width:320px}input{font:inherit;font-size:16px;padding:10px 12px;border:1px solid rgba(132,61,37,.35);border-radius:8px}
button{font:inherit;font-weight:600;border:0;border-radius:999px;padding:11px;background:var(--ter);color:#fff;cursor:pointer}
@media (max-width:640px){table,thead,tbody,tr,td{display:block}thead{display:none}tr{border-bottom:1px solid #E5E0D8;padding:6px 0}td{border:0;padding:3px 12px}}
</style></head><body><main><h1>${titulo}</h1>${cuerpo}</main></body></html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}
