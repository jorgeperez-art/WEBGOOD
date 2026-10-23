import { isTbc, site } from "@/content/site";
import { articles } from "@/content/articles";

/** Resumen en texto plano para asistentes de IA (https://llmstxt.org). Solo datos confirmados. */
export function GET() {
  const { address, phone, email } = site.contact;
  const link = (path: string) => new URL(path, site.url).toString();
  const lines = [
    `# ${site.brand.name} · ${site.brand.descriptor}`,
    "",
    `> ${site.about.short}`,
    "",
    "## Datos",
    `- Dirección: ${address.street}, ${address.postalCode} ${address.city}, ${address.region}`,
    `- Horario: ${site.hoursLabel}`,
    ...(isTbc(phone) ? [] : [`- Teléfono: ${phone}`]),
    ...(isTbc(email) ? [] : [`- Email: ${email}`]),
    `- Reservar cita: ${link("/#reservar")}`,
    "",
    "## Servicios",
    ...site.services.map((g) => `- [${g.title}](${link(`/servicios/${g.slug}`)}): ${g.items.join(", ")}`),
    "",
    "## Consejos",
    ...articles.map((a) => `- [${a.title}](${link(`/consejos/${a.slug}`)}): ${a.excerpt}`),
    `- [Test de fatiga visual digital](${link("/test-fatiga-visual")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
