/**
 * Test orientativo de fatiga visual digital. No es un diagnóstico: solo
 * ayuda a decidir si conviene pedir una revisión.
 */

export type QuizQuestion = { question: string; answers: [string, string, string] };

/** Cada respuesta suma 0, 1 o 2 puntos según su posición. */
export const quizQuestions: QuizQuestion[] = [
  {
    question: "¿Cuántas horas al día pasas delante de pantallas?",
    answers: ["Menos de 2 horas", "Entre 2 y 6 horas", "Más de 6 horas"],
  },
  {
    question: "¿Notas los ojos secos, irritados o cansados al final del día?",
    answers: ["Casi nunca", "A veces", "A menudo"],
  },
  {
    question: "¿Ves borroso o te cuesta enfocar al apartar la vista de la pantalla?",
    answers: ["Casi nunca", "A veces", "A menudo"],
  },
  {
    question: "¿Te duele la cabeza, el cuello o los hombros después de usar pantallas?",
    answers: ["Casi nunca", "A veces", "A menudo"],
  },
  {
    question: "¿Cuándo fue tu última revisión de la vista?",
    answers: ["Hace menos de un año", "Hace uno o dos años", "Hace más de dos años, o nunca"],
  },
];

export const quizResults = [
  {
    upTo: 3,
    title: "Pocas señales de fatiga visual",
    text: "Por lo que nos cuentas, tus ojos llevan bien las pantallas. Aun así, una revisión al año ayuda a detectar cambios a tiempo.",
  },
  {
    upTo: 6,
    title: "Algunas señales de fatiga visual",
    text: "Hay síntomas que se repiten. Una revisión nos dirá si se deben a tu graduación, a cómo trabajan tus ojos juntos o a tus hábitos con las pantallas.",
  },
  {
    upTo: 10,
    title: "Varias señales de fatiga visual",
    text: "Tus respuestas apuntan a que tus ojos están haciendo un esfuerzo extra. Te recomendamos pedir cita para una evaluación de la fatiga visual digital.",
  },
];
