"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { FrameIcon, frameShapes } from "./FrameIcon";

/** Bandeja horizontal de marcas: flechas, arrastre con ratón, teclado y táctil (scroll nativo). */
export function BrandTray({ brands }: { brands: readonly string[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const step = () => (trackRef.current?.clientWidth ?? 600) * 0.8;
  const scrollBy = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    scrollBy(e.key === "ArrowRight" ? 1 : -1);
  };

  // El arrastre solo con ratón; en táctil manda el scroll nativo.
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    trackRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !trackRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => (drag.current = null);

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scrollBy(dir)}
            aria-label={dir === 1 ? "Ver más marcas" : "Ver marcas anteriores"}
            className="grid h-11 w-11 place-items-center rounded-full border border-linea text-tinta transition-colors hover:border-cobre hover:text-cobre"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        ))}
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        role="list"
        aria-label="Marcas disponibles. Usa las flechas del teclado para desplazarte."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="-mx-5 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] active:cursor-grabbing md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand, i) => (
          <li
            key={brand}
            className="group flex w-56 shrink-0 snap-start select-none flex-col justify-between gap-10 rounded-foto-sm border border-linea bg-papel p-6 transition-colors duration-300 hover:border-arena md:w-64"
          >
            <FrameIcon
              shape={frameShapes[i % frameShapes.length]}
              className="w-full text-tinta transition-colors duration-500 group-hover:text-cobre"
            />
            <span className="text-sm font-medium uppercase tracking-[0.14em]">{brand}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
