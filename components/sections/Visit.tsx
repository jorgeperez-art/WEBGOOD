import Image from "next/image";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { Button } from "@/components/ui/Button";
import { Tbc } from "@/components/ui/Tbc";

export function Visit() {
  const { address, phone, whatsapp, email, mapsUrl } = site.contact;
  const rows: [string, string][] = [
    ["Dirección", `${address.street}, ${address.postalCode} ${address.city}`],
    ["Horario", site.hoursLabel],
    ["Teléfono", phone],
    ["WhatsApp", whatsapp],
    ["Email", email],
  ];

  return (
    <section id="visitanos" aria-labelledby="visitanos-titulo" className="border-t border-linea bg-papel">
      <div className="relative h-[18rem] overflow-hidden md:h-[30rem]">
        <Image
          src={images.visit.src}
          alt={images.visit.alt}
          placeholder="blur"
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-24">
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">04</p>
          <h2 id="visitanos-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Visítanos
          </h2>
          <p className="mt-6 max-w-sm text-acero">Tenerife, {address.region}.</p>
          {mapsUrl ? (
            <Button href={mapsUrl} variant="line" className="mt-8" target="_blank" rel="noopener">
              Cómo llegar
            </Button>
          ) : (
            <p className="mt-8 text-sm">
              <Tbc value="[Enlace de Google Maps por confirmar]" />
            </p>
          )}
        </div>
        <dl className="border-t border-linea">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 border-b border-linea py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="text-xs font-medium uppercase tracking-[0.16em]">{label}</dt>
              <dd className="text-sm">
                <Tbc value={value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
