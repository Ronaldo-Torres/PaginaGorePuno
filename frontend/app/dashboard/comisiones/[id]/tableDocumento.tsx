"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  ArrowRightToLine,
  PhoneOutgoing,
  PictureInPicture,
} from "lucide-react";
import { Eliminar } from "@/components/eliminar";
import PaginationControl from "@/components/PaginationControl";
import TableFilters, {
  VisibleColumn,
  FilterOption,
} from "@/components/TableFilters";
import DataTable, { SortConfig, ActionOption } from "@/components/DataTable";
import ComisionService from "@/services/ComisionService";
import Agregar from "./agregar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { PhotoGalleryUpload } from "./upload-imagenes";
type Data = {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  tipo: string;
  activo: boolean;
  comision: any;
};

interface ActividadFormData {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  tipo: string;
  activo: boolean;
  comision: any;
}

export function TableDocumento() {
  const router = useRouter();
  // Obtener el id de la comisión param de la url
  const { id } = useParams();
  const [datas, setData] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<Data | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Data | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumn[]>([
    { key: "id", label: "ID", visible: true, align: "start" },
    {
      key: "nombre",
      label: "Nombre",
      visible: true,
      align: "start",
    },
    {
      key: "descripcion",
      label: "Descripcion",
      visible: true,
      align: "start",
    },
    {
      key: "fecha",
      label: "Fecha",
      visible: true,
      align: "start",
    },
    {
      key: "hora",
      label: "Hora",
      visible: true,
      align: "start",
    },
    {
      key: "lugar",
      label: "Lugar",
      visible: true,
      align: "start",
    },
    {
      key: "categoria",
      label: "Categoria",
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
  const [dialogImagenOpen, setDialogImagenOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const estado = statusFilter === "TODOS" ? null : statusFilter;
      const result = await ComisionService.getActividades(
        Number(id),
        currentPage,
        rowsPerPage,
        searchQuery,
        estado
      );
      setData(result.content as any[]);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error("Error fetching datas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, currentPage, rowsPerPage, searchQuery, statusFilter]);

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
    setStatusFilter("TODOS");
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
      await ComisionService.deleteActividad(dataToDelete.id);
      setData(datas.filter((d) => d.id !== dataToDelete.id));
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
      key: "estado",
      type: "select",
      placeholder: "Estado",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "ASIGNADO", label: "Asignado" },
        { value: "DISPONIBLE", label: "Disponible" },
        { value: "TODOS", label: "Todos" },
      ],
    },
    // Se pueden agregar más filtros aquí si se requieren.
  ];

  const handleImagenes = (item: Data) => {
    setDialogImagenOpen(true);
    setDataToEdit(item);
  };

  // Arreglo con las acciones para el menú desplegable
  const dropdownActions: (ActionOption<Data> & {
    showForStatus?: string | string[];
  })[] = [
    {
      label: "Editar",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleEditClick(item),
      iconColor: "text-green-600",
      iconColorDark: "dark:text-green-400",
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleDeleteClick(item),
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

  const convertToActividadFormData = (data: Data): ActividadFormData => ({
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    activo: data.activo,
    fecha: data.fecha,
    hora: data.hora,
    lugar: data.lugar,
    categoria: data.categoria,
    tipo: data.tipo,
    comision: data.comision,
  });

  const onUpdateStatus = async (id: number, status: boolean) => {
    try {
      await ComisionService.activarActividad(id, status);
      fetchData();
    } catch (error) {
      console.error("Error al activar comisión:", error);
    }
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 py-6 transition-colors duration-200 ease-in-out">
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-bold">Actividades</div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Registro de actividades
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
          data={datas}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onUpdateStatus={onUpdateStatus}
          dropdownActions={dropdownActions}
          inlineActions={inlineActions}
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
        dataTitle={dataToDelete?.nombre || ""}
      />
      <Agregar
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setDataToEdit(null);
        }}
        fetchData={fetchData}
        data={dataToEdit ? convertToActividadFormData(dataToEdit) : null}
        onCreateData={(newData) => {
          // Lógica para manejar la creación de una nueva actividad
          console.log("Nueva actividad creada:", newData);
        }}
      />
      <PhotoGalleryUpload
        data={dataToEdit}
        isOpen={dialogImagenOpen}
        onClose={() => setDialogImagenOpen(false)}
      />
    </div>
  );
}
