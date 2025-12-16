"use client";

import React from "react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Check,
  X,
  Clock,
  Info,
  FileText,
  Send,
  Eye,
  Edit,
  Trash2,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import VisualizarReunionModal from "./visualizar-reunion-modal";
import AgendaService, { Agendas } from "@/services/AgendaService";
import DataTable, { SortConfig, VisibleColumn } from "@/components/DataTable";

// Tipos de reuniones disponibles para consejeros con colores mejorados
const tiposReunion = [
  { id: "reuniones", label: "Reuniones", color: "#1fef8e" }, // Verde más claro
  { id: "otros", label: "Otros", color: "#93c5fd" }, // Azul más claro
];

// Estados de reuniones para consejeros
const estadosReunion = [
  {
    id: "PENDIENTE",
    label: "Pendiente",
    color: "#ffd21e",
    textColor: "#854d0e",
    icon: Clock,
  },
  {
    id: "ASISTIRA",
    label: "Asistirá",
    color: "#00e868",
    textColor: "#166534",
    icon: Check,
  },
  {
    id: "NO_ASISTIRA",
    label: "No Asistirá",
    color: "#ff4242",
    textColor: "#991b1b",
    icon: X,
  },
];

// Interfaz para los eventos del calendario en la lista
interface EventoLista {
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
    avatar?: string;
    descripcion?: string;
    publico?: boolean;
    documento?: string;
    lugar?: string;
  };
}

interface Agenda {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  estado: string;
  publico: boolean;
  documento?: string;
  lugar?: string;
}

const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "";

export default function ListaReunionesPage() {
  const { toast } = useToast();
  const [eventos, setEventos] = useState<EventoLista[]>([]);
  const [eventosPendientes, setEventosPendientes] = useState<EventoLista[]>([]);
  const [eventosConfirmados, setEventosConfirmados] = useState<EventoLista[]>(
    []
  );
  const [eventosNoConfirmados, setEventosNoConfirmados] = useState<
    EventoLista[]
  >([]);
  const [filtroConsejero, setFiltroConsejero] = useState<string | null>(null);
  const [filtrosTipo, setFiltrosTipo] = useState<string[]>(
    tiposReunion.map((tipo) => tipo.id)
  );
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined);
  const [eventoSeleccionadoModal, setEventoSeleccionadoModal] =
    useState<EventoLista | null>(null);
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [dialogConfirmacionAbierto, setDialogConfirmacionAbierto] =
    useState(false);
  const [eventoParaConfirmar, setEventoParaConfirmar] = useState<string | null>(
    null
  );
  const [timeFilter, setTimeFilter] = useState<string>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "fecha",
    direction: "desc",
  });

  const visibleColumns: VisibleColumn[] = [
    {
      key: "nombre",
      label: "Nombre",
      visible: true,
    },
    {
      key: "fecha",
      label: "Fecha",
      visible: true,
      render: (value: string) =>
        format(new Date(value), "EEEE, d 'de' MMMM", { locale: es }),
    },
    {
      key: "horaInicio",
      label: "Hora Inicio",
      visible: true,
    },
    {
      key: "horaFin",
      label: "Hora Fin",
      visible: true,
    },
    {
      key: "tipo",
      label: "Tipo",
      visible: true,
      badgeMapping: {
        REUNIONES: "bg-green-100 text-green-800",
        OTROS: "bg-blue-100 text-blue-800",
        default: "bg-gray-100 text-gray-800",
      },
    },
    {
      key: "estado",
      label: "Estado",
      visible: true,
      badgeMapping: {
        PENDIENTE: "bg-yellow-100 text-yellow-800",
        CONFIRMADA: "bg-green-100 text-green-800",
        "NO-CONFIRMADA": "bg-red-100 text-red-800",
        default: "bg-gray-100 text-gray-800",
      },
    },
  ];

  // Cargar datos desde el backend
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setIsLoading(true);

        // Cargar eventos pendientes
        const pendientesData = await AgendaService.getAgendasPorEstado(
          "PENDIENTE"
        );
        const pendientes = transformarEventos(pendientesData, "PENDIENTE");
        setEventosPendientes(pendientes);

        // Cargar eventos que asistirá
        const asistiraData = await AgendaService.getAgendasPorEstado(
          "ASISTIRA"
        );
        const asistira = transformarEventos(asistiraData, "ASISTIRA");
        setEventosConfirmados(asistira);

        // Cargar eventos que no asistirá
        const noAsistiraData = await AgendaService.getAgendasPorEstado(
          "NO_ASISTIRA"
        );
        const noAsistira = transformarEventos(noAsistiraData, "NO_ASISTIRA");
        setEventosNoConfirmados(noAsistira);

        // Combinar todos los eventos
        setEventos([...pendientes, ...asistira, ...noAsistira]);
      } catch (error) {
        console.error("Error al cargar los eventos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las reuniones desde el servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    cargarEventos();
  }, [toast]);

  useEffect(() => {
    fetchAgendas();
  }, []);

  // Función para transformar datos de la API al formato necesario para la UI
  const transformarEventos = (
    agendas: Agendas[],
    estadoMapped: string
  ): EventoLista[] => {
    return agendas.map((agenda) => {
      // Determinar color basado en el estado
      const estadoActual = estadosReunion.find((e) => e.id === agenda.estado);
      const colorEstado = estadoActual ? estadoActual.color : "#aaabaf";

      return {
        id: agenda.id.toString(),
        title: agenda.nombre,
        start: `${agenda.fecha}T${agenda.horaInicio}`,
        end: `${agenda.fecha}T${agenda.horaFin}`,
        backgroundColor: colorEstado,
        borderColor: colorEstado,
        extendedProps: {
          tipo: agenda.tipo,
          estado: agenda.estado,
          descripcion: agenda.descripcion,
          lugar: agenda.lugar,
          publico: agenda.publico,
          documento: agenda.documento,
        },
      };
    });
  };

  // Filtrar eventos según el filtro de tiempo seleccionado
  const filtrarEventosPorTiempo = (eventos: EventoLista[], filtro: string) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00 para comparar solo fechas

    if (filtro === "all") {
      return eventos; // Mostrar todos los eventos sin filtrar por tiempo
    }

    return eventos.filter((evento) => {
      const fechaEvento = parseISO(evento.start);
      fechaEvento.setHours(0, 0, 0, 0); // Normalizar para comparar solo fechas

      if (filtro === "upcoming") {
        // Para próximas: mostrar eventos desde hoy (inclusive) hacia adelante
        return fechaEvento >= hoy;
      } else if (filtro === "past") {
        // Para pasadas: mostrar eventos anteriores a hoy
        return fechaEvento < hoy;
      }

      return true; // Caso por defecto, no debería ocurrir
    });
  };

  // Aplicar filtro de tiempo a cada categoría
  const eventosPendientesFiltrados = filtrarEventosPorTiempo(
    eventosPendientes,
    timeFilter
  );
  const eventosConfirmadosFiltrados = filtrarEventosPorTiempo(
    eventosConfirmados,
    timeFilter
  );
  const eventosNoConfirmadosFiltrados = filtrarEventosPorTiempo(
    eventosNoConfirmados,
    timeFilter
  );

  // Filtrar eventos pendientes solo para el día actual (solo para la pestaña "Pendientes de hoy")
  const eventosPendientesHoy = eventosPendientes.filter((evento) => {
    const fechaEvento = parseISO(evento.start);
    const hoy = new Date();
    return (
      fechaEvento.getDate() === hoy.getDate() &&
      fechaEvento.getMonth() === hoy.getMonth() &&
      fechaEvento.getFullYear() === hoy.getFullYear()
    );
  });

  // Obtener color para el tipo de reunión
  const getColorTipo = (tipo: string) => {
    return tiposReunion.find((t) => t.id === tipo)?.color || "#aaabaf";
  };

  // Obtener color para el estado de reunión
  const getColorEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.color || "#aaabaf";
  };

  // Obtener etiqueta para el tipo de reunión
  const getLabelTipo = (tipo: string) => {
    return tiposReunion.find((t) => t.id === tipo)?.label || tipo;
  };

  // Obtener etiqueta para el estado de reunión
  const getLabelEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.label || estado;
  };

  // Abrir modal con detalles de la reunión
  const abrirDetallesReunion = (evento: EventoLista) => {
    setEventoSeleccionadoModal(evento);
    setModalDetallesAbierto(true);
  };

  const handleEstadoChange = () => {
    // Recargar los eventos después de cambiar el estado
    cargarEventos();
  };

  // Agrupar eventos por día
  const agruparEventosPorDia = (eventos: EventoLista[]) => {
    const eventosAgrupados: { [key: string]: EventoLista[] } = {};

    eventos.forEach((evento) => {
      const fechaEvento = parseISO(evento.start);
      const fechaKey = format(fechaEvento, "yyyy-MM-dd");

      if (!eventosAgrupados[fechaKey]) {
        eventosAgrupados[fechaKey] = [];
      }

      eventosAgrupados[fechaKey].push(evento);
    });

    // Ordenar los eventos de cada día por hora
    Object.keys(eventosAgrupados).forEach((fecha) => {
      eventosAgrupados[fecha].sort((a, b) => {
        return parseISO(a.start).getTime() - parseISO(b.start).getTime();
      });
    });

    return eventosAgrupados;
  };

  // Manejar cambio en filtros de tipo
  const toggleFiltroTipo = (id: string) => {
    setFiltrosTipo((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Abrir diálogo de confirmación
  const abrirDialogoConfirmacion = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setEventoParaConfirmar(id);
    setDialogConfirmacionAbierto(true);
  };

  // Renderizar eventos agrupados por día
  const renderEventosPorDia = (eventos: EventoLista[]) => {
    const eventosPorDia = agruparEventosPorDia(eventos);

    return Object.entries(eventosPorDia).map(([fecha, eventosDelDia]) => (
      <div key={fecha} className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {format(parseISO(fecha), "EEEE, d 'de' MMMM", { locale: es })}
        </h3>
        <div className="space-y-3">
          {eventosDelDia.map((evento) => {
            const estadoActual = estadosReunion.find(
              (e) => e.id === evento.extendedProps.estado
            );
            const IconoEstado = estadoActual?.icon || Clock;

            return (
              <Card
                key={evento.id}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: estadoActual?.color || "#aaabaf",
                            color: estadoActual?.textColor || "#374151",
                          }}
                          className="flex items-center gap-1"
                        >
                          <IconoEstado className="h-3 w-3" />
                          <span>
                            {estadoActual?.label || evento.extendedProps.estado}
                          </span>
                        </Badge>
                        <Badge variant="outline">
                          {evento.extendedProps.tipo}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{evento.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {evento.extendedProps.descripcion}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(parseISO(evento.start), "HH:mm", {
                              locale: es,
                            })}{" "}
                            -{" "}
                            {format(parseISO(evento.end), "HH:mm", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        {evento.extendedProps.lugar && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{evento.extendedProps.lugar}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => abrirDetallesReunion(evento)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalles</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    ));
  };

  // Confirmar una reunión
  const confirmarReunion = async () => {
    if (!eventoParaConfirmar) return;

    try {
      const evento = eventos.find((e) => e.id === eventoParaConfirmar);
      if (!evento) return;

      // Buscar la agenda correspondiente por ID
      const eventoId = parseInt(eventoParaConfirmar);

      // Determinar color basado en el tipo
      const tipoSeleccionado = tiposReunion.find(
        (t) => t.id.toLowerCase() === evento.extendedProps.tipo.toLowerCase()
      );
      const colorTipo = tipoSeleccionado ? tipoSeleccionado.color : "#aaabaf";

      // Preparar los datos para la actualización
      const eventoFecha = parseISO(evento.start);
      const updateData = {
        id: eventoId,
        nombre: evento.title,
        descripcion: evento.extendedProps.descripcion || "",
        horaInicio: format(parseISO(evento.start), "HH:mm:ss"),
        horaFin: format(parseISO(evento.end), "HH:mm:ss"),
        fecha: format(eventoFecha, "yyyy-MM-dd"),
        color: colorTipo,
        tipo: evento.extendedProps.tipo.toUpperCase(),
        estado: "CONFIRMADA", // Cambiar estado a confirmada
        publico: evento.extendedProps.publico || false,
      };

      // Enviar la actualización al backend
      await AgendaService.updateAgenda(eventoId, updateData);

      // Actualizar la UI
      const eventoActualizado = {
        ...evento,
        extendedProps: {
          ...evento.extendedProps,
          estado: "CONFIRMADA",
        },
      };

      // Mover el evento de pendientes a confirmados
      setEventosPendientes((prev) =>
        prev.filter((e) => e.id !== eventoParaConfirmar)
      );
      setEventosConfirmados((prev) => [...prev, eventoActualizado]);

      // Actualizar la lista completa de eventos
      setEventos((prev) =>
        prev.map((e) => (e.id === eventoParaConfirmar ? eventoActualizado : e))
      );

      // Mostrar toast de confirmación
      toast({
        title: "Reunión confirmada",
        description: "La reunión ha sido confirmada correctamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al confirmar la reunión:", error);
      toast({
        title: "Error",
        description: "No se pudo confirmar la reunión.",
        variant: "destructive",
      });
    } finally {
      // Cerrar el diálogo
      setDialogConfirmacionAbierto(false);
      setEventoParaConfirmar(null);
    }
  };

  // Cancelar una reunión
  const cancelarReunion = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const evento = eventos.find((e) => e.id === id);
      if (!evento) return;

      // Buscar la agenda correspondiente por ID
      const eventoId = parseInt(id);

      // Determinar color basado en el tipo
      const tipoSeleccionado = tiposReunion.find(
        (t) => t.id.toLowerCase() === evento.extendedProps.tipo.toLowerCase()
      );
      const colorTipo = tipoSeleccionado ? tipoSeleccionado.color : "#aaabaf";

      // Preparar los datos para la actualización
      const eventoFecha = parseISO(evento.start);
      const updateData = {
        id: eventoId,
        nombre: evento.title,
        descripcion: evento.extendedProps.descripcion || "",
        horaInicio: format(parseISO(evento.start), "HH:mm:ss"),
        horaFin: format(parseISO(evento.end), "HH:mm:ss"),
        fecha: format(eventoFecha, "yyyy-MM-dd"),
        color: colorTipo,
        tipo: evento.extendedProps.tipo.toUpperCase(),
        estado: "NO_ASISTIRA", // Cambiar estado a no asistirá
        publico: evento.extendedProps.publico || false,
      };

      // Enviar la actualización al backend
      await AgendaService.updateAgenda(eventoId, updateData);

      // Actualizar la UI
      const eventoActualizado = {
        ...evento,
        extendedProps: {
          ...evento.extendedProps,
          estado: "NO_ASISTIRA",
        },
      };

      // Mover el evento de pendientes a no confirmados
      setEventosPendientes((prev) => prev.filter((e) => e.id !== id));
      setEventosNoConfirmados((prev) => [...prev, eventoActualizado]);

      // Actualizar la lista completa de eventos
      setEventos((prev) =>
        prev.map((e) => (e.id === id ? eventoActualizado : e))
      );

      // Mostrar toast de cancelación
      toast({
        title: "Reunión no confirmada",
        description: "La reunión ha sido marcada como no confirmada.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error al cancelar la reunión:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la reunión.",
        variant: "destructive",
      });
    }
  };

  const fetchAgendas = async () => {
    try {
      setIsLoading(true);
      const response = await AgendaService.getAgendas();
      setAgendas(response.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las agendas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSendEmail = async (agenda: Agenda) => {
    try {
      // Aquí implementarías la lógica para enviar el correo
      toast({
        title: "Correo enviado",
        description: "Se ha enviado la agenda por correo electrónico",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el correo",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (agenda: Agenda) => {
    if (agenda.documento) {
      const documentUrl = `${STORAGE_BASE_URL}${agenda.documento}`;
      window.open(documentUrl, "_blank");
    } else {
      toast({
        title: "Sin documento",
        description: "Esta agenda no tiene un documento adjunto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (agenda: Agenda) => {
    // Implementar lógica de edición
  };

  const handleDelete = async (agenda: Agenda) => {
    try {
      await AgendaService.deleteAgenda(agenda.id);
      toast({
        title: "Agenda eliminada",
        description: "La agenda ha sido eliminada correctamente",
      });
      fetchAgendas();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la agenda",
        variant: "destructive",
      });
    }
  };

  const inlineActions = [
    {
      label: "Ver documento",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDocument,
    },
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
    },
  ];

  return (
    <div className="w-full p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b pb-4 gap-4">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Mostrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Próximas</SelectItem>
              <SelectItem value="past">Pasadas</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Cargando reuniones...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="pendientes" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pendientes" className="relative">
              Pendientes
              {eventosPendientesFiltrados.length > 0 && (
                <Badge className="ml-2 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600">
                  {eventosPendientesFiltrados.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmados">
              Confirmados
              {eventosConfirmadosFiltrados.length > 0 && (
                <Badge className="ml-2 bg-green-400 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600">
                  {eventosConfirmadosFiltrados.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="no-confirmados">
              No confirmados
              {eventosNoConfirmadosFiltrados.length > 0 && (
                <Badge className="ml-2 bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600">
                  {eventosNoConfirmadosFiltrados.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendientes">
            {timeFilter === "upcoming" && eventosPendientesHoy.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  Pendientes para hoy
                </h3>
                {renderEventosPorDia(eventosPendientesHoy)}
              </div>
            ) : null}

            {eventosPendientesFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay reuniones pendientes{" "}
                {timeFilter === "upcoming"
                  ? "próximas"
                  : timeFilter === "past"
                  ? "pasadas"
                  : ""}
              </div>
            ) : (
              <>
                {timeFilter === "upcoming" &&
                  eventosPendientesHoy.length > 0 && (
                    <h3 className="text-lg font-medium mb-4">
                      Otras pendientes
                    </h3>
                  )}
                {renderEventosPorDia(eventosPendientesFiltrados)}
              </>
            )}
          </TabsContent>

          <TabsContent value="confirmados">
            {eventosConfirmadosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay reuniones confirmadas{" "}
                {timeFilter === "upcoming"
                  ? "próximas"
                  : timeFilter === "past"
                  ? "pasadas"
                  : ""}
              </div>
            ) : (
              renderEventosPorDia(eventosConfirmadosFiltrados)
            )}
          </TabsContent>

          <TabsContent value="no-confirmados">
            {eventosNoConfirmadosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay reuniones no confirmadas{" "}
                {timeFilter === "upcoming"
                  ? "próximas"
                  : timeFilter === "past"
                  ? "pasadas"
                  : ""}
              </div>
            ) : (
              renderEventosPorDia(eventosNoConfirmadosFiltrados)
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Modal de detalles */}
      <VisualizarReunionModal
        open={modalDetallesAbierto}
        onOpenChange={setModalDetallesAbierto}
        evento={eventoSeleccionadoModal}
        onEstadoChange={handleEstadoChange}
      />

      {/* Diálogo de confirmación */}
      <Dialog
        open={dialogConfirmacionAbierto}
        onOpenChange={setDialogConfirmacionAbierto}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar asistencia</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas confirmar tu asistencia a esta
              reunión?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
            <Info className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Al confirmar, se notificará al organizador y a los demás
              participantes.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogConfirmacionAbierto(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmarReunion}>Confirmar asistencia</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  <DataTable
        data={agendas}
        visibleColumns={visibleColumns}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onSend={handleSendEmail}
        inlineActions={inlineActions}
      /> */}
    </div>
  );
}
