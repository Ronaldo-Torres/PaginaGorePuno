"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, PictureInPicture } from "lucide-react";
import { Eliminar } from "@/components/eliminar";
import PaginationControl from "@/components/PaginationControl";
import TableFilters, {
  VisibleColumn,
  FilterOption,
} from "@/components/TableFilters";
import DataTable, { SortConfig, ActionOption } from "@/components/DataTable";
import NoticiaService from "@/services/NoticiaService";
import Agregar from "./agregar";
import DocumentoService from "@/services/DocumentoService";
import TipoDocumentoService from "@/services/TipoDocumentoService";
import { PhotoGalleryUpload } from "./upload-imagenes";
import { Badge } from "@/components/ui/badge";

interface Consejero {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cargo: string;
  descripcion: string;
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  provincia: string | null;
  url_imagen: string;
  documento: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Comision {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

type Data = {
  id: number;
  gorro: string;
  titulo: string;
  bajada: string;
  introduccion: string;
  contenido: string;
  conclusion: string;
  nota?: string;
  fechaPublicacion: Date;
  destacado: boolean;
  url?: string;
  activo: boolean;
  destacadoAntigua: boolean;
  autor: string;
  tags: string[];
  consejeros: Consejero[];
  comisiones: Comision[];
  imagenes: any[];
  createdAt: string;
  updatedAt: string;
};

interface DocumentoFormData {
  id?: number;
  gorro: string;
  titulo: string;
  bajada: string;
  introduccion: string;
  contenido: string;
  conclusion: string;
  nota: string;
  fechaPublicacion: Date;
  destacado: boolean;
  url: string;
  activo: boolean;
  destacadoAntigua: boolean;
  autor: string;
  tags: string[];
  consejeros: number[];
  comisiones: number[];
}

export function TableNoticia() {
  const [documentos, setDocumentos] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [destacadoAntiguaFilter, setDestacadoAntiguaFilter] = useState<
    boolean | null
  >(null);
  const [destacadoFilter, setDestacadoFilter] = useState<boolean | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<Data | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Data | null>(null);
  const [dialogImagenOpen, setDialogImagenOpen] = useState(false);
  const [dataToEditImagen, setDataToEditImagen] = useState<Data | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumn[]>([
  //  { key: "id", label: "ID", visible: true, align: "start" },
  {
    key: "fechaPublicacion",
    label: "Fecha Publicacion",
    visible: true,
    align: "start",
  },

  //encima el titulo abajop la bajada
    {
      key: "titulo",
      label: "Titulo",
      visible: true,
      align: "start",
      render: (value: string) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">{value.length > 100 ? value.substring(0, 100) + "..." : value}</p>
          <p className="text-xs text-muted-foreground">{value.length > 150 ? value.substring(0, 150) + "..." : value}</p>
        </div>
      ),
    },
    {
      key: "destacado",
      label: "Destacado",
      visible: true,
      align: "center",
      render: (value: boolean) => (value ? <Badge className="bg-green-500 text-white">Principal</Badge> : <Badge className="bg-red-500 text-white">Normal</Badge>),
     
    },
    {
      key: "activo",
      label: "Estado",
      visible: true,
      align: "center",
      render: (value: boolean) => (value ? "Activo" : "Inactivo"),
      badgeMapping: {
        true: "bg-green-500",
        false: "bg-red-500",
      },
    },
  ]);
  const [tiposDocumento, setTiposDocumento] = useState<
    { id: string; nombre: string }[]
  >([]);

  const handleDestacadoAntiguaChange = (checked: boolean | "indeterminate") => {
    const value = checked === "indeterminate" ? null : checked ? true : null;
    console.log("Cambiando destacadoAntigua a:", value);
    setDestacadoAntiguaFilter(value);
  };

  const handleDestacadoChange = (checked: boolean | "indeterminate") => {
    const value = checked === "indeterminate" ? null : checked ? true : null;
    console.log("Cambiando destacado a:", value);
    setDestacadoFilter(value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Enviando filtros:", {
        destacadoAntigua: destacadoAntiguaFilter,
        destacado: destacadoFilter,
      });
      const response = await NoticiaService.getNoticias(
        currentPage,
        rowsPerPage,
        searchQuery,
        null,
        destacadoAntiguaFilter === true ? true : null,
        destacadoFilter === true ? true : null
      );
      const result = response.content;
      setDocumentos(result as any[]);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching datas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTiposDocumento = async () => {
    try {
      const response = await TipoDocumentoService.getTiposDocumento();
      setTiposDocumento(response);
    } catch (error) {
      console.error("Error fetching tipos de documento:", error);
    }
  };

  useEffect(() => {
    console.log("Filtros actuales:", {
      destacadoAntigua: destacadoAntiguaFilter,
      destacado: destacadoFilter,
    });
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    statusFilter,
    sortConfig,
    currentPage,
    rowsPerPage,
    destacadoAntiguaFilter,
    destacadoFilter,
  ]);

  useEffect(() => {
    fetchTiposDocumento();
  }, []);

  const handleSort = (column: string) => {
    setSortConfig((current) => ({
      key: column,
      direction:
        current.key === column && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEditClick = (data: Data) => {
    setDataToEdit(data);
    setCreateModalOpen(true);
  };

  const handleDeleteClick = (data: Data) => {
    setDataToDelete(data);
    setDeleteModalOpen(true);
  };

  const resetFilters = () => {
    setIsResetting(true);
    setSearchQuery("");
    setStatusFilter(1);
    setDestacadoAntiguaFilter(null);
    setDestacadoFilter(null);
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(0);
    setIsResetting(false);
    fetchTiposDocumento();
  };

  const toggleColumnaVisible = (column: VisibleColumn) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.key === column.key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleConfirmDelete = async () => {
    if (!dataToDelete) return;
    try {
      await NoticiaService.deleteNoticia(dataToDelete.id);
      setDocumentos(documentos.filter((d) => d.id !== dataToDelete.id));
      fetchData();
      setDeleteModalOpen(false);
      setDataToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Definir un arreglo con las opciones de filtro dinámico
  const filterOptions: FilterOption[] = [
    {
      key: "search",
      type: "input",
      placeholder: "Buscar...",
      value: searchQuery,
      onChange: setSearchQuery,
    },
    {
      key: "destacadoAntigua",
      type: "checkbox",
      label: "Destacado Antigua",
      value: destacadoAntiguaFilter,
      onChange: handleDestacadoAntiguaChange,
    },
    {
      key: "destacado",
      type: "checkbox",
      label: "Destacado Principal",
      value: destacadoFilter,
      onChange: handleDestacadoChange,
    },
  ];

  // Arreglo con las acciones para el menú desplegable
  const dropdownActions: (ActionOption<Data> & {
    showForStatus?: string | string[];
  })[] = [
    {
      label: "Editar",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleEditClick(item),
      /*  showForStatus: ["ASIGNADA", "DISPONIBLE"], */
      iconColor: "text-green-600",
      iconColorDark: "dark:text-green-400",
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleDeleteClick(item),
      /* showForStatus: ["ASIGNADA", "DISPONIBLE"], */
      iconColor: "text-red-500",
      iconColorDark: "dark:text-red-400",
    },
  ];

  // Opcional: Arreglo de acciones que se mostrarán directamente (inline) junto al botón del menú
  const inlineActions: (ActionOption<Data> & {
    showForStatus?: string | string[];
    iconColor?: string;
    iconColorDark?: string;
  })[] = [
    {
      label: "Imagenes",
      icon: <PictureInPicture className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleImagenes(item),
      iconColor: "",
      iconColorDark: "",
    },
  ];

  const handleImagenes = (item: Data) => {
    setDialogImagenOpen(true);
    setDataToEdit(item);
    setDataToEditImagen(item);
  };

  const convertToDocumentoFormData = (data: Data): DocumentoFormData => ({
    id: data.id,
    gorro: data.gorro,
    titulo: data.titulo,
    bajada: data.bajada,
    introduccion: data.introduccion,
    contenido: data.contenido,
    conclusion: data.conclusion,
    nota: data.nota || "",
    fechaPublicacion: new Date(data.fechaPublicacion),
    destacado: data.destacado,
    url: data.url || "",
    activo: data.activo,
    destacadoAntigua: data.destacadoAntigua,
    autor: data.autor,
    tags: data.tags || [],
    consejeros: data.consejeros.map((c) => c.id),
    comisiones: data.comisiones.map((c) => c.id),
  });

  const onUpdateStatus = async (id: number, status: boolean) => {
    try {
      await NoticiaService.activarNoticia(id, status);
      fetchData();
    } catch (error) {
      console.error("Error al activar documento:", error);
    }
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 py-6 transition-colors duration-200 ease-in-out">
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-bold">Noticias</div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Registro de noticias
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl w-full md:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>
        {/* Filtros */}
        <TableFilters
          filters={filterOptions}
          resetFilters={resetFilters}
          isResetting={isResetting}
          visibleColumns={visibleColumns}
          toggleColumnaVisible={toggleColumnaVisible}
        />
        {/* Tabla */}
        <DataTable
          data={documentos}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onUpdateStatus={onUpdateStatus}
          dropdownActions={dropdownActions}
          inlineActions={inlineActions}
          /*  getInlineActions={(item) =>
              inlineActions.filter((action) => {
                if (action.showForStatus) {
                  return Array.isArray(action.showForStatus)
                    ? action.showForStatus.includes(item.estado)
                    : action.showForStatus === item.estado;
                }
                return true;
              })
            } */
          getDropdownActions={(item) =>
            dropdownActions.filter((action) => {
              if (action.showForStatus) {
                return Array.isArray(action.showForStatus)
                  ? action.showForStatus.includes(item.estado)
                  : action.showForStatus === item.estado;
              }
              return true;
            })
          }
        />
        {/* Paginación */}
        <PaginationControl
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
      <Eliminar
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        dataTitle={dataToDelete?.dni || ""}
      />
      <Agregar
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setDataToEdit(null);
        }}
        fetchData={fetchData}
        data={dataToEdit ? convertToDocumentoFormData(dataToEdit) : null}
        onCreateData={(newData) => {
          // Lógica para manejar la creación de un nuevo operario
          console.log("Nuevo operario creado:", newData);
        }}
        tipoDocumento={tiposDocumento}
      />
      <PhotoGalleryUpload
        isOpen={dialogImagenOpen}
        onClose={() => setDialogImagenOpen(false)}
        data={dataToEditImagen}
      />
    </div>
  );
}
