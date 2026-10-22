"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { useActiveSection } from "@/lib/use-active-section";

const ids = site.nav.map((item) => item.id);

// "El optotipo": cada enlace un punto más pequeño, como las líneas de una carta de agudeza visual.
const sizes = ["text-[0.875rem]", "text-[0.8125rem]", "text-[0.75rem]", "text-[0.6875rem]"];

export function Header() {
  const isHome = usePathname() === "/";
  const active = useActiveSection(ids);

  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-linea bg-niebla/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-5 md:justify-between md:px-8">
        <Link href="/" aria-label="goodview, Centro óptico: inicio" className="text-cobre">
          <Logo title="" className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-baseline gap-9">
            {site.nav.map((item, i) => {
              const current = isHome && active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    aria-current={current ? "location" : undefined}
                    className={`${sizes[i]} relative pb-1 font-medium uppercase tracking-[0.18em] text-tinta transition-colors duration-300 hover:text-cobre after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-cobre after:transition-transform after:duration-500 after:ease-suave ${
                      current ? "after:scale-x-100" : "after:scale-x-0"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
