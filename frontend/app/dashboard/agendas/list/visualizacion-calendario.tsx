"use client";

import React from "react";
import { useState, useEffect } from "react";
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

interface Evento {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    tipo: string;
    estado: string;
    consejero: string;
    descripcion?: string;
    documento?: string;
  };
}

interface VisualizacionCalendarioProps {
  eventos: Evento[];
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
  { id: "reuniones", label: "Reuniones", color: "#1fef8e" }, // Verde más claro
  { id: "otros", label: "Otros", color: "#93c5fd" }, // Azul más claro
];

// Estados de reuniones para consejeros
const estadosReunion = [
  { id: "pendiente", label: "Pendiente", color: "#ffd21e" },
  { id: "confirmada", label: "Confirmada", color: "#00e868" },
  { id: "no-confirmada", label: "No confirmada", color: "#ff4242" },
];

export default function VisualizacionCalendario({
  eventos,
}: VisualizacionCalendarioProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 0,
  ]); // Todos los días seleccionados por defecto
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(
    null
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reunionActual, setReunionActual] = useState<Evento | null>(null);

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Buscar la reunión actual
      const actual = encontrarReunionActual(eventosFiltrados, now);
      setReunionActual(actual);
    }, 60000);

    // Ejecutar inmediatamente al montar el componente
    const now = new Date();
    setCurrentTime(now);
    const actual = encontrarReunionActual(eventos, now);
    setReunionActual(actual);

    return () => clearInterval(interval);
  }, [eventos]);

  // Obtener el inicio de la semana (lunes)
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generar los días de la semana
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

  // Filtrar eventos por mes si hay un mes seleccionado
  const eventosFiltrados = eventos.filter((evento) => {
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
    setCurrentDate(addDays(currentDate, -7));
  };

  // Navegar a la semana siguiente
  const semanaSiguiente = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // Navegar a la semana actual
  const semanaActual = () => {
    setCurrentDate(new Date());
  };

  // Manejar clic en un evento
  const handleEventoClick = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setModalAbierto(true);
  };

  // Manejar cambio en la selección de días
  const toggleDiaSeleccionado = (diaId: number) => {
    setDiasSeleccionados((prev) => {
      if (prev.includes(diaId)) {
        return prev.filter((id) => id !== diaId);
      } else {
        return [...prev, diaId].sort((a, b) => {
          // Ordenar días de la semana (1-6, 0) -> (lunes a domingo)
          if (a === 0) return 1;
          if (b === 0) return -1;
          return a - b;
        });
      }
    });
  };

  // Obtener eventos para un día específico
  const getEventosParaDia = (dia: Date) => {
    return eventosFiltrados.filter((evento) => {
      const fechaEvento = parseISO(evento.start);
      return isSameDay(fechaEvento, dia);
    });
  };

  // Calcular la posición y altura de un evento
  const calcularPosicionEvento = (evento: Evento) => {
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

    return {
      top,
      height: altura,
    };
  };

  // Formatear la hora para mostrar
  const formatHora = (hora: number) => {
    return `${hora}:00`;
  };

  // First, update the grid template columns calculation
  // const getGridTemplateColumns = () => {
  //   return `50px repeat(${diasSemana.length}, 1fr)`;
  // };

  // Improved event rendering with proper overflow handling
  const renderEvent = (evento: Evento) => {
    const { top, height } = calcularPosicionEvento(evento);
    const posicionEstilo = {
      top: `${top}px`,
      height: `${height}px`,
    };

    return (
      <div
        key={evento.id}
        className="absolute left-0 right-0 px-1 z-10"
        style={posicionEstilo}
        onClick={() => handleEventoClick(evento)}
      >
        <div
          className="flex flex-col p-1 rounded-md h-full text-xs cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
          style={{ backgroundColor: evento.backgroundColor + "80" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold truncate">{evento.title}</span>
            <div className="flex items-center">
              {evento.extendedProps.documento && (
                <FileText className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
          <div className="flex items-center mt-1">
            <Badge
              className="text-[10px] h-4 px-1"
              style={{
                backgroundColor: getColorEstado(evento.extendedProps.estado),
                color: "#333",
              }}
            >
              {getLabelEstado(evento.extendedProps.estado)}
            </Badge>
            <span className="text-[10px] ml-auto">
              {format(parseISO(evento.start), "HH:mm")} -{" "}
              {format(parseISO(evento.end), "HH:mm")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Update the time grid rendering to be responsive
  const renderTimeGrid = () => {
    return (
      <div className="relative overflow-x-auto border rounded-lg">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `50px repeat(${diasSemana.length}, 1fr)`,
          }}
        >
          {/* Encabezados de días */}
          <div className="sticky top-0 z-10 bg-card">
            {/* Celda vacía en la esquina superior izquierda */}
            <div className="h-16 border-b border-r flex items-center justify-center bg-muted"></div>

            {/* Encabezados de cada día */}
            {diasSemana.map((dia) => (
              <div
                key={dia.dayNumber}
                className={`h-16 border-b border-r p-1 flex flex-col items-center justify-center text-center ${
                  dia.isToday ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <span className="text-sm font-medium capitalize">
                  {dia.dayName}
                </span>
                <span
                  className={`text-xl font-bold mt-1 flex items-center justify-center ${
                    dia.isToday
                      ? "bg-primary text-primary-foreground w-8 h-8 rounded-full"
                      : ""
                  }`}
                >
                  {dia.dayNumber}
                </span>
              </div>
            ))}
          </div>

          {/* Filas de horas */}
          {horasDelDia.map((hora) => (
            <React.Fragment key={hora}>
              {/* Celda de hora */}
              <div className="sticky left-0 border-b border-r bg-muted z-10">
                <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                  {formatHora(hora)}
                </div>
              </div>

              {/* Celdas para cada día en esta hora */}
              {diasSemana.map((dia) => (
                <div
                  key={`${dia.dayNumber}-${hora}`}
                  className={`h-20 border-b border-r relative ${
                    dia.isToday ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Renderizar eventos para este día y hora */}
                  {getEventosParaDia(dia.date)
                    .filter((evento) => {
                      const startHour = parseISO(evento.start).getHours();
                      return startHour === hora;
                    })
                    .map((evento) => renderEvent(evento))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Then update the return section to use the new rendering function:
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Calendario de Consejeros
        </h1>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center mr-1 sm:mr-2">
            <Select
              value={selectedMonth !== null ? selectedMonth.toString() : ""}
              onValueChange={(value) =>
                setSelectedMonth(
                  value === "all" ? null : value ? Number.parseInt(value) : null
                )
              }
            >
              <SelectTrigger className="w-[140px] sm:w-[150px] text-sm sm:text-base">
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
            </Select>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Días</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium mb-2">Días de la semana</h4>
                  {diasSemanaCompletos.map((dia) => (
                    <div key={dia.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dia-${dia.id}`}
                        checked={diasSeleccionados.includes(dia.id)}
                        onCheckedChange={() => toggleDiaSeleccionado(dia.id)}
                      />
                      <label htmlFor={`dia-${dia.id}`} className="text-sm">
                        {dia.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={semanaAnterior}
              className="px-2 text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={semanaActual}
              className="mx-1 text-xs sm:text-sm"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={semanaSiguiente}
              className="px-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline mr-1">Siguiente</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden text-sm">
        {/* Calendar header */}
        <div
          className="grid border-b border-border"
          style={{
            gridTemplateColumns: `60px repeat(${diasSemana.length}, 1fr)`,
          }}
        >
          <div className="p-1 sm:p-2 border-r border-border bg-muted font-medium text-center">
            Hora
          </div>
          {diasSemana.map((dia) => (
            <div
              key={dia.dayNumber}
              className={`p-1 sm:p-2 text-center border-r border-border truncate ${
                dia.isWeekend
                  ? "bg-yellow-50 dark:bg-yellow-900/10"
                  : "bg-background"
              } ${dia.isToday ? "font-bold" : ""}`}
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
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Reunión en curso
          </h2>
          <Card
            className="border-l-4 overflow-hidden"
            style={{
              borderLeftColor: getColorTipo(reunionActual.extendedProps.tipo),
            }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-lg">
                      {reunionActual.title}
                    </h3>
                    <Badge
                      style={{
                        backgroundColor: getColorEstado(
                          reunionActual.extendedProps.estado
                        ),
                        color: "#333",
                      }}
                    >
                      {getLabelEstado(reunionActual.extendedProps.estado)}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(parseISO(reunionActual.start), "HH:mm")} -{" "}
                        {format(parseISO(reunionActual.end), "HH:mm")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(
                          parseISO(reunionActual.start),
                          "EEEE, d 'de' MMMM",
                          { locale: es }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{reunionActual.extendedProps.consejero}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEventoClick(reunionActual)}
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
          <h3 className="text-lg font-medium mb-2">Tipos de Reunión</h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {tiposReunion.map((tipo) => (
              <div key={tipo.id} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tipo.color }}
                ></div>
                <span>{tipo.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda de estados */}
        <div>
          <h3 className="text-lg font-medium mb-2">Estados de Reunión</h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {estadosReunion.map((estado) => (
              <div key={estado.id} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: estado.color }}
                ></div>
                <span>{estado.label}</span>
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
