"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PrivilegeTable } from "./PrivilegeTable";
import PrivilegeService, { PageRequest } from "@/services/PrivilegeService";
import { Privilege } from "@/services/RoleService";
import { PrivilegeForm } from "./PrivilegeForm";

// Función para verificar si el usuario tiene un privilegio específico
const hasPrivilege = (user: any, privilegeName: string): boolean => {
  return user?.roleDetails?.some((role: any) =>
    role.privileges.some((privilege: any) => privilege.name === privilegeName)
  );
};

type SortDirection = "asc" | "desc";

export default function PrivilegesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    sortBy: string;
    sortDir: SortDirection;
  }>({
    sortBy: "name",
    sortDir: "asc",
  });

  const fetchPrivileges = async () => {
    setIsLoading(true);
    try {
      const data = await PrivilegeService.getPrivileges({
        page,
        size: pageSize,
        sortBy: sortConfig.sortBy,
        sortDir: sortConfig.sortDir,
      });
      setPrivileges(data.content);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error("Error al obtener privilegios:", error);
      toast.error("No se pudieron cargar los privilegios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar permiso de lectura de privilegios
    if (!hasPrivilege(user, "PRIVILEGE_READ")) {
      toast.error("No tiene permisos para ver privilegios");
      router.push("/dashboard/roles");
      return;
    }

    fetchPrivileges();
  }, [isAuthenticated, user, router, page, sortConfig]);

  const handleCreate = () => {
    setSelectedPrivilege(null);
    setIsFormOpen(true);
  };

  const handleEdit = (privilege: Privilege) => {
    console.log("Iniciando edición de privilegio:", privilege);
    setSelectedPrivilege(privilege);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    console.log("Cerrando formulario");
    setIsFormOpen(false);
    setSelectedPrivilege(null);
    fetchPrivileges();
  };

  const handleSort = (sortBy: string) => {
    setSortConfig((prev) => ({
      sortBy,
      sortDir:
        prev.sortBy === sortBy && prev.sortDir === "asc" ? "desc" : "asc",
    }));
  };

  const hasCreatePrivilege = user?.roleDetails?.some((role) =>
    role.privileges.some((privilege) => privilege.name === "PRIVILEGE_CREATE")
  );

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Privilegios
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Gestiona los privilegios del sistema
                  </p>
                </div>
                {hasCreatePrivilege && (
                  <Button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Nuevo Privilegio
                  </Button>
                )}
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
                            placeholder="Buscar por nombre o descripción..."
                            className="pl-10 pr-4 py-2 w-full sm:w-[350px] focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <PrivilegeTable
                  privileges={privileges}
                  isLoading={isLoading}
                  onRefresh={fetchPrivileges}
                  onEdit={handleEdit}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  pagination={{
                    pageIndex: page,
                    pageSize,
                    pageCount,
                    onPageChange: setPage,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrivilegeForm
        open={isFormOpen}
        onClose={handleCloseForm}
        privilege={selectedPrivilege}
        onSuccess={fetchPrivileges}
      />
    </TooltipProvider>
  );
}
