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
    phone: "922 31 41 85",
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
  /** Servicios confirmados, agrupados para la web. */
  services: [
    {
      title: "Exámenes y salud visual",
      items: [
        "Graduación de la vista",
        "Revisión optométrica",
        "Examen visual",
        "Evaluación de la visión binocular",
        "Evaluación de la fatiga visual digital",
        "Asesoramiento en salud visual",
      ],
    },
    {
      title: "Gafas y lentes",
      items: [
        "Gafas graduadas personalizadas",
        "Gafas progresivas de última generación",
        "Lentes ocupacionales",
        "Lentes para pantallas y trabajo digital",
        "Gafas de sol graduadas",
        "Asesoramiento personalizado en monturas y lentes premium",
        "Asesoramiento estético",
      ],
    },
    {
      title: "Lentes de contacto",
      items: [
        "Adaptación de lentes de contacto",
        "Lentillas multifocales",
        "Lentillas tóricas",
        "Lentillas para control de miopía",
        "Estudio de tolerancia a lentes de contacto",
      ],
    },
    {
      title: "Terapia visual e infancia",
      items: [
        "Terapia visual personalizada",
        "Examen visual infantil",
        "Control de miopía infantil",
        "Evaluación de dificultades visuales en el aprendizaje",
        "Seguimiento de la evolución visual infantil",
      ],
    },
    {
      title: "Taller",
      items: [
        "Montaje de lentes oftálmicas",
        "Reparación de gafas",
        "Ajuste y mantenimiento de monturas",
        "Personalización de gafas",
        "Sustitución de lentes graduadas",
      ],
    },
  ],
  /** Motivos de cita: los grupos de servicios más una opción abierta. */
  bookingReasons: [
    "Examen visual y salud visual",
    "Gafas y lentes",
    "Lentes de contacto",
    "Terapia visual e infancia",
    "Taller: reparación y ajustes",
    "Otro motivo",
  ],
  booking: {
    /** Provisional, por confirmar: cuántos días se pueden reservar por adelantado y con cuánta antelación mínima. */
    daysAhead: 30,
    minNoticeMinutes: 120,
    /** Provisional, por confirmar: duración de cada cita si no hay tabla de horario (modo demo). */
    slotMinutes: 30,
  },
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
