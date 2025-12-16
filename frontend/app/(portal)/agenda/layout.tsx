import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda | Gobierno Regional de Puno",
  description: "Agenda oficial de actividades del Gobierno Regional de Puno. Consulta las fechas de sesiones ordinarias, extraordinarias, reuniones de comisiones y eventos institucionales del Gobierno regional.",
  keywords: [
    "agenda Gobierno Regional Puno",
    "sesiones ordinarias Puno",
    "sesiones extraordinarias Puno",
    "reuniones comisiones Puno",
    "calendario institucional Puno",
    "eventos Gobierno Regional",
    "cronograma actividades Puno"
  ],
  openGraph: {
    title: "Agenda del Gobierno Regional de Puno",
    description: "Agenda oficial de actividades, sesiones y reuniones del Gobierno Regional de Puno. Mantente informado sobre el calendario institucional.",
    type: "website",
    locale: "es_PE",
    url: "https://Gobiernoregional.regionpuno.gob.pe/agenda",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda del Gobierno Regional de Puno",
    description: "Agenda oficial de actividades y sesiones del Gobierno Regional de Puno.",
  },
  alternates: {
    canonical: "https://Gobiernoregional.regionpuno.gob.pe/agenda",
  },
  other: {
    "article:section": "Agenda",
    "article:tag": "Agenda, Calendario, Sesiones, Reuniones, Comisiones, Puno",
  }
};

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 