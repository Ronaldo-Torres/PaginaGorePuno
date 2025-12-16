import React from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { FaCalendarAlt, FaTags, FaFileAlt, FaSitemap, FaFilePdf } from "react-icons/fa";
import DocumentoService from "@/services/DocumentoService"; // Asegúrate de importar correctamente



const UltimosCincoDocumentos = ({ tipoId, loading, tipoDocumentoSelect, anioSeleccionado, handleVerDocumento }) => {

    const [documentos, setDocumentos] = useState<any[]>([]);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await DocumentoService.getDocumentosByTipo(
                    tipoId, // tipo_doc_id
                    3, // año 3 = 2025
                    0, // desde 0 
                    5, // hasta 10, poner 5
                    "",
                    ""
                );
                // console.log(response)
                setDocumentos(response.content || []);
            } catch (error) {
                console.error("Error fetching documentos:", error);
            }
        };

        if (tipoId && anioSeleccionado) {
            fetchDocumentos();
        }
    }, [tipoId, anioSeleccionado]);

    return (
        <div className="mb-6">
            <div className="px-10 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                <span className="text-[#184482]">Últimos documentos subidos</span>
            </div>

            <div className="space-y-4 mx-9">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))
                ) : documentos.length > 0 ? (
                    documentos.slice(-5).map((doc) => (
                        <div
                            key={doc.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="bg-[#184482]/10 text-[#184482] border-[#184482]/20">
                                        {doc.tipoDocumento?.nombre || doc?.nombre}
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

                                    {/* Consejeros */}
                                    {doc.consejeros && doc.consejeros.length > 0 && (
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <FaFileAlt className="h-3 w-3" />
                                            <span className="truncate max-w-32">
                                                {doc.consejeros[0].nombre}
                                                {doc.consejeros.length > 1 && ` +${doc.consejeros.length - 1}`}
                                            </span>
                                        </div>
                                    )}

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
                            {tipoDocumentoSelect && anioSeleccionado
                                ? "No se tiene los cinco últimos documentos"
                                : "Selecciona un tipo de documento y año para ver los documentos disponibles"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UltimosCincoDocumentos;
