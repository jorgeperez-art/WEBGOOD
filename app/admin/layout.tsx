import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">{children}</div>;
}
