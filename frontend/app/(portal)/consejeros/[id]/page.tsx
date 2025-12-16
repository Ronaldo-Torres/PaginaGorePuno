"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  FaFileAlt,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaChevronRight,
  FaDownload,
  FaCalendar,
  FaAward,
  FaBars,
  FaCalendarAlt,
  FaImages,
  FaEye,
  FaChevronCircleRight,
  FaSearch,
  FaTags,
  FaUsers,
  FaSitemap,
  FaFilePdf,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import PrincipalService from "@/services/PrincipalService";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { VerDocumento } from "./ver-documento";
import Link from "next/link";

// Animation variants extracted for reusability
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  pageTransition: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

export default function ConsejeroPerfil(props: any) {
  const { id } = props.params;
  const [consejero, setConsejero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openVerDocumento, setOpenVerDocumento] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<
    "actividades" | "documentos" | null
  >(null);
  const [tipoDocumentoSelect, setTipoDocumentoSelect] = useState<string>("");
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>("");
  const [fotosGaleria, setFotosGaleria] = useState<any[]>([]);
  
  // Estados para documentos con filtros y paginación
  const [documentosConsejero, setDocumentosConsejero] = useState<any[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [tiposDocumentos, setTiposDocumentos] = useState<any[]>([]);
  const [searchTermDoc, setSearchTermDoc] = useState("");
  const [activeSearchTermDoc, setActiveSearchTermDoc] = useState("");
  const [currentPageDoc, setCurrentPageDoc] = useState(0);
  const [totalPagesDoc, setTotalPagesDoc] = useState(1);
  const [totalItemsDoc, setTotalItemsDoc] = useState(0);
  const itemsPerPageDoc = 5;

  // Generar años desde 2020 hasta el año actual
  const generarAnios = () => {
    const anioActual = new Date().getFullYear();
    const anios = [];
    for (let año = anioActual; año >= 2020; año--) {
      anios.push(año);
    }
    return anios;
  };

  const getGaleriaUltimos = async () => {
    try {
      const response = await PrincipalService.getGaleriaUltimos(parseInt(id));
      // El endpoint devuelve directamente el array, no un objeto con content
      setFotosGaleria(response || []);
    } catch (error) {
      console.error("Error al cargar galería:", error);
      setFotosGaleria([]);
    }
  };

  const getTiposDocumentos = async () => {
    try {
      const response = await PrincipalService.getTiposDocumentos();
      setTiposDocumentos(response.data || []);
    } catch (error) {
      console.error("Error al cargar tipos de documentos:", error);
      setTiposDocumentos([]);
    }
  };

  const getDocumentosConsejero = async () => {
    if (!tipoDocumentoSelect || !anioSeleccionado) {
      setDocumentosConsejero([]);
      setTotalItemsDoc(0);
      setTotalPagesDoc(1);
      return;
    }

    setLoadingDocumentos(true);
    try {
      const tipoDoc = tiposDocumentos.find(t => t.id.toString() === tipoDocumentoSelect);
      if (!tipoDoc) return;

      const response = await PrincipalService.getDocumentosByTipo(
        tipoDoc.id,
        tipoDoc.codigo,
        currentPageDoc,
        itemsPerPageDoc,
        activeSearchTermDoc,
        anioSeleccionado,
        parseInt(id) // Enviar consejeroId para filtrar en el backend
      );

      // Ya no necesitamos filtrar en el frontend porque el backend lo hace
      setDocumentosConsejero(response.content || []);
      setTotalItemsDoc(response.totalElements || 0);
      setTotalPagesDoc(response.totalPages || 1);
    } catch (error) {
      console.error("Error al cargar documentos del consejero:", error);
      setDocumentosConsejero([]);
      setTotalItemsDoc(0);
      setTotalPagesDoc(1);
    } finally {
      setLoadingDocumentos(false);
    }
  };

  const handleSearchDoc = () => {
    setActiveSearchTermDoc(searchTermDoc);
    setCurrentPageDoc(0);
  };

  const handleKeyPressDoc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchDoc();
    }
  };

  const handlePageChangeDoc = (page: number) => {
    setCurrentPageDoc(page - 1);
  };



  const getConsejero = async () => {
    setLoading(true);
    try {
      const response = await PrincipalService.getConsejero(parseInt(id));
      setConsejero(response.data);
    } catch (error) {
      console.error("Error al cargar datos del consejero:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDocumento = () => {
    setOpenVerDocumento(true);
  };

  useEffect(() => {
    getConsejero();
    getGaleriaUltimos();
    getTiposDocumentos();
  }, [id]);

  useEffect(() => {
    if (tiposDocumentos.length > 0) {
      getDocumentosConsejero();
    }
  }, [tipoDocumentoSelect, anioSeleccionado, activeSearchTermDoc, currentPageDoc, tiposDocumentos]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] mt-[70px] w-4/5 mx-auto bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#184482]"></div>
      </div>
    );
  }

  if (!consejero) {
    return (
      <div className="min-h-[calc(100vh-100px)] mt-[70px] w-4/5 mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#184482] mb-4">
            Consejero no encontrado
          </h2>
          <p className="text-gray-600">
            No se pudo encontrar la información del consejero solicitado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Header Elegante */}
        <motion.div
          variants={animations.title}
          className="mb-12 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              {consejero?.nombre} {consejero?.apellido}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaAward className="h-5 w-5 mr-2" />
              <span className="font-semibold tracking-wide">
                {consejero?.descripcion || "Regional"}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar con foto y navegación */}
          <motion.div
            variants={animations.item}
            className="md:w-1/3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-6 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#184482]/20 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                        Ampliar imagen
                      </span>
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejero?.url_imagen}?height=400&width=300`}
                      alt={`Foto de ${consejero?.nombre} ${consejero?.apellido}`}
                      width={300}
                      height={400}
                      className="w-full object-cover"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="p-0 overflow-hidden max-w-none border-none shadow-xl">
                  <DialogHeader className="absolute top-2 right-2 z-10">
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-colors">
                      <FaTimes className="h-4 w-4" />
                      <span className="sr-only">Cerrar</span>
                    </DialogClose>
                  </DialogHeader>
                  <div className="relative flex items-center justify-center bg-black/5">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejero?.url_imagen}?height=600&width=450`}
                      alt={`Foto de ${consejero?.nombre} ${consejero?.apellido}`}
                      width={450}
                      height={600}
                      className="object-contain max-h-[80vh] max-w-[90vw]"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-[#184482]/10 text-[#184482] border-[#184482]/20"
                  >
                    {consejero.sexo === "MASCULINO" ? "REGIONAL" 
                    : consejero.sexo === "FEMENINO" ? "REGIONAL"
                    : "REGIONAL"} {" - "} 
                    {consejero.provincia}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Galería de Fotos */}
            <motion.div
              className="mb-6 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-[#184482]">
                    <FaImages className="h-4 w-4" />
                    Galería de Fotos
                  
                  </h3>
                  <Link 
                    href={`/consejeros/${id}/galeria`}
                    className="flex items-center gap-1 text-xs text-[#184482] hover:text-[#1a4c94] font-medium transition-all duration-300 hover:scale-105"
                  >
                    Ver todas
                    <FaChevronCircleRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {fotosGaleria.slice(0, 4).map((foto, index) => (
                    <Link
                      key={foto.id}
                      href={`/consejeros/${id}/galeria`}
                      className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#184482]/20"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${foto.urlImagen}`}
                        alt={foto.descripcion}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <FaEye className="h-5 w-5 text-white" />
                      </div>
                      {index === 3 && fotosGaleria.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            +{fotosGaleria.length - 4}
                          </span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
                {fotosGaleria.length > 4 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      +{fotosGaleria.length - 4} fotos más en la galería
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={animations.item}
              className="mb-6 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h3 className="flex items-center gap-2 text-sm font-medium text-[#184482]">
                  <FaFileAlt className="h-4 w-4" />
                  Credencial JNE
                </h3>
              </div>
              <div className="p-2">
                {consejero.documento && (
                    <Button
                      key={consejero.id}
                      onClick={handleVerDocumento}
                      variant="ghost"
                      className="cursor-pointer w-full justify-start"
                    >
                      <div className="flex items-center justify-between px-3 py-2 hover:bg-[#184482]/5 rounded transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="text-red-500">
                            <FaFilePdf className="h-5 w-5" />
                          </div>
                          <span className="text-xs text-gray-700">
                            {consejero.nombre} {consejero.apellido}
                          </span>
                        </div>
                      </div>
                    </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={animations.item}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h3 className="flex items-center gap-2 text-sm font-medium text-[#184482]">
                  <FaBars className="h-4 w-4" />
                  Mas Información
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Button
                      variant="ghost"
                      className={`text-xs justify-start items-center w-full gap-5 cursor-pointer ${
                        seccionActiva === "actividades" ? "bg-[#184482]/10" : ""
                      }`}
                      onClick={() =>
                        setSeccionActiva(
                          seccionActiva === "actividades" ? null : "actividades"
                        )
                      }
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-[#184482] flex-shrink-0"></div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Actividades Realizadas
                        </h4>
                        <p className="text-sm text-gray-600">
                          {consejero?.actividad || ""}
                        </p>
                      </div>

                      <FaChevronRight
                        className={`h-3 w-3 ml-1 flex justify-end w-full text-right transition-transform ${
                          seccionActiva === "actividades" ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex items-start gap-2">
                    <Button
                      variant="ghost"
                      className={`text-xs justify-start items-center w-full gap-5 cursor-pointer ${
                        seccionActiva === "documentos" ? "bg-[#184482]/10" : ""
                      }`}
                      onClick={() =>
                        setSeccionActiva(
                          seccionActiva === "documentos" ? null : "documentos"
                        )
                      }
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-[#184482] flex-shrink-0"></div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Documentos
                        </h4>
                      </div>
                      <FaChevronRight
                        className={`h-3 w-3 ml-1 flex justify-end w-full transition-transform ${
                          seccionActiva === "documentos" ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            variants={animations.item}
            className="md:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {seccionActiva === "actividades" ? (
              /* Actividades Relacionadas */
              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-100 bg-[#184482]/5 flex justify-between items-center">
                  <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                    <FaCalendar className="h-4 w-4" />
                    Actividades Relacionadas
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-[#184482] hover:bg-[#184482]/10 rounded-full bg-[#1A4A90]"
                    onClick={() => setSeccionActiva(null)}
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {consejero?.noticias.map((noticia: any) => (
                      <div
                        key={noticia.id}
                        className="border border-gray-200 rounded-md p-5 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 w-full justify-end">
                          <FaCalendar className="h-4 w-4 text-[#F3B7BD]" />
                          <span className="text-xs text-gray-600">
                            {new Date(
                              noticia.fechaPublicacion
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-[#184482]"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-md font-medium mb-2 text-gray-900">
                              {noticia.titulo}
                            </h3>
                            <div
                              className="text-sm text-gray-600 mb-2"
                              dangerouslySetInnerHTML={{
                                __html:
                                  noticia.bajada.substring(0, 150) + "...",
                              }}
                            ></div>
                            <Link
                              href={`/noticias/${noticia.id}`}
                              className="text-xs text-[#184482] hover:underline inline-flex items-center w-full justify-end"
                            >
                              Ver más
                              <FaChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Link
                        href={`/noticias/todas?consejero=${consejero.nombre}`}
                        className="text-sm text-[#184482] cursor-pointer"
                      >
                        Ver todas
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : seccionActiva === "documentos" ? (
              /* Documentos del Consejero */
              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-100 bg-[#184482]/5 flex justify-between items-center">
                  <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                    <FaFileAlt className="h-4 w-4" />
                    Documentos del Consejero
                    {totalItemsDoc > 0 && (
                      <Badge variant="outline" className="ml-2 ">
                        {totalItemsDoc}
                      </Badge>
                    )}
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-[#184482] hover:bg-[#184482]/10 rounded-full bg-[#1A4A90]"
                    onClick={() => setSeccionActiva(null)}
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6">
                  {/* Filtros de búsqueda */}
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Tipo de documento */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Tipo de documento
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184482]/30 text-sm bg-white"
                          value={tipoDocumentoSelect}
                          onChange={(e) => {
                            setTipoDocumentoSelect(e.target.value);
                            setCurrentPageDoc(0);
                          }}
                        >
                          <option value="">Seleccionar tipo</option>
                          {tiposDocumentos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id.toString()}>
                              {tipo.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Año */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Año
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184482]/30 text-sm bg-white"
                          value={anioSeleccionado}
                          onChange={(e) => {
                            setAnioSeleccionado(e.target.value);
                            setCurrentPageDoc(0);
                          }}
                        >
                          <option value="">Seleccionar año</option>
                          {generarAnios().map((año) => (
                            <option key={año} value={año.toString()}>
                              {año}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Búsqueda */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Buscar documento
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTermDoc}
                            onChange={(e) => setSearchTermDoc(e.target.value)}
                            onKeyPress={handleKeyPressDoc}
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={handleSearchDoc}
                            className="bg-[#184482] hover:bg-[#1a4c94]"
                          >
                            <FaSearch className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de documentos */}
                    <div className="space-y-4">
                    {loadingDocumentos ? (
                      // Skeleton loading
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-full mb-2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      ))
                    ) : documentosConsejero.length > 0 ? (
                      documentosConsejero.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="bg-[#184482]/10 text-[#184482] border-[#184482]/20">
                                {doc.tipoDocumento?.nombre}
                              </Badge>
                              <span className="text-sm font-semibold text-[#184482]">
                                N° {doc.numeroDocumento}-{doc.anio?.anio}
                            </span>
                          </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FaCalendarAlt className="h-3 w-3" />
                              {new Date(doc.fechaEmision).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            {doc.nombreDocumento}
                          </h3>
                          
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {doc.descripcion}
                          </p>

                          {/* Tags */}
                          {doc.tagsDocumento && doc.tagsDocumento.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {doc.tagsDocumento.slice(0, 3).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                  <FaTags className="h-2 w-2" />
                                  {tag}
                                </span>
                              ))}
                              {doc.tagsDocumento.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{doc.tagsDocumento.length - 3} más
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs">
                              {/* Comisiones */}
                              {doc.comisiones && doc.comisiones.length > 0 && (
                                <div className="flex items-center gap-1 text-purple-600">
                                  <FaSitemap className="h-3 w-3" />
                                  <span className="truncate max-w-32">
                                    {doc.comisiones[0].nombre}
                                    {doc.comisiones.length > 1 && ` +${doc.comisiones.length - 1}`}
                                  </span>
                                </div>
                              )}
                              </div>
                            
                            {/* Botón ver PDF */}
                            {doc.urlDocumento && (
                              <a
                                href={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${doc.urlDocumento}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs bg-[#F0B000] hover:bg-[#d9a000] text-white px-3 py-1 rounded-lg transition-colors"
                              >
                                <FaFilePdf className="h-3 w-3" />
                                Ver PDF
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaFileAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">
                          {tipoDocumentoSelect && anioSeleccionado 
                            ? "No se encontraron documentos del consejero con los filtros aplicados"
                            : "Selecciona un tipo de documento y año para ver los documentos del consejero"
                          }
                        </p>
                      </div>
                    )}
                    </div>

                  {/* Paginación */}
                  {!loadingDocumentos && totalPagesDoc > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPageDoc > 0) handlePageChangeDoc(currentPageDoc);
                              }}
                              className={currentPageDoc === 0 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(3, totalPagesDoc) }).map((_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  size="sm"
                                  isActive={pageNumber === currentPageDoc + 1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChangeDoc(pageNumber);
                                  }}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPageDoc < totalPagesDoc - 1) 
                                  handlePageChangeDoc(currentPageDoc + 2);
                              }}
                              className={currentPageDoc === totalPagesDoc - 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}

                  {/* Enlace a documentos completos */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-center">
                      <Link
                        href="/documentos"
                        className="inline-flex items-center gap-2 text-sm text-[#184482] hover:text-[#1a4c94] font-medium transition-colors"
                      >
                        Ver todos los documentos oficiales
                        <FaChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Información Personal por defecto */
              <>
                {/* Información Personal */}
                <motion.div
                  className="mb-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                  whileHover={{
                    y: -4,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                    <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                      <FaUser className="h-4 w-4" />
                      Información Personal
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <FaUser className="h-3 w-3" />
                          Documento de Identidad
                        </h3>
                        <p className="text-sm font-medium text-gray-800">
                          {consejero?.dni || "No disponible"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <FaPhone className="h-3 w-3" />
                          Teléfono
                        </h3>
                        <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                          <img src="/peru.svg" alt="Perú" className="h-3 w-3" />
                          +51{" "}
                          {consejero?.telefono?.length === 9
                            ? `${consejero?.telefono.slice(
                                0,
                                3
                              )}-${consejero?.telefono.slice(
                                3,
                                6
                              )}-${consejero?.telefono.slice(6)}`
                            : consejero?.telefono}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <FaEnvelope className="h-3 w-3" />
                          Correo Institucional
                        </h3>
                        <p className="text-sm font-medium text-gray-800">
                          {consejero?.correo || "No disponible"}
                        </p>
                      </div>
                    </div>

                    {/* Redes Sociales */}
                    {(consejero?.facebook || consejero?.twitter || consejero?.instagram) && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          <FaUsers className="h-3 w-3" />
                          Redes Sociales
                        </h3>
                        <div className="flex gap-3">
                          {consejero?.facebook && (
                            <Link 
                              href={consejero.facebook} 
                              target="_blank"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-300"
                            >
                              <FaFacebook className="h-4 w-4" />
                              <span className="text-sm font-medium">Facebook</span>
                            </Link>
                          )}
                          {consejero?.twitter && (
                            <Link 
                              href={consejero.twitter} 
                              target="_blank"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors duration-300"
                            >
                              <FaTwitter className="h-4 w-4" />
                              <span className="text-sm font-medium">Twitter</span>
                            </Link>
                          )}
                          {consejero?.instagram && (
                            <Link 
                              href={consejero.instagram} 
                              target="_blank"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors duration-300"
                            >
                              <FaInstagram className="h-4 w-4" />
                              <span className="text-sm font-medium">Instagram</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Comisiones */}
                <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                    <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                      <FaAward className="h-4 w-4" />
                      Comisiones Asignadas
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="">
                      {consejero?.comisiones
                        .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
                        .map((comision: any) => (
                        <div key={comision.id} className="flex items-center gap-2 mb-2">
                          <span className="inline-block w-2 h-2 bg-[#184482] rounded-full"></span>
                          <Badge
                            variant="secondary"
                            className="text-xs text-black"
                          >
                            {comision.cargo}
                          </Badge>
                          <span className="text-sm text-gray-900">
                            {comision.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actividades Recientes */}
                {consejero?.noticias && consejero.noticias.length > 0 && (
                  <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100 bg-[#184482]/5 flex justify-between items-center">
                      <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                        <FaCalendar className="h-4 w-4" />
                        Actividades Recientes
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#184482] hover:text-[#1a4c94] hover:bg-[#184482]/10"
                        onClick={() => setSeccionActiva("actividades")}
                      >
                        Ver todas
                        <FaChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {consejero.noticias.slice(0, 3).map((noticia: any) => (
                          <div
                            key={noticia.id}
                            className="border border-gray-200 rounded-md p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-colors"
                          >
                            <div className="flex items-center gap-2 w-full justify-end mb-2">
                              <FaCalendar className="h-3 w-3 text-[#F3B7BD]" />
                              <span className="text-xs text-gray-600">
                                {new Date(noticia.fechaPublicacion).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1.5 flex-shrink-0">
                                <div className="h-2 w-2 rounded-full bg-[#184482]"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium mb-2 text-gray-900 line-clamp-2">
                                  {noticia.titulo}
                                </h3>
                                <div
                                  className="text-xs text-gray-600 mb-2 line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html: noticia.bajada.substring(0, 100) + "...",
                                  }}
                                ></div>
                                <Link
                                  href={`/noticias/${noticia.id}`}
                                  className="text-xs text-[#184482] hover:underline inline-flex items-center"
                                >
                                  Leer más
                                  <FaChevronRight className="h-3 w-3 ml-1" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {consejero.noticias.length > 3 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-[#184482] hover:text-[#1a4c94] hover:bg-[#184482]/10"
                              onClick={() => setSeccionActiva("actividades")}
                            >
                              Ver todas las actividades ({consejero.noticias.length})
                              <FaChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
        <VerDocumento
          open={openVerDocumento}
          onOpenChange={setOpenVerDocumento}
          documento={consejero?.documento}
          consejero={consejero}
        />


      </motion.div>
    </motion.div>
  );
}
