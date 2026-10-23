import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";

/** Foto de marca de la lente entera, sin recortar, con el claim al lado. */
export function LensBand() {
  return (
    <section
      aria-label={site.brand.claim}
      className="mx-auto grid max-w-7xl gap-10 px-5 pt-16 md:grid-cols-2 md:items-center md:gap-20 md:px-8 md:pt-24"
    >
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-foto md:max-w-none">
        <Image
          src={images.lensLogo.src}
          alt={images.lensLogo.alt}
          placeholder="blur"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="text-3xl font-extralight leading-snug text-balance md:text-5xl">{site.brand.claim}.</p>
        <p className="mt-6 max-w-sm text-acero">
          En óptica, el punto focal es donde la luz converge y la imagen se vuelve nítida.
        </p>
      </div>
    </section>
  );
}
