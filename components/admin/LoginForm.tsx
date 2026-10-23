"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const input =
  "mt-2 w-full rounded-2xl border border-linea bg-papel px-4 py-3 text-base text-tinta outline-none transition-colors focus:border-cobre";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.14em]">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} key={state.email} className={input} />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.14em]">
          Contraseña
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-cobre">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-cobre px-7 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-papel transition-colors hover:bg-tinta disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
