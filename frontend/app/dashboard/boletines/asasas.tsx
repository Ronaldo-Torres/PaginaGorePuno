"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BoletinService, { type Boletines } from "@/services/BoletinService";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

// Schema de validación con mensajes claros
const formSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  contenido: z.string().min(1, "El contenido es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  url: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
  activo: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface BoletinFormData {
  id?: number;
  titulo: string;
  contenido: string;
  categoria: string;
  url?: string;
  activo: boolean;
}

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  data?: BoletinFormData | null;
  fetchData: () => void;
}

export function Agregar({ isOpen, onClose, data, fetchData }: AgregarProps) {
  // Inicializar el formulario con valores por defecto
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      contenido: "",
      categoria: "",
      url: "",
      activo: false,
    },
  });

  // Resetear el formulario cuando cambian los datos
  useEffect(() => {
    if (data) {
      form.reset({
        titulo: data.titulo,
        contenido: data.contenido,
        categoria: data.categoria,
        url: data.url || "",
        activo: Boolean(data.activo),
      });
    } else {
      form.reset({
        titulo: "",
        contenido: "",
        categoria: "",
        url: "",
        activo: false,
      });
    }
  }, [data, form]);

  // Manejar el envío del formulario con mejor manejo de errores
  const onSubmit = async (values: FormValues) => {
    try {
      const boletinData: Boletines = {
        ...values,
        fechaPublicacion: new Date(),
        estado: values.activo ? "activo" : "inactivo",
      };

      if (data?.id) {
        await BoletinService.updateBoletin(data.id, boletinData);
        toast({
          title: "Boletín actualizado",
          description: "El boletín ha sido actualizado exitosamente",
        });
      } else {
        await BoletinService.createBoletin(boletinData);
        toast({
          title: "Boletín creado",
          description: "El boletín ha sido creado exitosamente",
        });
      }

      onClose();
      fetchData();
    } catch (error) {
      console.error("Error al guardar el boletín:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el boletín",
        variant: "destructive",
      });
    }
  };

  // Función para cerrar y limpiar el formulario
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-auto max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
          <DialogTitle>
            {data?.id ? "Editar Boletín" : "Crear Nuevo Boletín"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data?.id ? "editar" : "crear"} un boletín.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Título</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Ej. Boletín de la Semana"
                        {...field}
                        aria-describedby={`${field.name}-description`}
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-description`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Categoría</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Ej. Noticias, Eventos, Anuncios"
                        {...field}
                        aria-describedby={`${field.name}-description`}
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-description`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contenido"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel htmlFor={field.name}>Contenido</FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        placeholder="Ingrese el contenido del boletín"
                        className="min-h-[120px]"
                        {...field}
                        aria-describedby={`${field.name}-description`}
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-description`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>URL Contenido</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="https://ejemplo.com/documento"
                        {...field}
                        aria-describedby={`${field.name}-description`}
                      />
                    </FormControl>
                    <FormDescription>
                      URL opcional para contenido externo relacionado
                    </FormDescription>
                    <FormMessage id={`${field.name}-description`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-describedby={`${field.name}-description`}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor={field.name}>Activo</FormLabel>
                      <FormDescription id={`${field.name}-description`}>
                        Marque esta casilla para publicar el boletín
                        inmediatamente
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting
                  ? "Guardando..."
                  : data?.id
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Agregar;
