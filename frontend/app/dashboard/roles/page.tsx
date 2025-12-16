"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Shield } from "lucide-react";
import { RoleTable } from "./RoleTable";
import RoleService, { Role } from "@/services/RoleService";

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

export default function RolesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

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

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await RoleService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      toast.error("No se pudieron cargar los roles");
    } finally {
      setIsLoading(false);
    }
  };

  // Función debounced para fetchRoles
  const debouncedFetchRoles = useCallback(
    debounce(async () => {
      await fetchRoles();
    }, 300),
    []
  );

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    debouncedFetchRoles();

    return () => {
      debouncedFetchRoles.cancel();
    };
  }, [router, isAuthenticated, debouncedFetchRoles]);

  // Filtrar roles basado en el término de búsqueda
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      Gestión de Roles y Privilegios
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Administra los roles y sus privilegios en el sistema
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
                            placeholder="Buscar por nombre..."
                            className="pl-10 pr-4 py-2 w-full sm:w-[350px] focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasPrivilege(user, "PRIVILEGE_READ") && (
                          <Button
                            onClick={() => router.push("/dashboard/privileges")}
                            variant="outline"
                            className="px-4 py-2"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Gestionar Privilegios
                          </Button>
                        )}
                        {hasPrivilege(user, "ROLE_CREATE") && (
                          <Button
                            onClick={() => router.push("/dashboard/roles/new")}
                            disabled={isLoading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Rol
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <RoleTable
                  roles={filteredRoles}
                  isLoading={isLoading}
                  onRefresh={fetchRoles}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
