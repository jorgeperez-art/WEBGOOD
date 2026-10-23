import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleBySlug, articles } from "@/content/articles";
import { serviceBySlug } from "@/content/site";
import { images } from "@/content/images";
import { Button } from "@/components/ui/Button";
import { ArticleCard } from "@/components/articles/ArticleCard";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/consejos/[slug]">): Promise<Metadata> {
  const article = articleBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/consejos/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

export default async function Page({ params }: PageProps<"/consejos/[slug]">) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();

  const image = images.articles[article.image];
  const service = serviceBySlug(article.service);
  const others = articles.filter((a) => a !== article);

  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <Link
          href="/consejos"
          className="text-xs font-medium uppercase tracking-[0.18em] text-acero hover:text-cobre"
        >
          ← Consejos
        </Link>
        <h1 className="mt-8 text-4xl font-extralight tracking-tight text-balance md:text-5xl">{article.title}</h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-acero md:text-xl">{article.excerpt}</p>
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-foto">
          <Image
            src={image.src}
            alt={image.alt}
            placeholder="blur"
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-12 space-y-10 text-[1.05rem] leading-relaxed">
          {article.sections.map((section, i) => (
            <section key={i}>
              {section.heading && <h2 className="mb-4 text-2xl font-light">{section.heading}</h2>}
              {section.paragraphs?.map((p) => (
                <p key={p} className="mt-4 first:mt-0">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-2 border-t border-linea">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-4 border-b border-linea py-3.5">
                      <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-cobre" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-acero">Texto informativo. No sustituye una revisión de la vista.</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="/#reservar">Reservar cita</Button>
          {service && (
            <Link
              href={`/servicios/${service.slug}`}
              className="text-xs font-medium uppercase tracking-[0.18em] text-acero hover:text-cobre"
            >
              {service.title} →
            </Link>
          )}
        </div>
      </article>

      <aside aria-labelledby="mas-consejos" className="border-t border-linea bg-papel">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <h2 id="mas-consejos" className="text-xs font-medium uppercase tracking-[0.18em]">
            Más consejos
          </h2>
          <div className="mt-8 grid gap-12 md:grid-cols-3 md:gap-8">
            {others.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
