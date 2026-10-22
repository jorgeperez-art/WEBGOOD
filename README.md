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

## Estado

Fase 1 (base): cabecera, barra móvil, pie, páginas legales y anclajes de la home.
Siguientes fases: portada y marcas, servicios y visítanos, reserva con Supabase, panel `/admin`,
SEO y legal, y guía de despliegue en Vercel y GoDaddy.
