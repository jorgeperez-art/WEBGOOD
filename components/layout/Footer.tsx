import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Tbc } from "@/components/ui/Tbc";

export function Footer() {
  return (
    <footer className="border-t border-linea bg-papel">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div className="space-y-5">
          <Logo className="h-10 w-auto text-cobre" />
          <p className="text-sm text-acero">
            {site.legal.name} · CIF <Tbc value={site.legal.cif} />
          </p>
        </div>
        <div className="space-y-4 md:text-right">
          <nav aria-label="Contenido">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-xs uppercase tracking-[0.14em] md:justify-end">
              {site.footerLinks.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="hover:text-cobre">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-xs uppercase tracking-[0.14em] text-acero md:justify-end">
              {site.legalPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="hover:text-cobre">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
