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
import ConsejeroService from "@/services/ConsejeroService";
import DocumentoService from "@/services/DocumentoService";
import TipoDocumentoService from "@/services/TipoDocumentoService";
import PortadaService from "@/services/PortadaService";
import Agregar from "./agregar";

type Data = {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  activo: boolean;
  imagen: string;
  nombreBoton: string;
  urlBoton: string;
};

interface DocumentoFormData {
  id?: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  activo: boolean;
  imagen: string;
  nombreBoton: string;
  urlBoton: string;
}

export function PortadasTable() {
  const [portadas, setPortadas] = useState<Data[]>([]);
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
  const [dataToEdit, setDataToEdit] = useState<Data | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumn[]>([
    { key: "id", label: "ID", visible: true, align: "start" },
    {
      key: "titulo",
      label: "Titulo",
      visible: true,
      align: "start",
    },
    {
      key: "subtitulo",
      label: "Subtitulo",
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
      key: "estado",
      label: "Estado",
      visible: true,
      align: "center",
    },
  ]);
  const [tiposDocumento, setTiposDocumento] = useState<
    { id: string; nombre: string }[]
  >([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // const estado = statusFilter === "TODOS" ? null : statusFilter;
      const tipoDocumento = statusFilter;
      const response = await PortadaService.getPortadas(
        currentPage,
        rowsPerPage,
        searchQuery,
        //estado
        tipoDocumento
      );
      const result = response.content;
      setPortadas(result as any[]);
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
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, sortConfig, currentPage, rowsPerPage]);

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

  const handleConfirmDelete = async () => {
    if (!dataToDelete) return;
    try {
      await PortadaService.deletePortada(dataToDelete.id);
      setPortadas(portadas.filter((d) => d.id !== dataToDelete.id));
      fetchData();
      setDeleteModalOpen(false);
      setDataToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

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
    /*    {
      label: "Enviar a Contrato ",
      icon: <Send className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleFiscalizacion(item),
      showForStatus: "GENERADO",
      iconColor: "text-orange-500",
      iconColorDark: "dark:text-orange-300",
    }, */
  ];

  const convertToDocumentoFormData = (data: Data): DocumentoFormData => ({
    id: data.id,
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    descripcion: data.descripcion,
    activo: data.activo,
    imagen: data.imagen,
    nombreBoton: data.nombreBoton,
    urlBoton: data.urlBoton,
  });

  const onUpdateStatus = async (id: number, status: boolean) => {
    try {
      await PortadaService.activarPortada(id, status);
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
            <div className="text-xl sm:text-2xl font-bold">Portada</div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Portada de la pagina principal
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

        {/* Tabla */}
        <DataTable
          data={portadas}
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
      />
    </div>
  );
}
