import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { Tbc } from "@/components/ui/Tbc";

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="border-t border-linea bg-papel">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-8 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-full md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          <Image
            src={images.services.src}
            alt={images.services.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">02</p>
          <h2 id="servicios-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Servicios
          </h2>
          <ol className="mt-10 border-t border-linea">
            {site.services.map((service, i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-linea py-7">
                <span className="text-sm font-medium tabular-nums text-cobre">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-normal">
                    <Tbc value={service.title} />
                  </h3>
                  <p className="mt-2 text-sm text-acero">
                    <Tbc value={service.description} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
