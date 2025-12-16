"use client";

import { useEffect, useState } from "react";
import { RoleForm } from "../RoleForm";
import { useUser } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RoleService, { Role } from "@/services/RoleService";

export default function EditRolePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const roleId = parseInt(params.id);

  useEffect(() => {
    const hasPrivilege =
      user?.roleDetails?.some((role) =>
        role.privileges.some((p) => p.name === "ROLE_UPDATE")
      ) ?? false;

    if (!hasPrivilege) {
      toast.error("No tiene permisos para editar roles");
      router.push("/dashboard/roles");
      return;
    }

    // Verificar que el ID sea válido
    if (isNaN(roleId)) {
      toast.error("ID de rol inválido");
      router.push("/dashboard/roles");
      return;
    }

    // Solo necesitamos verificar que el rol existe
    const verifyRole = async () => {
      try {
        await RoleService.getRoleById(roleId);
        setIsLoading(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Rol no encontrado");
        } else {
          toast.error("Error al cargar el rol");
        }
        router.push("/dashboard/roles");
      }
    };

    verifyRole();
  }, [roleId, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <RoleForm roleId={roleId} />
    </div>
  );
}
