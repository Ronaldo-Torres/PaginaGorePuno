"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import RoleService, { Role, Privilege } from "@/services/RoleService";
import PrivilegeService from "@/services/PrivilegeService";

// Esquema de validación
const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  privilegeIds: z.array(z.number()).min(1, {
    message: "Debe seleccionar al menos un privilegio.",
  }),
});

interface RoleFormProps {
  roleId?: number;
}

export function RoleForm({ roleId }: RoleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  // Configurar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      privilegeIds: [],
    },
  });

  // Cargar datos del rol si estamos en modo edición
  useEffect(() => {
    const loadRole = async () => {
      if (!roleId) return;

      try {
        const role = await RoleService.getRoleById(roleId);
        form.reset({
          name: role.name,
          privilegeIds: role.privileges.map((p) => p.id),
        });
      } catch (error) {
        console.error("Error al cargar el rol:", error);
        toast.error("Error al cargar el rol");
        router.push("/dashboard/roles");
      }
    };

    loadRole();
  }, [roleId, form, router]);

  // Cargar privilegios disponibles
  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        const privileges = await PrivilegeService.getAllPrivileges();
        setPrivileges(privileges);
      } catch (error) {
        console.error("Error al cargar privilegios:", error);
        toast.error("Error al cargar privilegios");
      }
    };

    loadPrivileges();
  }, []);

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Convertir los IDs de privilegios a objetos Privilege completos
      const selectedPrivileges = privileges.filter((privilege) =>
        values.privilegeIds.includes(privilege.id)
      );

      if (roleId) {
        await RoleService.updateRole(roleId, {
          name: values.name,
          privileges: selectedPrivileges,
        });
        toast.success("Rol actualizado correctamente");
      } else {
        await RoleService.createRole({
          name: values.name,
          privileges: selectedPrivileges,
        });
        toast.success("Rol creado correctamente");
      }
      router.push("/dashboard/roles");
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      toast.error("Error al guardar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar privilegios por categoría
  const groupedPrivileges = privileges.reduce<Record<string, Privilege[]>>(
    (acc, privilege) => {
      const category = privilege.name.split("_")[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(privilege);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {roleId ? "Editar Rol" : "Crear Nuevo Rol"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {roleId
                  ? "Modifica los detalles del rol existente"
                  : "Define un nuevo rol y sus privilegios"}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Rol</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese el nombre del rol"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privilegeIds"
                      render={() => (
                        <FormItem>
                          <FormLabel>Privilegios</FormLabel>
                          <div className="space-y-6">
                            {Object.entries(groupedPrivileges).map(
                              ([category, categoryPrivileges]) => (
                                <div key={category} className="space-y-2">
                                  <h3 className="font-semibold text-sm text-muted-foreground">
                                    {category}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryPrivileges.map((privilege) => (
                                      <FormField
                                        key={privilege.id}
                                        control={form.control}
                                        name="privilegeIds"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={privilege.id}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(
                                                    privilege.id
                                                  )}
                                                  onCheckedChange={(
                                                    checked
                                                  ) => {
                                                    return checked
                                                      ? field.onChange([
                                                          ...field.value,
                                                          privilege.id,
                                                        ])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) =>
                                                              value !==
                                                              privilege.id
                                                          )
                                                        );
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="font-normal">
                                                {privilege.name}
                                                <p className="text-xs text-muted-foreground">
                                                  {privilege.description}
                                                </p>
                                              </FormLabel>
                                            </FormItem>
                                          );
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/roles")}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
