"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  Table as TanStackTable,
} from "@tanstack/react-table";
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconSearch,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { buildAvatarUrl, getInitials } from "@/lib/avatar-utils";
import { useUser } from "@/lib/store";
import { UserDetailsModal } from "./UserDetailsModal";
import UserForm from "./UserForm";
import { User } from "@/types/user";

interface UserTableProps {
  table: TanStackTable<any>;
  isLoading: boolean;
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  formatDate: (dateString: string | null) => string;
}

// Componente para los encabezados de tabla con estilo mejorado
const SortableHeader = ({ column, title }: { column: any; title: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "hover:bg-muted/50 px-3 py-2 font-semibold text-sm flex items-center justify-start w-full h-auto text-foreground",
        "transition-colors duration-200",
        column.getIsSorted() && "bg-muted text-foreground"
      )}
    >
      {title}
      <span className="ml-2 transition-transform duration-200">
        {{
          asc: <IconChevronUp className="h-4 w-4 text-primary" />,
          desc: <IconChevronDown className="h-4 w-4 text-primary" />,
        }[column.getIsSorted() as string] ?? (
          <IconSelector className="h-4 w-4 opacity-40 group-hover:opacity-60" />
        )}
      </span>
    </Button>
  );
};

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

export default function UserTable({
  table,
  isLoading,
  onEditUser,
  onDeleteUser,
  formatDate,
}: UserTableProps) {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const handleViewUser = (userData: User) => {
    setSelectedUser(userData);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  // Definición de columnas para TanStack Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: ({ column }) => (
          <SortableHeader column={column} title="Nombre Completo" />
        ),
        cell: ({ row }) => {
          const avatarUrl = buildAvatarUrl(row.original.avatar);
          const initials = getInitials(
            row.original.firstName,
            row.original.lastName
          );

          return (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={avatarUrl}
                  alt={`${row.original.firstName} ${row.original.lastName}`}
                  className="object-cover"
                  onError={(e) =>
                    console.error(
                      "Avatar load error for",
                      row.original.firstName,
                      e
                    )
                  }
                />
                <AvatarFallback className="bg-gradient-to-r from-slate-800 to-slate-900 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-800 font-medium text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">
                  {row.original.firstName} {row.original.lastName}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {row.original.email}
                </div>
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: "roles",
        header: ({ column }) => (
          <SortableHeader column={column} title="Roles" />
        ),
        cell: ({ row }) => {
          const roles = row.original.roles as { id: number; name: string }[];

          // Función para determinar el estilo del badge según el rol
          const getBadgeStyle = (roleName: string) => {
            const roleStyles: { [key: string]: string } = {
              ADMIN:
                "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800",
              SUPER_ADMIN:
                "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800",
              USER: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800",
              "ROL DE VERIFICACION":
                "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800",
            };

            // Color por defecto para roles no especificados - tono cyan/teal atractivo
            return (
              roleStyles[roleName] ||
              "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/50 border-cyan-200 dark:border-cyan-800"
            );
          };

          return (
            <div className="flex flex-wrap gap-1">
              {roles.map((role) => (
                <Badge
                  key={role.id}
                  variant="outline"
                  className={cn(
                    "whitespace-nowrap font-medium border",
                    getBadgeStyle(role.name)
                  )}
                >
                  {role.name}
                </Badge>
              ))}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <SortableHeader column={column} title="Fecha de Registro" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: false,
        sortingFn: "datetime",
      },
      {
        accessorKey: "enabled",
        header: ({ column }) => (
          <div className="px-3 py-2 font-semibold text-sm text-foreground">
            Estado
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <Badge
              variant={row.original.enabled ? "default" : "secondary"}
              className={cn(
                "text-xs px-2 py-1",
                row.original.enabled
                  ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                  : "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
              )}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  row.original.enabled
                    ? "bg-green-500 animate-pulse"
                    : "bg-orange-500"
                }`}
              />
              {row.original.enabled ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "equals",
      },
      {
        id: "actions",
        header: ({ column }) => (
          <div className="px-3 py-2 font-semibold text-sm text-right text-foreground">
            Acciones
          </div>
        ),
        cell: ({ row }) => {
          const userData = row.original;
          const renderActions = () => (
            <div className="flex items-center gap-2">
              {hasPrivilege(user, "USER_READ") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewUser(userData)}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalles</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {hasPrivilege(user, "USER_UPDATE") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(userData)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar usuario</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {hasPrivilege(user, "USER_DELETE") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteUser(userData)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar usuario</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );

          return (
            <div className="flex items-center justify-end space-x-1">
              {renderActions()}
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [onEditUser, onDeleteUser, formatDate, user, handleViewUser]
  );

  // Actualizar las columnas de la tabla
  table.setOptions((prev) => ({
    ...prev,
    columns,
  }));

  return (
    <>
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-3">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-[200px]" />
                    <Skeleton className="h-2 w-[150px]" />
                  </div>
                  <Skeleton className="h-5 w-[80px] rounded-full" />
                  <Skeleton className="h-5 w-[70px] rounded-full" />
                  <Skeleton className="h-3 w-[100px]" />
                  <div className="flex space-x-1">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-b-0"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-auto py-0">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center p-4"
                    >
                      <Alert className="max-w-md mx-auto">
                        <IconSearch className="h-4 w-4" />
                        <AlertDescription>
                          <div className="text-center space-y-1">
                            <p className="font-medium">
                              No se encontraron usuarios
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Intenta ajustar los filtros de búsqueda o crear un
                              nuevo usuario
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Página{" "}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex + 1}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">
                    {table.getPageCount() || 1}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || isLoading}
                  className="px-3 py-1 bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || isLoading}
                  className="px-3 py-1 bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        formatDate={formatDate}
      />

      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserCreated={() => {}}
        onUserUpdated={() => {}}
      />
    </>
  );
}
