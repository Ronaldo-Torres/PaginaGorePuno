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
import ConsejeroService from "@/services/ConsejeroService";
import Agregar from "./agregar";
import DocumentoService from "@/services/DocumentoService";
import TipoDocumentoService from "@/services/TipoDocumentoService";
import BoletinService from "@/services/BoletinService";
import { PhotoGalleryUpload } from "./upload-imagenes";

type Data = {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  estado: string;
  categoria: string;
  url: string;
  activo: boolean;
  imagen: string;
  urlDocumento: string;
};

interface BoletinFormData {
  id?: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  estado: string;
  categoria: string;
  url: string;
  activo: boolean;
  imagen: string;
  urlDocumento: string;
}

export function TableDocumento() {
  const [documentos, setDocumentos] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });
  const [statusFilter, setStatusFilter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<Data | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Data | null>(null);
  const [dialogImagenOpen, setDialogImagenOpen] = useState(false);
  const [dataToEditImagen, setDataToEditImagen] = useState<Data | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumn[]>([
    { key: "id", label: "ID", visible: true, align: "start" },
    {
      key: "titulo",
      label: "Titulo",
      visible: true,
      align: "start",
    },
    {
      key: "contenido",
      label: "Contenido",
      visible: true,
      align: "start",
    },
    {
      key: "fechaPublicacion",
      label: "Fecha Publicacion",
      visible: true,
      align: "start",
    },
    {
      key: "estado",
      label: "Estado",
      visible: true,
      align: "center",
    },
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // const estado = statusFilter === "TODOS" ? null : statusFilter;
      const tipoDocumento = statusFilter;
      const response = await BoletinService.getBoletines(
        currentPage,
        rowsPerPage,
        searchQuery,
        //estado
        tipoDocumento
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, sortConfig, currentPage, rowsPerPage]);

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
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(0);
    setIsResetting(false);
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
      await BoletinService.deleteBoletin(dataToDelete.id);
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

    // Se pueden agregar más filtros aquí si se requieren.
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
      iconColor: "text-zinc-800",
      iconColorDark: "dark:text-zinc-800",
    },
  ];

  const handleImagenes = (item: Data) => {
    setDialogImagenOpen(true);
    setDataToEdit(item);
    setDataToEditImagen(item);
  };
  const convertToDocumentoFormData = (data: Data): BoletinFormData => ({
    id: data.id,
    titulo: data.titulo,
    contenido: data.contenido,
    fechaPublicacion: new Date(data.fechaPublicacion),
    categoria: data.categoria,
    url: data.url,
    activo: data.activo,
    imagen: data.imagen,
    urlDocumento: data.urlDocumento,
    estado: data.estado,
  });

  const onUpdateStatus = async (id: number, status: boolean) => {
    try {
      await BoletinService.activarBoletin(id, status);
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
            <div className="text-xl sm:text-2xl font-bold">Boletines</div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Registro de boletines
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
        dataTitle={dataToDelete?.titulo || ""}
      />
      <Agregar
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setDataToEdit(null);
        }}
        fetchData={fetchData}
        data={dataToEdit ? convertToDocumentoFormData(dataToEdit) : null}
      />
      <PhotoGalleryUpload
        isOpen={dialogImagenOpen}
        onClose={() => setDialogImagenOpen(false)}
        data={dataToEditImagen}
      />
    </div>
  );
}
