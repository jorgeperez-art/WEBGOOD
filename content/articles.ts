/**
 * Consejos de salud visual. Son textos divulgativos generales: no hablan de
 * precios, plazos ni servicios que no estén en site.ts.
 */

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  /** Clave de images.articles. */
  image: string;
  sections: { heading?: string; paragraphs?: string[]; list?: string[] }[];
  /** Grupo de servicios relacionado (slug de site.services). */
  service: string;
};

export const articles: Article[] = [
  {
    slug: "fatiga-visual-digital",
    title: "Fatiga visual digital: qué es y cómo aliviarla",
    excerpt:
      "Ojos secos, visión borrosa o dolor de cabeza después de un día de pantallas. Te contamos por qué pasa y qué puedes hacer.",
    image: "fatiga",
    service: "examenes-salud-visual",
    sections: [
      {
        paragraphs: [
          "Cuando miramos una pantalla de cerca durante mucho tiempo, los músculos que enfocan trabajan sin descanso y parpadeamos menos de lo habitual. Al final del día aparecen los síntomas: ojos secos o irritados, visión borrosa al mirar lejos, pesadez y dolor de cabeza, cuello u hombros.",
        ],
      },
      {
        heading: "Pequeños gestos que ayudan",
        list: [
          "Regla 20-20-20: cada 20 minutos, mira algo a unos 6 metros durante 20 segundos.",
          "Parpadea a propósito de vez en cuando, sobre todo si notas los ojos secos.",
          "Coloca la pantalla a un brazo de distancia y con la parte de arriba a la altura de los ojos o un poco por debajo.",
          "Evita reflejos: la pantalla no debería estar frente a una ventana ni de espaldas a ella.",
          "Ajusta el brillo de la pantalla al de la habitación.",
        ],
      },
      {
        heading: "Cuándo conviene revisar la vista",
        paragraphs: [
          "Si los síntomas se repiten aunque cuides estos hábitos, puede haber una graduación sin corregir o una dificultad en cómo trabajan los dos ojos juntos. Una revisión lo aclara, y existen lentes pensadas para el trabajo con pantallas.",
        ],
      },
    ],
  },
  {
    slug: "miopia-infantil",
    title: "Miopía infantil: señales para estar atentos",
    excerpt:
      "Muchos niños no dicen que ven mal porque creen que todo el mundo ve así. Estas son las señales que pueden darte una pista.",
    image: "miopia",
    service: "terapia-visual-infancia",
    sections: [
      {
        paragraphs: [
          "La miopía hace que los objetos lejanos se vean borrosos. Suele aparecer en la infancia y puede aumentar mientras el niño crece, por eso conviene detectarla pronto y vigilar su evolución.",
        ],
      },
      {
        heading: "Señales frecuentes",
        list: [
          "Entrecierra los ojos para ver la pizarra o la televisión.",
          "Se acerca mucho a las pantallas o a los libros.",
          "Se queja de dolor de cabeza o se frota los ojos a menudo.",
          "Pierde la atención en clase o evita actividades en las que hay que mirar lejos.",
        ],
      },
      {
        heading: "Hábitos que ayudan",
        list: [
          "Pasar tiempo al aire libre cada día.",
          "Hacer pausas durante la lectura y el uso de pantallas.",
          "Mantener una distancia cómoda al leer y buena luz en la habitación.",
        ],
      },
      {
        heading: "La revisión, mejor sin esperar a que se queje",
        paragraphs: [
          "Un examen visual infantil permite saber cómo ve tu hijo y, si hay miopía, valorar opciones de control y hacer un seguimiento de su evolución.",
        ],
      },
    ],
  },
  {
    slug: "acostumbrarse-a-las-progresivas",
    title: "Cómo acostumbrarte a tus gafas progresivas",
    excerpt:
      "Las progresivas te dejan ver de lejos, a media distancia y de cerca con las mismas gafas. Los primeros días son de adaptación; así se llevan mejor.",
    image: "progresivas",
    service: "gafas-y-lentes",
    sections: [
      {
        paragraphs: [
          "Una lente progresiva cambia de graduación de arriba abajo: la parte superior es para lejos, la central para media distancia y la inferior para leer. Al principio el cerebro tiene que aprender a usar cada zona, y es normal notar una sensación extraña al mover la cabeza o al bajar escaleras.",
        ],
      },
      {
        heading: "Consejos para los primeros días",
        list: [
          "Llévalas puestas todo el día desde el principio, sin alternar con las gafas antiguas.",
          "Gira la cabeza hacia lo que quieres mirar, en lugar de mover solo los ojos.",
          "Para leer, baja la mirada, no la cabeza.",
          "En escaleras y bordillos, inclina un poco la cabeza para mirar por la zona de lejos.",
        ],
      },
      {
        heading: "Si no terminas de adaptarte",
        paragraphs: [
          "Una buena adaptación depende de la graduación, de la lente y de cómo está ajustada la montura a tu cara. Si pasados unos días sigues sin ver cómodo, vuelve a la óptica: muchas veces basta con un ajuste.",
        ],
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
