"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  getMonth,
  getDay,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  User,
  CalendarIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VisualizarReunionModal from "./visualizar-reunion-modal";
import { FaFilePdf } from "react-icons/fa";

interface Evento {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    tipo: string;
    estado: string;
    consejero: string;
    documento?: string;
  };
}

interface VisualizacionCalendarioProps {
  eventos: Evento[];
  onMesChange?: (mes: number | null) => void;
  mesInicial?: number | null;
}

// Horas para mostrar en la vista
const horasDelDia = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 a 19:00

// Días de la semana
const diasSemanaCompletos = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 0, nombre: "Domingo" },
];

// Meses del año
const mesesDelAnio = [
  { id: 0, nombre: "Enero" },
  { id: 1, nombre: "Febrero" },
  { id: 2, nombre: "Marzo" },
  { id: 3, nombre: "Abril" },
  { id: 4, nombre: "Mayo" },
  { id: 5, nombre: "Junio" },
  { id: 6, nombre: "Julio" },
  { id: 7, nombre: "Agosto" },
  { id: 8, nombre: "Septiembre" },
  { id: 9, nombre: "Octubre" },
  { id: 10, nombre: "Noviembre" },
  { id: 11, nombre: "Diciembre" },
];

// Tipos de reuniones disponibles para consejeros con colores mejorados
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

// Estados de reuniones para consejeros
const estadosReunion = [
  { id: "pendiente", label: "Pendiente", color: "#f59e0b", bgColor: "#fef3c7" },
  {
    id: "confirmada",
    label: "Confirmada",
    color: "#22c55e",
    bgColor: "#dcfce7",
  },
  {
    id: "no-confirmada",
    label: "No confirmada",
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
];

export default function VisualizacionCalendario({
  eventos,
  onMesChange,
  mesInicial,
}: VisualizacionCalendarioProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    mesInicial ?? null
  );
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 0,
  ]); // Todos los días seleccionados por defecto
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(
    null
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reunionActual, setReunionActual] = useState<Evento | null>(null);
  // Estado para mantener filtros consistentes
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    diasSeleccionados: [1, 2, 3, 4, 5, 6, 0],
    mes: mesInicial ?? null,
  });
  const [eventosPorHora, setEventosPorHora] = useState<{
    [key: string]: any[];
  }>({});

  // Inicializar selectedMonth con mesInicial al montar el componente
  useEffect(() => {
    if (mesInicial !== undefined) {
      setSelectedMonth(mesInicial);
      setFiltrosAplicados((prev) => ({
        ...prev,
        mes: mesInicial,
      }));
    }
  }, [mesInicial]);

  // Actualizar la hora actual cada minuto y buscar reunión actual
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Buscar la reunión actual entre los eventos filtrados
      const actual = encontrarReunionActual(eventosFiltrados, now);
      setReunionActual(actual);
    }, 60000);

    // Ejecutar inmediatamente al montar el componente
    const now = new Date();
    setCurrentTime(now);
    const actual = encontrarReunionActual(eventos, now);
    setReunionActual(actual);

    return () => clearInterval(interval);
  }, [eventos, diasSeleccionados, selectedMonth]); // Dependencias actualizadas

  // Obtener el inicio de la semana (lunes)
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generar los días de la semana, filtrando por días seleccionados
  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date,
      dayName: format(date, "EEE", { locale: es }).toLowerCase(),
      dayNumber: format(date, "d"),
      isToday: isSameDay(date, new Date()),
      isWeekend: i >= 5, // Sábado y domingo
      dayOfWeek: getDay(date), // 0 = domingo, 1 = lunes, etc.
    };
  }).filter((dia) => diasSeleccionados.includes(dia.dayOfWeek));

  // Filtrar eventos de manera consistente
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const fechaEvento = parseISO(evento.start);

      // Filtrar por mes si hay un mes seleccionado
      if (selectedMonth !== null && getMonth(fechaEvento) !== selectedMonth) {
        return false;
      }

      // Filtrar por días de la semana seleccionados
      const diaEvento = getDay(fechaEvento);
      if (!diasSeleccionados.includes(diaEvento)) {
        return false;
      }

      return true;
    });
  }, [eventos, selectedMonth, diasSeleccionados]);

  // Función para encontrar la reunión actual
  function encontrarReunionActual(eventos: Evento[], now: Date): Evento | null {
    return (
      eventos.find((evento) => {
        const startTime = parseISO(evento.start);
        const endTime = parseISO(evento.end);

        return isWithinInterval(now, { start: startTime, end: endTime });
      }) || null
    );
  }

  // Obtener color para el tipo de reunión
  const getColorTipo = (tipo: string) => {
    return tiposReunion.find((t) => t.id === tipo)?.color || "#aaabaf";
  };

  // Obtener color para el estado de reunión
  const getColorEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.color || "#aaabaf";
  };

  // Obtener etiqueta para el estado de reunión
  const getLabelEstado = (estado: string) => {
    return estadosReunion.find((e) => e.id === estado)?.label || estado;
  };

  // Navegar a la semana anterior
  const semanaAnterior = () => {
    const nuevaFecha = addDays(currentDate, -7);
    setCurrentDate(nuevaFecha);

    // Verificar si cambió el mes
    if (nuevaFecha.getMonth() !== currentDate.getMonth() && onMesChange) {
      const nuevoMes = nuevaFecha.getMonth();
      // Actualizar el selector de mes
      setSelectedMonth(nuevoMes);
      setFiltrosAplicados((prev) => ({
        ...prev,
        mes: nuevoMes,
      }));
      // Notificar al padre
      onMesChange(nuevoMes);
    }
  };

  // Navegar a la semana siguiente
  const semanaSiguiente = () => {
    const nuevaFecha = addDays(currentDate, 7);
    setCurrentDate(nuevaFecha);

    // Verificar si cambió el mes
    if (nuevaFecha.getMonth() !== currentDate.getMonth() && onMesChange) {
      const nuevoMes = nuevaFecha.getMonth();
      // Actualizar el selector de mes
      setSelectedMonth(nuevoMes);
      setFiltrosAplicados((prev) => ({
        ...prev,
        mes: nuevoMes,
      }));
      // Notificar al padre
      onMesChange(nuevoMes);
    }
  };

  // Navegar a la semana actual
  const semanaActual = () => {
    const hoy = new Date();
    setCurrentDate(hoy);

    // Verificar si cambió el mes
    if (hoy.getMonth() !== currentDate.getMonth() && onMesChange) {
      const nuevoMes = hoy.getMonth();
      // Actualizar el selector de mes
      setSelectedMonth(nuevoMes);
      setFiltrosAplicados((prev) => ({
        ...prev,
        mes: nuevoMes,
      }));
      // Notificar al padre
      onMesChange(nuevoMes);
    }
  };

  // Manejar clic en un evento
  const handleEventoClick = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setModalAbierto(true);
  };

  // Manejar cambio en la selección de días de manera consistente
  const toggleDiaSeleccionado = (diaId: number) => {
    // Asegurar que al menos queda un día seleccionado
    setDiasSeleccionados((prev) => {
      // Si es el único día seleccionado, no permitir deseleccionarlo
      if (prev.includes(diaId) && prev.length === 1) {
        return prev;
      }

      const nuevosDias = prev.includes(diaId)
        ? prev.filter((id) => id !== diaId)
        : [...prev, diaId].sort((a, b) => {
            // Ordenar días de la semana (1-6, 0) -> (lunes a domingo)
            if (a === 0) return 1;
            if (b === 0) return -1;
            return a - b;
          });

      // Actualizar filtros aplicados
      setFiltrosAplicados((prevFiltros) => ({
        ...prevFiltros,
        diasSeleccionados: nuevosDias,
      }));

      return nuevosDias;
    });
  };

  // Manejar selección de todos o ningún día
  const seleccionarTodosLosDias = () => {
    const todosDias = [1, 2, 3, 4, 5, 6, 0];
    setDiasSeleccionados(todosDias);
    setFiltrosAplicados((prev) => ({
      ...prev,
      diasSeleccionados: todosDias,
    }));
  };

  const seleccionarDiasLaborables = () => {
    const diasLaborables = [1, 2, 3, 4, 5];
    setDiasSeleccionados(diasLaborables);
    setFiltrosAplicados((prev) => ({
      ...prev,
      diasSeleccionados: diasLaborables,
    }));
  };

  const seleccionarFinDeSemana = () => {
    const finDeSemana = [6, 0];
    setDiasSeleccionados(finDeSemana);
    setFiltrosAplicados((prev) => ({
      ...prev,
      diasSeleccionados: finDeSemana,
    }));
  };

  // Obtener eventos para un día específico
  const getEventosParaDia = (dia: Date) => {
    return eventosFiltrados.filter((evento) => {
      const fechaEvento = parseISO(evento.start);
      return isSameDay(fechaEvento, dia);
    });
  };

  // Calcular la posición y altura de un evento
  const calcularPosicionEvento = (
    evento: Evento,
    eventosSimultaneos: Evento[],
    indice: number
  ) => {
    const fechaInicio = parseISO(evento.start);
    const fechaFin = parseISO(evento.end);

    const horaInicio = fechaInicio.getHours();
    const minutoInicio = fechaInicio.getMinutes();
    const horaFin = fechaFin.getHours();
    const minutoFin = fechaFin.getMinutes();

    // Calcular la posición superior (top) basada en la hora de inicio
    // Cada hora tiene 60px de altura, y cada minuto es 1px
    const top = (horaInicio - 8) * 60 + minutoInicio;

    // Calcular la altura basada en la duración
    const duracionMinutos =
      (horaFin - horaInicio) * 60 + (minutoFin - minutoInicio);
    const altura = duracionMinutos;

    // Calcular el ancho y posición horizontal para eventos simultáneos
    const total = eventosSimultaneos.length;
    const ancho = total > 1 ? `${100 / total}%` : "100%";
    const left = total > 1 ? `${(100 / total) * indice}%` : "0%";

    return {
      top,
      height: altura,
      width: ancho,
      left: left,
    };
  };

  // Formatear la hora para mostrar
  const formatHora = (hora: number) => {
    return `${hora}:00`;
  };

  // First, update the grid template columns calculation
  const getGridTemplateColumns = () => {
    return `60px sm:w-[80px] repeat(${diasSemana.length}, 1fr)`;
  };

  // Improved event rendering with proper overflow handling
  const renderEvent = (
    evento: Evento,
    eventosSimultaneos: Evento[],
    indice: number
  ) => {
    const { top, height, width, left } = calcularPosicionEvento(
      evento,
      eventosSimultaneos,
      indice
    );
    const startTime = parseISO(evento.start);
    const endTime = parseISO(evento.end);
    const estadoColor = getColorEstado(evento.extendedProps.estado);
    const estadoLabel = getLabelEstado(evento.extendedProps.estado);
    const tieneDocumento = !!evento.extendedProps.documento;

    // Obtener el color de texto oscuro para el tipo de reunión
    const textColor = tiposReunion.find((t) => t.id === evento.extendedProps.tipo)?.textColor || "#1f2937";

    return (
      <>
        <div
          key={evento.id}
          className="absolute p-1.5 sm:p-2 text-2xs sm:text-xs rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 flex flex-col gap-1 shadow-lg"
          style={{
            backgroundColor: getColorTipo(evento.extendedProps.tipo),
            top: `${top}px`,
            height: `${height}px`,
            width: width,
            left: left,
            zIndex: 5,
            borderLeft: `3px solid ${textColor}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          onClick={() => handleEventoClick(evento)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <span 
                className="font-semibold text-sm sm:text-base"
                style={{ color: textColor }}
              >
                {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
              </span>
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  backgroundColor: getColorEstado(evento.extendedProps.estado),
                }}
                title={estadoLabel}
              />
            </div>
            {tieneDocumento && (
              <FaFilePdf
                className="transition-colors text-lg hover:scale-110"
                style={{ color: textColor }}
                size={16}
                aria-label="Documento PDF disponible"
              />
            )}
          </div>

          <div className="flex-1 flex items-center">
            <span
              className="font-bold line-clamp-2 text-sm sm:text-base leading-tight"
              style={{
                color: textColor,
              }}
            >
              {evento.title}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs" style={{ color: `${textColor}CC` }}>
            <User size={10} />
            <span className="truncate">{evento.extendedProps.consejero}</span>
          </div>
        </div>
      </>
    );
  };

  // Update the time grid rendering to be responsive and handle simultaneous events
  const renderTimeGrid = () => {
    return (
      <div className="relative overflow-auto">
        {/* Fixed height container based on hour slots */}
        <div
          style={{ height: `${horasDelDia.length * 60}px` }}
          className="relative"
        >
          {/* Horizontal hour lines */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {horasDelDia.map((hora, index) => (
              <div
                key={`line-${hora}`}
                className="border-b border-border"
                style={{
                  position: "absolute",
                  top: `${index * 60}px`,
                  left: 0,
                  right: 0,
                  height: "60px",
                }}
              ></div>
            ))}
          </div>

          {/* Hour column */}
          <div className="absolute top-0 left-0 w-[60px] sm:w-[80px] h-full border-r border-border bg-muted z-10">
            {horasDelDia.map((hora, index) => {
              const isCurrentHour = currentTime.getHours() === hora;
              return (
                <div
                  key={`hour-${hora}`}
                  className={`p-1 sm:p-2 text-right text-xs sm:text-sm ${
                    isCurrentHour ? "text-red-600 font-bold" : "text-gray-700 font-medium"
                  }`}
                  style={{
                    position: "absolute",
                    top: `${index * 60}px`,
                    left: 0,
                    width: "100%",
                    height: "60px",
                  }}
                >
                  {formatHora(hora)}
                </div>
              );
            })}
          </div>

          {/* Day columns with events */}
          <div
            className="grid absolute left-[60px] sm:left-[80px] right-0 top-0 bottom-0"
            style={{
              gridTemplateColumns: `repeat(${diasSemana.length}, 1fr)`,
            }}
          >
            {/* Day columns */}
            {diasSemana.map((dia, colIndex) => {
              const eventosDelDia = getEventosParaDia(dia.date);

              // Agrupar eventos por hora para manejar eventos simultáneos
              const eventosPorHora: { [key: string]: Evento[] } = {};
              eventosDelDia.forEach((evento) => {
                const fechaInicio = parseISO(evento.start);
                const horaLlave = `${fechaInicio.getHours()}-${
                  Math.floor(fechaInicio.getMinutes() / 15) * 15
                }`;

                if (!eventosPorHora[horaLlave]) {
                  eventosPorHora[horaLlave] = [];
                }
                eventosPorHora[horaLlave].push(evento);
              });

              return (
                <div
                  key={`col-${dia.dayNumber}`}
                  className={`relative border-r border-border ${
                    dia.isWeekend ? "bg-yellow-50" : "bg-background"
                  } h-full`}
                >
                  {/* Current time indicator */}
                  {isSameDay(dia.date, new Date()) && (
                    <div
                      className="absolute left-0 right-0 border-t border-red-500 z-10"
                      style={{
                        top: `${
                          (currentTime.getHours() - 8) * 60 +
                          currentTime.getMinutes()
                        }px`,
                      }}
                    >
                      <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Events for the day, rendered with proper positioning for simultaneous events */}
                  {Object.keys(eventosPorHora).map((horaLlave) => {
                    const eventosGrupo = eventosPorHora[horaLlave];
                    return (
                      <div key={`group-${horaLlave}-${dia.dayNumber}`}>
                        {eventosGrupo.map((evento: Evento, index: number) => (
                          <div key={`${evento.id}-${index}`}>
                            {renderEvent(evento, eventosGrupo, index)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Obtener el mes actual en texto
  const obtenerMesActual = () => {
    const mesActual = mesesDelAnio.find(
      (mes) => mes.id === currentDate.getMonth()
    );
    return mesActual ? mesActual.nombre : "";
  };

  // Then update the return section to include the current month:
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2937]">
            Agenda del Gobierno Regional de Puno
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center mr-1 sm:mr-2">
          {/*   <Select
              value={selectedMonth !== null ? selectedMonth.toString() : ""}
              onValueChange={(value) => {
                const newMonth =
                  value === "all"
                    ? null
                    : value
                    ? Number.parseInt(value)
                    : null;

                setSelectedMonth(newMonth);
                setFiltrosAplicados((prev) => ({
                  ...prev,
                  mes: newMonth,
                }));

                if (onMesChange) {
                  onMesChange(newMonth);
                }
              }}
            > 
              <SelectTrigger className="w-[140px] sm:w-[150px] text-sm sm:text-base bg-background border-border hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Todos los meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                {mesesDelAnio.map((mes) => (
                  <SelectItem key={mes.id} value={mes.id.toString()}>
                    {mes.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>*/}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 px-2 sm:px-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Días</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Filtros rápidos</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={seleccionarTodosLosDias}
                        className="text-xs font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
                      >
                        Todos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={seleccionarDiasLaborables}
                        className="text-xs font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
                      >
                        Laborables
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={seleccionarFinDeSemana}
                        className="text-xs font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
                      >
                        Fin de semana
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Días de la semana</h4>
                    {diasSemanaCompletos.map((dia) => (
                      <div
                        key={dia.id}
                        className="flex items-center space-x-2 my-1"
                      >
                        <Checkbox
                          id={`dia-${dia.id}`}
                          checked={diasSeleccionados.includes(dia.id)}
                          onCheckedChange={() => toggleDiaSeleccionado(dia.id)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor={`dia-${dia.id}`} className="text-sm">
                          {dia.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={semanaAnterior}
              className="px-2 text-xs sm:text-sm font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={semanaActual}
              className="mx-1 text-xs sm:text-sm font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={semanaSiguiente}
              className="px-2 text-xs sm:text-sm font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border-[#285391] text-[#1f2937] border-2"
            >
              <span className="hidden sm:inline mr-1">Siguiente</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mostrar información de filtros aplicados */}
      <div className="mb-4 flex flex-wrap gap-2 items-center text-sm">
        <span className="text-gray-700 font-medium">Filtros aplicados:</span>
        {selectedMonth !== null && (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {mesesDelAnio.find((m) => m.id === selectedMonth)?.nombre || ""}
          </Badge>
        )}
        {diasSeleccionados.length < 7 && (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {diasSeleccionados.length === 5 &&
            diasSeleccionados.every((d) => d >= 1 && d <= 5)
              ? "Días laborables"
              : diasSeleccionados.length === 2 &&
                diasSeleccionados.includes(0) &&
                diasSeleccionados.includes(6)
              ? "Fin de semana"
              : `${diasSeleccionados.length} día(s) seleccionado(s)`}
          </Badge>
        )}
        {(selectedMonth !== null || diasSeleccionados.length < 7) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium hover:bg-[#285391] hover:text-white transition-all duration-300 rounded-full border border-[#285391] text-[#1f2937]"
            onClick={() => {
              setSelectedMonth(null);
              setDiasSeleccionados([1, 2, 3, 4, 5, 6, 0]);
              setFiltrosAplicados({
                diasSeleccionados: [1, 2, 3, 4, 5, 6, 0],
                mes: null,
              });
              if (onMesChange) onMesChange(null);
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="border border-border rounded-lg overflow-hidden text-sm shadow-sm">
        {/* Calendar header */}
        <div
          className="grid border-b border-border bg-muted/50"
          style={{
            gridTemplateColumns: `60px repeat(${diasSemana.length}, 1fr)`,
          }}
        >
          <div className="p-1 sm:p-2 border-r border-border font-semibold text-center text-gray-800">
            Hora
          </div>
          {diasSemana.map((dia) => (
            <div
              key={dia.dayNumber}
              className={`p-1 sm:p-2 text-center border-r border-border truncate ${
                dia.isWeekend ? "bg-muted/30" : "bg-background"
              } ${dia.isToday ? "font-bold text-primary" : ""}`}
            >
              <div className="text-xs sm:text-sm">
                {format(dia.date, "EEE", { locale: es })} {dia.dayNumber}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive calendar body */}
        {renderTimeGrid()}
      </div>

      {/* Sección de reunión actual */}
      {reunionActual && (
        <div className="mt-6 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-primary">
            Reunión en curso
          </h2>
          <Card
            className="border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{
              borderLeftColor: getColorTipo(reunionActual.extendedProps.tipo),
              background: `linear-gradient(to right, ${getColorTipo(
                reunionActual.extendedProps.tipo
              )}15, ${getColorTipo(reunionActual.extendedProps.tipo)}05)`,
              color:
                tiposReunion.find(
                  (t) => t.id === reunionActual.extendedProps.tipo
                )?.textColor || "#374151",
            }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-lg">
                      {reunionActual.title}
                    </h3>
                    <Badge
                      style={{
                        backgroundColor: getColorEstado(
                          reunionActual.extendedProps.estado
                        ),
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      {getLabelEstado(reunionActual.extendedProps.estado)}
                    </Badge>
                    {reunionActual.extendedProps.documento && (
                      <Badge
                        variant="outline"
                        className="bg-white/50 backdrop-blur-sm text-blue-600 border-blue-200 gap-1 flex items-center"
                      >
                        <FaFilePdf size={12} />
                        <span>PDF</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock
                        className="h-4 w-4"
                        style={{
                          color: getColorTipo(reunionActual.extendedProps.tipo),
                        }}
                      />
                      <span>
                        {format(parseISO(reunionActual.start), "HH:mm")} -{" "}
                        {format(parseISO(reunionActual.end), "HH:mm")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        className="h-4 w-4"
                        style={{
                          color: getColorTipo(reunionActual.extendedProps.tipo),
                        }}
                      />
                      <span>
                        {format(
                          parseISO(reunionActual.start),
                          "EEEE, d 'de' MMMM",
                          { locale: es }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User
                        className="h-4 w-4"
                        style={{
                          color: getColorTipo(reunionActual.extendedProps.tipo),
                        }}
                      />
                      <span>{reunionActual.extendedProps.consejero}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-center">
                  {reunionActual.extendedProps.documento && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${reunionActual.extendedProps.documento}`,
                          "_blank"
                        );
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <FaFilePdf className="h-4 w-4 mr-1" />
                      Ver PDF
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEventoClick(reunionActual)}
                    style={{
                      borderColor: getColorTipo(
                        reunionActual.extendedProps.tipo
                      ),
                      color: getColorTipo(reunionActual.extendedProps.tipo),
                    }}
                    className="hover:bg-opacity-10 transition-colors"
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leyendas en un contenedor flex para mejor distribución */}
      <div className="mt-4 sm:mt-6 flex flex-wrap gap-4 sm:gap-8 text-sm sm:text-base">
        {/* Leyenda de tipos de reunión */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-800">
            Tipos de Reunión
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {tiposReunion.map((tipo) => (
              <div key={tipo.id} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tipo.color }}
                ></div>
                <span className="text-gray-700 font-medium">{tipo.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para ver detalles de la reunión */}
      <VisualizarReunionModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        evento={eventoSeleccionado}
      />
    </div>
  );
}
