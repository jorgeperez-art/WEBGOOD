import { isTbc } from "@/content/site";

/**
 * Muestra un dato de site.ts. Si aún está "[… por confirmar]", lo marca de
 * forma visible para que no pase por un dato real.
 */
export function Tbc({ value, className = "" }: { value: string; className?: string }) {
  if (!isTbc(value)) return <span className={className}>{value}</span>;
  return (
    <span
      className={`${className} italic text-acero underline decoration-arena decoration-dotted underline-offset-4`}
    >
      {value}
    </span>
  );
}
