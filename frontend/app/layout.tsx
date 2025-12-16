import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gobierno Regional de Puno | Gobierno Regional Puno",
    template: "%s | Gobierno Regional de Puno"
  },
  description: "Gobierno Regional de Puno - Órgano de debate, fiscalización y legislación del Gobierno Regional. Información sobre sesiones, acuerdos, ordenanzas, comisiones y actividades del Gobierno regional para el desarrollo de la región Puno.",
  keywords: [
    "Gobierno Regional Puno",
    "Gobierno Regional Puno", 
    "Ordenanzas Puno",
    "Acuerdos Regionales",
    "Fiscalización Regional",
    "Comisiones Regionales",
    "Mesa Directiva Puno",
    "Consejeros Regionales Puno",
    "Sesiones Gobierno Regional",
    "Transparencia Regional Puno"
  ],
  authors: [{ name: "Gobierno Regional de Puno" }],
  creator: "Gobierno Regional de Puno",
  publisher: "Gobierno Regional Puno",
  category: "Government",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://Gobiernoregional.regionpuno.gob.pe",
    siteName: "Gobierno Regional de Puno",
    title: "Gobierno Regional de Puno | Gobierno Regional Puno",
    description: "Órgano de debate, fiscalización y legislación del Gobierno Regional de Puno. Información oficial sobre sesiones, ordenanzas, acuerdos y actividades.",
    images: [
      {
        url: "/logoheader.png",
        width: 1200,
        height: 630,
        alt: "Logo Gobierno Regional de Puno"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Gobierno Regional de Puno | Gobierno Regional Puno",
    description: "Órgano de debate, fiscalización y legislación del Gobierno Regional de Puno",
    images: ["/logoheader.png"]
  },
  icons: {
    icon: "/logoheader.png",
    shortcut: "/logoheader.png",
    apple: "/logoheader.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Reemplazar con código real
  },
  alternates: {
    canonical: "https://Gobiernoregional.regionpuno.gob.pe",
  },
  other: {
    "geo.region": "PE-PUN",
    "geo.placename": "Puno, Perú",
    "geo.position": "-15.8402;-70.0219",
    "ICBM": "-15.8402, -70.0219"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://Gobiernoregional.regionpuno.gob.pe" />
        <meta name="theme-color" content="#184482" />
        <meta name="msapplication-TileColor" content="#184482" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Datos estructurados básicos */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              name: "Gobierno Regional de Puno",
              description: "Órgano de debate, fiscalización y legislación del Gobierno Regional de Puno",
              url: "https://Gobiernoregional.regionpuno.gob.pe",
              logo: "https://Gobiernoregional.regionpuno.gob.pe/logoheader.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jr. Deustua 356",
                addressLocality: "Puno",
                addressRegion: "Puno",
                addressCountry: "PE"
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                areaServed: "PE-PUN"
              },
              sameAs: [
                "https://www.facebook.com/Gobiernopuno",
                "https://twitter.com/Gobiernoregpuno"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          {children}
          <Toaster position="top-center" closeButton richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
