import { site } from "@/content/site";
import { Tbc } from "@/components/ui/Tbc";

/** Plantilla de página legal. El texto definitivo lo debe redactar o revisar un profesional. */
export function LegalPage({ title }: { title: string }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <h1 className="text-3xl font-extralight tracking-tight md:text-4xl">{title}</h1>
      <dl className="mt-10 space-y-3 text-sm">
        <div className="flex gap-3">
          <dt className="text-acero">Titular:</dt>
          <dd>{site.legal.name}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-acero">CIF:</dt>
          <dd>
            <Tbc value={site.legal.cif} />
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-acero">Domicilio:</dt>
          <dd>
            <Tbc value={site.legal.registeredAddress} />
          </dd>
        </div>
      </dl>
      <p className="mt-10">
        <Tbc value={`[Texto de ${title.toLowerCase()} por confirmar]`} />
      </p>
    </article>
  );
}
