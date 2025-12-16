"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import PrincipalService from "@/services/PrincipalService";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSearch,
  FaNewspaper,
  FaArrowRight,
  FaFilter,
  FaEye,
  FaTag,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

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

function TodasNoticiasContent() {
  const [todasLasNoticias, setTodasLasNoticias] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const consejero = searchParams.get("consejero");
  const comision = searchParams.get("comision");
  const tag = searchParams.get("tag");

  const getTodasLasNoticias = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await PrincipalService.getNoticiasByCategoria({
        titulo: searchQuery,
        consejero: consejero,
        comision: comision,
        tag: tag,
        page: currentPage,
        size: 9,
      });
      setTodasLasNoticias(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTodasLasNoticias();
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const truncarContenido = (contenido: string, maxLength: number = 150) => {
    const textoLimpio = contenido.replace(/<[^>]*>/g, '');
    return textoLimpio.length > maxLength ? `${textoLimpio.slice(0, maxLength)}...` : textoLimpio;
  };

  const NewsSkeleton = () => (
    <Card className="overflow-hidden transition-all h-full flex flex-col animate-pulse rounded-2xl border-0 shadow-lg">
      <div className="relative h-48">
        <Skeleton className="w-full h-full rounded-t-2xl" />
      </div>
      <CardHeader className="pb-2 flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </CardContent>
      <CardFooter className="flex justify-end p-4">
        <Skeleton className="h-10 w-24 rounded-full" />
      </CardFooter>
    </Card>
  );

  const activeFilters = [
    { key: 'consejero', value: consejero, icon: FaUser, label: 'Consejero' },
    { key: 'comision', value: comision, icon: FaBuilding, label: 'Comisión' },
    { key: 'tag', value: tag, icon: FaTag, label: 'Tag' }
  ].filter(filter => filter.value);

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
          className="mb-12 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] transform -skew-y-1 rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              Todas las Noticias
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaNewspaper className="h-4 w-4 mr-2" />
              <span className="font-semibold tracking-wide text-sm">
                Archivo Completo de Noticias
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Botón de Volver y Filtros */}
        <motion.div
          variants={animations.item as any}
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <Link
            href="/noticias"
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group font-medium text-sm"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <FaArrowLeft className="h-3 w-3" />
            </div>
            <span>Volver a noticias principales</span>
          </Link>

          {/* Filtros Activos */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
              {activeFilters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Badge
                    key={filter.key}
                    variant="outline"
                    className="bg-[#184482]/10 text-[#184482] border-[#184482]/30 px-3 py-1 rounded-full"
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {filter.label}: {filter.value}
                  </Badge>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Barra de Búsqueda */}
        <motion.div
          variants={animations.item as any}
          className="mb-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
        >
          <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
            <h2 className="flex items-center gap-2 font-bold text-[#184482]">
              <FaSearch className="h-4 w-4" />
              Buscar Noticias
              {todasLasNoticias.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {todasLasNoticias.length} resultados
                </Badge>
              )}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, contenido o autor..."
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-[#184482] focus:ring-[#184482]/20 transition-all duration-300 rounded-xl text-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getTodasLasNoticias();
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => getTodasLasNoticias()}
                className="px-6 h-12 bg-[#184482] hover:bg-[#1a4c94] text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <FaSearch className="h-4 w-4" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Grid de Noticias */}
        <motion.div
          variants={animations.item as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NewsSkeleton />
                </motion.div>
              ))
            : todasLasNoticias.map((noticia, index) => (
                <motion.div
                  key={noticia.id}
                  variants={animations.card as any}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full flex flex-col rounded-2xl border-0 shadow-lg bg-white group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${noticia?.urlImagenPrincipal}` || "/placeholder.svg"
                        }
                        alt={noticia?.titulo || "Noticia"}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      
                      {/* Badges superpuestos */}
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm border-white/50 text-gray-800 font-medium px-3 py-1 rounded-full"
                        >
                          {noticia?.categoria || 'General'}
                        </Badge>
                      </div>
                      
                      {/* Overlay de lectura */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <FaEye className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2 flex-grow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaCalendarAlt className="h-3 w-3" />
                          <span>{formatearFecha(noticia?.fechaPublicacion || "")}</span>
                        </div>
                        {noticia?.autor && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaUser className="h-3 w-3" />
                            <span className="truncate max-w-20">{noticia.autor}</span>
                          </div>
                        )}
                      </div>
                      
                      <CardTitle className="line-clamp-2 text-base font-bold text-gray-900 leading-tight group-hover:text-[#184482] transition-colors duration-300">
                        {noticia?.titulo}
                      </CardTitle>
                      
                      {noticia?.gorro && (
                        <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg inline-block mt-2">
                          {noticia.gorro.length > 40 ? `${noticia.gorro.slice(0, 40)}...` : noticia.gorro}
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {truncarContenido(noticia?.contenido || "", 120)}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end p-4 pt-0">
                      <Button
                        variant="outline"
                        className="px-4 py-2 bg-[#184482] hover:bg-[#1a4c94] text-white border-[#184482] rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium group-hover:scale-105"
                        onClick={() => router.push(`/noticias/${noticia?.id}`)}
                      >
                        <span>Leer más</span>
                        <FaArrowRight className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        {/* Paginación Mejorada */}
        {totalPages > 1 && (
          <motion.div
            variants={animations.item as any}
            className="flex justify-center"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                      className={`rounded-xl ${
                        currentPage === 0 
                          ? "pointer-events-none opacity-50" 
                          : "hover:bg-[#184482] hover:text-white transition-colors duration-300"
                      }`}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i;
                    } else if (currentPage <= 2) {
                      pageNumber = i;
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 5 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className={`rounded-xl ${
                            currentPage === pageNumber
                              ? "bg-[#184482] text-white"
                              : "hover:bg-[#184482]/10 hover:text-[#184482]"
                          } transition-colors duration-300`}
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                      }
                      className={`rounded-xl ${
                        currentPage === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-[#184482] hover:text-white transition-colors duration-300"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </motion.div>
        )}

        {/* Estado Vacío */}
        {!isLoading && todasLasNoticias.length === 0 && (
          <motion.div
            variants={animations.item as any}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
              <FaNewspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">No se encontraron noticias</h3>
              <p className="text-gray-600 text-sm">
                Intenta con otros términos de búsqueda o verifica los filtros aplicados.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

const TodasNoticias = () => {
  return (
    <Suspense fallback={
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <div className="bg-gray-200 h-12 w-80 mx-auto rounded-full mb-4 animate-pulse"></div>
            <div className="bg-gray-200 h-16 w-64 mx-auto rounded-2xl animate-pulse"></div>
          </div>
          
          <div className="mb-8">
            <div className="bg-gray-200 h-12 w-48 rounded-full mb-4 animate-pulse"></div>
            <div className="bg-gray-200 h-20 w-full rounded-2xl animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-gray-200 h-96 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </motion.div>
    }>
      <TodasNoticiasContent />
    </Suspense>
  );
};

export default TodasNoticias;
