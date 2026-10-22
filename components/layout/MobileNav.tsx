"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { useActiveSection } from "@/lib/use-active-section";

const ids = site.nav.map((item) => item.id);

/** Barra de navegación fija abajo, solo en móvil. */
export function MobileNav() {
  const isHome = usePathname() === "/";
  const active = useActiveSection(ids);

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-papel pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-[var(--mobile-nav-h)] grid-cols-4">
        {site.nav.map((item) => {
          const current = isHome && active === item.id;
          const isBooking = item.id === "reservar";
          return (
            <li key={item.id} className="flex">
              <Link
                href={`/#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-1.5 text-center text-[0.625rem] font-medium uppercase leading-tight tracking-[0.12em] ${
                  isBooking ? "text-cobre" : "text-tinta"
                }`}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-px w-6 bg-cobre transition-opacity duration-300 ${current ? "opacity-100" : "opacity-0"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
