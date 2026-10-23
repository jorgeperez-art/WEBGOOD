import { z } from "zod";

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida");

export const appointmentSchema = z
  .object({
    reason: z.string().trim().min(1, "Elige un motivo").max(120),
    startsAt: z.iso.datetime({ message: "Elige un día y una hora" }),
    endsAt: z.iso.datetime({ message: "Elige un día y una hora" }),
    name: z.string().trim().min(2, "Escribe tu nombre").max(120),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s-]{6,20}$/, "Escribe un teléfono válido"),
    email: z.email("Escribe un email válido").max(200),
    notes: z.string().trim().max(1000, "Máximo 1000 caracteres").optional().default(""),
    consent: z.literal("on", { message: "Necesitamos tu consentimiento para gestionar la cita" }),
  })
  .refine((v) => Date.parse(v.endsAt) > Date.parse(v.startsAt), {
    path: ["startsAt"],
    message: "Elige un día y una hora",
  });

export type AppointmentForm = z.infer<typeof appointmentSchema>;
export type FieldErrors = Partial<Record<keyof AppointmentForm | "form", string>>;
