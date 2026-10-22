import { horizontal, isotipo, monograma, vertical } from "./brand-paths";

const variants = { horizontal, vertical, isotipo, monograma };

type Props = {
  variant?: keyof typeof variants;
  /** Texto alternativo; vacío si el logo es decorativo. */
  title?: string;
  className?: string;
};

/**
 * Logo oficial. El color se hereda con `currentColor` (text-cobre, text-niebla
 * o text-tinta), las tres versiones que permite el manual.
 */
export function Logo({ variant = "horizontal", title = "goodview · Centro óptico", className }: Props) {
  const { viewBox, d } = variants[variant];
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={d} />
    </svg>
  );
}
