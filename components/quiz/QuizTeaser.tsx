import Link from "next/link";

/** Invitación al test de fatiga visual digital. */
export function QuizTeaser({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/test-fatiga-visual"
      className={`group block rounded-foto-sm border border-linea bg-niebla p-7 transition-colors duration-300 hover:border-cobre ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-cobre">Test de 1 minuto</p>
      <p className="mt-3 text-xl font-light">¿Pasas muchas horas delante de pantallas?</p>
      <p className="mt-2 text-sm text-acero">
        Responde 5 preguntas sobre fatiga visual digital{" "}
        <span aria-hidden="true" className="inline-block text-cobre transition-transform duration-300 ease-suave group-hover:translate-x-1">
          →
        </span>
      </p>
    </Link>
  );
}
