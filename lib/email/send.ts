import "server-only";
import { Resend } from "resend";
import { isTbc, site } from "@/content/site";
import type { AppointmentInput } from "@/lib/booking/types";
import { TIME_ZONE } from "@/lib/booking/time";

const when = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Confirmación al cliente y aviso a la óptica. Si falta la clave de Resend o
 * las direcciones siguen por confirmar, no envía nada y lo deja en el log.
 */
export async function sendBookingEmails(appt: AppointmentInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? site.email.from;
  const notifyTo = process.env.EMAIL_NOTIFY_TO ?? site.email.notifyTo;
  if (!key || isTbc(from)) {
    console.warn("[email] Resend sin configurar: no se envían emails de la cita");
    return false;
  }

  const resend = new Resend(key);
  const fecha = when(appt.startsAt);
  const { street, postalCode, city } = site.contact.address;
  const direccion = `${street}, ${postalCode} ${city}`;

  const tasks = [
    resend.emails.send({
      from,
      to: appt.email,
      subject: `Tu cita en ${site.brand.name}: ${fecha}`,
      text: [
        `Hola, ${appt.name}:`,
        "",
        `Hemos recibido tu solicitud de cita para el ${fecha} (${appt.reason}).`,
        "Te escribiremos para confirmarla.",
        "",
        `${site.brand.name} · ${site.brand.descriptor}`,
        direccion,
        site.contact.phone,
      ].join("\n"),
    }),
  ];

  if (!isTbc(notifyTo)) {
    tasks.push(
      resend.emails.send({
        from,
        to: notifyTo,
        replyTo: appt.email,
        subject: `Nueva cita: ${fecha} · ${appt.name}`,
        html: `<p><b>${escape(appt.name)}</b> ha pedido cita para el <b>${escape(fecha)}</b>.</p>
<ul><li>Motivo: ${escape(appt.reason)}</li><li>Teléfono: ${escape(appt.phone)}</li><li>Email: ${escape(appt.email)}</li>
<li>Comentario: ${escape(appt.notes ?? "")}</li></ul>`,
      }),
    );
  }

  const [toClient, ...rest] = await Promise.allSettled(tasks);
  for (const r of [toClient, ...rest]) if (r.status === "rejected") console.error("[email]", r.reason);
  return toClient.status === "fulfilled" && !toClient.value.error;
}
