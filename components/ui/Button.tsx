import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { variant?: "solid" | "line" };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ease-suave";

const styles = {
  solid: "bg-cobre text-papel hover:bg-tinta",
  line: "border border-cobre text-cobre hover:bg-cobre hover:text-papel",
};

export function Button({ variant = "solid", className = "", ...props }: Props) {
  return <Link className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
