"use client";

import { useActionState, useState, useTransition } from "react";
import { createAppointmentAction, getSlotsAction, type BookingState } from "@/app/actions/booking";
import { isTbc, site } from "@/content/site";
import { TIME_ZONE, canaryDate, weekdayOf } from "@/lib/booking/time";
import type { Slot } from "@/lib/booking/types";

const STEPS = ["Motivo", "Día y hora", "Tus datos", "Confirmación"] as const;
const dayIndex: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };
const openWeekdays = new Set(site.openingHours.flatMap((h) => h.days.map((d) => dayIndex[d])));

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-ES", { timeZone: TIME_ZONE, ...opts });
const dayLabel = fmt({ weekday: "short", day: "numeric", month: "short" });
const timeLabel = fmt({ hour: "2-digit", minute: "2-digit" });
const longLabel = fmt({ weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const noon = (ymd: string) => new Date(`${ymd}T12:00:00Z`);

const chip =
  "rounded-full border px-4 py-2.5 text-sm transition-colors duration-200 aria-pressed:border-cobre aria-pressed:bg-cobre aria-pressed:text-papel";
const input =
  "mt-2 w-full rounded-2xl border border-linea bg-papel px-4 py-3 text-base text-tinta outline-none transition-colors focus:border-cobre";

export function Wizard() {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsError, setSlotsError] = useState("");
  const [loadingSlots, startLoading] = useTransition();

  // Días abiertos dentro del margen de reserva, en hora de Canarias. Se calculan al pasar
  // al paso 2 (no al renderizar), para no fijar "hoy" en la página prerenderizada.
  const [days, setDays] = useState<string[]>([]);
  const goToDays = () => {
    const now = new Date();
    setDays(
      Array.from({ length: site.booking.daysAhead + 1 }, (_, i) => canaryDate(now, i)).filter((d) =>
        openWeekdays.has(weekdayOf(d)),
      ),
    );
    setStep(1);
  };

  const loadSlots = (d: string) => {
    setDate(d);
    setSlot(null);
    setSlotsError("");
    startLoading(async () => {
      const res = await getSlotsAction(d);
      setSlots(res.ok ? res.slots : []);
      if (!res.ok) setSlotsError(res.error);
    });
  };

  const [state, formAction, sending] = useActionState<BookingState, FormData>(
    async (prev, formData) => {
      const result = await createAppointmentAction(prev, formData);
      // Si la hora se ha ocupado mientras tanto, volvemos a elegirla con las franjas al día.
      if (result.status === "error" && result.errors.startsAt) {
        setStep(1);
        loadSlots(date);
      }
      return result;
    },
    { status: "idle" },
  );

  const errors = state.status === "error" ? state.errors : {};
  const current = state.status === "ok" ? 3 : step;

  return (
    <div className="rounded-foto border border-linea bg-papel p-6 md:p-8">
      <ol className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Pasos de la reserva">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className={`flex items-center gap-2 text-xs uppercase tracking-[0.14em] ${i === current ? "text-tinta" : "text-acero"}`}
          >
            <span className={`tabular-nums ${i <= current ? "text-cobre" : ""}`}>{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="mt-6 h-px bg-linea" aria-hidden="true">
        <div className="h-px bg-cobre transition-all duration-500 ease-suave" style={{ width: `${(current / 3) * 100}%` }} />
      </div>

      {current === 0 && (
        <fieldset className="mt-8 min-w-0">
          <legend className="text-lg font-normal">¿Para qué quieres la cita?</legend>
          <div className="mt-5 flex flex-wrap gap-2">
            {site.bookingReasons.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={reason === r}
                onClick={() => setReason(r)}
                className={`${chip} border-linea ${isTbc(r) ? "italic text-acero" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
          <Nav next={goToDays} canNext={!!reason} />
        </fieldset>
      )}

      {current === 1 && (
        <fieldset className="mt-8 min-w-0">
          <legend className="text-lg font-normal">Elige día y hora</legend>
          <div className="-mx-6 mt-5 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:thin] md:-mx-8 md:px-8">
            {days.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={date === d}
                onClick={() => loadSlots(d)}
                className={`${chip} shrink-0 border-linea capitalize`}
              >
                {dayLabel.format(noon(d))}
              </button>
            ))}
          </div>

          <div className="mt-6 min-h-24" aria-live="polite">
            {!date && <p className="text-sm text-acero">Elige un día para ver las horas libres.</p>}
            {date && loadingSlots && <p className="text-sm text-acero">Buscando horas libres…</p>}
            {date && !loadingSlots && slotsError && <p className="text-sm text-cobre">{slotsError}</p>}
            {date && !loadingSlots && slots?.length === 0 && !slotsError && (
              <p className="text-sm text-acero">No quedan horas libres ese día. Prueba con otro.</p>
            )}
            {date && !loadingSlots && !!slots?.length && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((s) => (
                  <button
                    key={s.startsAt}
                    type="button"
                    aria-pressed={slot?.startsAt === s.startsAt}
                    onClick={() => setSlot(s)}
                    className={`${chip} border-linea tabular-nums`}
                  >
                    {timeLabel.format(new Date(s.startsAt))}
                  </button>
                ))}
              </div>
            )}
            {errors.startsAt && <p className="mt-3 text-sm text-cobre">{errors.startsAt}</p>}
          </div>
          <Nav back={() => setStep(0)} next={() => setStep(2)} canNext={!!slot} />
        </fieldset>
      )}

      {current === 2 && slot && (
        <form action={formAction} className="mt-8" noValidate>
          <p className="text-lg font-normal">Tus datos</p>
          <p className="mt-1 text-sm text-acero first-letter:uppercase">
            {longLabel.format(new Date(slot.startsAt))} · {reason}
          </p>

          <input type="hidden" name="reason" value={reason} />
          <input type="hidden" name="startsAt" value={slot.startsAt} />
          <input type="hidden" name="endsAt" value={slot.endsAt} />
          {/* Honeypot: invisible para personas, los bots lo rellenan. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field id="cita-nombre" label="Nombre" error={errors.name}>
              <input id="cita-nombre" name="name" autoComplete="name" required className={input} />
            </Field>
            <Field id="cita-telefono" label="Teléfono" error={errors.phone}>
              <input id="cita-telefono" name="phone" type="tel" autoComplete="tel" required className={input} />
            </Field>
            <Field id="cita-email" label="Email" error={errors.email} className="sm:col-span-2">
              <input id="cita-email" name="email" type="email" autoComplete="email" required className={input} />
            </Field>
            <Field id="cita-comentario" label="Comentario (opcional)" error={errors.notes} className="sm:col-span-2">
              <textarea id="cita-comentario" name="notes" rows={3} maxLength={1000} className={input} />
            </Field>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-acero">
            <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-cobre" />
            <span>
              He leído la{" "}
              <a href="/privacidad" className="text-tinta underline decoration-arena underline-offset-4">
                política de privacidad
              </a>{" "}
              y acepto que {site.legal.name} use mis datos para gestionar la cita.
            </span>
          </label>
          {errors.consent && <p className="mt-2 text-sm text-cobre">{errors.consent}</p>}
          {errors.form && (
            <p role="alert" className="mt-4 text-sm text-cobre">
              {errors.form}
            </p>
          )}

          <Nav back={() => setStep(1)} submit sending={sending} />
        </form>
      )}

      {state.status === "ok" && (
        <div className="mt-8" role="status">
          <p className="text-2xl font-extralight">Solicitud recibida{state.name ? `, ${state.name}` : ""}.</p>
          <p className="mt-3 text-acero first-letter:uppercase">
            {longLabel.format(new Date(state.startsAt))}
            {state.reason ? ` · ${state.reason}` : ""}
          </p>
          <p className="mt-6 max-w-md text-sm text-acero">
            {state.emailed && "Te hemos enviado un email con los detalles. "}
            Te escribiremos para confirmar la cita. Si necesitas cambiarla, llámanos al {site.contact.phone}.
          </p>
        </div>
      )}
    </div>
  );
}

function Nav({
  back,
  next,
  canNext = true,
  submit,
  sending,
}: {
  back?: () => void;
  next?: () => void;
  canNext?: boolean;
  submit?: boolean;
  sending?: boolean;
}) {
  const primary =
    "rounded-full bg-cobre px-7 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-papel transition-colors hover:bg-tinta disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {back ? (
        <button type="button" onClick={back} className="text-sm uppercase tracking-[0.14em] text-acero hover:text-tinta">
          Atrás
        </button>
      ) : (
        <span />
      )}
      {submit ? (
        <button type="submit" disabled={sending} className={primary}>
          {sending ? "Enviando…" : "Reservar cita"}
        </button>
      ) : (
        <button type="button" onClick={next} disabled={!canNext} className={primary}>
          Siguiente
        </button>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.14em]">
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-sm text-cobre">{error}</p>}
    </div>
  );
}
