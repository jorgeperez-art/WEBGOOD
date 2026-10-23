"use client";

import { useRef, useState } from "react";
import { quizQuestions, quizResults } from "@/content/quiz";
import { Button } from "@/components/ui/Button";

const option =
  "w-full rounded-full border border-linea px-5 py-3.5 text-left transition-colors duration-200 hover:border-cobre";

export function EyeStrainQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = answers.length;
  const done = step === quizQuestions.length;

  function answer(points: number) {
    setAnswers([...answers, points]);
    // El foco pasa a la siguiente pregunta para que el lector de pantalla la anuncie.
    requestAnimationFrame(() => heading.current?.focus());
  }

  if (done) {
    const score = answers.reduce((a, b) => a + b, 0);
    const result = quizResults.find((r) => score <= r.upTo) ?? quizResults[quizResults.length - 1];
    return (
      <div role="status">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cobre">Resultado</p>
        <h2 ref={heading} tabIndex={-1} className="mt-4 text-3xl font-extralight tracking-tight md:text-4xl">
          {result.title}
        </h2>
        <p className="mt-6 max-w-lg text-lg font-light leading-relaxed">{result.text}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="/#reservar">Reservar cita</Button>
          <button
            type="button"
            onClick={() => setAnswers([])}
            className="text-xs font-medium uppercase tracking-[0.18em] text-acero hover:text-cobre"
          >
            Repetir el test
          </button>
        </div>
      </div>
    );
  }

  const q = quizQuestions[step];
  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cobre tabular-nums">
          Pregunta {step + 1} de {quizQuestions.length}
        </p>
        <div aria-hidden="true" className="h-px flex-1 bg-linea">
          <div
            className="h-px bg-tinta transition-[width] duration-500 ease-suave"
            style={{ width: `${(step / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>
      <h2 ref={heading} tabIndex={-1} className="mt-6 text-2xl font-light text-balance md:text-3xl">
        {q.question}
      </h2>
      <ul className="mt-8 max-w-md space-y-3">
        {q.answers.map((label, points) => (
          <li key={label}>
            <button type="button" onClick={() => answer(points)} className={option}>
              {label}
            </button>
          </li>
        ))}
      </ul>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setAnswers(answers.slice(0, -1))}
          className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-acero hover:text-cobre"
        >
          Atrás
        </button>
      )}
    </div>
  );
}
