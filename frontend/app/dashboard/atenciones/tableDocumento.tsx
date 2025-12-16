"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Eliminar } from "@/components/eliminar";
import PaginationControl from "@/components/PaginationControl";
import TableFilters, {
  VisibleColumn,
  FilterOption,
} from "@/components/TableFilters";
import DataTable, { SortConfig, ActionOption } from "@/components/DataTable";
import Agregar from "./agregar";
import AtencionService from "@/services/AtencionService";

type Data = {
  id: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  email: string;
  imagen: string;
  estado: string;
};

interface AtencionFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  email: string;
  imagen: string;
  estado: string;
}

export function TableDocumento() {
  const [atenciones, setAtenciones] = useState<Data[]>([]);
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
      key: "descripcion",
      label: "Descripcion",
      visible: true,
      align: "start",
    },
    {
      key: "telefono",
      label: "Telefono",
      visible: true,
      align: "start",
    },
    {
      key: "email",
      label: "Email",
      visible: true,
      align: "start",
    },
  ]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await AtencionService.getAtenciones(
        currentPage,
        rowsPerPage,
        searchQuery ? searchQuery.trim() : undefined
      );
      setAtenciones(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching atenciones:", error);
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
      await AtencionService.deleteAtencion(dataToDelete.id);
      setAtenciones(atenciones.filter((d) => d.id !== dataToDelete.id));
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
    /*  {
      key: "estado",
      type: "select",
      placeholder: "Estado",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "ACTIVO", label: "Activo" },
        { value: "INACTIVO", label: "Inactivo" },
        { value: "TODOS", label: "Todos" },
      ],
    }, */
  ];

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

  const convertToAtencionFormData = (data: Data): AtencionFormData => ({
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    telefono: data.telefono,
    email: data.email,
    imagen: data.imagen,
    estado: data.estado,
  });

  const onUpdateStatus = async (id: number, status: boolean) => {
    /*  try {
      await AtencionService.activarAtencion(id, status);
      fetchData();
    } catch (error) {
      console.error("Error al activar atención:", error);
    } */
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 py-6 transition-colors duration-200 ease-in-out">
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-bold">Atenciones</div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Registro de atenciones
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
          data={atenciones}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onUpdateStatus={onUpdateStatus}
          dropdownActions={dropdownActions}
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
        data={dataToEdit ? convertToAtencionFormData(dataToEdit) : null}
        onCreateData={(newData) => {
          console.log("Nueva atención creada:", newData);
        }}
      />
    </div>
  );
}
