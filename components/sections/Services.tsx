import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { Button } from "@/components/ui/Button";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="border-t border-linea bg-papel">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-8 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-arco md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
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
          <ol className="mt-10 space-y-12">
            {site.services.map((group, i) => (
              <li key={group.title}>
                <h3 className="flex items-baseline gap-4 border-b border-linea pb-4 text-xl font-light">
                  <span className="text-sm font-medium tabular-nums text-cobre">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/servicios/${group.slug}`} className="group flex flex-1 items-baseline justify-between gap-4 hover:text-cobre">
                    {group.title}
                    <span aria-hidden="true" className="text-sm text-cobre transition-transform duration-300 ease-suave group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </h3>
                <ul className="grid sm:grid-cols-2 sm:gap-x-8">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-linea py-3.5 text-[0.95rem]">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <Button href="/#reservar" className="mt-12">
            Reservar cita
          </Button>
          <QuizTeaser className="mt-16" />
        </div>
      </div>
    </section>
  );
}
