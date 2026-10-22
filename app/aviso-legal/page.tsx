import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Aviso legal", alternates: { canonical: "/aviso-legal" } };

export default function Page() {
  return <LegalPage title="Aviso legal" />;
}
