import type { Metadata } from "next";
import PortalLayout from "./(portal)/layout";
import PortalPage from "./(portal)/page";

export const metadata: Metadata = {
  title: "Inicio | Gobierno Regional de Puno",
  description: "Portal oficial del Gobierno Regional de Puno. Órgano de debate, fiscalización y legislación del Gobierno Regional. Conoce nuestra mesa directiva, agenda de sesiones, últimas noticias, documentos oficiales y servicios ciudadanos.",
  keywords: [
    "Gobierno Regional Puno inicio",
    "Portal oficial Puno",
    "Mesa directiva Puno",
    "Sesiones Gobierno Regional",
    "Servicios ciudadanos Puno",
    "Noticias Gobierno Regional Puno",
    "Agenda institucional Puno"
  ],
  openGraph: {
    title: "Gobierno Regional de Puno | Portal Oficial",
    description: "Portal oficial del Gobierno Regional de Puno. Información sobre mesa directiva, agenda, noticias y servicios para la ciudadanía.",
    type: "website",
    locale: "es_PE",
    url: "https://Gobiernoregional.regionpuno.gob.pe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gobierno Regional de Puno | Portal Oficial",
    description: "Portal oficial del Gobierno Regional de Puno. Mesa directiva, agenda, noticias y servicios ciudadanos.",
  },
  alternates: {
    canonical: "https://Gobiernoregional.regionpuno.gob.pe",
  },
  other: {
    "article:section": "Gobierno",
    "article:tag": "Gobierno Regional, Puno, Gobierno Regional, Mesa Directiva",
  }
};

export default function RootPage() {
  return (
    <PortalLayout>
      <PortalPage />
    </PortalLayout>
  );
}
