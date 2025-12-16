"use client";

import { RoleForm } from "../RoleForm";
import { useUser } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NewRolePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const hasPrivilege =
      user?.roleDetails?.some((role) =>
        role.privileges.some((p) => p.name === "ROLE_CREATE")
      ) ?? false;

    if (!hasPrivilege) {
      toast.error("No tiene permisos para crear roles");
      router.push("/dashboard/roles");
    }
  }, [user, router]);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Nuevo Rol</h1>
      <RoleForm />
    </div>
  );
}
