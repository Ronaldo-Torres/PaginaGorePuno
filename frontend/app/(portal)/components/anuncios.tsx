"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { 
  FaBullhorn, 
  FaInfoCircle, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt,
  FaBuilding,
  FaExpand,
  FaCompress
} from "react-icons/fa";
import PrincipalService from "@/services/PrincipalService";

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  url: string | null; // URL de la imagen
  fecha: string;
  activo: boolean;
  tipo: string | null;
  imagen: string | null;
  atentamente: string | null;
  createdAt: string;
  updatedAt: string;
}

export function Anuncios({
  logoInstitucionDark,
  logoInstitucionLight,
  isHomePage = false,
}: {
  logoInstitucionDark: string;
  logoInstitucionLight: string;
  isHomePage?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentAnuncioIndex, setCurrentAnuncioIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAnunciosActivos = async () => {
    setLoading(true);
    try {
      // getAnuncioActivo ya devuelve response.data directamente
      const anunciosData = await PrincipalService.getAnuncioActivo();
      
      // Asegurar que es un array y filtrar anuncios válidos
      const anunciosActivos = Array.isArray(anunciosData) 
        ? anunciosData.filter((anuncio: any) => anuncio && anuncio.titulo && anuncio.descripcion && anuncio.activo)
        : [];
      setAnuncios(anunciosActivos);
      setCurrentAnuncioIndex(0);
    } catch (error) {
      console.error("Error al obtener los anuncios:", error);
      setAnuncios([]);
    } finally {
      setLoading(false);
    }
  };

    // Obtener el anuncio actual basado en el índice
  const anuncioActual = anuncios.length > 0 ? anuncios[currentAnuncioIndex] : null;

  useEffect(() => {
    if (loading) {
      getAnunciosActivos();
    }
  }, [loading]);

  // Carrusel automático para múltiples anuncios (más de 2)
  useEffect(() => {
    if (anuncios.length >= 2 && isOpen) {
      const interval = setInterval(() => {
        setCurrentAnuncioIndex((prevIndex) => 
          prevIndex === anuncios.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Cambiar cada 8 segundos
      return () => clearInterval(interval);
    }
  }, [anuncios.length, isOpen]);

  // Mostrar anuncios automáticamente
  useEffect(() => {
    if (anuncios.length > 0 && !loading) {
      // Verificar sessionStorage solo para evitar mostrar repetidamente en la misma sesión
      const anuncioMostrado = sessionStorage.getItem("anuncioMostrado");
      const anuncioCerrado = sessionStorage.getItem("anuncioCerrado");
      
      // Mostrar automáticamente si no se ha mostrado en esta sesión
      if (!anuncioMostrado && !anuncioCerrado && !isOpen && !isMinimized) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setIsMinimized(false);
          sessionStorage.setItem("anuncioMostrado", "true");
        }, 2000);
        return () => clearTimeout(timer);
      } else if (anuncioCerrado && !isOpen && !isMinimized) {
        // Si fue cerrado, mostrar minimizado
        setIsMinimized(true);
      }
    }
  }, [anuncios, loading]);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
    // Guardar que el usuario cerró el anuncio en esta sesión
    sessionStorage.setItem("anuncioCerrado", "true");
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };
  // No renderizar nada si no hay anuncios
  if (anuncios.length === 0) {
    return null;
      }

    return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          
          {/* Header con logo del gobierno */}
          <div className="relative bg-white border-b border-gray-200 p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Cerrar anuncio"
            >
              <FaTimes className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="flex items-center justify-center gap-4">
              <Image
                src={'/oscuro.png'}
                alt="Logo Gobierno Regional de Puno"
                width={60}
                height={60}
                className="h-14 w-auto"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#063585] uppercase tracking-wide">
                  GOBIERNO REGIONAL PUNO
                </h2>
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                
                </p>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 space-y-6">
            {anuncioActual?.url && (
              <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${anuncioActual.url}`}
                  alt="Imagen del anuncio"
                  width={600}
                  height={300}
                  className="w-full h-auto object-cover max-h-72"
                  onError={() => {
                    // Error al cargar imagen
                  }}
                />
              </div>
            )}
            
            {/* Tipo y título del anuncio */}
            <div className="space-y-4">
              
              {/* Título del anuncio */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#063585] rounded-full">
                    <FaInfoCircle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#063585] uppercase tracking-wide">
                    {anuncioActual?.titulo}
                  </h4>
                </div>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-justify text-base">
                {anuncioActual?.descripcion}
              </p>
            </div>
            
            {/* Información adicional */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-3 h-3" />
                <span>
                  {anuncioActual?.fecha ? new Date(anuncioActual.fecha).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </span>
              </div>
              
              {anuncioActual?.atentamente && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-3 h-3" />
                  <span className="font-medium">{anuncioActual.atentamente}</span>
                </div>
              )}
            </div>

            {/* Indicadores de carrusel */}
            {anuncios.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {anuncios.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAnuncioIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentAnuncioIndex === index 
                        ? "bg-[#063585] scale-125 shadow-lg" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Ir al anuncio ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-2 right-6 bg-gradient-to-r from-[#063585] to-blue-700 text-white rounded-lg shadow-xl cursor-pointer z-40 hover:shadow-2xl transition-all duration-300 hover:scale-105 w-96"
            onClick={handleMaximize}
          >
            <div className="flex items-center p-2 space-x-3">
              <div className="flex-shrink-0">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <FaBullhorn className="w-3 h-3" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    Gobierno Regional de Puno
                  </span>
                  {anuncios.length > 1 && (
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      {currentAnuncioIndex + 1}/{anuncios.length}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium truncate">
                  {anuncioActual?.titulo}
                </p>
              </div>
              
              <div className="flex gap-1">
                <button
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMaximize();
                  }}
                  aria-label="Expandir anuncio"
                >
                  <FaExpand className="w-3 h-3" />
                </button>
                <button
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(false);
                    sessionStorage.setItem("anuncioCerrado", "true");
                  }}
                  aria-label="Cerrar anuncio"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>
          
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
