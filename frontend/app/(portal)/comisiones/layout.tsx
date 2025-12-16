import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comisiones | Gobierno Regional de Puno",
  description: "Comisiones del Gobierno Regional de Puno. Conoce las comisiones ordinarias y especiales, sus integrantes, funciones y actividades desarrolladas en beneficio de la región.",
  keywords: [
    "comisiones Gobierno Regional Puno",
    "comisiones ordinarias Puno",
    "comisiones especiales Puno",
    "integrantes comisiones Puno",
    "funciones comisiones regionales",
    "actividades comisiones Puno",
    "trabajo comisiones regionales"
  ],
  openGraph: {
    title: "Comisiones del Gobierno Regional de Puno",
    description: "Información sobre las comisiones del Gobierno Regional de Puno, sus integrantes y actividades desarrolladas.",
    type: "website",
    locale: "es_PE",
    url: "https://Gobiernoregional.regionpuno.gob.pe/comisiones",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comisiones del Gobierno Regional de Puno",
    description: "Comisiones ordinarias y especiales del Gobierno Regional de Puno con sus integrantes y actividades.",
  },
  alternates: {
    canonical: "https://Gobiernoregional.regionpuno.gob.pe/comisiones",
  },
  other: {
    "article:section": "Comisiones",
    "article:tag": "Comisiones, Trabajo Legislativo, Fiscalización, Consejeros, Puno",
  }
};

export default function ComisionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 