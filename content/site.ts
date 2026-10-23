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
  /** Textos de "Quiénes somos", sacados del manual de marca. */
  about: {
    short:
      "goodview, centro óptico en Puerto de la Cruz, Tenerife. Rigor profesional y trato cercano para cuidar tu vista. Reserva tu cita online.",
    long: [
      "goodview es un centro óptico en Puerto de la Cruz que une rigor profesional y trato cercano.",
      "En un mundo de pantallas, prisas y estímulos, la vista es uno de nuestros sentidos más exigidos, y cuidarla es también una forma de bienestar.",
      "Por eso ponemos el foco en cada persona. Una óptica actual y técnicamente sólida, con una forma de trabajar cálida, cercana y honesta.",
    ],
    principles: ["Escuchamos antes de recomendar", "Analizamos antes de prescribir", "Acompañamos antes de vender"],
    team: tbc("Equipo y titulaciones"),
  },
  legal: {
    name: "Holding Of Business Goodviews S.L.",
    cif: "B93927137",
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
  /** Servicios confirmados, agrupados para la web. Cada grupo tiene su página en /servicios/[slug]. */
  services: [
    {
      slug: "examenes-salud-visual",
      title: "Exámenes y salud visual",
      intro:
        "Una revisión completa para saber cómo ves y cómo están tus ojos. Medimos tu graduación, comprobamos cómo trabajan los dos ojos juntos y te explicamos los resultados con calma.",
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
      slug: "gafas-y-lentes",
      title: "Gafas y lentes",
      intro:
        "Gafas pensadas para tu vista y para tu día a día: graduadas, progresivas, para pantallas o de sol. Te ayudamos a elegir montura y lentes según tu graduación, lo que haces cada día y tu estilo.",
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
      slug: "lentes-de-contacto",
      title: "Lentes de contacto",
      intro:
        "Adaptamos las lentes de contacto a tus ojos y a tu rutina, también multifocales, tóricas o para control de miopía. Antes estudiamos cómo las toleras.",
      items: [
        "Adaptación de lentes de contacto",
        "Lentillas multifocales",
        "Lentillas tóricas",
        "Lentillas para control de miopía",
        "Estudio de tolerancia a lentes de contacto",
      ],
    },
    {
      slug: "terapia-visual-infancia",
      title: "Terapia visual e infancia",
      intro:
        "La vista influye en cómo aprenden y juegan los niños. Revisamos su visión, seguimos su evolución, trabajamos el control de la miopía y preparamos terapia visual personalizada cuando hace falta.",
      items: [
        "Terapia visual personalizada",
        "Examen visual infantil",
        "Control de miopía infantil",
        "Evaluación de dificultades visuales en el aprendizaje",
        "Seguimiento de la evolución visual infantil",
      ],
    },
    {
      slug: "taller",
      title: "Taller",
      intro:
        "Montamos tus lentes, reparamos y ajustamos tus gafas y cambiamos los cristales graduados para que sigan como el primer día.",
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
    /** Confirmado por Jorge: se puede reservar hasta 15 días por adelantado. */
    daysAhead: 15,
    /** Provisional, por confirmar: antelación mínima para reservar. */
    minNoticeMinutes: 120,
    /** Confirmado por Jorge: citas de 30 minutos (modo demo; en Supabase va en opening_hours). */
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
  /** Enlaces del pie a las páginas de contenido. */
  footerLinks: [
    { href: "/consejos", label: "Consejos" },
    { href: "/test-fatiga-visual", label: "Test de fatiga visual" },
  ],
  legalPages: [
    { href: "/aviso-legal", label: "Aviso legal" },
    { href: "/privacidad", label: "Privacidad" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export type Site = typeof site;
export type ServiceGroup = Site["services"][number];

export const serviceBySlug = (slug: string) => site.services.find((g) => g.slug === slug);
