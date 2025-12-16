"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarInfo from "./navbar-info";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FaExternalLinkAlt } from "react-icons/fa";

// Estructura de navegación para SEO y accesibilidad
const navigationItems = [
  {
    href: "/",
    label: "Inicio",
    description: "Página principal del Gobierno Regional de Puno"
  },
  {
    href: "/gobierno",
    label: "Gobierno",
    description: "Página principal del Gobierno Regional de Puno"
  },
  {
    href: "/consejeros",
    label: "Gobierno Regional",
    description: "Conoce a nuestros consejeros regionales electos"
  },
  {
    href: "/comisiones",
    label: "Transparencia",
    description: "Comisiones ordinarias y especiales del Gobierno"
  },
  {
    href: "/agenda",
    label: "Correo Institucional",
    description: "Calendario de sesiones y actividades institucionales"
  },
  {
    href: "/documentos",
    label: "Sede Central",
    description: "Ordenanzas, acuerdos y documentos oficiales"
  },
  {
    href: "/noticias",
    label: "Contacto",
    description: "Últimas noticias y comunicados oficiales"
  }
] as const;

const Navbar = ({
  loading,
  correoInstitucion,
  direccionInstitucion,
  telefonoInstitucion,
  telefonoInstitucion2,
  logoInstitucionDark,
  logoInstitucionLight,
  isHomePage,
}: {
  loading: boolean;
  correoInstitucion?: string | null;
  direccionInstitucion?: string | null;
  telefonoInstitucion?: string | null;
  telefonoInstitucion2?: string | null;
  logoInstitucionDark?: string | null;
  logoInstitucionLight?: string | null;
  isHomePage?: boolean;
}) => {
  const [isScrolled, setIsScrolled] = useState(!isHomePage); // Inicialmente scrolled si no es homepage
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Si no es homepage, siempre mantener el estado scrolled
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    // Solo en homepage escuchar el scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const isBaseRoute = pathname === "/";

  // Datos estructurados para navegación
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: navigationItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://gore.regionpuno.gob.pe${item.href}`
    }))
  };

  return (
    <>
      {/* Datos estructurados para navegación */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      {/* Navbar Info - Controlable si se oculta al hacer scroll */}
      {/* 
        hideOnScroll = true: El navbar-info se oculta al hacer scroll
        hideOnScroll = false: El navbar-info siempre permanece visible (por defecto)
        
        theme = "blue": Fondo azul con texto blanco (por defecto)
        theme = "white": Fondo blanco con texto azul
      */}
      
      <div className="fixed top-0 left-0 w-full z-50">
        <NavbarInfo
          correoInstitucion={correoInstitucion}
          direccionInstitucion={direccionInstitucion}
          telefonoInstitucion={telefonoInstitucion}
          telefonoInstitucion2={telefonoInstitucion2}
          isBaseRoute={isBaseRoute}
          isScrolled={isScrolled}
          hideOnScroll={false} // Cambia a true si quieres que se oculte
          theme={isHomePage && !isScrolled ? "white" : "white"} // Blanco en inicio sin scroll, azul en el resto
        />
      </div>

      {/* Navbar Principal - Siempre visible con fondo */}
      <nav
        className="fixed left-0 w-full z-40 transition-all duration-300 ease-out bg-white/98 backdrop-blur-lg text-[#0f3e80] shadow-sm"
        style={{
          top: '135px', // Altura del navbar-info (25px) + altura del navbar rojo (~110px)
          borderBottom: '1px solid rgb(229 231 235 / 0.5)',
          transition: 'all 0.3s ease-out',
        }}
        role="navigation"
        aria-label="Navegación principal del Gobierno Regional de Puno"
      >
        <div className="w-full sm:w-4/5 mx-auto px-4 sm:px-4 py-2.5">
          <div className="flex flex-row justify-between items-center">


            {/* Desktop Menu - Sin fondos en estado inicial */}
            <div className="hidden sm:flex items-center space-x-1 font-semibold tracking-wide">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1" role="menubar">
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.href} role="none">
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={`relative px-4 py-2.5 font-semibold tracking-wider text-sm uppercase transition-all duration-300 focus:outline-none after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:transition-all after:duration-500 hover:after:w-full after:transform after:-translate-x-1/2 hover:scale-105 text-[#063585] hover:text-[#BA0028] focus:ring-blue-400 focus:ring-offset-white after:bg-[#BA0028] ${
                          pathname === item.href
                            ? "text-[#BA0028] after:w-3/4"
                            : ""
                        }`}
                        role="menuitem"
                        aria-current={pathname === item.href ? "page" : undefined}
                        title={item.description}
                      >
                        <span className="relative z-10 font-medium tracking-wider transition-all duration-300 group-hover:text-current">{item.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Menu Button - Adaptativo */}
            <div className="sm:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="text-[#194789] hover:text-[#BA0028] hover:bg-blue-50 focus:ring-blue-400 focus:ring-offset-white -m-2.5 inline-flex items-center justify-center rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                  >
                    <svg
                      className={`size-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent
                  id="mobile-menu"
                  side="right"
                  className="w-[300px] backdrop-blur-lg shadow-2xl bg-[#063585]/95 border-none [&>button]:hidden"
                  aria-label="Menú de navegación móvil"
                >
                  {/* Header del menú móvil - Mejorado y consistente */}
                  <header className="flex items-center space-x-3 pt-4 pb-2 px-1">
                    <div className="flex-shrink-0">
                      <Image
                        src="/logo.png" // Logo blanco consistente para fondo azul
                        alt="Logo del Gobierno Regional Puno"
                        width={140}
                        height={35}
                        className="h-9 w-auto drop-shadow-lg filter brightness-0 invert"
                        priority
                      />
                    </div>
                    <div className="text-white flex flex-col justify-center">
                      <span className="text-sm font-extrabold tracking-wider leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                        Gobierno REGIONAL PUNO
                      </span>
                      <span className="text-xs font-medium text-white/80 tracking-wider italic">
                        Gobierno Regional Puno
                      </span>
                    </div>
                  </header>

                  <Separator className="mt-4 mb-4 bg-white/25 border-none h-px" />

                  {/* Navigation Links - Mejorados y consistentes */}
                  <nav className="flex flex-col space-y-2" role="navigation" aria-label="Navegación móvil">
                    {navigationItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group relative flex items-center text-base font-semibold tracking-wide px-4 py-3.5 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1 focus:outline-none ${
                          pathname === item.href
                            ? "text-white bg-white/15 translate-x-1"
                            : "text-white/90 hover:text-white"
                      }`}
                        aria-current={pathname === item.href ? "page" : undefined}
                        title={item.description}
                    >
                        <span className="relative z-10 uppercase tracking-wider font-medium transition-all duration-300 g roup-hover:pl-2">{item.label}</span>
                        {/* Indicador visual para página activa */}
                        {pathname === item.href && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
                        )}
                        {/* Efecto hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </Link>
                    ))}
                  </nav>

                  {/* Enlaces adicionales y accesibilidad */}
                  <div className="mt-6 pt-4 border-t border-white/25 space-y-3">
                    {/* Enlace a GR PUNO */}
                    <Link
                      href="https://www.regionpuno.gob.pe/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 focus:outline-none"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Portal Gobierno Regional</span>
                      <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
                    </Link>
                    
                    {/* Skip link para accesibilidad */}
                    <Link
                      href="#main-content"
                      className="block text-sm text-white/70 hover:text-white/90 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Ir al contenido principal
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Skip link para accesibilidad en desktop */}
      <Link
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold z-[60] focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        Saltar al contenido principal
      </Link>
    </>
  );
};

export default Navbar;
