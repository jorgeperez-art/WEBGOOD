import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Section } from "@/components/ui/Section";
import { Tbc } from "@/components/ui/Tbc";

// Fase 1 (base): estructura de la home con sus anclajes. Cada sección se completa en su fase.
export default function Home() {
  return (
    <>
      <section id="inicio" aria-labelledby="inicio-titulo">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-32">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cobre">{site.brand.claim}</p>
            <h1 id="inicio-titulo" className="mt-6 max-w-xl text-4xl font-extralight leading-[1.15] tracking-tight md:text-5xl">
              Escuchar antes de recomendar. Analizar antes de prescribir.
            </h1>
            <p className="mt-6 max-w-md text-acero">
              Una óptica actual y técnicamente sólida, con un trato cálido, cercano y honesto.
            </p>
            <Button href="/#reservar" className="mt-10">
              Reservar cita
            </Button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-linea" />
            <div className="absolute inset-[12%] rounded-full border border-linea" />
            <div className="absolute inset-[24%] rounded-full border border-arena/60" />
            <Logo variant="isotipo" title="" className="absolute inset-[36%] text-cobre" />
          </div>
        </div>
        <dl className="border-t border-linea bg-papel">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 text-sm sm:grid-cols-3 md:px-8">
            {[
              ["Ubicación", site.contact.address.street],
              ["Horario", site.hoursLabel],
              ["Citas", site.bookingLabel],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-tinta">{label}</dt>
                <dd>
                  <Tbc value={value} />
                </dd>
              </div>
            ))}
          </div>
        </dl>
      </section>

      <Section id="marcas" number="01" title="Marcas">
        <p className="text-acero">Bandeja de marcas: fase 2.</p>
      </Section>
      <Section id="servicios" number="02" title="Servicios" className="bg-papel">
        <p className="text-acero">Lista de servicios: fase 3.</p>
      </Section>
      <Section id="reservar" number="03" title="Reservar cita">
        <p className="text-acero">Asistente de reserva en 4 pasos: fase 4.</p>
      </Section>
      <Section id="visitanos" number="04" title="Visítanos" className="bg-papel">
        <p className="text-acero">Mapa, dirección y contacto: fase 3.</p>
      </Section>
    </>
  );
}
