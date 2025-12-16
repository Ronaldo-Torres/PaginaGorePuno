"use client";

import Link from "next/link";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import Image from "next/image";

export default function NavbarInfo({
  correoInstitucion,
  direccionInstitucion,
  telefonoInstitucion,
  telefonoInstitucion2,
  isBaseRoute = false,
  isScrolled = false,
  hideOnScroll = false, // Variable para controlar si se oculta al hacer scroll
  theme = "blue", // Tema por defecto: "blue" (azul con texto blanco) | "white" (blanco con texto azul)
}: {
  correoInstitucion?: string | null;
  direccionInstitucion?: string | null;
  telefonoInstitucion?: string | null;
  telefonoInstitucion2?: string | null;
  isBaseRoute?: boolean;
  isScrolled?: boolean;
  hideOnScroll?: boolean; // Nueva prop para controlar ocultación
  theme?: "blue" | "white"; // Nueva prop para controlar tema
}) {
  // Datos estáticos por defecto
  const direccionPorDefecto = "Jr. Deustua 356, Puno";
  // const correoPorDefecto = "info@consejoregional.regionpuno.gob.pe";
  const correoPorDefecto = "info@regionpuno.gob.pe";


  // Configuración de temas
  const themes = {
    blue: {
      // Tema actual: Fondo azul con texto blanco
      container: "bg-[#063585] text-white border-blue-800/30",
      textPrimary: "text-white/90 group-hover:text-white",
      textSecondary: "text-white/80",
      iconColors: {
        direccion: "text-gray-300",
        correo: "text-gray-300",
        telefono1: "text-gray-300",
        telefono2: "text-gray-300",
        horario: "text-gray-300",
      },
      hoverBg: "hover:bg-white/10",
      focusRing: "focus:ring-white/50 focus:ring-offset-blue-600",
      separator: "border-white/20",
      mobileText: "text-white/80",
      mobileLink: "text-white/90 hover:text-white",
    },
    white: {
      // Tema inverso: Fondo blanco con texto azul
      container: "bg-white text-[#063585] border-gray-200",
      textPrimary: "text-[#063585]/90 group-hover:text-[#063585]",
      textSecondary: "text-[#063585]/70",
      iconColors: {
        direccion: "text-[#063585]",
        correo: "text-[#063585]",
        telefono1: "text-[#063585]",
        telefono2: "text-[#063585]",
        horario: "text-[#063585]",
      },
      hoverBg: "hover:bg-blue-50",
      focusRing: "focus:ring-blue-400 focus:ring-offset-white",
      separator: "border-gray-200",
      mobileText: "text-[#063585]/70",
      mobileLink: "text-[#063585]/90 hover:text-[#063585]",
    },
  };

  const currentTheme = themes[theme];

  // Datos estructurados para información de contacto
  const contactData = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "PE-PUN",
    availableLanguage: "Spanish",
    telephone: telefonoInstitucion,
    email: correoInstitucion || correoPorDefecto,
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "16:30"
    }
  };

  return (
    <>
      {/* Datos estructurados para contacto */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactData)
        }}
      />

      <header
        className={`w-full h-6 flex items-center ${currentTheme.container} transition-all duration-500 ${hideOnScroll && isScrolled
          ? 'transform -translate-y-full opacity-0 pointer-events-none'
          : 'transform translate-y-0 opacity-100 pointer-events-auto'
          }`}
        role="banner"
        aria-label="Información de contacto del Consejo Regional de Puno"
      >
        <div className="flex justify-end w-4/5 mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Información de contacto - Lado izquierdo */}
            <nav
              className="flex items-center space-x-4 lg:space-x-6 font-medium"
              aria-label="Información de contacto"
            >
              {/* Dirección - Siempre visible con datos por defecto */}
              <Link
                href="https://maps.app.goo.gl/5HikEEZR57nDu2Yt7"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center group px-2 md:px-3 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                aria-label={`Ver ubicación en el mapa: ${direccionInstitucion || direccionPorDefecto}`}
              >
                <div className="relative">
                  <FaMapMarkerAlt
                    className={`h-4 w-3 md:mr-2 flex-shrink-0 ${currentTheme.iconColors.direccion} transition-all duration-300 transform group-hover:scale-110 shadow-sm`}
                    aria-hidden="true"
                  />
                </div>
                <span className={`hidden md:inline text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 group-hover:translate-x-0.5 ${currentTheme.textPrimary}`}>
                  {direccionInstitucion || direccionPorDefecto}
                </span>
              </Link>

              {/* Correo electrónico - Siempre visible con datos por defecto */}
              <Link
                href={`mailto:${correoInstitucion || correoPorDefecto}`}
                className={`flex items-center group px-2 md:px-3 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                aria-label={`Enviar correo a: ${correoInstitucion || correoPorDefecto}`}
              >
                <div className="relative">
                  <FaEnvelope
                    className={`h-4 w-4 md:mr-2 flex-shrink-0 ${currentTheme.iconColors.correo} transition-all duration-300 transform group-hover:scale-110 shadow-sm`}
                    aria-hidden="true"
                  />
                </div>
                <span className={`hidden md:inline text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 group-hover:translate-x-0.5 ${currentTheme.textPrimary}`}>
                  {correoInstitucion || correoPorDefecto}
                </span>
              </Link>

              {/* Teléfono - Visible en móvil solo como ícono, completo en desktop */}
              {telefonoInstitucion && (
                <Link
                  href={`tel:${telefonoInstitucion}`}
                  className={`flex items-center group px-2 md:px-3 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                  aria-label={`Llamar al teléfono: ${telefonoInstitucion}`}
                >
                  <div className="relative">
                    <FaPhone
                      className={`h-4 w-4 md:mr-2 flex-shrink-0 ${currentTheme.iconColors.telefono1} transition-all duration-300 transform group-hover:scale-110 shadow-sm`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className={`hidden lg:inline text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 group-hover:translate-x-0.5 ${currentTheme.textPrimary}`}>
                    {telefonoInstitucion}
                  </span>
                </Link>
              )}

              {/* Teléfono 2 - Solo visible si existe */}
              {telefonoInstitucion2 && (
                <Link
                  href={`tel:${telefonoInstitucion2}`}
                  className={`hidden xl:flex items-center group px-2 md:px-3 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                  aria-label={`Llamar al teléfono: ${telefonoInstitucion2}`}
                >
                  <div className="relative">
                    <FaPhone
                      className={`h-4 w-4 md:mr-2 flex-shrink-0 ${currentTheme.iconColors.telefono2} transition-all duration-300 transform group-hover:scale-110 shadow-sm`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className={`text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 group-hover:translate-x-0.5 ${currentTheme.textPrimary}`}>
                    {telefonoInstitucion2}
                  </span>
                </Link>
              )}

              {/* Horarios - Siempre visible */}
              <div className={`hidden xl:flex items-center px-2 md:px-3 py-1 ${currentTheme.textSecondary}`}>
                <FaClock
                  className={`h-4 w-4 md:mr-2 flex-shrink-0 ${currentTheme.iconColors.horario} shadow-sm`}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium tracking-wide">
                  Lun - Vie: 8:30 AM - 4:30 PM
                </span>
              </div>
            </nav>


          </div>
        </div>
      </header>

      {/* Sección Azul - Logo Gobierno Regional de Puno */}
      <header className="w-full bg-[#14467B] shadow-lg">
        <div className="w-4/5 mx-auto px-4">

          <div className="flex items-center justify-between py-2">

            <div className="flex items-center">
              <Image
                src="/logonuevoGORE.png"
                alt="Logo Gobierno Regional de Puno"
                width={90}
                height={90}
                
              />
              <Image
                src="/nameGORE.png"
                alt="Logo Gobierno Regional de Puno"
                width={250}
                height={120}
              />
            </div>

            <div className="hidden sm:block">
              <Image
                src="/sloganGORE.png"
                alt="Logo Gobierno Regional de Puno"
                width={350}
                height={300}
              />
            </div>

            {/* <div className="text-white ml-2">
              <h2 className="text-md font-semibold">GOBIERNO REGIONAL</h2>
              <h1 className="text-6xl font-bold tracking-wide">PUNO</h1>
            </div> */}
          </div>

        </div>
      </header>
    </>
  );
}
