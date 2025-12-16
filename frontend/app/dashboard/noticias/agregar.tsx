"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import NoticiaService, { Noticias } from "@/services/NoticiaService";
import RichTextEditor from "@/components/RichTextEditor";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  id: z.number().optional(),
  gorro: z
    .string()
    .max(250, "El gorro no puede exceder los 100 caracteres")
    .optional(),
  titulo: z
    .string()
    .min(1, "El título es requerido")
    .max(500, "El título no puede exceder los 500 caracteres"),
  bajada: z
    .string()
    .max(5000, "La bajada no puede exceder los 5000 caracteres")
    .optional(),
  introduccion: z
    .string()
    .max(5000, "La introducción no puede exceder los 5000 caracteres")
    .optional(),
  contenido: z
    .string()
    .max(10000, "El contenido no puede exceder los 10000 caracteres")
    .optional(),
  conclusion: z
    .string()
    .max(5000, "La conclusión no puede exceder los 5000 caracteres")
    .optional(),
  nota: z
    .string()
    .max(1000, "La nota no puede exceder los 1000 caracteres")
    .optional(),
  url: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
  autor: z.string().optional(),
  activo: z.boolean(),
  destacado: z.boolean(),
  destacadoAntigua: z.boolean(),
  fechaPublicacion: z
    .date()
    .min(new Date("2000-01-01"), "La fecha debe ser válida"),
  tags: z.array(z.string()).optional(),
  consejeros: z.array(z.number()).optional(),
  comisiones: z.array(z.number()).optional(),
});

type NoticiaFormData = z.infer<typeof formSchema>;

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  data?: NoticiaFormData | null;
  fetchData: () => void;
}

export function Agregar({ isOpen, onClose, data, fetchData }: AgregarProps) {
  const [consejeros, setConsejeros] = useState<
    { value: number; label: string }[]
  >([]);
  const [comisiones, setComisiones] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [consejerosData, comisionesData] = await Promise.all([
          NoticiaService.getAllConsejeros(),
          NoticiaService.getAllComisiones(),
        ]);

        setConsejeros(
          consejerosData.map((c: any) => ({
            value: c.id,
            label: `${c.nombre} ${c.apellido}`,
          }))
        );

        setComisiones(
          comisionesData.map((c: any) => ({
            value: c.id,
            label: c.nombre,
          }))
        );
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los consejeros y comisiones",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const form = useForm<NoticiaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      gorro: "",
      titulo: "",
      bajada: "",
      introduccion: "",
      contenido: "",
      conclusion: "",
      nota: "",
      url: "",
      autor: "",
      activo: false,
      destacado: false,
      destacadoAntigua: false,
      fechaPublicacion: new Date(),
      tags: [],
      consejeros: [],
      comisiones: [],
    },
  });

  useEffect(() => {
    if (data) {
      const formData = {
        ...data,
        fechaPublicacion: new Date(data.fechaPublicacion),
        tags: data.tags || [],
        // Los IDs ya vienen convertidos desde convertToDocumentoFormData
        consejeros: data.consejeros || [],
        comisiones: data.comisiones || [],
      };
      form.reset(formData);
    } else {
      form.reset({
        id: undefined,
        gorro: "",
        titulo: "",
        bajada: "",
        introduccion: "",
        contenido: "",
        conclusion: "",
        nota: "",
        url: "",
        autor: "",
        activo: false,
        destacado: false,
        destacadoAntigua: false,
        fechaPublicacion: new Date(),
        tags: [],
        consejeros: [],
        comisiones: [],
      });
    }
  }, [data, form]);

  const onSubmit = async (values: NoticiaFormData) => {
    try {
      const noticiaData = {
        ...values,
        estado: values.activo ? "activo" : "inactivo",
      };

      if (values.id) {
        await NoticiaService.updateNoticia(values.id, noticiaData);
        toast({
          title: "Noticia actualizada",
          description: "La noticia ha sido actualizada exitosamente",
        });
      } else {
        await NoticiaService.createNoticia(noticiaData);
        toast({
          title: "Noticia creada",
          description: "La noticia ha sido creada exitosamente",
        });
      }

      onClose();
      fetchData();
    } catch (error) {
      console.error("Error al guardar la noticia:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la noticia",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isSubmitting = form.formState.isSubmitting;

  const handleConsejeroSelect = (value: string) => {
    const consejeroId = parseInt(value);
    const currentConsejeros = form.getValues("consejeros") || [];
    if (!currentConsejeros.includes(consejeroId)) {
      form.setValue("consejeros", [...currentConsejeros, consejeroId]);
    }
  };

  const handleComisionSelect = (value: string) => {
    const comisionId = parseInt(value);
    const currentComisiones = form.getValues("comisiones") || [];
    if (!currentComisiones.includes(comisionId)) {
      form.setValue("comisiones", [...currentComisiones, comisionId]);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 overflow-auto">
        <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
          <DialogTitle>
            {data?.id ? "Editar Noticia" : "Crear Nueva Noticia"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data?.id ? "editar" : "crear"} una
            noticia.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6 pt-2"
          >
            {/* Sección de Estados */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Estado de la Noticia</h3>
              <div className="flex items-center justify-end space-x-8">
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-4">
                      <FormLabel className="font-medium">Activo</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destacado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-4">
                      <FormLabel className="font-medium">Destacado</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destacadoAntigua"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-4">
                      <FormLabel className="font-medium">
                        Destacado Antigua
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Información Principal */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                Información Principal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        Título <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="Ingrese el título de la noticia"
                          {...field}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaPublicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        Fecha Publicación{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Contenido */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                Contenido de la Noticia
              </h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="gorro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Gorro</FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="Ingrese el gorro de la noticia"
                          {...field}
                          maxLength={250}
                        />
                      </FormControl>
                      <FormDescription>
                        Texto corto que aparece sobre el título (máx. 100
                        caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bajada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Bajada</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Ingrese la bajada de la noticia"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Resumen breve que aparece debajo del título
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="introduccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Introducción</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Ingrese la introducción de la noticia"
                          className="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contenido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Contenido</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Ingrese el contenido principal de la noticia"
                          className="min-h-[300px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Conclusión</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Ingrese la conclusión de la noticia"
                          className="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Información Adicional */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                Información Adicional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="autor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Autor</FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="Nombre del autor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>URL</FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="https://ejemplo.com/documento"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL opcional para contenido relacionado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Nota Adicional</FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="Nota adicional opcional"
                          {...field}
                          maxLength={1000}
                        />
                      </FormControl>
                      <FormDescription>
                        Información adicional opcional (máx. 1000 caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Categorización */}
            {/* <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Categorización</h3>
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccione o escriba tags"
                          createable
                          options={[]}
                          className="w-full [&_.remove-button]:text-red-500 [&_.remove-button:hover]:text-red-700"
                        />
                      </FormControl>
                      <FormDescription>
                        Escriba o seleccione tags para categorizar la noticia
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="consejeros"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Consejeros</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={handleConsejeroSelect}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar consejero" />
                            </SelectTrigger>
                            <SelectContent>
                              {consejeros.map((consejero) => (
                                <SelectItem
                                  key={consejero.value}
                                  value={consejero.value.toString()}
                                >
                                  {consejero.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormControl>
                            <MultiSelect
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Consejeros seleccionados"
                              options={consejeros}
                              className="w-full [&_.remove-button]:text-red-500 [&_.remove-button:hover]:text-red-700"
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Seleccione los consejeros relacionados
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comisiones"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Comisiones</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={handleComisionSelect}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar comisión" />
                            </SelectTrigger>
                            <SelectContent>
                              {comisiones.map((comision) => (
                                <SelectItem
                                  key={comision.value}
                                  value={comision.value.toString()}
                                >
                                  {comision.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormControl>
                            <MultiSelect
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Comisiones seleccionadas"
                              options={comisiones}
                              className="w-full [&_.remove-button]:text-red-500 [&_.remove-button:hover]:text-red-700"
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Seleccione las comisiones relacionadas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div> */}

            <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
