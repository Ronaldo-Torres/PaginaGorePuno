"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  HelpCircle,
  Settings,
  ChevronDown,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMediaQuery } from "./use-media-query";
import AgendaService from "@/services/AgendaService";
import PrincipalService from "@/services/PrincipalService";

// Importar el nuevo componente modal
import AgregarReunionModal from "./agregar-reunion-modal";

// Definir la interfaz para los eventos del calendario
interface EventoCalendario {
  id?: number;
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  color: string;
  tipo: string;
  estado: string;
  publico: boolean;
  documento?: string;
  lugar: string;
  visible: boolean;
}

// Tipos de reuniones disponibles para consejeros con colores mejorados
const tiposReunion = [
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
  { id: "otros", label: "Otros", color: "#aaabaf", textColor: "#374151" },
];

// Estados de reuniones para consejeros
const estadosReunion = [
  {
    id: "PENDIENTE",
    label: "Pendiente",
    color: "#ffd21e",
    textColor: "#854d0e",
  },
  {
    id: "ASISTIRA",
    label: "Asistirá",
    color: "#00e868",
    textColor: "#166534",
  },
  {
    id: "NO_ASISTIRA",
    label: "No Asistirá",
    color: "#ff4242",
    textColor: "#991b1b",
  },
];

export default function Agenda() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [filtrosTipo, setFiltrosTipo] = useState<string[]>(
    tiposReunion.map((tipo) => tipo.id)
  );
  const [filtrosEstado, setFiltrosEstado] = useState<string[]>(
    estadosReunion.map((estado) => estado.id)
  );
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [newEvent, setNewEvent] = useState<EventoCalendario>({
    nombre: "",
    descripcion: "",
    horaInicio: "09:00",
    horaFin: "10:00",
    fecha: format(new Date(), "yyyy-MM-dd"),
    color: "#ffd21e",
    tipo: "reuniones",
    estado: "pendiente",
    publico: true,
    visible: true,
    lugar: "",
    documento: "",
  });
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const calendarInitialized = useRef(false);
  const { toast } = useToast();

  // Cerrar sidebar automáticamente en móvil
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Obtener color de texto para el tipo de reunión
  const getTextColorTipo = (tipo: string) => {
    return tiposReunion.find((t) => t.id === tipo)?.textColor || "#374151";
  };

  // Obtener color para el estado de reunión
  const getColorEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.color || "#aaabaf";
  };

  // Obtener color de texto para el estado de reunión
  const getTextColorEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.textColor || "#374151";
  };

  // Obtener etiqueta para el estado de reunión
  const getLabelEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.label || estado;
  };

  // Función para cargar eventos desde el backend
  const cargarEventos = async () => {
    try {
      // Obtener el mes actual (1-12)
      const mesActual = currentDate.getMonth() + 1;

      // Intentar cargar las agendas del mes desde PrincipalService
      //const agendasDelMes = await PrincipalService.getAgendas(mesActual);

      // Si no hay agendas del mes, cargamos todas las agendas usando AgendaService
      const response = await AgendaService.getAgendas();
      setEventos(response.content);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar el calendario
  useEffect(() => {
    if (!calendarInitialized.current && calendarRef.current && !calendar) {
      const newCalendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        headerToolbar: false,
        locale: esLocale,
        slotMinTime: "08:00:00",
        slotMaxTime: "20:00:00",
        allDaySlot: false,
        height: "auto",
        editable: true,
        selectable: true,
        nowIndicator: true,
        slotLabelFormat: {
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
        },
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
        },
        dayHeaderFormat: {
          weekday: "short",
          day: "numeric",
        },
        views: {
          listWeek: {
            titleFormat: { year: "numeric", month: "long", day: "numeric" },
          },
        },
        eventContent: (arg) => {
          const estado = arg.event.extendedProps.estado;
          const tipo = arg.event.extendedProps.tipo;
          const documento = arg.event.extendedProps.documento
            ? arg.event.extendedProps.documento.startsWith("http")
              ? arg.event.extendedProps.documento
              : `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${arg.event.extendedProps.documento}`
            : null;
          const estadoColor = getColorEstado(estado);
          const estadoTextColor = getTextColorEstado(estado);
          const tipoTextColor = getTextColorTipo(tipo);
          const estadoLabel = getLabelEstado(estado);

          const timeText = arg.timeText;
          const title = arg.event.title;

          let badgeHtml = "";
          let documentoHtml = "";

          // Agregar icono de documento si existe
          if (documento) {
            documentoHtml = `
              <a href="${documento}" target="_blank" rel="noopener noreferrer" 
                 class="documento-badge" 
                 style="position: absolute; right: 4px; top: 4px; display: inline-block; color: #2563eb; z-index: 5;"
                 onclick="event.stopPropagation();">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </a>
            `;
          }

          if (arg.view.type === "listWeek") {
            badgeHtml = `<span class="estado-badge" style="display: inline-block; background-color: ${estadoColor}; color: ${estadoTextColor}; font-size: 0.7em; padding: 2px 6px; border-radius: 10px; margin-left: 6px;">${estadoLabel}</span>`;
          } else if (arg.view.type === "dayGridMonth") {
            badgeHtml = `<span class="estado-dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${estadoColor}; margin-left: 4px;"></span>`;
          } else {
            badgeHtml = `<span class="estado-badge" style="display: inline-block; background-color: ${estadoColor}; color: ${estadoTextColor}; font-size: 0.7em; padding: 1px 4px; border-radius: 10px; margin-left: 4px;">${estadoLabel}</span>`;
          }

          return {
            html: `
              <div class="fc-event-main-frame" style="position: relative;">
                ${documentoHtml}
                <div class="fc-event-time-with-status">
                  <span class="fc-event-time" style="color: ${tipoTextColor};">${timeText}</span>
                  ${badgeHtml}
                </div>
                <div class="fc-event-title-container">
                  <div class="fc-event-title fc-sticky" style="color: ${tipoTextColor}; font-weight: 500;">${title}</div>
                </div>
              </div>
            `,
          };
        },
        select: (info) => {
          setNewEvent({
            ...newEvent,
            fecha: format(info.start, "yyyy-MM-dd"),
            horaInicio: format(info.start, "HH:mm"),
            horaFin: format(info.end, "HH:mm"),
          });
          setShowNewEventDialog(true);
        },
        eventClick: (info) => {
          const evento = info.event;
          const eventoCalendario: EventoCalendario = {
            id: parseInt(evento.id),
            nombre: evento.title,
            descripcion: evento.extendedProps.descripcion || "",
            horaInicio: format(evento.start!, "HH:mm:ss"),
            horaFin: format(evento.end!, "HH:mm:ss"),
            fecha: format(evento.start!, "yyyy-MM-dd"),
            color: evento.backgroundColor as string,
            tipo: evento.extendedProps.tipo,
            estado: evento.extendedProps.estado,
            publico: evento.extendedProps.publico,
            documento: evento.extendedProps.documento || "",
            lugar: evento.extendedProps.lugar || "",
            visible: evento.extendedProps.visible,
          };
          setNewEvent(eventoCalendario);
          setShowNewEventDialog(true);
        },
        eventDrop: async (info) => {
          try {
            // Obtener los datos necesarios del evento
            const evento = info.event;
            const eventoId = parseInt(evento.id);

            if (!eventoId) {
              console.error("No se pudo obtener el ID del evento");
              info.revert();
              return;
            }

            // Formatear las fechas y horas
            const fecha = format(evento.start!, "yyyy-MM-dd");
            const horaInicio = format(evento.start!, "HH:mm:ss");
            const horaFin = format(evento.end!, "HH:mm:ss");

            // Determinar color basado en el tipo
            const tipo = evento.extendedProps.tipo;
            const tipoSeleccionado = tiposReunion.find(
              (t) => t.id.toLowerCase() === tipo.toLowerCase()
            );
            const colorTipo = tipoSeleccionado
              ? tipoSeleccionado.color
              : "#aaabaf";

            // Preparar datos para actualizar
            const dataToUpdate = {
              id: eventoId,
              nombre: evento.title,
              descripcion: evento.extendedProps.descripcion || "",
              horaInicio: horaInicio,
              horaFin: horaFin,
              fecha: fecha,
              color: colorTipo,
              tipo: evento.extendedProps.tipo.toUpperCase(),
              estado: evento.extendedProps.estado.toUpperCase(),
              publico: evento.extendedProps.publico,
              lugar: evento.extendedProps.lugar || "",
              visible: evento.extendedProps.visible,
            };

            // Mostrar toast de carga
            toast({
              title: "Actualizando evento...",
              description: "Guardando los cambios de fecha/hora.",
              variant: "default",
            });

            // Enviar al backend
            await AgendaService.updateAgenda(eventoId, dataToUpdate);

            // Recargar eventos para mantener la sincronización
            await cargarEventos();

            toast({
              title: "¡Evento actualizado!",
              description:
                "La nueva fecha/hora ha sido guardada correctamente.",
              variant: "default",
            });
          } catch (error) {
            console.error("Error al actualizar evento arrastrado:", error);
            // Revertir el cambio visual en caso de error
            info.revert();
            toast({
              title: "Error",
              description: "No se pudo actualizar la fecha/hora del evento.",
              variant: "destructive",
            });
          }
        },
        eventResize: async (info) => {
          try {
            // Obtener los datos necesarios del evento
            const evento = info.event;
            const eventoId = parseInt(evento.id);

            if (!eventoId) {
              console.error("No se pudo obtener el ID del evento");
              info.revert();
              return;
            }

            // Formatear las fechas y horas (solo cambia la hora fin al redimensionar)
            const fecha = format(evento.start!, "yyyy-MM-dd");
            const horaInicio = format(evento.start!, "HH:mm:ss");
            const horaFin = format(evento.end!, "HH:mm:ss");

            // Determinar color basado en el tipo
            const tipo = evento.extendedProps.tipo;
            const tipoSeleccionado = tiposReunion.find(
              (t) => t.id.toLowerCase() === tipo.toLowerCase()
            );
            const colorTipo = tipoSeleccionado
              ? tipoSeleccionado.color
              : "#aaabaf";

            // Preparar datos para actualizar
            const dataToUpdate = {
              id: eventoId,
              nombre: evento.title,
              descripcion: evento.extendedProps.descripcion || "",
              horaInicio: horaInicio,
              horaFin: horaFin,
              fecha: fecha,
              color: colorTipo,
              tipo: evento.extendedProps.tipo.toUpperCase(),
              estado: evento.extendedProps.estado.toUpperCase(),
              publico: evento.extendedProps.publico,
              lugar: evento.extendedProps.lugar || "",
              visible: evento.extendedProps.visible,
            };

            // Mostrar toast de carga
            toast({
              title: "Actualizando evento...",
              description: "Guardando la nueva duración del evento.",
              variant: "default",
            });

            // Enviar al backend
            await AgendaService.updateAgenda(eventoId, dataToUpdate);

            // Recargar eventos para mantener la sincronización
            await cargarEventos();

            toast({
              title: "¡Evento actualizado!",
              description: "La nueva duración ha sido guardada correctamente.",
              variant: "default",
            });
          } catch (error) {
            console.error("Error al actualizar evento redimensionado:", error);
            // Revertir el cambio visual en caso de error
            info.revert();
            toast({
              title: "Error",
              description: "No se pudo actualizar la duración del evento.",
              variant: "destructive",
            });
          }
        },
      });

      newCalendar.render();
      setCalendar(newCalendar);
      calendarInitialized.current = true;
    }

    // Solo destruir el calendario cuando el componente se desmonte
    return () => {
      if (calendar) {
        calendar.destroy();
        setCalendar(null);
        calendarInitialized.current = false;
      }
    };
  }, []); // Solo se ejecuta al montar el componente

  // Actualizar eventos cuando cambian
  useEffect(() => {
    if (calendar) {
      calendar.removeAllEvents();
      calendar.addEventSource(
        eventos.map((evento) => {
          // Determinar color basado en el tipo
          const tipoSeleccionado = tiposReunion.find(
            (t) => t.id.toLowerCase() === evento.tipo.toLowerCase()
          );
          const colorTipo = tipoSeleccionado
            ? tipoSeleccionado.color
            : "#aaabaf";
          const textColorTipo = tipoSeleccionado
            ? tipoSeleccionado.textColor
            : "#374151";

          // Determinar si el evento debe ser visible según los filtros actuales
          const tipoEvent = evento.tipo.toLowerCase();
          const estadoEvent = evento.estado;
          const visible =
            filtrosTipo.includes(tipoEvent) &&
            filtrosEstado.includes(estadoEvent);

          return {
            id: evento.id?.toString(),
            title: evento.nombre,
            start: `${evento.fecha}T${evento.horaInicio}`,
            end: `${evento.fecha}T${evento.horaFin}`,
            backgroundColor: colorTipo,
            borderColor: colorTipo,
            textColor: textColorTipo,
            display: visible ? "auto" : "none",
            extendedProps: {
              tipo: evento.tipo.toLowerCase(),
              estado: evento.estado,
              publico: evento.publico,
              descripcion: evento.descripcion,
              documento: evento.documento,
              visible: evento.visible,
              lugar: evento.lugar,
            },
          };
        })
      );
    }
  }, [eventos, calendar, filtrosTipo, filtrosEstado]);

  // Cargar eventos solo una vez al montar el componente
  useEffect(() => {
    if (isLoading) {
      cargarEventos();
    }
  }, [isLoading]);

  // Actualizar filtros de eventos
  useEffect(() => {
    if (calendar) {
      calendar.getEvents().forEach((event) => {
        const tipo = event.extendedProps.tipo.toLowerCase();
        const estado = event.extendedProps.estado;

        const visible =
          filtrosTipo.includes(tipo) && filtrosEstado.includes(estado);

        event.setProp("display", visible ? "auto" : "none");
      });
    }
  }, [filtrosTipo, filtrosEstado, calendar]);

  // Cambiar la vista del calendario
  const cambiarVista = (vista: string) => {
    if (calendar) {
      calendar.changeView(vista);
      setCurrentView(vista);
    }
  };

  // Navegar por el calendario
  const navegarHoy = () => {
    if (calendar) {
      calendar.today();
      const hoy = new Date();
      setCurrentDate(hoy);
      cambiarMes(hoy);
    }
  };

  // Función para cambiar el mes y cargar sus eventos
  const cambiarMes = async (nuevaFecha: Date) => {
    setCurrentDate(nuevaFecha);
    if (calendar) {
      calendar.gotoDate(nuevaFecha);

      // Cargar eventos del nuevo mes
      try {
        setIsLoading(true);
        const nuevoMes = nuevaFecha.getMonth() + 1;
        const agendasDelMes = await PrincipalService.getAgendas(nuevoMes);

        if (agendasDelMes && agendasDelMes.length > 0) {
          setEventos(agendasDelMes);
          toast({
            title: "Eventos actualizados",
            description: `Se cargaron ${agendasDelMes.length} eventos para el mes seleccionado.`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error al cargar eventos del mes:", error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los eventos del mes seleccionado.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navegarAnterior = () => {
    if (calendar) {
      calendar.prev();
      const nuevaFecha = calendar.getDate();
      setCurrentDate(nuevaFecha);
      cambiarMes(nuevaFecha);
    }
  };

  const navegarSiguiente = () => {
    if (calendar) {
      calendar.next();
      const nuevaFecha = calendar.getDate();
      setCurrentDate(nuevaFecha);
      cambiarMes(nuevaFecha);
    }
  };

  // Manejar cambios en filtros de tipo
  const toggleFiltroTipo = (id: string) => {
    setFiltrosTipo((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Manejar cambios en filtros de estado
  const toggleFiltroEstado = (id: string) => {
    setFiltrosEstado((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Formatear el título del mes actual
  const formatearTituloMes = () => {
    return format(currentDate, "MMMM yyyy", { locale: es });
  };

  // Toggle sidebar en móvil
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Modificar la función de enviar datos al endpoint
  const enviarDatosAlEndpoint = async (
    eventData: EventoCalendario,
    pdfFile?: File | null
  ) => {
    try {
      console.log("Datos a enviar:", eventData); // Para debugging

      // Determinar color basado en el tipo
      const tipoSeleccionado = tiposReunion.find(
        (t) => t.id.toLowerCase() === eventData.tipo.toLowerCase()
      );
      const colorTipo = tipoSeleccionado ? tipoSeleccionado.color : "#aaabaf";

      const dataToSend = {
        id: eventData.id,
        nombre: eventData.nombre,
        descripcion: eventData.descripcion,
        horaInicio: eventData.horaInicio,
        horaFin: eventData.horaFin,
        fecha: eventData.fecha,
        color: colorTipo,
        tipo: eventData.tipo.toUpperCase(),
        estado: eventData.estado.toUpperCase(),
        publico: eventData.publico,
        documento: eventData.documento,
        lugar: eventData.lugar || "",
        visible: eventData.visible,
      };

      console.log("Datos formateados para enviar:", dataToSend); // Para debugging

      if (eventData.id) {
        await AgendaService.updateAgenda(eventData.id, dataToSend, pdfFile);
      } else {
        await AgendaService.createAgenda(dataToSend, pdfFile);
      }

      // Recargar eventos después de guardar
      await cargarEventos();

      toast({
        title: "¡Éxito!",
        description: "La reunión ha sido guardada correctamente.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error("Error al guardar evento:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la reunión.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Botón para agregar nueva reunión */}
      <div className="p-4 mt-auto w-ful flex justify-end">
        <Button
          className=" justify-end rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
          onClick={() => setShowNewEventDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reunión
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Botón para mostrar/ocultar sidebar en móvil */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Barra lateral */}
        <aside
          className={cn(
            "w-64 border-r flex flex-col bg-card text-card-foreground z-30",
            isMobile
              ? "fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out"
              : "",
            isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
          )}
        >
          {/* Logo y título */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-400 rounded-md">
              <span className="text-lg font-bold text-white">14</span>
            </div>
            <div>
              <h1 className="text-base font-medium">presidencia</h1>
              <p className="text-xs text-muted-foreground">
                Control de reuiniones y citas
              </p>
            </div>
          </div>

          {/* Mini calendario */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                {format(miniCalendarDate, "MMMM yyyy", { locale: es })}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() =>
                    setMiniCalendarDate((prev) => subMonths(prev, 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() =>
                    setMiniCalendarDate((prev) => addMonths(prev, 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-xs mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <div key={day} className="text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {(() => {
                // Obtener el primer día del mes
                const monthStart = startOfMonth(miniCalendarDate);
                // Obtener el último día del mes
                const monthEnd = endOfMonth(miniCalendarDate);
                // Obtener todos los días del mes
                const monthDays = eachDayOfInterval({
                  start: monthStart,
                  end: monthEnd,
                });

                // Calcular el offset para el primer día (0 = domingo, 1 = lunes, etc.)
                // Ajustamos para que la semana comience en lunes (1)
                let startOffset = getDay(monthStart) - 1;
                if (startOffset < 0) startOffset = 6; // Si es domingo (0), lo movemos al final (6)

                // Crear array para los días a mostrar
                const calendarDays = [];

                // Añadir días del mes anterior para completar la primera semana
                for (let i = 0; i < startOffset; i++) {
                  calendarDays.push(null);
                }

                // Añadir los días del mes actual
                calendarDays.push(...monthDays);

                // Renderizar todos los días
                return calendarDays.map((day, i) => {
                  if (!day) {
                    // Espacio vacío para días fuera del mes
                    return (
                      <div
                        key={`empty-${i}`}
                        className="h-7 w-7 text-muted-foreground"
                      />
                    );
                  }

                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, currentDate);

                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-center h-7 w-7 text-sm mx-auto",
                        isSelected
                          ? "bg-primary text-primary-foreground rounded-full"
                          : isToday
                          ? "font-medium"
                          : "hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-full"
                      )}
                      onClick={() => {
                        cambiarMes(day);
                      }}
                    >
                      {format(day, "d")}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Tipos de Reunión */}
          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Tipos de Reunión</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 space-y-2">
              {tiposReunion.map((tipo) => (
                <div key={tipo.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${tipo.id}`}
                    checked={filtrosTipo.includes(tipo.id)}
                    onCheckedChange={() => toggleFiltroTipo(tipo.id)}
                    className="rounded-sm"
                  />
                  <label
                    htmlFor={`tipo-${tipo.id}`}
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: tipo.color }}
                    />
                    {tipo.label}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Estados de Reunión */}
          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Estados de Reunión</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 space-y-2">
              {estadosReunion.map((estado) => (
                <div key={estado.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`estado-${estado.id}`}
                    checked={filtrosEstado.includes(estado.id)}
                    onCheckedChange={() => toggleFiltroEstado(estado.id)}
                    className="rounded-sm"
                  />
                  <label
                    htmlFor={`estado-${estado.id}`}
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: estado.color }}
                    />
                    {estado.label}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </aside>

        {/* Contenido principal */}
        <main
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            isMobile && sidebarOpen ? "opacity-50" : ""
          )}
        >
          {/* Barra de herramientas del calendario */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border-b gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-medium">
                {formatearTituloMes()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={navegarHoy}
                className="text-sm h-8 rounded-md"
              >
                Hoy
              </Button>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navegarAnterior}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navegarSiguiente}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hidden sm:flex"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hidden sm:flex"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hidden sm:flex"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={currentView === "dayGridDay" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => cambiarVista("dayGridDay")}
                  className="rounded-none border-r h-8 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Dias
                </Button>
                <Button
                  variant={
                    currentView === "timeGridWeek" ? "secondary" : "ghost"
                  }
                  size="sm"
                  onClick={() => cambiarVista("timeGridWeek")}
                  className="rounded-none border-r h-8 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Semanas
                </Button>
                <Button
                  variant={
                    currentView === "dayGridMonth" ? "secondary" : "ghost"
                  }
                  size="sm"
                  onClick={() => cambiarVista("dayGridMonth")}
                  className="rounded-none border-r h-8 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Meses
                </Button>
                <Button
                  variant={currentView === "listWeek" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => cambiarVista("listWeek")}
                  className="rounded-none h-8 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Lista
                </Button>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="flex-1 overflow-auto">
            <div ref={calendarRef} className="h-full"></div>
          </div>
        </main>
      </div>

      {/* Diálogo para nuevo evento */}
      <AgregarReunionModal
        open={showNewEventDialog}
        onOpenChange={setShowNewEventDialog}
        initialData={newEvent}
        getAgenda={cargarEventos}
        selectedDate={new Date(newEvent.fecha + "T00:00:00")}
        selectedStartTime={newEvent.horaInicio}
        selectedEndTime={newEvent.horaFin}
        onSave={async (eventData: EventoCalendario, pdfFile?: File | null) => {
          // Primero intentamos enviar al endpoint
          const enviado = await enviarDatosAlEndpoint(eventData, pdfFile);

          if (enviado && calendar) {
            const tipoSeleccionado = tiposReunion.find(
              (t) => t.id.toLowerCase() === eventData.tipo.toLowerCase()
            );
            const colorTipo = tipoSeleccionado
              ? tipoSeleccionado.color
              : "#aaabaf";
            const textColorTipo = tipoSeleccionado
              ? tipoSeleccionado.textColor
              : "#374151";

            if (eventData.id) {
              // Actualizar evento existente
              const evento = calendar.getEventById(eventData.id.toString());
              if (evento) {
                evento.setProp("title", eventData.nombre);
                evento.setStart(`${eventData.fecha}T${eventData.horaInicio}`);
                evento.setEnd(`${eventData.fecha}T${eventData.horaFin}`);
                evento.setProp("backgroundColor", colorTipo);
                evento.setProp("borderColor", colorTipo);
                evento.setProp("textColor", textColorTipo);
                evento.setExtendedProp("tipo", eventData.tipo);
                evento.setExtendedProp(
                  "estado",
                  eventData.estado.toUpperCase()
                );
                evento.setExtendedProp("publico", eventData.publico);
                evento.setExtendedProp("descripcion", eventData.descripcion);
                evento.setExtendedProp("documento", eventData.documento);
                evento.setExtendedProp("lugar", eventData.lugar);
                evento.setExtendedProp("visible", eventData.visible);
              }
            } else {
              // Crear nuevo evento
              calendar.addEvent({
                title: eventData.nombre,
                start: `${eventData.fecha}T${eventData.horaInicio}`,
                end: `${eventData.fecha}T${eventData.horaFin}`,
                backgroundColor: colorTipo,
                borderColor: colorTipo,
                textColor: textColorTipo,
                extendedProps: {
                  tipo: eventData.tipo,
                  estado: eventData.estado.toUpperCase(),
                  publico: eventData.publico,
                  descripcion: eventData.descripcion,
                  documento: eventData.documento,
                  lugar: eventData.lugar || "",
                  visible: eventData.visible,
                },
              });
            }
          }
        }}
      />
    </div>
  );
}
