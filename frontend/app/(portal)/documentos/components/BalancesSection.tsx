"use client";

// PARTICIPACION CIUDADANA

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaCalendarAlt, FaFilePdf } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PrincipalService from "@/services/PrincipalService";
import DocumentoModal from "../documento-modal";
import UltimosCinco from "./UltimosCincoDocumentos"

import DocumentoService from "@/services/DocumentoService";




interface BalancesSectionProps { }

export default function BalancesSection({ }: BalancesSectionProps) {
  // Estados para balances
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>("2025");

  const [tipoDocumentoSelect, setTipoDocumentoSelect] = useState<string>("");
  const [tiposDocumentos, setTiposDocumentos] = useState<any[]>([]);

  // Estados para modal
  const [selectedDocumento, setSelectedDocumento] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  const tipoId = 4; // Id de TIPO_DOC = BALANCES (C)

  // Generar años desde 2020 hasta el año actual
  const generarAnios = () => {
    const anioActual = new Date().getFullYear();
    const anios = [];
    for (let año = anioActual; año >= 2020; año--) {
      anios.push(año);
    }
    return anios;
  };

  const getTiposDocumentos = async () => {
    try {
      const response = await PrincipalService.getTiposDocumentos("C");
      const tipos = response.data || [];
      setTiposDocumentos(tipos);

      // Seleccionar automáticamente el primer tipo si existe
      if (tipos.length > 0 && !tipoDocumentoSelect) {
        setTipoDocumentoSelect(tipos[0].id.toString());
      }
    } catch (error) {
      console.error("Error al cargar tipos de documentos:", error);
      setTiposDocumentos([]);
    }
  };

  // Función para obtener balances
  const getBalances = async () => {
    setLoading(true);
    try {

      const tipoDoc = tiposDocumentos.find(t => t.id.toString() === tipoDocumentoSelect);

      if (!tipoDoc) return;


      const tipos = await PrincipalService.getTiposDocumentos("C");
      // console.log("tipostipostipos", tipos)

      const anioAMapa = { // sacado de la BD
        "2023": 1,
        "2024": 2,
        "2025": 3,
        "2022": 4,
        "2021": 5,
        "2020": 6
      };

      const enviarAnio = anioAMapa[anioSeleccionado];

      console.log("año a enviar: ", enviarAnio)

      const response = await DocumentoService.getDocumentosByTipo(
        // tipoId, // Id de TIPO_DOC = BALANCES (C)
        tipoDoc.id,
        tipoDoc.codigo, // codigo apra filtar
        enviarAnio, // AÑO 2025
        currentPage,
        itemsPerPage,
        activeSearchTerm,
        "",
      );

      setBalances(response.content || []);
      setTotalItems(response.totalElements || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error al cargar participacion ciudadana:", error);
      setBalances([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Manejador de búsqueda
  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Función para manejar la vista de documentos (siempre modal local)
  const handleVerDocumento = (documento: any) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocumento(null);
  };

  useEffect(() => {
    getTiposDocumentos();
  }, []);

  // Efecto para cargar balances
  useEffect(() => {
    if (tiposDocumentos.length > 0) {
      getBalances();
    }
  }, [tipoDocumentoSelect, anioSeleccionado, activeSearchTerm, currentPage, tiposDocumentos]);

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-8"
        whileHover={{
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-gray-100 bg-[#184482]/5 flex justify-between items-center">
          <h2 className="flex items-center gap-2 font-medium text-[#184482]">
            <FaFileAlt className="h-4 w-4" />

            <span className="text-[#184482] font-semibold">Participación Ciudadana</span>

            {totalItems > 0 && (
              <Badge variant="outline" className="ml-2">
                {totalItems}
              </Badge>
            )}
          </h2>
        </div>

        <UltimosCinco
          tipoId={tipoId}
          loading={loading}
          tipoDocumentoSelect=""
          anioSeleccionado={anioSeleccionado}
          handleVerDocumento={handleVerDocumento}
        />

        <div className="px-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
          <span className="text-[#184482]">Todos los documentos subidos</span>
        </div>

        <div className="p-6">
          {/* Filtros específicos para balances */}
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
                    setCurrentPage(0);
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
                    setCurrentPage(0);
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
                  Buscar Participación Ciudadana
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Buscar Participación Ciudadana..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="bg-[#184482] hover:bg-[#1a4c94]"
                  >
                    <FaFileAlt className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de balances */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            ) : balances.length > 0 ? (
              balances.map((doc: any) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-[#184482]/10 text-[#184482] border-[#184482]/20">
                        Participación Ciudadana
                      </Badge>
                      <span className="text-sm font-semibold text-[#184482]">
                        N° {doc.numeroDocumento} {doc.anio?.anio}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendarAlt className="h-3 w-3" />
                      {new Date(doc.fechaEmision).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {doc.nombreDocumento || doc?.nombre}
                  </h3>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {doc.descripcion}
                  </p>

                  <div className="flex items-center justify-end">
                    {(doc.urlDocumento || doc.nombreBlDoc) && (
                      <button
                        onClick={() => handleVerDocumento(doc)}
                        className="inline-flex items-center gap-1 text-xs bg-[#F0B000] hover:bg-[#d9a000] text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        <FaFilePdf className="h-3 w-3" />
                        Ver PDF
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaFileAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  No se encontraron Participaciones Ciudadanas
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 0) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNumber: number;

                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 2) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          size="sm"
                          isActive={pageNumber === currentPage + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber - 1);
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
                        if (currentPage < totalPages - 1)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal para ver documentos */}
      {selectedDocumento && (
        <DocumentoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          documento={selectedDocumento}
        />
      )}
    </>
  );
}