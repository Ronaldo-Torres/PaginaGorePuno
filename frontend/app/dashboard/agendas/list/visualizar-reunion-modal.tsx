"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle,
  FileText,
  MapPin,
  Users,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AgendaService from "@/services/AgendaService";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Estados de reuniones para consejeros
const estadosReunion = [
  {
    id: "PENDIENTE",
    label: "Pendiente",
    color: "#ffd21e",
    textColor: "#854d0e",
  },
  { id: "ASISTIRE", label: "Asistiré", color: "#00e868", textColor: "#166534" },
  {
    id: "NO_ASISTIRE",
    label: "No Asistiré",
    color: "#ff4242",
    textColor: "#991b1b",
  },
];

interface VisualizarReunionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evento: {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: {
      tipo: string;
      estado: string;
      consejero?: string;
      descripcion?: string;
      documento?: string;
      lugar?: string;
      publico?: boolean;
    };
  } | null;
  onEstadoChange?: () => void;
}

export default function VisualizarReunionModal({
  open,
  onOpenChange,
  evento,
  onEstadoChange,
}: VisualizarReunionModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [nuevoEstadoSeleccionado, setNuevoEstadoSeleccionado] = useState<
    string | null
  >(null);

  if (!evento) return null;

  const estadoReunion = estadosReunion.find(
    (e) => e.id === evento.extendedProps.estado
  );

  const fechaInicio = parseISO(evento.start);
  const fechaFin = parseISO(evento.end);

  const handleEstadoChangeRequest = (nuevoEstado: string) => {
    if (nuevoEstado === evento.extendedProps.estado) return;
    setNuevoEstadoSeleccionado(nuevoEstado);
    setConfirmDialogOpen(true);
  };

  const handleConfirmEstadoChange = async () => {
    if (!nuevoEstadoSeleccionado) return;

    try {
      const eventoId = parseInt(evento.id);
      const fechaInicio = parseISO(evento.start);

      // Preparar los datos completos para la actualización
      const updateData = {
        id: eventoId,
        nombre: evento.title,
        descripcion: evento.extendedProps.descripcion || "",
        horaInicio: format(parseISO(evento.start), "HH:mm:ss"),
        horaFin: format(parseISO(evento.end), "HH:mm:ss"),
        fecha: format(fechaInicio, "yyyy-MM-dd"),
        color: evento.backgroundColor,
        tipo: evento.extendedProps.tipo,
        estado: nuevoEstadoSeleccionado,
        publico: evento.extendedProps.publico || false,
        lugar: evento.extendedProps.lugar || "",
        documento: evento.extendedProps.documento,
      };

      await AgendaService.updateAgenda(eventoId, updateData);

      toast({
        title: "¡Éxito!",
        description: "El estado de la reunión ha sido actualizado.",
        variant: "default",
      });

      // Cerrar ambos modales
      setConfirmDialogOpen(false);
      onOpenChange(false);

      // Actualizar los datos y refrescar la página
      if (onEstadoChange) {
        onEstadoChange();
      }

      // Refrescar la página
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la reunión.",
        variant: "destructive",
      });
      setConfirmDialogOpen(false);
    }
  };

  const getEstadoLabel = (estadoId: string) => {
    return estadosReunion.find((e) => e.id === estadoId)?.label || estadoId;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[90vw] rounded-lg max-h-[90vh] overflow-hidden mx-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center justify-between">
              <span>Detalles de la Reunión</span>
              <Select
                value={evento.extendedProps.estado}
                onValueChange={handleEstadoChangeRequest}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: estadoReunion?.color || "#aaabaf",
                        }}
                      />
                      {estadoReunion?.label || evento.extendedProps.estado}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {estadosReunion.map((estado) => (
                    <SelectItem
                      key={estado.id}
                      value={estado.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: estado.color }}
                        />
                        {estado.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="py-2 sm:py-4">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-1">
                    {evento.title}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {evento.extendedProps.descripcion}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fecha</p>
                      <p className="text-muted-foreground break-words">
                        {format(fechaInicio, "EEEE, d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horario</p>
                      <p className="text-muted-foreground">
                        {format(fechaInicio, "HH:mm", { locale: es })} -{" "}
                        {format(fechaFin, "HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>

                  {evento.extendedProps.lugar && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Lugar</p>
                        <p className="text-muted-foreground">
                          {evento.extendedProps.lugar}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Visibilidad</p>
                      <p className="text-muted-foreground">
                        {evento.extendedProps.publico ? "Público" : "Privado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Tipo de reunión</p>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: evento.backgroundColor,
                          marginTop: "0.5rem",
                        }}
                      >
                        {evento.extendedProps.tipo}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Estado actual</p>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: estadoReunion?.color || "#aaabaf",
                          color: estadoReunion?.textColor || "#374151",
                          marginTop: "0.5rem",
                        }}
                      >
                        {estadoReunion?.label || evento.extendedProps.estado}
                      </Badge>
                    </div>
                  </div>

                  {evento.extendedProps.documento && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Documento</p>
                        <a
                          href={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${evento.extendedProps.documento}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-1 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Ver documento</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="h-[70vh] border rounded-lg overflow-hidden">
              {evento.extendedProps.documento ? (
                <iframe
                  src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${evento.extendedProps.documento}`}
                  className="w-full h-full"
                  title="Vista previa del documento"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay documento PDF</p>
                  <p className="text-sm text-center mt-2">
                    Esta reunión no tiene ningún documento adjunto
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Confirmar cambio de estado
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas cambiar el estado de la reunión de{" "}
              <span className="font-medium">
                {getEstadoLabel(evento.extendedProps.estado)}
              </span>{" "}
              a{" "}
              <span className="font-medium">
                {getEstadoLabel(nuevoEstadoSeleccionado || "")}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmEstadoChange}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Confirmar cambio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
