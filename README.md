# goodview · Centro óptico

Web de [goodview.es](https://goodview.es). Next.js (App Router), TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # compilación de producción
npm run lint
```

## Datos del negocio

Todos los datos (dirección, horario, teléfono, servicios, marcas, textos legales…) viven en
[`content/site.ts`](content/site.ts). Lo que aún no está confirmado se escribe con `tbc("…")` y
la web lo muestra como `[… por confirmar]`. No se inventa ningún dato.

## Identidad

- Colores y tipografía (Fustat) según el manual corporativo; tokens en `app/globals.css`.
- Logos en `components/ui/brand-paths.ts`, vectorizados desde los PNG oficiales. Si llegan los
  SVG originales, se sustituyen ahí.

## Reservas

El asistente de cita (`components/booking/Wizard.tsx`) llama a dos Server Actions
(`app/actions/booking.ts`): una calcula las horas libres y otra guarda la cita. Ambas hablan
solo con la interfaz `BookingProvider` (`lib/booking/provider.ts`):

- `supabase`: producción. Horario en `opening_hours`, bloqueos en `blocked_slots`, citas en `appointments`.
- `demo`: sin base de datos, para probar en local (horario de `site.ts`, citas en memoria).
- `calcom`: adaptador preparado para pasar a Cal.com en el futuro.

Protección: validación con Zod en el servidor, honeypot, límite de 5 intentos por IP cada
10 minutos y restricción en la base de datos que impide dos citas solapadas.
Emails con Resend: confirmación al cliente y aviso a la óptica (`lib/email/send.ts`).

### Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (región UE).
2. En **SQL Editor**, ejecuta `supabase/migrations/0001_reservas.sql` y después `supabase/seed.sql`.
3. Copia `SUPABASE_URL` y la `service_role key` (Project Settings → API) a las variables de entorno.

### Variables de entorno

Copia `.env.example` a `.env.local` y rellénalo. Sin variables de Supabase, en local se usa el modo `demo`.

## Estado

Hecho: base, home visual, servicios y reservas.
## Panel de citas (/admin)

- Se entra en `/admin` con un usuario de Supabase Auth que esté en la tabla `staff` (ver `supabase/snippets/dar-acceso-panel.sql`).
- La sesión es una cookie firmada con `ADMIN_SESSION_SECRET` (o `RATE_LIMIT_SALT` si no existe), válida 12 horas.
- Muestra las citas de los próximos 14 días, permite confirmarlas, cancelarlas y recuperarlas, y bloquear huecos.

Pendiente: emails con Resend, textos legales y fotos reales.
