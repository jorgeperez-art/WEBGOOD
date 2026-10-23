import { articles } from "@/content/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/Button";

export function Tips() {
  return (
    <section id="consejos" aria-labelledby="consejos-titulo" className="border-t border-linea">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <h2 id="consejos-titulo" className="text-3xl font-extralight tracking-tight md:text-4xl">
            Consejos de salud visual
          </h2>
          <p className="max-w-md text-acero md:justify-self-end">
            Pequeñas cosas que puedes hacer por tu vista, explicadas con calma.
          </p>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <Button href="/consejos" variant="line" className="mt-12">
          Todos los consejos
        </Button>
      </div>
    </section>
  );
}
