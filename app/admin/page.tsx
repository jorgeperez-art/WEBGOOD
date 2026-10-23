import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin/session";
import { canaryDate, canaryToUtc, TIME_ZONE } from "@/lib/booking/time";
import { logoutAction, removeBlockAction, setStatusAction } from "./actions";
import { BlockForm } from "@/components/admin/BlockForm";

const DAYS = 14;

const dayLabel = new Intl.DateTimeFormat("es-ES", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" });
const timeLabel = new Intl.DateTimeFormat("es-ES", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });

const statusText = { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" } as const;
type Status = keyof typeof statusText;

type Appointment = {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: Status;
};

const smallBtn = "rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-acero">Cargando citas…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const session = await requireStaff();
  const today = canaryDate(new Date());
  const from = canaryToUtc(today, "00:00").toISOString();
  const to = canaryToUtc(canaryDate(new Date(), DAYS), "00:00").toISOString();
  const db = supabaseAdmin();

  const [appts, blocks] = await Promise.all([
    db
      .from("appointments")
      .select("id, starts_at, ends_at, reason, name, phone, email, notes, status")
      .gte("starts_at", from)
      .lt("starts_at", to)
      .order("starts_at"),
    db.from("blocked_slots").select("id, starts_at, ends_at, reason").gte("ends_at", from).order("starts_at"),
  ]);
  if (appts.error) throw appts.error;
  if (blocks.error) throw blocks.error;

  const byDay = new Map<string, Appointment[]>();
  for (const a of (appts.data ?? []) as Appointment[]) {
    const day = canaryDate(new Date(a.starts_at));
    byDay.set(day, [...(byDay.get(day) ?? []), a]);
  }
  const active = (appts.data ?? []).filter((a) => a.status !== "cancelled").length;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-linea pb-6">
        <div>
          <h1 className="text-3xl font-extralight tracking-tight md:text-4xl">Citas</h1>
          <p className="mt-2 text-sm text-acero">
            Próximos {DAYS} días · {active} {active === 1 ? "cita activa" : "citas activas"}
          </p>
        </div>
        <form action={logoutAction} className="flex items-center gap-4 text-sm text-acero">
          <span>{session.email}</span>
          <button type="submit" className="text-xs font-medium uppercase tracking-[0.14em] hover:text-cobre">
            Salir
          </button>
        </form>
      </header>

      {byDay.size === 0 && <p className="mt-10 text-acero">No hay citas en los próximos {DAYS} días.</p>}

      <div className="mt-10 space-y-12">
        {[...byDay.entries()].map(([day, list]) => (
          <section key={day} aria-label={dayLabel.format(new Date(`${day}T12:00:00Z`))}>
            <h2 className="text-lg font-light first-letter:uppercase">
              {dayLabel.format(new Date(`${day}T12:00:00Z`))}
              {day === today && <span className="ml-3 text-xs font-medium uppercase tracking-[0.14em] text-cobre">Hoy</span>}
            </h2>
            <ul className="mt-4 divide-y divide-linea rounded-foto-sm border border-linea bg-papel">
              {list.map((a) => (
                <li key={a.id} className={`grid gap-3 p-5 md:grid-cols-[6rem_1fr_auto] md:items-start ${a.status === "cancelled" ? "opacity-50" : ""}`}>
                  <p className="text-lg tabular-nums">{timeLabel.format(new Date(a.starts_at))}</p>
                  <div className="min-w-0">
                    <p className="font-normal">
                      {a.name} <span className="text-acero">· {a.reason}</span>
                    </p>
                    <p className="mt-1 text-sm text-acero">
                      <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="hover:text-cobre">{a.phone}</a>
                      {" · "}
                      <a href={`mailto:${a.email}`} className="break-all hover:text-cobre">{a.email}</a>
                    </p>
                    {a.notes && <p className="mt-2 text-sm">“{a.notes}”</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <span className="mr-2 text-xs font-medium uppercase tracking-[0.12em] text-acero">{statusText[a.status]}</span>
                    {a.status !== "confirmed" && a.status !== "cancelled" && (
                      <form action={setStatusAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="confirmed" />
                        <button className={`${smallBtn} border-cobre bg-cobre text-papel hover:bg-tinta`}>Confirmar</button>
                      </form>
                    )}
                    {a.status !== "cancelled" ? (
                      <form action={setStatusAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="cancelled" />
                        <button className={`${smallBtn} border-linea hover:border-cobre hover:text-cobre`}>Cancelar</button>
                      </form>
                    ) : (
                      <form action={setStatusAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="pending" />
                        <button className={`${smallBtn} border-linea hover:border-cobre hover:text-cobre`}>Recuperar</button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section aria-labelledby="bloqueos" className="mt-16 border-t border-linea pt-10">
        <h2 id="bloqueos" className="text-2xl font-extralight">Bloquear huecos</h2>
        <p className="mt-2 text-sm text-acero">Las horas bloqueadas no se pueden reservar en la web.</p>
        <div className="mt-6">
          <BlockForm today={today} />
        </div>
        {(blocks.data ?? []).length > 0 && (
          <ul className="mt-8 divide-y divide-linea border-y border-linea">
            {(blocks.data ?? []).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span className="first-letter:uppercase">
                  {dayLabel.format(new Date(b.starts_at))}, {timeLabel.format(new Date(b.starts_at))}–
                  {timeLabel.format(new Date(b.ends_at))}
                  {b.reason && <span className="text-acero"> · {b.reason}</span>}
                </span>
                <form action={removeBlockAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="text-xs font-medium uppercase tracking-[0.14em] text-acero hover:text-cobre">Quitar</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
