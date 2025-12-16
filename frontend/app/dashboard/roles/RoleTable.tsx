"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import RoleService, { Role } from "@/services/RoleService";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onRefresh: () => void;
}

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

export function RoleTable({ roles, isLoading, onRefresh }: RoleTableProps) {
  const router = useRouter();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Definición de columnas
  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "privileges",
        header: "Privilegios",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.privileges.map((privilege) => (
              <span
                key={privilege.id}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {privilege.name}
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Fecha de Creación",
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
            {hasPrivilege(user, "ROLE_READ") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewRole(row.original)}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Ver</span>
                <IconEye className="h-4 w-4" />
              </Button>
            )}
            {hasPrivilege(user, "ROLE_UPDATE") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/roles/${row.original.id}`)
                }
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Editar</span>
                <IconEdit className="h-4 w-4" />
              </Button>
            )}
            {hasPrivilege(user, "ROLE_DELETE") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteRole(row.original)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <span className="sr-only">Eliminar</span>
                <IconTrash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [user]
  );

  const table = useReactTable({
    data: roles,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;

    try {
      await RoleService.deleteRole(selectedRole.id);
      toast.success("Rol eliminado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      toast.error("Error al eliminar el rol");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
    }
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Privilegios</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
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

  if (roles.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-4 text-center text-muted-foreground">
          No se encontraron roles
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
              rol y sus privilegios asociados.
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

      {/* Modal de visualización de privilegios */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privilegios del Rol: {selectedRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {selectedRole?.privileges.map((privilege) => (
                <Badge key={privilege.id} variant="secondary">
                  {privilege.name}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
