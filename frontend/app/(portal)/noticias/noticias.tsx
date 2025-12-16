"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FaCalendarAlt,
  FaFacebook,
  FaNewspaper,
  FaShare,
  FaTwitter,
  FaLink,
  FaEye,
  FaClock,
  FaUser,
  FaArrowRight,
  FaImages,
  FaHashtag,
} from "react-icons/fa";
import Image from "next/image";
import PrincipalService from "@/services/PrincipalService";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  card: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  }
};

interface NoticiaResponse {
  id: number;
  titulo: string;
  gorro: string;
  bajada: string;
  introduccion: string;
  conclusion: string;
  contenido: string;
  fechaPublicacion: string;
  categoria: string;
  destacado: boolean;
  principal: boolean;
  destacadoAntigua: boolean;
  url: string;
  activo: boolean;
  urlImagenPrincipal: string | null;
  autor: string;
}

export default function Noticias() {
  const [noticias, setNoticias] = useState<NoticiaResponse[]>([]);
  const [noticiaDestacada, setNoticiaDestacada] = useState<NoticiaResponse | null>(null);
  const [noticiasNormales, setNoticiasNormales] = useState<NoticiaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    PrincipalService.getNoticias().then((res) => {
      // Encontrar la noticia destacada
      const destacada = res.find((noticia: NoticiaResponse) => noticia.destacado);
      setNoticiaDestacada(destacada || null);

      // Filtrar noticias normales (no destacadas ni destacadas antiguas)
      const normales = res.filter(
        (noticia: NoticiaResponse) => !noticia.destacado && !noticia.destacadoAntigua
      );
      setNoticiasNormales(normales);
      setIsLoading(false);
    });
  }, []);

  // Funciones de compartir
  const compartirEnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const compartirEnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const texto = encodeURIComponent(noticiaDestacada?.titulo || "");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${texto}`, "_blank");
  };

  const copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
    // Aquí podrías usar un toast en lugar de alert
    alert("Enlace copiado al portapapeles");
  };

  const abrirDetallesNoticia = (noticia: NoticiaResponse) => {
    router.push(`/noticias/${noticia.id}`);
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container as any}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        {/* Header Elegante */}
        <motion.div
          variants={animations.title as any}
          className="mb-12 text-center relative mt-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              Noticias y Actualizaciones
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaNewspaper className="h-5 w-5 mr-2" />
              <span className="font-semibold tracking-wide">
                Gobierno Regional de Puno
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mt-4"
            >
              Mantente informado sobre las últimas noticias y actividades del Gobierno Regional de Puno
            </motion.p>
          </div>
        </motion.div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Columna Principal de Noticias */}
          <div className="lg:col-span-3 space-y-8">
            {/* Noticia Destacada */}
            <motion.div
              variants={animations.item as any}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              whileHover={{
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h2 className="flex items-center gap-2 font-bold text-[#184482] text-xl">
                  <FaNewspaper className="h-5 w-5" />
                  Noticia Destacada
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                    Últimas
                  </Badge>
                </h2>
              </div>

              {noticiaDestacada ? (
                <div className="relative">
                  {noticiaDestacada.urlImagenPrincipal && (
                    <div className="relative h-[400px] overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${noticiaDestacada.urlImagenPrincipal}`}
                        alt={noticiaDestacada.titulo}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-6 relative">
                    {noticiaDestacada.urlImagenPrincipal && (
                      <div className="absolute -top-20 left-6 right-6 z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                            {noticiaDestacada.titulo}
                          </h1>
                          {noticiaDestacada.gorro && (
                            <div 
                              className="text-gray-700 font-medium mb-3"
                              dangerouslySetInnerHTML={{ __html: noticiaDestacada.gorro }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {!noticiaDestacada.urlImagenPrincipal && (
                      <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                          {noticiaDestacada.titulo}
                        </h1>
                        {noticiaDestacada.gorro && (
                          <div 
                            className="text-gray-700 font-medium mb-3"
                            dangerouslySetInnerHTML={{ __html: noticiaDestacada.gorro }}
                          />
                        )}
                      </div>
                    )}

                    <div className={noticiaDestacada.urlImagenPrincipal ? "mt-24" : ""}>
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="h-4 w-4 text-[#184482]" />
                          <span>{formatearFecha(noticiaDestacada.fechaPublicacion)}</span>
                        </div>
                        {noticiaDestacada.autor && (
                          <div className="flex items-center gap-1">
                            <FaUser className="h-4 w-4 text-green-600" />
                            <span>{noticiaDestacada.autor}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FaHashtag className="h-4 w-4 text-purple-600" />
                          <span>{noticiaDestacada.categoria || 'General'}</span>
                        </div>
                      </div>

                      {noticiaDestacada.bajada && (
                        <div 
                          className="text-gray-700 leading-relaxed mb-6 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: noticiaDestacada.bajada }}
                        />
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Button
                          onClick={() => abrirDetallesNoticia(noticiaDestacada)}
                          className="bg-[#184482] hover:bg-[#1a4c94] text-white px-6 py-3 rounded-full transition-all duration-300"
                        >
                          <span>Leer más</span>
                          <FaArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 mr-2">Compartir:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={compartirEnFacebook}
                            className="p-2 h-10 w-10 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <FaFacebook className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={compartirEnTwitter}
                            className="p-2 h-10 w-10 rounded-full border-sky-200 text-sky-600 hover:bg-sky-50"
                          >
                            <FaTwitter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copiarEnlace}
                            className="p-2 h-10 w-10 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            <FaLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <FaNewspaper className="text-6xl mb-4 mx-auto text-gray-300" />
                    <p className="text-xl font-medium">No hay noticia destacada disponible</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Lista de Noticias */}
            <motion.div
              variants={animations.item as any}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-[#184482] text-xl">
                  <FaImages className="h-5 w-5" />
                  Últimas Noticias
                  <Badge variant="outline" className="ml-2">
                    {noticiasNormales.length} noticias
                  </Badge>
                </h2>
                <Link
                  href="/noticias/todas"
                  className="text-[#184482] hover:text-[#1a4c94] font-semibold text-sm transition-colors duration-300 flex items-center gap-1"
                >
                  Ver todas
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-10 h-10 border-4 border-[#184482] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-600">Cargando noticias...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Primeras 3 noticias en cards grandes */}
                    {noticiasNormales.slice(0, 3).map((noticia, index) => (
                      <motion.div
                        key={noticia.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#184482]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => abrirDetallesNoticia(noticia)}
                      >
                        <div className="md:flex">
                          {noticia.urlImagenPrincipal && (
                            <div className="md:w-1/3">
                              <div className="relative h-48 md:h-full">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${noticia.urlImagenPrincipal}`}
                                  alt={noticia.titulo}
                                  fill
                                  className="object-cover transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            </div>
                          )}
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Últimas Noticias
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FaCalendarAlt className="h-3 w-3" />
                                <span>{formatearFecha(noticia.fechaPublicacion)}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                              {noticia.titulo}
                            </h3>
                            
                            {noticia.gorro && (
                              <div 
                                className="text-sm text-gray-600 line-clamp-1 mb-2 font-medium"
                                dangerouslySetInnerHTML={{ __html: noticia.gorro }}
                              />
                            )}
                            
                            {noticia.bajada && (
                              <div 
                                className="text-gray-700 line-clamp-2 leading-relaxed mb-4"
                                dangerouslySetInnerHTML={{ __html: noticia.bajada }}
                              />
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {noticia.autor && (
                                  <div className="flex items-center gap-1">
                                    <FaUser className="h-3 w-3" />
                                    <span>{noticia.autor}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <FaHashtag className="h-3 w-3" />
                                  <span>{noticia.categoria || 'General'}</span>
                                </div>
                              </div>
                              
                              <span className="text-[#184482] hover:text-[#1a4c94] font-semibold text-sm transition-colors duration-300 flex items-center gap-1">
                                Leer más
                                <FaArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Grid de noticias adicionales */}
                    {noticiasNormales.length > 3 && (
                      <div className="grid md:grid-cols-2 gap-4 mt-8">
                        {noticiasNormales.slice(3, 9).map((noticia, index) => (
                          <motion.div
                            key={noticia.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            className="border border-gray-200 rounded-xl p-4 hover:border-[#184482]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => abrirDetallesNoticia(noticia)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                Anteriores
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FaCalendarAlt className="h-3 w-3" />
                                <span>{formatearFecha(noticia.fechaPublicacion)}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                              {noticia.titulo}
                            </h3>
                            
                            {noticia.gorro && (
                              <div 
                                className="text-sm text-gray-600 line-clamp-1 mb-2"
                                dangerouslySetInnerHTML={{ __html: noticia.gorro }}
                              />
                            )}
                            
                            {noticia.bajada && (
                              <div 
                                className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-3"
                                dangerouslySetInnerHTML={{ __html: noticia.bajada }}
                              />
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {noticia.autor && (
                                  <div className="flex items-center gap-1">
                                    <FaUser className="h-3 w-3" />
                                    <span>{noticia.autor}</span>
                                  </div>
                                )}
                              </div>
                              
                              <span className="text-[#184482] hover:text-[#1a4c94] font-semibold text-sm transition-colors duration-300 flex items-center gap-1">
                                Leer más
                                <FaArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Botón Ver Más */}
                    <div className="flex justify-center mt-8">
                      <Link
                        href="/noticias/todas"
                        className="bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                      >
                        Ver todas las noticias
                        <FaArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Redes Sociales */}
          <div className="lg:col-span-1">
            <motion.div
              variants={animations.item as any}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 sticky top-4"
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h2 className="flex items-center gap-2 font-bold text-[#184482]">
                  <FaShare className="h-4 w-4" />
                  Redes Sociales
                </h2>
              </div>
              
              <div className="p-6">
                <Tabs defaultValue="facebook" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-4 bg-gray-100">
                    {redesSocialesEmbed.map((red, index) => (
                      <TabsTrigger
                        key={index}
                        value={red.id}
                        className="flex items-center gap-2 data-[state=active]:bg-[#184482] data-[state=active]:text-white font-semibold"
                      >
                        {red.icono}
                        <span>{red.nombre}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {redesSocialesEmbed.map((red, index) => (
                    <TabsContent
                      key={index}
                      value={red.id}
                      className="border rounded-xl overflow-hidden bg-gray-50"
                    >
                      <div className={red.contenedorClase}>
                        <iframe
                          src={red.embedUrl}
                          width={red.ancho}
                          height={red.alto}
                          style={{ border: "none", overflow: "hidden" }}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen={true}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        ></iframe>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const redesSocialesEmbed = [
  {
    id: "facebook",
    nombre: "Facebook",
    icono: <FaFacebook className="h-4 w-4" />,
    embedUrl:
      "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FGobiernoRegionalPuno&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId",
    ancho: "340",
    alto: "500",
    contenedorClase: "w-full max-w-[340px] mx-auto",
  },
]; 