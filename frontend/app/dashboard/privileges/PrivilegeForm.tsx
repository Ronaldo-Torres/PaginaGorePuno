"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Privilege } from "@/services/RoleService";
import PrivilegeService from "@/services/PrivilegeService";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PrivilegeFormProps {
  open: boolean;
  onClose: () => void;
  privilege?: Privilege | null;
  onSuccess?: () => void;
}

export function PrivilegeForm({
  open,
  onClose,
  privilege,
  onSuccess,
}: PrivilegeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: privilege?.name || "",
      description: privilege?.description || "",
    },
  });

  useEffect(() => {
    if (privilege) {
      console.log("Actualizando formulario con privilegio:", privilege);
      form.reset({
        name: privilege.name,
        description: privilege.description || "",
      });
    } else {
      console.log("Reseteando formulario a valores vacíos");
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [privilege, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (privilege) {
        console.log("Actualizando privilegio:", privilege.id, values);
        await PrivilegeService.updatePrivilege(privilege.id, {
          name: values.name,
          description: values.description || "",
        });
        toast.success("Privilegio actualizado correctamente");
      } else {
        console.log("Creando nuevo privilegio:", values);
        await PrivilegeService.createPrivilege({
          name: values.name,
          description: values.description || "",
        });
        toast.success("Privilegio creado correctamente");
      }
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error al guardar el privilegio:", error);
      toast.error("Error al guardar el privilegio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {privilege ? "Editar Privilegio" : "Nuevo Privilegio"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
