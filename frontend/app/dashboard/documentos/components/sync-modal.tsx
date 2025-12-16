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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentoService from "@/services/DocumentoService";
import ConsejeroService from "@/services/ConsejeroService";
import ComisionService from "@/services/ComisionService";
import { FaSync, FaCloudDownloadAlt, FaSpinner } from "react-icons/fa";
import { DocumetoSyncDTO } from "@/types/documento";

const formSchema = z.object({
  id: z.number(),
  tags: z.array(z.string()),
  codigoEmision: z.string(),
  consejeros: z.array(z.number()),
  comisiones: z.array(z.number())
});

type SyncFormData = z.infer<typeof formSchema>;

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  fetchData: () => void;
  documentoNombre?: string;
}

export function SyncModal({
  isOpen,
  onClose,
  data,
  fetchData,
  documentoNombre = "",
}: SyncModalProps) {
  const [consejeros, setConsejeros] = useState<{ value: number; label: string }[]>([]);
  const [comisiones, setComisiones] = useState<{ value: number; label: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const form = useForm<SyncFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      tags: [],
      codigoEmision: "",
      consejeros: [],
      comisiones: []
    }
  });

  useEffect(() => {
    if (isOpen) {
      const fetchOptionsAndSyncData = async () => {
        setIsLoadingData(true);
        try {
          const [consejerosData, comisionesData] = await Promise.all([
            ConsejeroService.getConsejeros(),
            ComisionService.getAllComisiones(0, 100)
          ]);

          setConsejeros(
            consejerosData.map((c: any) => ({
              value: c.id,
              label: `${c.nombre} ${c.apellido}`
            }))
          );

          setComisiones(
            comisionesData.content.map((c: any) => ({
              value: c.id,
              label: c.nombre
            }))
          );

          // Buscar sincronización existente si hay código de emisión
          if (data?.codigoEmision) {
            try {
              const syncData = await DocumentoService.getDocumentoSincronizacion(data.codigoEmision);
              if (syncData && syncData.id) {
                // Autocompletar con datos existentes
                const formData = {
                  id: syncData.id,
                  tags: syncData.tags || [],
                  codigoEmision: syncData.codigoEmision || data.codigoEmision,
                  consejeros: syncData.consejeros?.map((c: any) => c.id) || [],
                  comisiones: syncData.comisiones?.map((c: any) => c.id) || []
                };
                form.reset(formData);
                
                toast({
                  title: "Sincronización encontrada",
                  description: "Se cargaron los datos de sincronización existentes",
                  variant: "default"
                });
              } else {
                // No encontró datos, establecer datos básicos para nueva sincronización
                form.reset({
                  id: 0,
                  tags: [],
                  codigoEmision: data.codigoEmision || "",
                  consejeros: [],
                  comisiones: []
                });
              }
            } catch (error) {
              // Si no encuentra sincronización, usar datos del documento SGD
              console.log("No se encontró sincronización previa, creando nueva");
              form.reset({
                id: 0,
                tags: [],
                codigoEmision: data.codigoEmision || "",
                consejeros: [],
                comisiones: []
              });
            }
          }
        } catch (error) {
          console.error("Error al cargar opciones:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los consejeros y comisiones",
            variant: "destructive"
          });
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchOptionsAndSyncData();
    }
  }, [isOpen, data, form]);

  useEffect(() => {
    if (data && !isOpen) {
      // Solo establecer datos básicos cuando se cierre el modal
      const formData = {
        id: 0, // Siempre empezar con 0 para nueva sincronización
        tags: [],
        codigoEmision: data.codigoEmision || "",
        consejeros: [],
        comisiones: []
      };
      form.reset(formData);
    }
  }, [data, isOpen, form]);

  const onSubmit = async (values: SyncFormData) => {
    try {
      // Solo sincronizar las categorías (tags, consejeros, comisiones)
      const syncData = {
        id: values.id || null,
        tags: values.tags,
        codigoEmision: values.codigoEmision,
        consejeros: values.consejeros,
        comisiones: values.comisiones
      };

      // Determinar si es creación o edición
      if (values.id && values.id > 0) {
        // Edición: usar PUT
        await DocumentoService.actualizarSincronizacion(values.id, syncData as DocumetoSyncDTO);
        toast({
          title: "Categorías actualizadas",
          description: "Las categorías del documento SGD han sido actualizadas exitosamente"
        });
      } else {
        // Creación: usar POST
        await DocumentoService.sincronizarDocumentos(syncData as DocumetoSyncDTO);
        toast({
          title: "Categorías sincronizadas",
          description: "Las categorías del documento SGD han sido sincronizadas exitosamente"
        });
      }

      handleClose();
      fetchData();
    } catch (error) {
      console.error("Error al sincronizar categorías:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al sincronizar las categorías",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] p-0 overflow-auto">
        <DialogHeader className="p-6 pb-4 sticky top-0 bg-background z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FaCloudDownloadAlt className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Sincronizar Categorías SGD
              </DialogTitle>
              <DialogDescription className="text-base">
                {documentoNombre
                  ? `Sincronizando categorías para "${documentoNombre}"`
                  : form.watch("id") > 0 
                    ? "Editando sincronización existente de categorías SGD"
                    : "Crear nueva sincronización de categorías SGD con el sistema local"}
              </DialogDescription>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <FaSync className="h-3 w-3 mr-1" />
              Documento SGD
            </Badge>
            <Badge variant="outline" className="text-sm">
              Solo Categorización
            </Badge>
            {isLoadingData && (
              <Badge variant="secondary" className="text-sm">
                <FaSpinner className="h-3 w-3 mr-1 animate-spin" />
                Recuperando datos...
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoadingData ? (
          <div className="space-y-6 p-6 pt-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FaSpinner className="h-5 w-5 text-muted-foreground animate-spin" />
                  Recuperando datos de sincronización...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 pt-2">
              {/* Sección de Categorización */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FaSync className="h-5 w-5 text-muted-foreground" />
                    Categorización Local
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiquetas</FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccione o escriba tags"
                          createable
                          options={[]}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Agregue etiquetas para categorizar el documento SGD en el sistema local
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consejeros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consejeros</FormLabel>
                      <div className="space-y-2">
                        <Select onValueChange={handleConsejeroSelect}>
                          <SelectTrigger>
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
                            className="w-full"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Relacione el documento SGD con consejeros del sistema local
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comisiones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comisiones</FormLabel>
                      <div className="space-y-2">
                        <Select onValueChange={handleComisionSelect}>
                          <SelectTrigger>
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
                            className="w-full"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Relacione el documento SGD con comisiones del sistema local
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting || isLoadingData}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting || isLoadingData}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <FaSync className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <FaSync className="h-4 w-4 mr-2" />
                    {form.watch("id") > 0 ? "Actualizar Categorías" : "Sincronizar Categorías"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SyncModal;