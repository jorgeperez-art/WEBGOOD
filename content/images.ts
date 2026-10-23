/**
 * Imágenes de la web. Ahora son renders del proyecto de interiorismo;
 * cuando haya fotos reales de la tienda se sustituyen aquí (mismo nombre o nueva importación).
 */
import lenteLogo from "@/public/images/lente-logo.webp";
import mesas from "@/public/images/tienda-mesas.webp";
import butacas from "@/public/images/tienda-butacas.webp";
import expositor from "@/public/images/tienda-expositor.webp";
import mostrador from "@/public/images/tienda-mostrador.webp";
import celosia from "@/public/images/tienda-celosia.webp";
import arco from "@/public/images/tienda-arco.webp";
import pasillo from "@/public/images/tienda-pasillo.webp";
import baldas from "@/public/images/tienda-baldas.webp";

export const images = {
  hero: { src: mesas, alt: "Mesas de atención con sillas tapizadas bajo un techo terracota" },
  /** Foto de marca con el logotipo: debe verse entero, así que se encuadra centrada. */
  lensLogo: { src: lenteLogo, alt: "goodview, Centro óptico" },
  services: { src: butacas, alt: "Zona de espera con butacas junto al escaparate" },
  booking: { src: mostrador, alt: "Mostrador curvo de madera clara y mesa de atención" },
  visit: { src: expositor, alt: "Pared de baldas con monturas y suelo de madera clara" },
  gallery: [
    { src: celosia, alt: "Celosía de madera de roble y pasillo con expositores de monturas" },
    { src: arco, alt: "Expositores iluminados y espejo en arco" },
    { src: mesas, alt: "Mesas de atención con plantas colgantes" },
    { src: pasillo, alt: "Pasillo con expositores de monturas a ambos lados y escaparate" },
    { src: baldas, alt: "Pared de expositores con baldas de madera y celosía" },
    { src: butacas, alt: "Rincón de espera con butacas y mesa auxiliar" },
  ],
  about: { src: celosia, alt: "Celosía de roble junto a la zona de atención" },
  /** Una foto por grupo de servicios (clave: slug de site.services). */
  serviceGroups: {
    "examenes-salud-visual": { src: mesas, alt: "Mesas de atención bajo un techo terracota" },
    "gafas-y-lentes": { src: baldas, alt: "Pared de expositores con monturas" },
    "lentes-de-contacto": { src: mostrador, alt: "Mostrador curvo de madera clara" },
    "terapia-visual-infancia": { src: butacas, alt: "Rincón de espera con butacas" },
    taller: { src: celosia, alt: "Celosía de roble y expositores de monturas" },
  } as Record<string, { src: typeof mesas; alt: string }>,
  /** Fotos de los consejos (clave: image de content/articles.ts). */
  articles: {
    fatiga: { src: lenteLogo, alt: "goodview, Centro óptico" },
    miopia: { src: butacas, alt: "" },
    progresivas: { src: mesas, alt: "" },
  } as Record<string, { src: typeof mesas; alt: string }>,
  /** Mientras sean renders, se indica en la galería. */
  areRenders: true,
};
