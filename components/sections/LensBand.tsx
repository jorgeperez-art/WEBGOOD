import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";

/** Franja con la foto de la lente terracota y el claim. */
export function LensBand() {
  return (
    <section aria-label={site.brand.claim} className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
      <div className="relative isolate overflow-hidden rounded-foto">
        <Image
          src={images.lens.src}
          alt={images.lens.alt}
          placeholder="blur"
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-tinta/45 via-tinta/10 to-transparent" />
        <div className="px-7 py-24 md:px-16 md:py-36">
          <p className="max-w-lg text-3xl font-extralight leading-snug text-niebla text-balance md:text-5xl">
            {site.brand.claim}.
          </p>
          <p className="mt-6 max-w-sm text-niebla/90">
            En óptica, el punto focal es donde la luz converge y la imagen se vuelve nítida.
          </p>
        </div>
      </div>
    </section>
  );
}
