"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import "./galeria.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaShareAlt,
  FaExpand,
  FaImages,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import PrincipalService from "@/services/PrincipalService";
import { Loader2 } from "lucide-react";

interface Foto {
  id: string;
  nombre: string;
  descripcion: string;
  urlImagen: string;
  createdAt: string;
  updatedAt: string;
  consejero: any;
}

interface ConsejeroProp {
  id: string;
}

export default function GaleriaPage({ params }: { params: ConsejeroProp }) {
  const { id } = params;
  const [consejero, setConsejero] = useState<any>(null);
  const [fotosGaleria, setFotosGaleria] = useState<Foto[]>([]);
  const [imagenActual, setImagenActual] = useState(0);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const [modalAmpliado, setModalAmpliado] = useState(false);
  const [modoVisualizacion, setModoVisualizacion] = useState<"grid" | "carousel">("grid");
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalFotos, setTotalFotos] = useState(0);

  const getConsejero = async () => {
    try {
      const response = await PrincipalService.getConsejero(parseInt(id));
      setConsejero(response.data);
    } catch (error) {
      console.error("Error al cargar datos del consejero:", error);
    }
  };

  const getGaleriaCompleta = async (page: number = 0) => {
    setLoading(true);
    try {
      const response = await PrincipalService.getGaleriaConsejeros(
        parseInt(id), 
        page, 
        20, // 20 fotos por página
        'createdAt', 
        'desc' // Más recientes primero
      );
      setFotosGaleria(response.content || []);
      setTotalFotos(response.totalElements || 0);
      setPaginaActual(page);
    } catch (error) {
      console.error("Error al cargar galería:", error);
      setFotosGaleria([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConsejero();
    getGaleriaCompleta();
  }, [id]);

  // Navegación con swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => siguienteImagen(),
    onSwipedRight: () => imagenAnterior(),
    trackMouse: true,
  });

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % fotosGaleria.length);
  };

  const imagenAnterior = () => {
    setImagenActual((prev) => (prev - 1 + fotosGaleria.length) % fotosGaleria.length);
  };

  const descargarImagen = async (urlImagen: string, nombre: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${urlImagen}`);
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `${nombre.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  const compartirImagen = async (descripcion: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Foto: ${descripcion}`,
          text: `Mira esta foto de ${consejero?.nombre} ${consejero?.apellido}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const abrirModalAmpliado = () => {
    setModalAmpliado(true);
  };

  const cerrarModalAmpliado = () => {
    setModalAmpliado(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 via-white to-gray-100 mt-4 flex items-center justify-center">
        <Loader2 className="animate-spin rounded-full "></Loader2>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 via-white to-gray-100 mt-4 gallery-container">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-gray-200 relative z-10 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/consejeros/${id}`}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejero?.url_imagen}`}
                    alt={`${consejero?.nombre} ${consejero?.apellido}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {consejero?.nombre} {consejero?.apellido}
                  </h1>
                  <p className="text-sm text-gray-600">Galería de fotos</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {fotosGaleria.length} fotografías
              </span>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setModoVisualizacion("grid")}
                  className={`px-3 py-2 text-sm transition-colors ${
                    modoVisualizacion === "grid" 
                      ? "bg-blue-600 text-white" 
                      : "bg-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaImages className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setModoVisualizacion("carousel")}
                  className={`px-3 py-2 text-sm transition-colors ${
                    modoVisualizacion === "carousel" 
                      ? "bg-blue-600 text-white" 
                      : "bg-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaUser className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {modoVisualizacion === "grid" ? (
            /* Vista de Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {fotosGaleria.map((foto, index) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 border border-gray-200"
                  onClick={() => {
                    setImagenActual(index);
                    setModoVisualizacion("carousel");
                  }}
                >
                  <div className="aspect-square relative cursor-pointer">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${foto.urlImagen}`}
                      alt={foto.descripcion}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-overlay">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-medium text-sm mb-1 truncate">
                            {foto.descripcion}
                          </h3>
                          <p className="text-gray-200 text-xs">
                            {foto.createdAt && new Date(foto.createdAt).toLocaleDateString('es-PE')}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4">
                          <FaExpand className="h-5 w-5 text-white" />
                        </div>
                        
                        {/* Botón de expansión rápida desde grid */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagenActual(index);
                            setModalAmpliado(true);
                          }}
                          className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-300 backdrop-blur-sm hover:scale-110"
                          title="Ver en tamaño completo"
                        >
                          <FaExpand className="h-3 w-3" />
                        </button>
                      </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Vista de Carousel */
            <motion.div
              key="carousel"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="relative"
              {...handlers}
            >
              {/* Imagen principal */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl mb-6 border border-gray-200">
                <div className="aspect-video relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${fotosGaleria[imagenActual]?.urlImagen}`}
                    alt={fotosGaleria[imagenActual]?.descripcion}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={imagenAnterior}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110 backdrop-blur-sm gallery-controls shadow-lg border border-gray-200"
                >
                  <FaChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={siguienteImagen}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110 backdrop-blur-sm gallery-controls shadow-lg border border-gray-200"
                >
                  <FaChevronRight className="h-6 w-6" />
                </button>

                {/* Controles superiores */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    onClick={() => descargarImagen(fotosGaleria[imagenActual]?.urlImagen, fotosGaleria[imagenActual]?.descripcion)}
                    className="bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors backdrop-blur-sm gallery-controls shadow-lg border border-gray-200"
                    title="Descargar imagen"
                  >
                    <FaDownload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={abrirModalAmpliado}
                    className="bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors backdrop-blur-sm gallery-controls shadow-lg border border-gray-200"
                    title="Ver en tamaño completo"
                  >
                    <FaExpand className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => compartirImagen(fotosGaleria[imagenActual]?.descripcion)}
                    className="bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors backdrop-blur-sm gallery-controls shadow-lg border border-gray-200"
                    title="Compartir imagen"
                  >
                    <FaShareAlt className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Información de la imagen */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {fotosGaleria[imagenActual]?.descripcion}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Fotografía {imagenActual + 1} de {fotosGaleria.length} • {" "}
                      {fotosGaleria[imagenActual]?.createdAt && 
                        new Date(fotosGaleria[imagenActual].createdAt).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {fotosGaleria.map((foto, index) => (
                    <button
                      key={foto.id}
                      onClick={() => setImagenActual(index)}
                      className={`
                        flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300
                        ${index === imagenActual 
                          ? 'border-blue-500 ring-2 ring-blue-500/50 scale-110' 
                          : 'border-gray-300 hover:border-blue-300 hover:scale-105'
                        }
                      `}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${foto.urlImagen}`}
                        alt={foto.descripcion}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal Ampliado - Solo imagen en ancho completo */}
      <Dialog open={modalAmpliado} onOpenChange={setModalAmpliado}>
        <DialogContent className="p-0 max-w-95vw max-h-95vh w-full h-full border-none shadow-none bg-black">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Imagen en ancho completo */}
            <div className="w-full h-full relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${fotosGaleria[imagenActual]?.urlImagen}`}
                alt={fotosGaleria[imagenActual]?.descripcion}
                fill
                className="object-contain w-full"
                priority
                quality={100}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 