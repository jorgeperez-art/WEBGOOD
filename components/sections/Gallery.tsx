import Image from "next/image";
import { images } from "@/content/images";

/** Galería de la tienda en mosaico: una imagen grande, dos a su lado y una fila de tres. */
export function Gallery() {
  const [main, ...rest] = images.gallery;
  return (
    <section aria-labelledby="tienda-titulo" className="bg-niebla">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8 md:pb-28 md:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="tienda-titulo" className="max-w-md text-3xl font-extralight tracking-tight text-balance md:text-4xl">
            Un espacio pensado para que los ojos se relajen
          </h2>
          {images.areRenders && (
            <p className="text-xs uppercase tracking-[0.16em] text-acero">Imágenes del proyecto de interiorismo</p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <figure className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-foto md:row-span-2 md:aspect-auto">
            <Image
              src={main.src}
              alt={main.alt}
              placeholder="blur"
              sizes="(min-width: 768px) 66vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-suave hover:scale-[1.03]"
            />
          </figure>
          {rest.map((img, i) => (
            <figure key={img.alt} className={`relative aspect-[4/3] overflow-hidden rounded-foto-sm md:rounded-foto ${i === rest.length - 1 ? "col-span-2 md:col-span-1" : ""}`}>
              <Image
                src={img.src}
                alt={img.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-suave hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
