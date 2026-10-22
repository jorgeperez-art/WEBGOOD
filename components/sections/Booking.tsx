import Image from "next/image";
import { images } from "@/content/images";
import { Wizard } from "@/components/booking/Wizard";

export function Booking() {
  return (
    <section id="reservar" aria-labelledby="reservar-titulo">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:px-8 md:py-28">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">03</p>
          <h2 id="reservar-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Reservar cita
          </h2>
          <p className="mt-6 max-w-md text-acero">Elige el motivo, el día y la hora. Te confirmamos la cita por email.</p>
          <div className="mt-10">
            <Wizard />
          </div>
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
