"use client";

import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  Trash2,
  FileText,
  Upload,
  Mail,
  Bell,
  Eye,
  CheckCircle,
  RefreshCw,
  XCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AgendaService, { Agendas } from "@/services/AgendaService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAPI } from "@/lib/api-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ViewerWrapper from "@/app/(portal)/components/view-pdf";
import NotificacionesUsuarios from "./components/notificaciones-usuarios";

const tiposReunion = [
  { id: "otros", label: "Otros", color: "#aaabaf", textColor: "#374151" },
  { id: "sesiones", label: "Sesiones", color: "#1fef8e", textColor: "#065f46" },
  {
    id: "fiscalizacion",
    label: "Fiscalización",
    color: "#93c5fd",
    textColor: "#1e40af",
  },
  {
    id: "representacion",
    label: "Representación",
    color: "#ffd21e",
    textColor: "#92400e",
  },
  {
    id: "comisiones",
    label: "Comisiones",
    color: "#fdba74",
    textColor: "#9a3412",
  },
  {
    id: "coordinacion",
    label: "Coordinación",
    color: "#c4b5fd",
    textColor: "#5b21b6",
  },
  {
    id: "capacitacion",
    label: "Capacitación",
    color: "#ff5bb2",
    textColor: "#9d174d",
  },
];

const estadosReunion = [
  { id: "PENDIENTE", label: "Pendiente", color: "#ffd21e" },
  { id: "ASISTIRA", label: "Asistirá", color: "#00e868" },
  { id: "NO_ASISTIRA", label: "No Asistirá", color: "#ff4242" },
];

interface EventoCalendario {
  id?: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  estado: string;
  color: string;
  publico: boolean;
  visible: boolean;
  lugar: string;
  documento?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[] | null;
  enabled: boolean;
  createdAt: string | null;
  avatar?: string;
}

const defaultEventData: EventoCalendario = {
  nombre: "",
  descripcion: "",
  horaInicio: "09:00",
  horaFin: "10:00",
  fecha: format(new Date(), "yyyy-MM-dd"),
  color: "#aaabaf",
  tipo: "otros",
  estado: "PENDIENTE",
  documento: "",
  publico: true,
  visible: true,
  lugar: "",
};

interface AgregarReunionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: EventoCalendario, pdfFile?: File | null) => void;
  getAgenda: () => Promise<void>;
  initialData?: EventoCalendario;
  selectedDate?: Date;
  selectedStartTime?: string;
  selectedEndTime?: string;
}

interface FormValues {
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  lugar: string;
  fecha: Date;
  estado: string;
  publico: boolean;
  documento: string;
}

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  horaInicio: z.string().min(1, "La hora de inicio es requerida"),
  horaFin: z.string().min(1, "La hora de fin es requerida"),
  tipo: z.string().min(1, "El tipo es requerido"),
  lugar: z.string().min(1, "El lugar es requerido"),
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  estado: z.string().default("PENDIENTE"),
  publico: z.boolean().default(true),
  documento: z.string().optional(),
});

export default function AgregarReunionModal({
  open,
  onOpenChange,
  onSave,
  getAgenda,
  initialData = defaultEventData,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
}: AgregarReunionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showReenviarAlert, setShowReenviarAlert] = useState(false);
  const [notificacionToReenviar, setNotificacionToReenviar] = useState<
    number | null
  >(null);
  const [isLoadingReenvio, setIsLoadingReenvio] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [enviarCorreo, setEnviarCorreo] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>(
    []
  );
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [notificacionesPrevias, setNotificacionesPrevias] = useState<any[]>([]);
  const [isLoadingNotificaciones, setIsLoadingNotificaciones] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  console.log("usuariosSeleccionados", usuarios);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setIsLoadingUsers(true);
        const data = await UserAPI.getAllUsers();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchNotificaciones = async () => {
      if (initialData.id) {
        try {
          setIsLoadingNotificaciones(true);
          const notificaciones = await AgendaService.getNotificacionByAgendaId(
            initialData.id
          );
          setNotificacionesPrevias(notificaciones);
          setUsuariosSeleccionados([]);
          setEnviarCorreo(notificaciones.length > 0);
        } catch (error) {
          console.error("Error al cargar notificaciones:", error);
        } finally {
          setIsLoadingNotificaciones(false);
        }
      }
    };

    if (open) {
      fetchUsuarios();
      fetchNotificaciones();
    }
  }, [open, initialData.id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      nombre: "",
      descripcion: "",
      horaInicio: "09:00",
      horaFin: "10:00",
      tipo: "otros",
      lugar: "",
      fecha: new Date(),
      estado: "PENDIENTE",
      publico: true,
      documento: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (!initialData?.id) {
        form.reset({
          nombre: "",
          descripcion: "",
          horaInicio: selectedStartTime || "09:00",
          horaFin: selectedEndTime || "10:00",
          tipo: "otros",
          lugar: "",
          fecha: selectedDate || new Date(),
          estado: "PENDIENTE",
          publico: true,
          documento: "",
        });
        setFilePreview(null);
        setSelectedFile(null);
      } else if (initialData) {
        form.reset({
          nombre: initialData.nombre || "",
          descripcion: initialData.descripcion || "",
          horaInicio: initialData.horaInicio || "",
          horaFin: initialData.horaFin || "",
          tipo: initialData.tipo || "otros",
          lugar: initialData.lugar || "",
          fecha: initialData.fecha ? new Date(initialData.fecha) : new Date(),
          estado: initialData.estado || "PENDIENTE",
          publico: initialData.publico ?? true,
          documento: initialData.documento || "",
        });

        console.log("initialData.documento", initialData.documento);
        // Establecer la URL del PDF si existe
        if (initialData.documento) {
          // Si es un blob URL, usarlo directamente
          if (initialData.documento.startsWith("blob:")) {
            setFilePreview(initialData.documento);
          } else {
            const baseUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            setFilePreview(`${baseUrl}/uploads${initialData.documento}`);
          }
        } else {
          setFilePreview(null);
        }
        setSelectedFile(null);
      }
    }
  }, [
    open,
    initialData,
    form,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
  ]);

  const getColorTipo = (tipo: string) => {
    return tiposReunion.find((t) => t.id === tipo)?.color || "#aaabaf";
  };

  const getColorEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.color || "#aaabaf";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file));
        setShowPreview(true);
      } else {
        toast({
          title: "Formato no válido",
          description: "Por favor, selecciona un archivo PDF.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const colorTipo = getColorTipo(data.tipo);

      const agendaData: Agendas = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fecha: data.fecha.toISOString().split("T")[0],
        horaInicio: data.horaInicio.includes(":")
          ? data.horaInicio
          : `${data.horaInicio}:00`,
        horaFin: data.horaFin.includes(":")
          ? data.horaFin
          : `${data.horaFin}:00`,
        tipo: data.tipo.toUpperCase(),
        estado: data.estado,
        color: colorTipo,
        publico: data.publico,
        lugar: data.lugar,
        visible: data.publico,
        documento: selectedFile ? "" : initialData?.documento || "",
      };

      let response;

      if (initialData?.id) {
        agendaData.id = initialData.id;
        response = await AgendaService.updateAgenda(
          initialData.id,
          agendaData,
          selectedFile
        );
        toast({
          title: "Éxito",
          description: "Reunión actualizada correctamente",
        });
      } else {
        response = await AgendaService.createAgenda(agendaData, selectedFile);
        toast({
          title: "Éxito",
          description: "Reunión creada correctamente",
        });
      }

      if (enviarCorreo && usuariosSeleccionados.length > 0) {
        try {
          const notificacionData = {
            id: 0,
            mensaje: `Se ha programado una nueva reunión: ${data.nombre}`,
            estado: "pendiente",
            agendaId: response.id,
            userId: usuariosSeleccionados.map((id) => String(id)),
          };
          await AgendaService.notificarAgenda(notificacionData);
          toast({
            title: "Notificaciones enviadas",
            description: "Las notificaciones se han enviado correctamente",
          });
        } catch (error) {
          console.error("Error al enviar notificaciones:", error);
          toast({
            title: "Error en notificaciones",
            description: "No se pudieron enviar las notificaciones",
            variant: "destructive",
          });
        }
      }

      const updatedEventoData: EventoCalendario = {
        ...agendaData,
        id: response.id,
        documento: response?.documento || initialData?.documento || null,
        visible: data.publico,
        lugar: data.lugar,
      };

      onSave(updatedEventoData, selectedFile);
      onOpenChange(false);
      await getAgenda();
    } catch (error) {
      console.error("Error al guardar la reunión:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la reunión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (initialData.id) {
      setIsLoading(true);
      try {
        await AgendaService.deleteAgenda(initialData.id);
        toast({
          title: "¡Éxito!",
          description:
            "La reunión y sus notificaciones han sido eliminadas correctamente.",
          variant: "default",
        });
        await getAgenda();
        onOpenChange(false);
      } catch (error: any) {
        console.error("Error al eliminar reunión:", error);
        let errorMessage = "Hubo un problema al eliminar la reunión.";

        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setShowDeleteAlert(false);
      }
    }
  };

  const handleReenviar = async () => {
    if (notificacionToReenviar) {
      try {
        setIsLoadingReenvio(true);
        await AgendaService.reenviarNotificacion(notificacionToReenviar);
        toast({
          title: "¡Éxito!",
          description: "Se ha reenviado el correo de notificación.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error al reenviar notificación:", error);
        toast({
          title: "Error",
          description: "No se pudo reenviar la notificación.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingReenvio(false);
        setShowReenviarAlert(false);
        setNotificacionToReenviar(null);
      }
    }
  };

  const limpiarEstados = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setShowPreview(false);
    setEnviarCorreo(false);
    setUsuariosSeleccionados([]);
    setNotificacionesPrevias([]);
    setIsLoadingUsers(false);
    setIsLoadingNotificaciones(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    form.reset({
      nombre: "",
      descripcion: "",
      horaInicio: "09:00",
      horaFin: "10:00",
      fecha: new Date(),
      tipo: "otros",
      estado: "PENDIENTE",
      publico: true,
      lugar: "",
      documento: "",
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      limpiarEstados();
    }
    onOpenChange(isOpen);
  };

  console.log("initialData", initialData);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[90vw] rounded-lg h-[90vh] sm:h-[90vh] overflow-y-auto mx-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {initialData.id ? "Editar Reunión" : "Agregar Reunión"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:grid sm:grid-cols-1 grid-cols-2 gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-end gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Público</span>
                  <Switch
                    checked={form.watch("publico")}
                    onCheckedChange={(checked) => {
                      form.setValue("publico", checked, {
                        shouldValidate: true,
                      });
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    onSubmit as SubmitHandler<FormValues>
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nombre de la reunión{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el nombre de la reunión"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Fecha <span className="text-destructive">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tipo de agenda{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{
                                        backgroundColor: getColorTipo(
                                          field.value
                                        ),
                                      }}
                                    />
                                    {
                                      tiposReunion.find(
                                        (t) => t.id === field.value
                                      )?.label
                                    }
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tiposReunion.map((tipo) => (
                                <SelectItem
                                  key={tipo.id}
                                  value={tipo.id}
                                  className="flex items-center gap-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{
                                        backgroundColor: tipo.color,
                                      }}
                                    />
                                    {tipo.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="horaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Hora de inicio{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horaFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Hora de fin{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Descripción{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingrese la descripción de la reunión"
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
                    name="lugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Lugar <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el lugar de la reunión"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end gap-4">
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="text-sm">
                            Estado Confirmación del presidente{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Seleccione estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {estadosReunion.map((estado) => (
                                <SelectItem
                                  key={estado.id}
                                  value={estado.id}
                                  className="flex items-center gap-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: estado.color,
                                      }}
                                    />
                                    {estado.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
              <Separator className="my-4 border-t-2 border-gray-200" />
              <NotificacionesUsuarios
                usuarios={usuarios}
                isLoadingUsers={isLoadingUsers}
                isLoadingNotificaciones={isLoadingNotificaciones}
                notificacionesPrevias={notificacionesPrevias}
                usuariosSeleccionados={usuariosSeleccionados}
                setUsuariosSeleccionados={setUsuariosSeleccionados}
                enviarCorreo={enviarCorreo}
                setEnviarCorreo={setEnviarCorreo}
                onReenviarNotificacion={(notificacionId) => {
                  setNotificacionToReenviar(notificacionId);
                  setShowReenviarAlert(true);
                }}
                isLoadingReenvio={isLoadingReenvio}
                notificacionToReenviar={notificacionToReenviar}
              />
            </div>

            <div className="flex-1">
              <div className="border rounded-lg flex flex-col h-[50vh] sm:h-[70vh]">
                <div className="p-4 border-b flex-shrink-0">
                  <h3 className="font-medium mb-2">Documento PDF</h3>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Seleccionar PDF</span>
                    </Button>

                    {(selectedFile || filePreview) && (
                      <div className="flex items-center gap-2 border rounded-md p-2 flex-1">
                        <FileText className="h-5 w-5 text-red-500" />
                        <div className="flex flex-col flex-1">
                          <span className="text-sm truncate flex items-center gap-2">
                            {selectedFile
                              ? selectedFile.name
                              : "Archivo PDF subido"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Documento PDF
                            </span>
                            {!selectedFile && filePreview && (
                              <a
                                href={filePreview}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                              >
                                Descargar
                              </a>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={handleRemoveFile}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-h-0">
                  {filePreview ? (
                    <div className="h-full w-full pdf-viewer-container">
                      <ViewerWrapper fileUrl={filePreview} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No hay documento PDF
                      </p>
                      <p className="text-sm text-center mt-2">
                        Selecciona un archivo PDF para previsualizarlo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full pt-4 border-t mt-4">
            {initialData.id && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 flex items-center gap-2 text-white"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="h-4 w-4 sm:block hidden" />
                <span className="sm:block hidden">Eliminar</span>
                <Trash2 className="h-4 w-4 sm:hidden" />
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-md text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm sm:text-base"
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading
                  ? "Guardando..."
                  : initialData.id
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
            </div>
          </div>

          <style jsx global>{`
            @media (max-width: 640px) {
              .react-pdf__Page {
                margin: 0 !important;
                padding: 0 !important;
              }
              .react-pdf__Page__canvas {
                max-width: 100% !important;
                height: auto !important;
              }
            }
            
            /* Estilos para mejorar el scroll del PDF */
            .rpv-core__viewer {
              height: 100% !important;
              overflow: auto !important;
            }
            
            .rpv-core__page-layer {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .rpv-core__page {
              margin: 0 auto 1rem auto !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Asegurar que el contenedor del PDF tenga scroll */
            .pdf-viewer-container {
              height: 100% !important;
              overflow: auto !important;
              position: relative !important;
            }
          `}</style>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showReenviarAlert} onOpenChange={setShowReenviarAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Reenviar correo de notificación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se enviará nuevamente el correo de notificación con un nuevo
              token. El estado de la notificación se mantendrá como pendiente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoadingReenvio}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReenviar}
              disabled={isLoadingReenvio}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isLoadingReenvio ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                "Reenviar correo"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              ¿Estás seguro de eliminar esta reunión?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Esta acción no se puede deshacer. Se eliminará permanentemente:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>La reunión y toda su información</li>
                <li>Todas las notificaciones enviadas</li>
                <li>El historial de confirmaciones</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar reunión
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
