import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { articles } from "@/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...site.services.map((g) => `/servicios/${g.slug}`),
    "/test-fatiga-visual",
    "/consejos",
    ...articles.map((a) => `/consejos/${a.slug}`),
    ...site.legalPages.map((p) => p.href),
  ];
  return paths.map((path) => ({ url: new URL(path, site.url).toString() }));
}
