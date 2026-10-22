import { site } from "@/content/site";
import { BrandTray } from "@/components/brands/BrandTray";

export function Brands() {
  return (
    <section id="marcas" aria-labelledby="marcas-titulo" className="border-t border-linea">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">01</p>
            <h2 id="marcas-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
              Marcas
            </h2>
          </div>
          <p className="max-w-md text-acero md:justify-self-end">
            {site.brands.length} firmas de monturas y gafas de sol, entre otras.
          </p>
        </div>
        <div className="mt-12">
          <BrandTray brands={site.brands} />
        </div>
      </div>
    </section>
  );
}
