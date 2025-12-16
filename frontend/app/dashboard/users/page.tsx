"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconUserPlus, IconSearch } from "@tabler/icons-react";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AuthService from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import { UserAPI } from "@/lib/api-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { Plus } from "lucide-react";
import AdminUserService from "@/services/AdminUserService";
import RoleService from "@/services/RoleService";

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  // Estados para la tabla de TanStack
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Función de debounce para limitar las llamadas a la API
  function debounce(fn: Function, delay: number) {
    let timer: NodeJS.Timeout;
    const debouncedFn: any = (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };

    debouncedFn.cancel = () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

    return debouncedFn;
  }

  const openNewUserDialog = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditUserDialog = (user: any) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDeleteUserDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await UserAPI.toggleUserStatus(userId, !currentStatus);

      // Actualizar el estado local
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, enabled: !currentStatus } : user
      );

      setUsers(updatedUsers);
      toast.success(
        `Usuario ${currentStatus ? "desactivado" : "activado"} correctamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      toast.error("No se pudo cambiar el estado del usuario");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);

    try {
      await UserAPI.deleteUser(selectedUser.id);

      // Actualizar el estado local
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);

      setIsDeleteDialogOpen(false);
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("No se pudo eliminar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "No disponible";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Configuración de la tabla con TanStack
  const table = useReactTable({
    data: users,
    columns: [], // Se actualizarán dinámicamente en UserTable
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    pageCount: totalPages,
    // Configuración manual para server-side
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // Callbacks de estado
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    // Modelos requeridos
    getCoreRowModel: getCoreRowModel(),
    // Configuración adicional
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    // Funciones personalizadas
    globalFilterFn: "includesString",
    // Meta información para identificar la tabla
    meta: {
      tableName: "users-table",
    },
  });

  // Función debounced para fetchUsers
  const debouncedFetchUsers = useCallback(
    debounce(async () => {
      setIsLoading(true);
      try {
        // Obtener parámetros de ordenación
        let sort = "id";
        let order: "asc" | "desc" = "desc";

        // Si hay ordenación en la tabla, usar esos valores
        if (sorting.length > 0) {
          sort = sorting[0].id;
          order = sorting[0].desc ? "desc" : "asc";
        }

        // Obtener los datos paginados con filtros
        const response = await AdminUserService.getUsersPage(
          pagination.pageIndex,
          pagination.pageSize,
          sort,
          order,
          globalFilter,
          roleFilter
        );

        setUsers(response.content as unknown as any[]);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        toast.error("No se pudieron cargar los usuarios");
      } finally {
        setIsLoading(false);
      }
    }, 300), // 300ms de debounce
    [
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      globalFilter,
      roleFilter,
    ]
  );

  const handleUserCreated = () => {
    debouncedFetchUsers();
  };

  const handleUserUpdated = () => {
    debouncedFetchUsers();
  };

  // Función para cargar los roles
  const fetchRoles = async () => {
    try {
      const rolesData = await RoleService.getRolesList();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      toast.error("No se pudieron cargar los roles");
    }
  };

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated || !AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Cargar roles y usuarios
    fetchRoles();
    debouncedFetchUsers();

    // Cleanup function para cancelar peticiones pendientes
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [router, isAuthenticated, debouncedFetchUsers]);

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Administración de Usuarios
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Gestiona los usuarios del sistema de manera eficiente
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Sistema activo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Buscar por nombre, email..."
                            className="pl-10 pr-4 py-2 w-full sm:w-[350px] focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                          />
                        </div>
                        <div className="h-8 w-px bg-border mx-2"></div>
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="role-filter"
                            className="text-sm font-medium text-foreground"
                          >
                            Rol:
                          </Label>
                          <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                          >
                            <SelectTrigger
                              id="role-filter"
                              className="w-[140px]"
                            >
                              <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {hasPrivilege(user, "USER_CREATE") && (
                        <Button
                          onClick={openNewUserDialog}
                          disabled={isLoading}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <IconUserPlus className="mr-2 h-4 w-4" />
                          Nuevo Usuario
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <UserTable
                  table={table}
                  isLoading={isLoading}
                  onEditUser={openEditUserDialog}
                  onDeleteUser={openDeleteUserDialog}
                  formatDate={formatDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Formulario para crear/editar usuario */}
        <UserForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          user={selectedUser}
          onUserCreated={handleUserCreated}
          onUserUpdated={handleUserUpdated}
        />

        {/* Diálogo de confirmación para eliminar usuario */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <span className="font-medium">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </span>
                ? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
