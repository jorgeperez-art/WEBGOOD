import type { ReactNode } from "react";

type Props = {
  id: string;
  number: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

/** Contenedor de sección con numeración en cobre y título ligero. */
export function Section({ id, number, title, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={`border-t border-linea ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-cobre">{number}</p>
        <h2 id={`${id}-titulo`} className="text-3xl font-extralight tracking-tight md:text-4xl">
          {title}
        </h2>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
