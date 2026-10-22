/**
 * Imágenes de la web. Ahora son renders del proyecto de interiorismo;
 * cuando haya fotos reales de la tienda se sustituyen aquí (mismo nombre o nueva importación).
 */
import lente from "@/public/images/lente.webp";
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
  lens: { src: lente, alt: "" },
  services: { src: butacas, alt: "Zona de espera con butacas junto al escaparate" },
  booking: { src: mostrador, alt: "Mostrador curvo de madera clara y mesa de atención" },
  visit: { src: arco, alt: "Expositores iluminados y espejo en arco" },
  gallery: [
    { src: celosia, alt: "Celosía de madera de roble y pasillo con expositores de monturas" },
    { src: expositor, alt: "Pared de baldas con monturas y suelo de madera clara" },
    { src: mesas, alt: "Mesas de atención con plantas colgantes" },
    { src: pasillo, alt: "Pasillo con expositores de monturas a ambos lados y escaparate" },
    { src: baldas, alt: "Pared de expositores con baldas de madera y celosía" },
    { src: butacas, alt: "Rincón de espera con butacas y mesa auxiliar" },
  ],
  /** Mientras sean renders, se indica en la galería. */
  areRenders: true,
};
