"use client";

import { useState, useEffect, Children } from "react";
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

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"


// Estructura de navegación para SEO y accesibilidad
const navigationItems = [
  {
    href: "/",
    label: "Inicio",
    description: "Página principal del Gobierno Regional de Puno"
  },

  // GOBIERNO
  {
    href: "/gobierno",
    label: "Gobierno",
    children: [
      {
        label: "Nosotros",
        href: "/#",
        children: [
          { label: "Misión", href: "/mision" },
          { label: "Visión", href: "/vision" },
          { label: "Objetivos", href: "/objetivos" },
          { label: "Memorias Anuales", href: "/memorias-anuales" },
        ]
      },
      {
        label: "Funcionarios",
        href: "/#",
        children: [
          { label: "Gerentes Regionales", href: "/gerentes-regionales" },
          { label: "Directores Regionales", href: "/directores-regionales" },
        ]
      },
      {
        label: "Agenda",
        href: "/agenda",
      },
      {
        label: "Directorio Institucional",
        href: "/directorio-institucional",
        children: [
          { label: "Personal de la Gerencia Regional de la Infraestructura", href: "https://www.regionpuno.gob.pe/descargas/personal/Personal%20de%20Infraestructura.pdf" },
          { label: "Personal de la Sub Gerencia de Ejecución de Proyectos", href: "https://www.regionpuno.gob.pe/descargas/personal/Personal%20SubGerencia%20de%20Ejecucion%20de%20Proyectos.pdf" },
          { label: "Personal de la Oficina Regional de Supervisión y Liquidación de Proyectos", href: "personal-supervision-liquidacion-proyectos" },
        ]
      }
      ,
      {
        label: "Directorio de Alcaldes de la Región Puno 2023",
        href: "/alcaldes",
      }
    ]
  },

  // CONSEJO REGIONAL
  {
    href: "https://consejo.regionpuno.gob.pe/",
    label: "Consejo Regional",
  },

  // TRANSPARENCIA  
  {
    href: "/documentos",
    label: "Transparencia",
  },

  // CORREO INSTITUCIONAL
  {
    href: "https://webmail.regionpuno.gob.pe/",
    label: "Correo Institucional",
  },

  // SEDE CENTRAL
  // {
  //   href: "/sede-central",
  //   label: "Sede Central",
  // },

  // CONTACTO
  // {
  //   href: "/contacto",
  //   label: "Contacto",
  // }

] as const;






// Función recursiva para renderizar los items
const renderMobileNav = (items: any[], pathname: string, setIsMobileMenuOpen: (open: boolean) => void) => {
  return items.map((item) =>
    item.children && item.children.length > 0 ? (
      <Accordion type="single" collapsible key={item.href}>
        <AccordionItem value={item.href} className="border-none">
          <AccordionTrigger className="text-sm px-4 py-3.5 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all">
            {item.label}
          </AccordionTrigger>
          <AccordionContent className="pl-4 space-y-2">
            {renderMobileNav(item.children, pathname, setIsMobileMenuOpen)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`block text-sm px-4 py-2 rounded-lg transition-all ${pathname === item.href
          ? "text-white bg-white/15"
          : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
      >
        {item.label}
      </Link>
    )
  )
}


const CustomNavigationMenuItem = ({ item, pathname }) => {
  const [isHovered, setIsHovered] = useState(false);

  let timeoutId: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsHovered(false), 1000); // delay de 1000ms
  };


  return (
    <div
      className="relative"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.children ? (
        <button
          type="button"
          className={`px-4 py-2.5 uppercase text-sm tracking-wide text-black hover:text-[#14467B] transition-all duration-300`}
          title={item.description}
        >
          {item.label}
        </button>
      ) : (
        <Link
          href={item.href}
          className={`px-4 py-2.5 uppercase text-sm tracking-wide text-black hover:text-[#14467B] transition-all duration-300 ${pathname === item.href ? "text-sky-900 font-semibold" : ""}`}
          title={item.description}
        >
          {item.label}
        </Link>
      )}

      {item.children && isHovered && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20">
          {item.children.map((subItem) => (
            <SubMenuItem key={subItem.href} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

const SubMenuItem = ({ item }) => {

  const [isSubHovered, setIsSubHovered] = useState(false);
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsSubHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsSubHovered(false), 200);
  };

  return (
    <div
      className="relative"
      // onMouseEnter={() => setIsSubHovered(true)}
      // onMouseLeave={() => setIsSubHovered(false)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
        title={item.label}
      >
        {item.label}
      </Link>

      {item.children && isSubHovered && (
        <div className="absolute top-0 left-full ml-1 w-48 bg-white shadow-lg rounded-md z-30">
          {item.children.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
              title={subItem.label}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};



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
            <div className="hidden sm:flex items-center space-x-1  tracking-wide">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1" role="menubar">
                  {navigationItems.map((item) => (
                    <CustomNavigationMenuItem key={item.href} item={item} pathname={pathname} />
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
                  className="w-[300px] backdrop-blur-lg shadow-2xl bg-[#14467B] border-none [&>button]:hidden"
                  aria-label="Menú de navegación móvil"
                >
                  {/* Header del menú móvil - Mejorado y consistente */}
                  <header className="flex items-center space-x-3 pt-4 px-4">
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
                        GOBIERNO REGIONAL PUNO
                      </span>
                      <span className="text-xs font-medium text-white/80 tracking-wider italic">
                        Gobierno Regional Puno
                      </span>
                    </div>
                  </header>

                  <Separator className="mt-4 mb-4 bg-white/25 border-none h-px" />

                  {/* Navigation Links - Mejorados y consistentes */}
                  <nav className="flex flex-col space-y-2" role="navigation" aria-label="Navegación móvil">
                    {renderMobileNav(navigationItems, pathname, setIsMobileMenuOpen)}
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-md  z-[60] focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        Saltar al contenido principal
      </Link>
    </>
  );
};

export default Navbar;
