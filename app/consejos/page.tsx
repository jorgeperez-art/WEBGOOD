import type { Metadata } from "next";
import { articles } from "@/content/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";

export const metadata: Metadata = {
  title: "Consejos de salud visual",
  description: "Consejos para cuidar tu vista: pantallas, miopía infantil, gafas progresivas y más.",
  alternates: { canonical: "/consejos" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <h1 className="text-4xl font-extralight tracking-tight md:text-5xl">Consejos de salud visual</h1>
      <p className="mt-6 max-w-lg text-acero">
        Pequeñas cosas que puedes hacer por tu vista, explicadas con calma. Son textos informativos y no sustituyen
        una revisión.
      </p>
      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} headingLevel={2} />
        ))}
      </div>
      <QuizTeaser className="mt-20 max-w-xl" />
    </div>
  );
}
