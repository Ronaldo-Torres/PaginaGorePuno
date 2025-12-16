"use client";

import { useEffect, useState } from "react";
import {
  FaFolder,
  FaFile,
  FaChevronDown,
  FaChevronRight,
  FaCalendarAlt,
  FaDownload,
  FaPlus,
  FaEdit,
  FaEye,
  FaSearch,
  FaFileAlt,
  FaBalanceScale,
  FaChartLine
} from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaginationControl from "@/components/PaginationControl";
import TipoDocumentoService from "@/services/TipoDocumentoService";
import DocumentoService from "@/services/DocumentoService";
import AnioService from "@/services/AnioService";
import { AgregarNormativa } from "../components/agregar";
import { FaFilePdf } from "react-icons/fa";

// Componente para mostrar un archivo
const FileItem = ({
  file,
  onEdit,
}: {
  file: {
    id?: number;
    numeroDocumento?: string;
    nombreDocumento?: string;
    tipo?: string;
    extension?: string;
    tamanio?: string;
    fecha?: string;
    url?: string;
    descripcion?: string;
    fechaEmision?: string;
    activo?: boolean;
    urlDocumento?: string;
    tagsDocumento?: string[];
    consejeros?: any[];
    comisiones?: any[];
  };
  onEdit: (fileData: any) => void;
}) => {
  const getFileIcon = (type: string) => {
    const fileType = type?.toLowerCase() || "";
    switch (fileType) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "docx":
        return "bg-blue-100 text-blue-700";
      case "xlsx":
        return "bg-green-100 text-green-700";
      case "pptx":
        return "bg-orange-100 text-orange-700";
      case "png":
      case "jpg":
        return "bg-purple-100 text-purple-700";
      case "zip":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleView = () => {
    window.open(file.url, "_blank");
  };

  const handleEdit = () => {
    onEdit({
      id: file.id,
      numeroDocumento: file.numeroDocumento || "",
      nombreDocumento: file.nombreDocumento || "",
      descripcion: file.descripcion || "",
      fechaEmision: file.fechaEmision,
      activo: file.activo ?? true,
      urlDocumento: file.urlDocumento || "",
      tagsDocumento: file.tagsDocumento || [],
      consejeros: file.consejeros || [],
      comisiones: file.comisiones || []
    });
  };

  const handleDownload = async () => {
    if (!file.url) {
      alert("No se pudo descargar el documento");
      return;
    }

    try {
      const response = await fetch(file.url, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Error al descargar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.nombreDocumento || file.numeroDocumento || "archivo";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("No se pudo descargar el documento");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors gap-2 sm:gap-0">
        <div className="flex items-center flex-1 min-w-0 w-full">
          <FaFilePdf className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
          <div className="flex-1 min-w-0 mr-3">
            <div className="truncate text-sm font-medium">
              {file.numeroDocumento} - {file.nombreDocumento}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {file.descripcion}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 pl-7 sm:pl-0">
          <span className="text-sm text-gray-500 flex-shrink-0">
            {file.fechaEmision}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleView}
                    className="h-8 w-8"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="h-8 w-8"
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    className="h-8 w-8"
                  >
                    <FaDownload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Descargar documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente para mostrar una carpeta con sus archivos
const FolderItem = ({
  folder,
  anios,
  anioId,
  isOpen,
  onToggle,
}: {
  folder: { id: number; nombre: string; codigo: string; files: any[] };
  anios: any[];
  anioId: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [documentoView, setDocumentoView] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filterType]);

  // Cargar documentos cuando cambia la página o los filtros
  useEffect(() => {
    if (isOpen) {
      fetchDocumentos();
    }
  }, [currentPage, searchTerm, filterType, rowsPerPage, isOpen]);

  const fetchDocumentos = async () => {
    if (!isOpen) return;

    setLoading(true);
    try {
      // Usar servicio local para balances
      const response = await DocumentoService.getDocumentosByTipo(
        folder.id,
        folder.codigo, // adderly
        anioId,
        currentPage,
        rowsPerPage,
        searchTerm,
        filterType === "all" ? "" : filterType
      );

      if (response) {
        setDocumentoView(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        setDocumentoView([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      setDocumentoView([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = async () => {
    onToggle();
    if (!isOpen) {
      setCurrentPage(0);
      // fetchDocumentos se llamará automáticamente por el useEffect
    }
  };

  const handleDownloadAll = () => {
    alert(`Descargando todos los archivos de la carpeta: ${folder.nombre}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0); // Resetear a la primera página
  };

  const handleEditDocument = (documentData: any) => {
    // Detectar extensión desde la URL del documento
    let detectedExtension = "pdf";
    if (documentData.urlDocumento) {
      const urlParts = documentData.urlDocumento.split(".");
      if (urlParts.length > 1) {
        detectedExtension = urlParts[urlParts.length - 1].toLowerCase();
      }
    }

    // Preparar los datos del documento para edición
    const documentToEdit = {
      id: documentData.id,
      numeroDocumento: documentData.numeroDocumento || "",
      nombreDocumento: documentData.nombreDocumento || "",
      descripcion: documentData.descripcion || "",
      fechaEmision: documentData.fechaEmision
        ? new Date(documentData.fechaEmision).toISOString().split("T")[0]
        : "",
      activo: documentData.activo ?? true,
      anio: "",
      urlDocumento: documentData.urlDocumento || "",
      tipoDocumento: null, // Se establecerá automáticamente por la carpeta
      anios: null, // Se establecerá automáticamente por el año seleccionado
      oficina: null,
      extension: detectedExtension,
      tamanio: documentData.tamanio || "",
      tags: documentData.tagsDocumento || [], // Agregamos los tags
      consejeros: documentData.consejeros?.map((c: any) => c.id) || [],
      comisiones: documentData.comisiones?.map((c: any) => c.id) || []
    };

    setEditingDocument(documentToEdit);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingDocument(null);
  };

  return (
    <div className="mb-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors gap-2">
        <div className="flex items-center flex-1 cursor-pointer" onClick={handleFolderClick}>
          {isOpen ? (
            <FaChevronDown className="h-4 w-4 mr-1 text-gray-500" />
          ) : (
            <FaChevronRight className="h-4 w-4 mr-1 text-gray-500" />
          )}
          <FaFolder className="h-5 w-5 mr-2 text-yellow-500" />
          <span>{folder.nombre}</span>
          <Badge className="ml-2 bg-gray-200 text-gray-700 hover:bg-gray-200">
            Sub Carpeta
          </Badge>
        </div>

        {isOpen && (
          <div className="flex items-center gap-2 pl-7 sm:pl-0">
            {isOpen && (
                <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => setIsAddDialogOpen(true)}
                      >
                        <FaPlus className="h-4 w-4 mr-1" /> Agregar
                      </Button>
                  
                </div>
            )}
          </div>
        )}

        <AgregarNormativa
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          fetchData={fetchDocumentos}
          tipoDocumento={[]}
          anios={anios}
          oficinas={[]}
          carpetaNombre={folder.nombre}
          carpetaId={folder.id}
          anioId={anioId}
          carpetaTipoDocumento={folder}
        />

        <AgregarNormativa
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          data={editingDocument}
          fetchData={fetchDocumentos}
          tipoDocumento={[]}
          anios={anios}
          oficinas={[]}
          carpetaNombre={folder.nombre}
          carpetaId={folder.id}
          anioId={anioId}
          carpetaTipoDocumento={folder}
        />
      </div>

      {isOpen && (
        <div className="ml-4 sm:ml-8 mt-1 border-l-2 border-gray-200 pl-2">
          {/* Barra de búsqueda y filtros */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar documentos de participacion ciudadana..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Información de resultados */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Cargando documentos...
                      </div>
                    ) : (
                      <>
                        Mostrando {documentoView.length} de {totalElements} documentos
                        {searchTerm && (
                          <span className="font-medium"> para "{searchTerm}"</span>
                        )}
                      </>
                    )}
                  </div>
                  {totalElements > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {totalElements} total
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de documentos */}
          {loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Cargando documentos...</p>
                </div>
              </CardContent>
            </Card>
          ) : Array.isArray(documentoView) && documentoView.length > 0 ? (
            <>
              {documentoView.map((file, index) => (
                <FileItem
                  key={file.id || index}
                  file={{
                    id: file.id,
                    numeroDocumento: file.numeroDocumento,
                    nombreDocumento: file.nombreDocumento,
                    tipo: file.urlDocumento?.split(".").pop() || "pdf",
                    extension: file.urlDocumento?.split(".").pop() || "pdf",
                    fecha: new Date(file.fechaEmision).toLocaleDateString(),
                    url: file.urlDocumento
                      ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${file.urlDocumento}`
                      : undefined,
                    descripcion: file.descripcion,
                    fechaEmision: file.fechaEmision,
                    activo: file.activo,
                    urlDocumento: file.urlDocumento,
                    tagsDocumento: file.tagsDocumento || [],
                    consejeros: file.consejeros || [],
                    comisiones: file.comisiones || []
                  }}
                  onEdit={handleEditDocument}
                />
              ))}

              {/* Paginación */}
              <PaginationControl
                totalItems={totalElements}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                isLoading={loading}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          ) : totalElements === 0 && !loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="p-4 bg-muted/20 rounded-full">
                    <FaSearch className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">No se encontraron documentos</h3>
                    <p className="text-muted-foreground text-sm">
                      {searchTerm ? 
                        `No hay documentos que coincidan con "${searchTerm}"` :
                        "No hay documentos de participacion ciudadana disponibles en esta carpeta"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="p-4 bg-muted/20 rounded-full">
                    <FaFileAlt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Sin documentos</h3>
                    <p className="text-muted-foreground text-sm">
                      Esta carpeta no contiene documentos de participacion ciudadana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

// Componente principal
export default function Balances() {
  const [anios, setAnios] = useState<any[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("all");
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  //obtener todos los años
  const getAnios = async () => {
    const response = await AnioService.getAnios();
    setAnios(response);
    
    // Expandir automáticamente el último año (más reciente)
    if (response.length > 0) {
      // Ordenar para encontrar el año más reciente
      const sortedYears = response.sort((a: any, b: any) => parseInt(b.anio) - parseInt(a.anio));
      const latestYear = sortedYears[0]; // El primer elemento después de ordenar
      setExpandedYears(new Set([latestYear.id]));
      setSelectedAnio(latestYear.id);
    }
  };

  //obtener todos los tipos de documento
  const getTiposDocumento = async () => {
    const response = await TipoDocumentoService.getTiposDocumento("C");
    setTiposDocumento(response);

    console.log("tiposDocumento", response);
  };

  //cargar los anios al entrar a la pagina
  useEffect(() => {
    getAnios();
    getTiposDocumento(); // Cargar tipos de documento al inicio
  }, []);

  // Función para manejar la apertura/cierre de carpetas
  const handleFolderToggle = (folderId: number) => {
    setOpenFolderId(openFolderId === folderId ? null : folderId);
  };

  // Función para manejar la expansión de años
  const handleYearExpansion = (anioId: number, isExpanded: boolean) => {
    const newExpandedYears = new Set(expandedYears);
    if (isExpanded) {
      newExpandedYears.add(anioId);
      setSelectedAnio(anioId);
    } else {
      newExpandedYears.delete(anioId);
      if (selectedAnio === anioId) {
        setSelectedAnio(null);
      }
    }
    setExpandedYears(newExpandedYears);
  };

  // Filtrar años basado en búsqueda global
  const filteredAnios = anios.filter((anio) => {
    const matchesSearch =
      globalSearchTerm === "" ||
      anio.anio.toString().includes(globalSearchTerm);
    const matchesYearFilter =
      selectedYearFilter === "all" ||
      anio.anio.toString() === selectedYearFilter;

    return matchesSearch && matchesYearFilter;
  }).sort((a: any, b: any) => parseInt(b.anio) - parseInt(a.anio)); // Ordenar por año descendente

  // Filtrar tipos de documento basado en búsqueda global
  const filteredTiposDocumento = tiposDocumento.filter((tipo) => {
    return (
      globalSearchTerm === "" ||
      tipo.nombre.toLowerCase().includes(globalSearchTerm.toLowerCase())
    );
  });

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FaBalanceScale className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Participación Ciudadana</h1>
            <p className="text-muted-foreground text-lg">
              Informes de participación ciudadana
            </p>
          </div>
        </div>
        
        <Separator />
        
        {/* Info Alert */}
        <Alert>
          <FaChartLine className="h-4 w-4" />
          <AlertDescription>
            Documentos de participación ciudadana del sistema local del Gobierno Regional
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex-none space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="h-5 w-5 text-muted-foreground" />
                Documentos por Año
              </div>
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {filteredAnios.length} {filteredAnios.length === 1 ? 'año disponible' : 'años disponibles'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-6 overflow-y-auto">
          {filteredAnios.length > 0 ? (
            <Accordion
              type="multiple"
              className="w-full"
              value={Array.from(expandedYears).map(id => `year-${id}`)}
              onValueChange={(values) => {
                // Manejar la expansión de múltiples acordeones
                const newExpandedYears = new Set<number>();
                values.forEach((value) => {
                  const anioId = parseInt(value.replace("year-", ""));
                  if (!isNaN(anioId)) {
                    newExpandedYears.add(anioId);
                  }
                });
                setExpandedYears(newExpandedYears);

                // Establecer el año seleccionado (el último expandido)
                if (newExpandedYears.size > 0) {
                  const lastExpanded = Array.from(newExpandedYears).pop();
                  setSelectedAnio(lastExpanded || null);
                } else {
                  setSelectedAnio(null);
                }
              }}
            >
              {filteredAnios.map((anio, index) => {
                const isCurrentYear = new Date().getFullYear().toString() === anio.anio;
                
                return (
                  <AccordionItem key={index} value={`year-${anio.id}`} className="border rounded-lg mb-2">
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-md">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-lg">{anio.anio}</span>
                          {isCurrentYear && (
                            <Badge variant="default" className="text-xs">
                              Año Actual
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Local
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {filteredTiposDocumento.length} tipos
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="ml-2 mt-2">
                      {expandedYears.has(anio.id) &&
                      filteredTiposDocumento.length > 0 ? (
                        filteredTiposDocumento.map(
                          (tipoDocumento, tipoDocumentoIndex) => (
                            <FolderItem
                              key={tipoDocumentoIndex}
                              folder={tipoDocumento}
                              anios={anios}
                              anioId={anio.id}
                              isOpen={openFolderId === tipoDocumento.id}
                              onToggle={() =>
                                handleFolderToggle(tipoDocumento.id)
                              }
                            />
                          )
                        )
                      ) : expandedYears.has(anio.id) &&
                        filteredTiposDocumento.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <FaSearch className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>
                            No se encontraron tipos de documentos que coincidan
                            con tu búsqueda
                          </p>
                        </div>
                      ) : expandedYears.has(anio.id) ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                          <p>Cargando tipos de documentos...</p>
                        </div>
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted/20 rounded-full">
                  <FaSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg">No se encontraron años</h3>
                  <p className="text-muted-foreground">
                    No hay años disponibles que coincidan con tu búsqueda
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 