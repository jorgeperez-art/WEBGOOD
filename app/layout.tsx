import type { Metadata, Viewport } from "next";
import { Fustat } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const title = `${site.brand.name} · ${site.brand.descriptor} en Tenerife`;
const description = site.about.short;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.brand.name}` },
  description,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.brand.name,
    title,
    description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#EFECE8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fustat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-papel focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
