import { Logo } from "./Logo";

/** El punto focal en un círculo con anillos finos. Pasa de borroso a nítido una vez al cargar. */
export function FocalPoint({ className = "" }: { className?: string }) {
  return (
    <div className={`aspect-square ${className}`} aria-hidden="true">
      <div className="relative h-full w-full rounded-full bg-niebla shadow-[0_0_0_1px_var(--color-linea)]">
        <div className="absolute inset-[10%] rounded-full border border-linea" />
        <div className="absolute inset-[20%] rounded-full border border-arena/70" />
        <Logo variant="isotipo" title="" className="animate-enfoque absolute inset-[32%] text-cobre" />
      </div>
    </div>
  );
}
