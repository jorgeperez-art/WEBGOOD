/** Monturas dibujadas a línea. Cada marca toma una forma por turno. */
const lens = {
  redonda: <circle cx="50" cy="40" r="27" />,
  rectangular: <rect x="20" y="20" width="62" height="40" rx="9" />,
  gatita: <path d="M20 32 Q20 18 48 19 Q80 19 84 26 Q85 58 52 60 Q22 61 20 32Z" />,
  piloto: <path d="M19 25 Q20 18 50 18 Q82 18 82 29 Q80 63 50 62 Q21 61 19 25Z" />,
};

export type FrameShape = keyof typeof lens;
export const frameShapes = Object.keys(lens) as FrameShape[];

export function FrameIcon({ shape, className = "" }: { shape: FrameShape; className?: string }) {
  const bridge = shape === "piloto" ? "M82 27 Q100 20 118 27 M84 21 L116 21" : "M78 36 Q100 26 122 36";
  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {lens[shape]}
        <g transform="translate(200 0) scale(-1 1)">{lens[shape]}</g>
        <path d={bridge} />
        <path d="M22 30 L4 26 M178 30 L196 26" />
      </g>
    </svg>
  );
}
