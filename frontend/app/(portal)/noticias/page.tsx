import type { Metadata } from "next";
import Noticias from "./noticias";

export const metadata: Metadata = {
  title: "Noticias | Gobierno Regional de Puno",
  description: "Últimas noticias y comunicados oficiales del Consejo Regional de Puno. Mantente informado sobre las actividades, sesiones, acuerdos y decisiones del órgano de gobierno regional.",
  keywords: [
    "noticias Gobierno Regional Puno",
    "comunicados oficiales Puno",
    "actividades Gobierno Regional",
    "sesiones ordinarias Puno",
    "acuerdos regionales Puno",
    "decisiones Gobierno Regional",
    "actualidad política Puno"
  ],
  openGraph: {
    title: "Noticias del Gobierno Regional de Puno",
    description: "Últimas noticias y comunicados oficiales del Gobierno Regional de Puno. Información actualizada sobre actividades y decisiones.",
    type: "website",
    locale: "es_PE",
    url: "https://consejoregional.regionpuno.gob.pe/noticias",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noticias del Gobierno Regional de Puno",
    description: "Últimas noticias y comunicados oficiales del Gobierno Regional de Puno.",
  },
  alternates: {
    canonical: "https://consejoregional.regionpuno.gob.pe/noticias",
  },
  other: {
    "article:section": "Noticias",
    "article:tag": "Noticias, Gobierno Regional, Puno, Comunicados, Actividades",
  }
};

export default function NoticiasPage() {
  return <Noticias />;
};
