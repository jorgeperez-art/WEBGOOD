import { isTbc, site } from "@/content/site";

const dayNames: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

/** Ficha de la óptica para Google (schema.org/Optician). Solo incluye datos confirmados. */
export function OpticianJsonLd() {
  const { address, phone, email, geo, social } = site.contact;
  const data = {
    "@context": "https://schema.org",
    "@type": "Optician",
    name: site.brand.name,
    description: site.about.short,
    url: site.url,
    image: new URL("/opengraph-image.jpg", site.url).toString(),
    ...(isTbc(phone) ? {} : { telephone: `+34 ${phone}` }),
    ...(isTbc(email) ? {} : { email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    ...(geo ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } } : {}),
    openingHoursSpecification: site.openingHours.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.days.map((d) => dayNames[d]),
      opens: row.opens,
      closes: row.closes,
    })),
    ...(site.contact.mapsUrl ? { hasMap: site.contact.mapsUrl } : {}),
    ...(social.length ? { sameAs: social.map((s) => s.url) } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
