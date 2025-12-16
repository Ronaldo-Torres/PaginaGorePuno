"use client";

import { useEffect, useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import { File, X, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentoService from "@/services/DocumentoService";
import TipoDocumentoService from "@/services/TipoDocumentoService";
import ConsejeroService from "@/services/ConsejeroService";
import ComisionService from "@/services/ComisionService";
import { FaFileUpload, FaTags, FaUsers } from "react-icons/fa";

const formSchema = z.object({
  id: z.number().optional(),
  numeroDocumento: z.string().optional(),
  nombreDocumento: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  fechaEmision: z.string().optional(),
  activo: z.boolean(),
  anio: z.string().optional(),
  urlDocumento: z.string().optional(),
  tipoDocumento: z.object({
    id: z.number(),
    nombre: z.string()
  }).nullable(),
  anios: z.object({
    id: z.number(),
    anio: z.string()
  }).nullable(),
  oficina: z.object({
    id: z.number(),
    nombre: z.string()
  }).nullable(),
  extension: z.string(),
  tamanio: z.string().optional(),
  tags: z.array(z.string()),
  consejeros: z.array(z.number()),
  comisiones: z.array(z.number())
});

type DocumentoFormData = z.infer<typeof formSchema>;

interface AgregarNormativaProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  fetchData: () => void;
  tipoDocumento?: any[];
  anios?: any[];
  oficinas?: any[];
  carpetaNombre?: string;
  carpetaId?: number;
  anioId?: number;
  carpetaTipoDocumento?: any;
}

export function AgregarNormativa({
  isOpen,
  onClose,
  data,
  fetchData,
  tipoDocumento = [],
  anios = [],
  oficinas = [],
  carpetaNombre = "",
  carpetaId,
  anioId,
  carpetaTipoDocumento,
}: AgregarNormativaProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [consejeros, setConsejeros] = useState<{ value: number; label: string }[]>([]);
  const [comisiones, setComisiones] = useState<{ value: number; label: string }[]>([]);


  const [tiposDocumento, setTiposDocumento] = useState<{ value: number; label: string }[]>([]);


  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      numeroDocumento: "",
      nombreDocumento: "",
      descripcion: "",
      fechaEmision: "",
      activo: true,
      anio: "",
      urlDocumento: "",
      tipoDocumento: null,
      anios: null,
      oficina: null,
      extension: "pdf",
      tamanio: "",
      tags: [],
      consejeros: [],
      comisiones: []
    }
  });

  // console.log("carpetaTipoDocumento", carpetaTipoDocumento.grupo)

  // const grupoDocumento = carpetaTipoDocumento.grupo
  const grupoDocumento = carpetaTipoDocumento?.grupo ?? null;

  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        try {
          const [consejerosData, comisionesData, tiposData] = await Promise.all([
            ConsejeroService.getConsejeros(),
            ComisionService.getAllComisiones(0, 100),
            TipoDocumentoService.getTiposDocumento(grupoDocumento),
          ]);

          // console.log("TIPOS:", tiposData);

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
ñ
          setTiposDocumento(
            tiposData.map((t: any) => ({
              value: t.id,
              label: t.nombre,
            }))
          );

        } catch (error) {
          console.error("Error al cargar opciones:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los consejeros y comisiones",
            variant: "destructive"
          });
        }
      };

      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (tiposDocumento.length > 0 && form.getValues("tipoDocumento")) {
      const td = form.getValues("tipoDocumento");
      const exists = tiposDocumento.find(t => t.value === td?.id);

      if (exists) {
        form.setValue("tipoDocumento", {
          id: exists.value,
          nombre: exists.label
        });
      }
    }
  }, [tiposDocumento]);

  useEffect(() => {
    if (data) {
      const formData = {
        ...data,
        tags: data.tags || [],
        consejeros: data.consejeros?.map((c: any) => typeof c === 'number' ? c : c.id) || [],
        comisiones: data.comisiones?.map((c: any) => typeof c === 'number' ? c : c.id) || []
      };
      form.reset(formData);

      if (data.urlDocumento) {
        setDocumentUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + data.urlDocumento);
      }
    } else {
      const anioSeleccionado = anioId ? anios.find((a) => a.id === anioId) : null;
      form.reset({
        id: undefined,
        numeroDocumento: "",
        nombreDocumento: "",
        descripcion: "",
        fechaEmision: "",
        activo: true,
        anio: "",
        urlDocumento: "",
        tipoDocumento: carpetaTipoDocumento || null,
        anios: anioSeleccionado ? { id: anioSeleccionado.id, anio: anioSeleccionado.anio } : null,
        oficina: null,
        extension: "pdf",
        tamanio: "",
        tags: [],
        consejeros: [],
        comisiones: []
      });
      setDocumentUrl(null);
      setSelectedDocument(null);
    }
  }, [data, form, carpetaTipoDocumento, anioId, anios]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setIsLoadingPreview(true);
      setSelectedDocument(file);

      const url = URL.createObjectURL(file);
      setDocumentUrl(url);

      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const tamanio = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      form.setValue("extension", extension);
      form.setValue("tamanio", tamanio);
      if (!form.getValues("nombreDocumento")) {
        form.setValue("nombreDocumento", file.name.replace(/\.[^/.]+$/, ""));
      }

      setTimeout(() => {
        setIsLoadingPreview(false);
      }, 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB

      const allowedTypes = ["pdf", "docx", "xlsx", "pptx", "jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        toast({
          title: "Error",
          description: "Tipo de archivo no permitido. Solo se permiten: PDF, DOCX, XLSX, PPTX, JPG, PNG",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        toast({
          title: "Error",
          description: "El archivo excede el tamaño máximo permitido de 50 MB",
          variant: "destructive"
        });
        return;
      }

      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (values: DocumentoFormData) => {
    try {
      if (formRef.current) {
        const formDataToSend = new FormData(formRef.current);

        // Enviar los tags sin comillas
        const tagsString = values.tags.join(',');
        formDataToSend.set("tags", tagsString);

        if (values.consejeros && values.consejeros.length > 0) {
          values.consejeros.forEach(id => {
            formDataToSend.append("consejeroIds", id.toString());
          });
        }

        if (values.comisiones && values.comisiones.length > 0) {
          values.comisiones.forEach(id => {
            formDataToSend.append("comisionIds", id.toString());
          });
        }

        if (selectedDocument) {
          formDataToSend.set("file", selectedDocument);
        }

        if (!values.id) { // si se crea siempre es el tipoDoc ed la carpeta
          if (carpetaId) {
            formDataToSend.set("tipoDocumentoId", carpetaId.toString());
          }
        } else { // pero se puede editar
          const tipoDocumento = form.getValues("tipoDocumento");
          if (tipoDocumento) {
            formDataToSend.set("tipoDocumentoId", tipoDocumento.id.toString());
          }
        }

        if (anioId) {
          formDataToSend.set("anioId", anioId.toString());
        }

        if (carpetaTipoDocumento && !values.tipoDocumento) {
          formDataToSend.set("tipoDocumentoId", carpetaTipoDocumento.id.toString());
        }

        if (values.id) {
          await DocumentoService.updateDocumento(values.id, formDataToSend);
          toast({
            title: "Documento actualizado",
            description: "El documento ha sido actualizado exitosamente"
          });
        } else {
          await DocumentoService.createDocumento(formDataToSend);
          toast({
            title: "Documento creado",
            description: "El documento ha sido creado exitosamente"
          });
        }

        handleClose();
        fetchData();
      }
    } catch (error) {
      console.error("Error al guardar documento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el documento",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setDocumentUrl(null);
    setSelectedDocument(null);
    setIsLoadingPreview(false);
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
      <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 overflow-auto">
        <DialogHeader className="p-6 pb-4 sticky top-0 bg-background z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FaFileUpload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {data?.id ? "Editar Documento" : carpetaNombre ? `Agregar Documento a ${carpetaNombre}` : "Agregar Nuevo Documento"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {carpetaNombre
                  ? `Añadiendo un nuevo documento a la carpeta "${carpetaNombre}" ${anioId ? `para el año ${anios.find((a) => a.id === anioId)?.anio || ""}` : ""
                  }`
                  : `Complete los campos para ${data?.id ? "editar" : "crear"} un documento normativo.`}
              </DialogDescription>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <FaFileUpload className="h-3 w-3 mr-1" />
              {data?.id ? "Edición" : "Nuevo Documento"}
            </Badge>
            {carpetaNombre && (
              <Badge variant="outline" className="text-sm">
                {carpetaNombre}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>

          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 pt-2">
            {/* Sección de Información Principal */}
            <Card>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FaFileUpload className="h-5 w-5 text-muted-foreground" />
                  Información Principal
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <FormField
                    control={form.control}
                    name="numeroDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Documento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese número de documento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombreDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Documento <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese nombre del documento" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingrese descripción del documento"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaEmision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Emisión</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Documento visible en el portal
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Para editar tipo de doumento: */}
                  <FormField
                    control={form.control}
                    name="tipoDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>

                        <Select
                          value={field.value ? field.value.id.toString() : ""}
                          onValueChange={(value) => {
                            const selected = tiposDocumento.find(t => t.value === parseInt(value));

                            console.log("tiposDocumento Seleccionado:", selected);

                            field.onChange(
                              selected ? { id: selected.value, nombre: selected.label } : null
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo de documento" />
                          </SelectTrigger>

                          <SelectContent>
                            {tiposDocumento.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value.toString()}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </div>
              </CardContent>
            </Card>

            {/* Sección de Archivo */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <File className="h-5 w-5 text-muted-foreground" />
                  Archivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
                  />

                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <File className="h-10 w-10 text-primary" />
                    </div>

                    {documentUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedDocument?.name || data?.nombreDocumento}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setSelectedDocument(null);
                              setDocumentUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(documentUrl, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Previsualizar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            Arrastra y suelta tu archivo aquí o
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, XLSX, PPTX, JPG, PNG (max. 50MB)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Seleccionar archivo
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección de Categorización */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FaTags className="h-5 w-5 text-muted-foreground" />
                  Categorización
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
                          Agregue etiquetas para categorizar el documento
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
                        <FormLabel>Autoridad</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={handleConsejeroSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar autoridad" />
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
                              placeholder="Autoridades seleccionadas"
                              options={consejeros}
                              className="w-full"
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Seleccione las autoridades relacionadas
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
                          Seleccione las comisiones relacionadas
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
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
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

export default AgregarNormativa;
