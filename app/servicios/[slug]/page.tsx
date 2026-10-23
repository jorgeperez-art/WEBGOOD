import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceBySlug, site } from "@/content/site";
import { images } from "@/content/images";
import { Button } from "@/components/ui/Button";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";

export function generateStaticParams() {
  return site.services.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const group = serviceBySlug((await params).slug);
  if (!group) return {};
  return {
    title: group.title,
    description: group.intro,
    alternates: { canonical: `/servicios/${group.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/servicios/[slug]">) {
  const group = serviceBySlug((await params).slug);
  if (!group) notFound();

  const index = site.services.indexOf(group);
  const image = images.serviceGroups[group.slug];
  const others = site.services.filter((g) => g !== group);

  return (
    <>
      <article className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:gap-20 md:px-8 md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-arco md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          <Image
            src={image.src}
            alt={image.alt}
            placeholder="blur"
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <Link
            href="/#servicios"
            className="text-xs font-medium uppercase tracking-[0.18em] text-acero hover:text-cobre"
          >
            ← Servicios
          </Link>
          <p className="mb-4 mt-10 text-xs font-medium tracking-[0.2em] text-cobre">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h1 className="text-4xl font-extralight tracking-tight text-balance md:text-5xl">{group.title}</h1>
          <p className="mt-8 text-lg font-light leading-relaxed md:text-xl">{group.intro}</p>
          <h2 className="mt-12 text-xs font-medium uppercase tracking-[0.18em]">Qué hacemos</h2>
          <ul className="mt-4 border-t border-linea">
            {group.items.map((item) => (
              <li key={item} className="border-b border-linea py-4">
                {item}
              </li>
            ))}
          </ul>
          <Button href="/#reservar" className="mt-12">
            Reservar cita
          </Button>
          {group.slug === "examenes-salud-visual" && <QuizTeaser className="mt-16" />}
        </div>
      </article>

      <nav aria-labelledby="otros-servicios" className="border-t border-linea bg-papel">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <h2 id="otros-servicios" className="text-xs font-medium uppercase tracking-[0.18em]">
            Otros servicios
          </h2>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/servicios/${g.slug}`}
                  className="flex items-baseline justify-between gap-4 border-b border-linea py-4 text-lg font-light hover:text-cobre"
                >
                  {g.title}
                  <span aria-hidden="true" className="text-sm text-cobre">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
