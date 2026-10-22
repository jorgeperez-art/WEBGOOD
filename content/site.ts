/**
 * Único archivo de datos del negocio.
 *
 * Regla: no se inventa ningún dato. Lo que falta se marca con `tbc()` y se
 * muestra en la web como "[… por confirmar]" hasta que se rellene aquí.
 */

const TBC_SUFFIX = "por confirmar";

export const tbc = (label: string) => `[${label} ${TBC_SUFFIX}]`;

export const isTbc = (value: string | null | undefined): boolean =>
  value == null || value.endsWith(`${TBC_SUFFIX}]`);

export type NavItem = { id: SectionId; label: string };
export type SectionId = "inicio" | "marcas" | "servicios" | "reservar" | "visitanos";

export const site = {
  brand: {
    name: "goodview",
    descriptor: "Centro óptico",
    claim: "Enfocar lo importante",
  },
  legal: {
    name: "Holding Of Business Goodviews S.L.",
    cif: tbc("CIF"),
    registeredAddress: tbc("Domicilio social"),
  },
  url: "https://goodview.es",
  locale: "es_ES",
  contact: {
    address: {
      street: "Calle Blanco, 1",
      postalCode: "38400",
      city: "Puerto de la Cruz",
      region: "Santa Cruz de Tenerife",
      country: "ES",
    },
    geo: null as null | { lat: number; lng: number },
    phone: tbc("Teléfono"),
    whatsapp: tbc("WhatsApp"),
    email: "hola@goodview.es",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Blanco+1,+38400+Puerto+de+la+Cruz" as string | null,
    social: [] as { network: string; url: string }[],
  },
  /** Horario de apertura (hora de Canarias). También sirve para el JSON-LD y para sembrar opening_hours. */
  openingHours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:30", closes: "20:30" },
    { days: ["Sa"], opens: "10:00", closes: "14:00" },
  ],
  /** Texto visible del horario. */
  hoursLabel: "Lunes a viernes, 9:30 a 20:30 · Sábados, 10:00 a 14:00",
  bookingLabel: tbc("Condiciones de cita"),
  services: [
    { title: tbc("Servicio"), description: tbc("Descripción") },
    { title: tbc("Servicio"), description: tbc("Descripción") },
    { title: tbc("Servicio"), description: tbc("Descripción") },
  ],
  bookingReasons: [tbc("Motivo de cita")],
  brands: [
    "Porsche Design",
    "Lindberg",
    "Tiwi",
    "Etnia Barcelona",
    "Ray-Ban",
    "Tom Ford",
    "Bottega Veneta",
    "Valentino",
    "Oakley",
    "Tous",
    "Carolina Herrera",
    "Police",
    "Boss",
    "Carrera",
    "Emporio Armani",
    "Hugo",
    "Michael Kors",
    "Marc Jacobs",
    "Vogue",
    "Ana Locking",
  ],
  email: {
    from: tbc("Remitente de emails"),
    notifyTo: tbc("Email de avisos de cita"),
  },
  nav: [
    { id: "marcas", label: "Marcas" },
    { id: "servicios", label: "Servicios" },
    { id: "reservar", label: "Reservar cita" },
    { id: "visitanos", label: "Visítanos" },
  ] satisfies NavItem[],
  legalPages: [
    { href: "/aviso-legal", label: "Aviso legal" },
    { href: "/privacidad", label: "Privacidad" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export type Site = typeof site;
