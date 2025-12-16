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
        className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden"
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
            className="absolute inset-0 mt-40"
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


        {/* Redes Sociales con mejor accesibilidad */}

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
