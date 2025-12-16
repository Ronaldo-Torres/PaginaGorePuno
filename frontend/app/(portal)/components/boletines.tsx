"use client";

import React, { useState, useEffect, useRef, SVGProps } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrincipalService from "@/services/PrincipalService";
import ViewerWrapper from "./view-pdf";
import { motion } from "framer-motion";
import { Calendar, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  bulletin: any;
  bulletins: any[];
}

export function Pdf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      width="2em"
      height="2em"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m12-6a1 1 0 1 0-2 0v6.586l-2.293-2.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L13 12.586zM7 18a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  },
};

const BulletinModal: React.FC<BulletinModalProps> = ({
  isOpen,
  onClose,
  bulletin,
  bulletins,
}) => {
  if (!bulletin) return null;

  const handleDownload = (url: string, fileName: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${url}`;

    // Crear un enlace temporal y simular clic para descargar
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] w-full h-[95vh] p-0 bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="flex flex-col h-full rounded-xl overflow-hidden">
          {/* Header simplificado */}
          <div className="flex-shrink-0 bg-[#063585] text-white rounded-t-xl">
            <div className="p-3 md:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg className="h-5 w-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm md:text-base font-bold text-white truncate">
                      {bulletin.titulo}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(bulletin.fechaPublicacion)}</span>
                      {bulletin.categoria && (
                        <>
                          <span>•</span>
                          <span className="truncate">{bulletin.categoria}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 flex-shrink-0 mr-8"
                  onClick={() =>
                    handleDownload(bulletin.urlDocumento, bulletin.titulo)
                  }
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs m">Descargar</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido del boletín con scroll completo */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="min-h-[80vh]">
              <ViewerWrapper
                fileUrl={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${bulletin.urlDocumento}`}
              />
            </div>

            {/* Información adicional al final del contenido */}
            <div className="bg-white border-t border-gray-200 mt-4">
              <div className="p-4 rounded-b-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-[#063585] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#063585] mb-2">Información del Boletín</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-[#063585]" />
                        <span><strong>Fecha de publicación:</strong> {formatDate(bulletin.fechaPublicacion)}</span>
                      </div>
                      {bulletin.categoria && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 text-[#063585]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
                          </svg>
                          <span><strong>Categoría:</strong> {bulletin.categoria}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Boletines({ desde, tituloBoletin, descripcionBoletin }: { desde?: string, tituloBoletin: string, descripcionBoletin: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBulletin, setSelectedBulletin] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getItemsPerPage = () => {
    if (windowWidth < 640 || desde === "noticias") {
      return 1;
    } else if (windowWidth < 1024) {
      return 2;
    } else {
      return 3;
    }
  };

  const getBulletins = async () => {
    setLoading(true);
    const response = await PrincipalService.getBoletines();
    console.log("boletines:", response.data)
    setBulletins(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getBulletins();

    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (bulletins.length > getItemsPerPage()) {
      startAutoplay();
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [bulletins, windowWidth]);

  const itemsPerPage = getItemsPerPage();

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      nextBulletin();
    }, 5000);
  };

  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const resumeAutoplay = () => {
    if (!autoplayRef.current && bulletins.length > getItemsPerPage()) {
      startAutoplay();
    }
  };

  const nextBulletin = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prev) => {
      const totalSlides = Math.ceil(bulletins.length / getItemsPerPage());
      const currentSlide = Math.floor(prev / getItemsPerPage());
      const nextSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
      return nextSlide * getItemsPerPage();
    });

    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevBulletin = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prev) => {
      const totalSlides = Math.ceil(bulletins.length / getItemsPerPage());
      const currentSlide = Math.floor(prev / getItemsPerPage());
      const prevSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
      return prevSlide * getItemsPerPage();
    });

    setTimeout(() => setIsTransitioning(false), 600);
  };

  const openModal = (bulletin: any) => {
    setSelectedBulletin(bulletin);
    console.log("buylletin: ", bulletin)
    setIsModalOpen(true);
    pauseAutoplay();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resumeAutoplay();
  };

  const getCurrentPage = () => {
    return Math.floor(currentIndex / getItemsPerPage());
  };


  return (
    <section className="bg-white py-16">
      <div className="w-11/12 md:w-4/5 mx-auto px-4 bg-[#14467B] rounded-4xl py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-wide">
            {tituloBoletin || ""}
          </h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-0.5 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-16 h-0.5 bg-white rounded-full"></div>
          </div>

          {/* <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            {descripcionBoletin || ""}
          </p> */}

        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[350px] space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#063585] border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-[#063585] font-medium animate-pulse">
              Cargando boletines...
            </div>
          </div>
        ) : bulletins.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hay boletines disponibles.
          </div>
        ) : (
          <motion.div
            variants={animations.container}
            initial="hidden"
            animate="visible"
            className="relative max-w-7xl mx-auto"
          >
            {/* Carrusel mejorado */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="transition-transform duration-500 ease-out flex"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {/* Generar slides basado en el tamaño de pantalla */}
                {Array.from(
                  { length: Math.ceil(bulletins.length / getItemsPerPage()) },
                  (_, slideIndex) => {
                    const startIndex = slideIndex * getItemsPerPage();
                    const endIndex = Math.min(
                      startIndex + getItemsPerPage(),
                      bulletins.length
                    );
                    const slideBulletins = bulletins.slice(
                      startIndex,
                      endIndex
                    );

                    return (
                      <div
                        key={slideIndex}
                        className="w-full flex-shrink-0"
                      >
                        <div className="flex justify-center items-center gap-8 p-4">
                          {slideBulletins.map((bulletin) => (

                            <motion.div
                              key={bulletin.id}
                              variants={animations.item}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer w-80 flex-shrink-0"
                              onClick={() => openModal(bulletin)}
                            >

                              {/* <h1 className="my-20">{process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "xdxdxd"}</h1> */}
                              {/* <h1 className="my-20">{bulletin.imagenPrincipalUrl || "xd"}</h1> */}


                              {/* Imagen más rectangular en vertical */}
                              <div className="relative h-80 overflow-hidden">

                                {/* <img
                                  src={
                                    process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
                                    bulletin.imagenPrincipalUrl
                                  }
                                  alt={bulletin.titulo}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    const placeholder = "/placeholder.svg";
                                    if (e.currentTarget.src !== window.location.origin + placeholder) {
                                      e.currentTarget.src = placeholder;
                                    }
                                  }}
                                /> */}

                                <img
                                  src={
                                    bulletin.imagenPrincipalUrl
                                      ? process.env.NEXT_PUBLIC_STORAGE_BASE_URL + bulletin.imagenPrincipalUrl
                                      : "/placeholder.svg"
                                  }
                                  alt={bulletin.titulo}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />


                                {/* Overlay con gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Badge de fecha */}
                                <div className="absolute top-3 left-3">
                                  <div className="bg-white/90 backdrop-blur-sm text-[#063585] px-2 py-1 rounded-md text-xs font-medium shadow-lg flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(bulletin.fechaPublicacion)}
                                  </div>
                                </div>

                                {/* Botón de descarga */}
                                <a
                                  href={
                                    process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
                                    bulletin.urlDocumento
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#063585] p-1.5 rounded-md shadow-lg hover:bg-[#063585] hover:text-white transition-all duration-300 group-hover:scale-110"
                                >
                                  <Download className="w-3 h-3" />
                                </a>

                                {/* Overlay de acción */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="bg-white/95 backdrop-blur-sm text-[#063585] px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
                                    <Eye className="w-4 h-4" />
                                    Ver Boletín
                                  </div>
                                </div>
                              </div>

                              {/* Contenido de la tarjeta */}
                              <div className="p-4">
                                <h3 className="text-base font-semibold text-[#063585] mb-2 line-clamp-2 leading-tight group-hover:text-[#0a4a9a] transition-colors">
                                  {bulletin.titulo}
                                </h3>

                                {bulletin.categoria && (
                                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                    {bulletin.categoria}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Botones de navegación mejorados */}
              {bulletins.length > getItemsPerPage() && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:border-[#063585]/20"
                    onClick={prevBulletin}
                    disabled={isTransitioning}
                  >
                    <ChevronLeft className="h-6 w-6 text-[#063585]" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:border-[#063585]/20"
                    onClick={nextBulletin}
                    disabled={isTransitioning}
                  >
                    <ChevronRight className="h-6 w-6 text-[#063585]" />
                  </button>
                </>
              )}
            </div>

            {/* Indicadores de paginación mejorados */}
            {bulletins.length > getItemsPerPage() && (
              <div className="flex justify-center items-center gap-3 mt-8">
                {Array.from(
                  { length: Math.ceil(bulletins.length / getItemsPerPage()) },
                  (_, index) => (
                    <button
                      key={index}
                      className={`h-3 rounded-full transition-all duration-300 ${getCurrentPage() === index
                        ? "bg-[#063585] w-8"
                        : "bg-gray-200 hover:bg-[#063585]/30 w-3"
                        }`}
                      onClick={() => {
                        if (!isTransitioning) {
                          setIsTransitioning(true);
                          setCurrentIndex(index * getItemsPerPage());
                          setTimeout(() => setIsTransitioning(false), 600);
                        }
                      }}
                      disabled={isTransitioning}
                    />
                  )
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
      <BulletinModal
        isOpen={isModalOpen}
        onClose={closeModal}
        bulletin={selectedBulletin}
        bulletins={bulletins}
      />
    </section>
  );
}
