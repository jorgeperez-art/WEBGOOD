import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/content/articles";
import { images } from "@/content/images";

export function ArticleCard({ article, headingLevel = 3 }: { article: Article; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  const image = images.articles[article.image];
  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-foto">
        <Image
          src={image.src}
          alt={image.alt}
          placeholder="blur"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
        />
      </div>
      <Heading className="mt-6 text-xl font-light text-balance">
        <Link href={`/consejos/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-cobre">
          {article.title}
        </Link>
      </Heading>
      <p className="mt-3 text-sm text-acero">{article.excerpt}</p>
      <p aria-hidden="true" className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-cobre">
        Leer{" "}
        <span className="inline-block transition-transform duration-300 ease-suave group-hover:translate-x-1">→</span>
      </p>
    </article>
  );
}
