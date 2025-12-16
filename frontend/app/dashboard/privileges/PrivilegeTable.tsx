"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  flexRender,
  PaginationState,
} from "@tanstack/react-table";
import { Privilege } from "@/services/RoleService";
import PrivilegeService from "@/services/PrivilegeService";
import { cn } from "@/lib/utils";

interface PrivilegeTableProps {
  privileges: Privilege[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (privilege: Privilege) => void;
  onSort: (sortBy: string) => void;
  sortConfig: {
    sortBy: string;
    sortDir: "asc" | "desc";
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
}

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

export function PrivilegeTable({
  privileges,
  isLoading,
  onRefresh,
  onEdit,
  onSort,
  sortConfig,
  pagination,
}: PrivilegeTableProps) {
  const { user } = useUser();
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Definición de columnas
  const columns: ColumnDef<Privilege>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => onSort("name")}
          className={cn(
            "flex items-center gap-2",
            sortConfig.sortBy === "name" && "font-bold"
          )}
        >
          Nombre
          {sortConfig.sortBy === "name" && (
            <span className="ml-2">
              {sortConfig.sortDir === "asc" ? "↑" : "↓"}
            </span>
          )}
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => onSort("description")}
          className={cn(
            "flex items-center gap-2",
            sortConfig.sortBy === "description" && "font-bold"
          )}
        >
          Descripción
          {sortConfig.sortBy === "description" && (
            <span className="ml-2">
              {sortConfig.sortDir === "asc" ? "↑" : "↓"}
            </span>
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.description || "Sin descripción"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => onSort("createdAt")}
          className={cn(
            "flex items-center gap-2",
            sortConfig.sortBy === "createdAt" && "font-bold"
          )}
        >
          Fecha de Creación
          {sortConfig.sortBy === "createdAt" && (
            <span className="ml-2">
              {sortConfig.sortDir === "asc" ? "↑" : "↓"}
            </span>
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString("es-ES")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {hasPrivilege(user, "PRIVILEGE_UPDATE") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Editar</span>
              <IconEdit className="h-4 w-4" />
            </Button>
          )}
          {hasPrivilege(user, "PRIVILEGE_DELETE") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeletePrivilege(row.original)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <span className="sr-only">Eliminar</span>
              <IconTrash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: privileges,
    columns,
    pageCount: pagination.pageCount,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        pagination.onPageChange(newState.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const handleDeletePrivilege = (privilege: Privilege) => {
    setSelectedPrivilege(privilege);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPrivilege) return;

    try {
      await PrivilegeService.deletePrivilege(selectedPrivilege.id);
      toast.success("Privilegio eliminado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error al eliminar el privilegio:", error);
      toast.error("Error al eliminar el privilegio");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPrivilege(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pagination.pageSize }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[300px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (privileges.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-4 text-center text-muted-foreground">
          No se encontraron privilegios
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 p-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} privilegio(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              privilegio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
