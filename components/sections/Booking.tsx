import Image from "next/image";
import { images } from "@/content/images";

const steps = ["Motivo", "Día y hora", "Tus datos", "Confirmación"];

// El asistente real (Supabase, validación y emails) llega en la fase de reserva.
export function Booking() {
  return (
    <section id="reservar" aria-labelledby="reservar-titulo">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-8 md:py-28">
        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">03</p>
          <h2 id="reservar-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Reservar cita
          </h2>
          <p className="mt-6 max-w-md text-acero">Elige el motivo, el día y la hora. Te confirmamos la cita por email.</p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-4 rounded-full border border-linea bg-papel px-5 py-4">
                <span className="text-sm font-medium tabular-nums text-cobre">{i + 1}</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-acero">Asistente de reserva en construcción</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-foto md:aspect-auto md:min-h-[28rem]">
          <Image
            src={images.booking.src}
            alt={images.booking.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
