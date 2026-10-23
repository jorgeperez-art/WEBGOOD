import type { Metadata } from "next";
import Image from "next/image";
import { images } from "@/content/images";
import { EyeStrainQuiz } from "@/components/quiz/EyeStrainQuiz";

export const metadata: Metadata = {
  title: "Test de fatiga visual digital",
  description: "5 preguntas para saber si las pantallas están cansando tu vista. Orientativo, en un minuto.",
  alternates: { canonical: "/test-fatiga-visual" },
};

export default function Page() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-20 md:px-8 md:py-24">
      <div>
        <h1 className="text-4xl font-extralight tracking-tight text-balance md:text-5xl">
          Test de fatiga visual digital
        </h1>
        <p className="mt-6 max-w-sm text-acero">
          5 preguntas para saber si las pantallas están cansando tu vista. Es orientativo y no sustituye un examen
          visual.
        </p>
        <div className="relative mt-10 hidden aspect-[5/4] overflow-hidden rounded-foto md:block">
          <Image
            src={images.lens.src}
            alt=""
            placeholder="blur"
            sizes="40vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="min-w-0 rounded-foto border border-linea bg-papel p-6 md:self-start md:p-10">
        <EyeStrainQuiz />
      </div>
    </div>
  );
}
