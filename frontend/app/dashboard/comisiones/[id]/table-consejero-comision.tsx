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
  SquareChartGantt,
} from "lucide-react";
import { Eliminar } from "@/components/eliminar";
import PaginationControl from "@/components/PaginationControl";
import TableFilters, {
  VisibleColumn,
  FilterOption,
} from "@/components/TableFilters";
import DataTable, { SortConfig, ActionOption } from "@/components/DataTable";
import ComisionService from "@/services/ComisionService";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Agregar from "../../consejeros/agregar";
type Data = {
  id: number;
  cargo: string;
  consejero: any;
  comision: any;
  activo: boolean;
};

export function TableConsejeroComision({ success }: { success: boolean }) {
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
      key: "cargo",
      label: "Cargo",
      visible: true,
      align: "start",
    },
    {
      key: "consejero.nombre",
      label: "Consejero",
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
      const result = await ComisionService.getConsejeros(
        Number(id),
        currentPage,
        rowsPerPage
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
  }, [id, currentPage, rowsPerPage, searchQuery, statusFilter, success]);

  const handleSort = (column: string) => {
    setSortConfig((current) => ({
      key: column,
      direction:
        current.key === column && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteClick = (data: Data) => {
    setDataToDelete(data);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dataToDelete) return;
    try {
      await ComisionService.deleteConsejeroComision(dataToDelete.id);
      setData(datas.filter((d) => d.id !== dataToDelete.id));
      fetchData();
      setDeleteModalOpen(false);
      setDataToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const inlineActions: (ActionOption<Data> & {
    showForStatus?: string | string[];
    iconColor?: string;
    iconColorDark?: string;
  })[] = [
    {
      label: "Eliminar",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (item: Data) => handleDeleteClick(item),
      iconColor: "text-zinc-800",
      iconColorDark: "dark:text-zinc-800",
    },
  ];

  const onUpdateStatus = async (id: number, status: boolean) => {
    try {
      await ComisionService.activarConsejeroComision(id, status);
      fetchData();
    } catch (error) {
      console.error("Error al activar comisión:", error);
    }
  };

  return (
    <div className="  py-6 transition-colors duration-200 ease-in-out">
      <div className="space-y-4">
        {/* Tabla */}
        <DataTable
          data={datas}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onUpdateStatus={onUpdateStatus}
          /*  dropdownActions={dropdownActions} */
          inlineActions={inlineActions}
          /*  getDropdownActions={(item) =>
            dropdownActions.filter((action) => {
              if (action.showForStatus) {
                return Array.isArray(action.showForStatus)
                  ? action.showForStatus.includes(item.estado)
                  : action.showForStatus === item.estado;
              }
              return true;
            })
          } */
        />
      </div>
      <Eliminar
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        dataTitle={dataToDelete?.cargo || ""}
      />
      <Agregar
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setDataToEdit(null);
        }}
        fetchData={fetchData}
        /*  data={dataToEdit ? convertToOperarioFormData(dataToEdit) : null} */
        onCreateData={(newData) => {
          // Lógica para manejar la creación de un nuevo operario
          console.log("Nuevo operario creado:", newData);
        }}
      />
    </div>
  );
}

export default TableConsejeroComision;
