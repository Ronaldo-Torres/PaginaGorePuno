"use client";

import { useState, useEffect, type SVGProps } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";
import "./componentes.css";

// Tipos para las portadas
interface Portada {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  nombreBoton: string;
  urlBoton: string | null;
  imagen: string | null;
}

const textAnimation = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterAnimation = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1] as const,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.6, 1] as const,
    },
  },
};

export default function Principal({
  portadas,
  parametro,
}: {
  portadas: Portada[];
  parametro: any;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (portadas && portadas.length > 1 && isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % portadas.length);
      }, 8000);

      return () => clearInterval(timer);
    }
  }, [portadas, isAutoPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset current slide if it's out of bounds
  useEffect(() => {
    if (portadas && portadas.length > 0 && currentSlide >= portadas.length) {
      setCurrentSlide(0);
    }
  }, [portadas, currentSlide]);

  // Si no hay portadas, mostrar estado vacío
  if (!portadas || portadas.length === 0) {
    return (
      <section className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-slate-600 text-xl font-semibold mb-2">
            Cargando contenido...
          </h2>
          <p className="text-slate-500">
            No hay portadas disponibles en este momento
          </p>
        </div>
      </section>
    );
  }

  // Asegurar que currentSlide esté en rango válido
  const safeCurrentSlide = Math.min(currentSlide, portadas.length - 1);
  const currentPortada = portadas[safeCurrentSlide];

  // Datos estructurados para cada portada
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: currentPortada?.titulo || "",
    description: currentPortada?.descripcion || "",
    url: "https://consejoregional.regionpuno.gob.pe",
    mainEntity: {
      "@type": "GovernmentOrganization",
      name: "Consejo Regional de Puno",
      description: currentPortada?.descripcion || "",
      image: currentPortada?.imagen 
        ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${currentPortada.imagen}`
        : undefined
    }
  };


  return (
    <>
      {/* Datos estructurados JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <section 
        className="relative w-full h-[60vh] sm:h-[70vh] lg:h-screen overflow-hidden"
        aria-label="Portada principal del Consejo Regional de Puno"
        role="banner"
      >
        
      {/* Fondo base para evitar flash blanco */}
      <div className="absolute inset-0 bg-slate-900"></div>

      {/* Imagen de fondo completa - pantalla completa */}
      <AnimatePresence mode="sync">
        {currentPortada && (
          <motion.div
            key={`bg-${safeCurrentSlide}`}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0.0, 0.2, 1],
              opacity: { duration: 0.6 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={
                currentPortada.imagen
                  ? process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
                    currentPortada.imagen
                  : "/placeholder-hero.jpg"
              }
                alt={`Portada: ${currentPortada.titulo} - ${currentPortada.subtitulo}`}
              fill
              className="object-cover"
              quality={95}
                priority={safeCurrentSlide === 0}
                sizes="100vw"
                loading={safeCurrentSlide === 0 ? "eager" : "lazy"}
            />
            {/* Overlay transparente - sin opacidad */}
            <div className="absolute inset-0"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido centrado sobre la imagen */}
      <div className="relative z-10 h-full flex items-center justify-center py-8 sm:py-12 lg:py-0">
        <div className="w-4/5 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ">
            {/* Contenido de texto */}
              <header className="text-center lg:text-left">
              <AnimatePresence mode="wait">
                {currentPortada && (
                  <motion.div
                    key={`content-${safeCurrentSlide}`}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                      {/* Título principal con SEO optimizado */}
                    <motion.h1
                      className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide text-white leading-tight uppercase"
                      variants={textAnimation}
                      initial="hidden"
                      animate="visible"
                    >
                      {currentPortada.titulo?.split("").map((char, index) => (
                        <motion.span
                          key={`titulo-${safeCurrentSlide}-${index}-${char}`}
                          variants={letterAnimation}
                          className={
                            char === " " ? "inline-block w-2" : "inline-block"
                          }
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.h1>

                      {/* Subtítulo con marcado semántico */}
                    <motion.div
                      className="mb-4 sm:mb-6"
                      variants={textAnimation}
                      initial="hidden"
                      animate="visible"
                    >
                        <h2 className="text-base sm:text-lg lg:text-2xl text-blue-200 font-bold tracking-wider block ">
                        {currentPortada.subtitulo
                          ?.split("")
                          .map((char, index) => (
                            <motion.span
                              key={`subtitulo-${safeCurrentSlide}-${index}-${char}`}
                              variants={letterAnimation}
                              className={
                                char === " "
                                  ? "inline-block w-2"
                                  : "inline-block"
                              }
                            >
                              {char}
                            </motion.span>
                          ))}
                        </h2>
                    </motion.div>

                      {/* Descripción con mejor accesibilidad */}
                    <motion.p
                      className="mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-semibold tracking-wide"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                        role="text"
                    >
                      {currentPortada.descripcion}
                    </motion.p>
                    

                      {/* Botón con mejor accesibilidad */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {currentPortada.urlBoton && (
                        <Link
                          href={currentPortada.urlBoton}
                          target={
                            currentPortada.urlBoton.startsWith("https://")
                              ? "_blank"
                              : ""
                          }
                            rel={
                              currentPortada.urlBoton.startsWith("https://")
                                ? "noopener noreferrer"
                                : ""
                            }
                            className="group inline-flex items-center gap-3 bg-[#063585] hover:bg-blue-800 text-white px-7 py-3.5 rounded-lg font-bold tracking-wider text-sm uppercase transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/50 shadow-md"
                            aria-label={`${currentPortada.nombreBoton} - ${currentPortada.titulo}`}
                        >
                          {currentPortada.nombreBoton}
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                              aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              </header>

            {/* Espacio para equilibrio visual en desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

        {/* Redes Sociales con mejor accesibilidad */}
        <motion.aside
        className="absolute bottom-12 sm:bottom-16 lg:bottom-20 right-4 sm:right-8 z-20 hidden sm:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
          aria-label="Enlaces a redes sociales"
      >
        <div className="flex flex-col items-end">
          <h3 className="text-white text-sm font-bold mb-3 tracking-wider uppercase">
            Nuestras Redes
          </h3>
            <nav className="flex space-x-3" role="navigation" aria-label="Redes sociales">
            {/* Facebook */}
            {parametro?.facebook && (
            <Link
              href={parametro?.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-[#1877F2] hover:bg-[#166FE5] rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Síguenos en Facebook"
            >
              <FaFacebookF className="w-4 h-4 text-white" aria-hidden="true" />
            </Link>
            )}

            {/* Instagram */}
            {parametro?.instagram && (
            <Link
              href={parametro?.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:from-[#7A359C] hover:via-[#E91B1B] hover:to-[#E86F33] rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E4405F] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Síguenos en Instagram"
            >
              <FaInstagram className="w-5 h-5 text-white" aria-hidden="true" />
            </Link>
            )}

            {/* Twitter/X */}
            {parametro?.twitter && (
            <Link
              href={parametro?.twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-[#1DA1F2] hover:bg-[#1A91DA] rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Síguenos en Twitter"
            >
              <FaTwitter className="w-4 h-4 text-white" aria-hidden="true" />
            </Link>
            )}

            {/* YouTube */}
            {parametro?.youtube && (
            <Link
              href={parametro?.youtube || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-[#FF0000] hover:bg-[#E60000] rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Suscríbete a nuestro canal de YouTube"
            >
              <FaYoutube className="w-5 h-5 text-white" aria-hidden="true" />
            </Link>
            )}
            </nav>
          </div>
        </motion.aside>

        {/* Navigation Dots con mejor accesibilidad */}
      {portadas.length > 1 && (
          <nav 
            className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            aria-label="Control del carrusel de portadas"
            role="tablist"
          >
          <div className="flex space-x-3">
            {portadas.map((_, index: number) => (
              <button
                key={`dot-${index}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black ${
                  safeCurrentSlide === index
                    ? "bg-[#063585] scale-125 shadow-blue-500/50 shadow-lg"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 3000);
                  }}
                  aria-label={`Ir a la portada ${index + 1} de ${portadas.length}`}
                  aria-selected={safeCurrentSlide === index}
                  role="tab"
              />
            ))}
          </div>
          </nav>
      )}

        {/* Indicador de progreso mejorado */}
        {portadas.length > 1 && isAutoPlaying && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20 z-20"
            role="progressbar"
            aria-label="Progreso del carrusel automático"
            aria-valuenow={(safeCurrentSlide + 1)}
            aria-valuemin={1}
            aria-valuemax={portadas.length}
          >
          <motion.div
            className="h-full bg-gradient-to-r from-[#063585] to-blue-700"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
            key={`progress-${safeCurrentSlide}`}
          />
        </div>
      )}
      </section>
    </>
  );
}
