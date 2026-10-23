import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";

/** Foto de marca de la lente con el logotipo centrado, y el claim debajo para no tapar el logo. */
export function LensBand() {
  return (
    <section aria-label={site.brand.claim} className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
      <div className="relative aspect-[4/3] overflow-hidden rounded-foto md:aspect-[21/9]">
        <Image
          src={images.lensLogo.src}
          alt={images.lensLogo.alt}
          placeholder="blur"
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-end">
        <p className="text-3xl font-extralight leading-snug text-balance md:text-5xl">{site.brand.claim}.</p>
        <p className="max-w-sm text-acero md:justify-self-end">
          En óptica, el punto focal es donde la luz converge y la imagen se vuelve nítida.
        </p>
      </div>
    </section>
  );
}
