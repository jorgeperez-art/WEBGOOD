"use client";

import { useActionState } from "react";
import { addBlockAction, type BlockState } from "@/app/admin/actions";

const input =
  "mt-2 w-full rounded-2xl border border-linea bg-papel px-4 py-2.5 text-base text-tinta outline-none focus:border-cobre";
const label = "text-xs font-medium uppercase tracking-[0.14em]";

export function BlockForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState<BlockState, FormData>(addBlockAction, {});
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_1.5fr_auto] lg:items-end">
      <div>
        <label htmlFor="b-date" className={label}>Día</label>
        <input id="b-date" name="date" type="date" min={today} required className={input} />
      </div>
      <div>
        <label htmlFor="b-from" className={label}>Desde</label>
        <input id="b-from" name="from" type="time" step={1800} required className={input} />
      </div>
      <div>
        <label htmlFor="b-to" className={label}>Hasta</label>
        <input id="b-to" name="to" type="time" step={1800} required className={input} />
      </div>
      <div>
        <label htmlFor="b-reason" className={label}>Motivo (opcional)</label>
        <input id="b-reason" name="reason" type="text" maxLength={120} placeholder="Vacaciones, formación…" className={input} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-cobre px-6 py-2.5 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-cobre transition-colors hover:bg-cobre hover:text-papel disabled:opacity-60"
      >
        Bloquear
      </button>
      {state.error && <p role="alert" className="text-sm text-cobre sm:col-span-2 lg:col-span-5">{state.error}</p>}
      {state.ok && <p role="status" className="text-sm text-salvia sm:col-span-2 lg:col-span-5">Hueco bloqueado.</p>}
    </form>
  );
}
