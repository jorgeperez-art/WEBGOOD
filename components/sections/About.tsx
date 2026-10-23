import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { Tbc } from "@/components/ui/Tbc";

export function About() {
  const { long, principles, team } = site.about;

  return (
    <section id="quienes-somos" aria-labelledby="quienes-somos-titulo" className="border-t border-linea bg-papel">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-20 md:px-8 md:py-28">
        <div>
          <h2 id="quienes-somos-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Quiénes somos
          </h2>
          <div className="mt-8 space-y-5 text-lg font-light leading-relaxed md:text-xl">
            {long.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="mt-12 border-t border-linea">
            {principles.map((principle, i) => (
              <li key={principle} className="flex items-baseline gap-4 border-b border-linea py-4">
                <span className="text-sm font-medium tabular-nums text-cobre">{String(i + 1).padStart(2, "0")}</span>
                {principle}.
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm">
            <Tbc value={team} />
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-arco">
          <Image
            src={images.about.src}
            alt={images.about.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="h-full w-full object-cover object-[30%_50%]"
          />
        </div>
      </div>
    </section>
  );
}
