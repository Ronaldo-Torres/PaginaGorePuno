import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gobierno Regionales | Consejo Regional de Puno",
  description: "Conoce a los Gobierno regionales de Puno. Información sobre nuestros representantes electos, sus perfiles, provincias que representan y funciones en el consejo regional.",
  keywords: [
    "Gobierno regionales Puno",
    "representantes regionales Puno",
    "Gobierno electos Puno",
    "perfil Gobierno Puno",
    "representación provincial Puno",
    "autoridades regionales Puno",
    "gobierno regional Puno"
  ],
  openGraph: {
    title: "Gobierno Regionales del Consejo Regional de Puno",
    description: "Conoce a nuestros Gobierno regionales electos y sus perfiles. Representantes de las provincias de la región Puno.",
    type: "website",
    locale: "es_PE",
    url: "https://consejoregional.regionpuno.gob.pe/Gobierno",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gobierno Regionales del Consejo Regional de Puno",
    description: "Conoce a nuestros Gobierno regionales electos y representantes provinciales.",
  },
  alternates: {
    canonical: "https://consejoregional.regionpuno.gob.pe/Gobierno",
  },
  other: {
    "article:section": "Gobierno",
    "article:tag": "Gobierno, Representantes, Autoridades, Gobierno Regional, Puno",
  }
};

export default function GobiernoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 