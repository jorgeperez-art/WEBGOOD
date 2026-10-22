import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { Button } from "@/components/ui/Button";
import { FocalPoint } from "@/components/ui/FocalPoint";
import { Tbc } from "@/components/ui/Tbc";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8 md:pb-24 md:pt-16">
        <div className="order-2 md:order-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cobre">{site.brand.claim}</p>
          <h1
            id="inicio-titulo"
            className="mt-6 max-w-xl text-4xl font-extralight leading-[1.12] tracking-tight text-balance md:text-[3.4rem]"
          >
            Escuchar antes de recomendar. Analizar antes de prescribir.
          </h1>
          <p className="mt-6 max-w-md text-acero">
            Una óptica actual y técnicamente sólida, con un trato cálido, cercano y honesto.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/#reservar">Reservar cita</Button>
            <Button href="/#visitanos" variant="line">
              Visítanos
            </Button>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          {/* Arco: la forma de los expositores de la tienda. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-arena/40">
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover object-[58%_50%]"
            />
          </div>
          <FocalPoint className="absolute -bottom-10 -left-4 w-32 md:-left-12 md:w-44" />
        </div>
      </div>

      <dl className="border-y border-linea bg-papel">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 text-sm sm:grid-cols-3 md:px-8">
          {[
            ["Ubicación", site.contact.address.street],
            ["Horario", site.hoursLabel],
            ["Citas", site.bookingLabel],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-wrap gap-x-3">
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-tinta">{label}</dt>
              <dd>
                <Tbc value={value} />
              </dd>
            </div>
          ))}
        </div>
      </dl>
    </section>
  );
}
