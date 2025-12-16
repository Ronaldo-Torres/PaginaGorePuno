"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarIcon,
  Clock,
  FileText,
  MapPin,
  Users,
  Calendar,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import PrincipalService from "@/services/PrincipalService";
import VisualizarReunionModal from "@/app/(portal)/agenda/visualizar-reunion-modal";

// Interfaz para los eventos
interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  color: string;
  tipo: string;
  estado: string;
  publico: boolean;
  documento: string | null;
  consejero: any | null;
}

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Colores simplificados - solo azul y blanco
const eventColors: Record<string, string> = {
  REUNION: "bg-blue-500",
  OTROS: "bg-slate-400",
  COMISION: "bg-blue-400",
  PRESENTACION: "bg-blue-300",
  SESION: "bg-blue-500",
  "REUNION DE CONSEJO": "bg-blue-500",
  "SESION PUBLICA": "bg-blue-500",
  "AUDIENCIA PUBLICA": "bg-blue-400",
  "EVENTO ESPECIAL": "bg-blue-300",
};

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { x: -30, opacity: 0, scale: 0.95 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
    hover: {
      scale: 1.02,
      x: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  },
  timeline: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  },
};

export default function Agenda({
  nombreInstitucion = "Gobierno Regional Puno",
  tituloAgenda,
  descripcionAgenda,
}: {
  nombreInstitucion?: string;
  tituloAgenda: string;
  descripcionAgenda: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const hoy = useRef(new Date());
  const [fechaInicio, setFechaInicio] = useState(new Date(hoy.current));
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar eventos del mes actual
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setLoading(true);
        const mesActual = hoy.current.getMonth() + 1;
        const agendas = await PrincipalService.getAgendas(mesActual);
        setEventos(agendas);
        setError(null);
      } catch (err) {
        console.error("Error al cargar agendas:", err);
        setError(
          "No se pudieron cargar las agendas. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarEventos();
  }, []); // Array vacío para que solo se ejecute al montar

  // Ajustar fecha inicio para que sea 2 días antes del actual
  useEffect(() => {
    const fechaAjustada = new Date(hoy.current);
    fechaAjustada.setDate(hoy.current.getDate() - 2);
    setFechaInicio(fechaAjustada);
  }, []);

  // Generar 5 días consecutivos desde fechaInicio
  const diasAMostrar = [];
  for (let i = 0; i < 5; i++) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fechaInicio.getDate() + i);
    // Solo agregar si está en el mismo mes
    if (
      fecha.getMonth() === hoy.current.getMonth() &&
      fecha.getFullYear() === hoy.current.getFullYear()
    ) {
      diasAMostrar.push(fecha);
    }
  }

  // Función para obtener eventos de una fecha específica
  const obtenerEventosDelDia = (fecha: Date) => {
    const fechaFormateada = format(fecha, "yyyy-MM-dd");
    return eventos.filter((evento) => evento.fecha === fechaFormateada);
  };

  // Función para verificar si es el día actual
  const esHoy = (fecha: Date) => {
    return fecha.toDateString() === hoy.current.toDateString();
  };

  // Navegar a días anteriores
  const diasAnteriores = () => {
    const nuevaFecha = new Date(fechaInicio);
    nuevaFecha.setDate(fechaInicio.getDate() - 5);
    // Verificar que no se salga del mes
    if (
      nuevaFecha.getMonth() === hoy.current.getMonth() &&
      nuevaFecha.getFullYear() === hoy.current.getFullYear()
    ) {
      setFechaInicio(nuevaFecha);
    }
  };

  // Navegar a días posteriores
  const diasPosteriores = () => {
    const nuevaFecha = new Date(fechaInicio);
    nuevaFecha.setDate(fechaInicio.getDate() + 5);
    // Verificar que no se salga del mes
    if (
      nuevaFecha.getMonth() === hoy.current.getMonth() &&
      nuevaFecha.getFullYear() === hoy.current.getFullYear()
    ) {
      setFechaInicio(nuevaFecha);
    }
  };

  // Función para manejar el clic en un evento
  const handleEventoClick = (evento: Evento) => {
    const eventoFormateado = {
      id: evento.id.toString(),
      title: evento.nombre,
      start: `${evento.fecha}T${evento.horaInicio}`,
      end: `${evento.fecha}T${evento.horaFin}`,
      description: evento.descripcion,
      backgroundColor: evento.color,
      borderColor: evento.color,
      extendedProps: {
        tipo: evento.tipo.toLowerCase(),
        estado: evento.estado,
        consejero: evento.consejero
          ? `${evento.consejero.nombre} ${evento.consejero.apellido}`
          : "Sin consejero asignado",
        documento: evento.documento,
      },
    };
    setEventoSeleccionado(eventoFormateado);
    setModalAbierto(true);
  };

  // return (
  //   <section
  //     ref={sectionRef}
  //     className="py-16 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  //   >
  //     <div className="w-11/12 md:w-4/5 mx-auto px-4 relative z-10">
  //       {/* Header unificado */}
  //       <div className="text-center mb-16">
  //         <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-wide">
  //           {tituloAgenda || ""}
  //         </h2>

  //         <div className="flex items-center justify-center gap-3 mb-6">
  //           <div className="w-16 h-0.5 bg-white rounded-full"></div>
  //           <div className="w-2 h-2 bg-white rounded-full"></div>
  //           <div className="w-16 h-0.5 bg-white rounded-full"></div>
  //         </div>

  //         <p className="text-slate-300 max-w-2xl mx-auto text-base leading-relaxed">
  //           {descripcionAgenda || ""}
  //         </p>
  //       </div>

  //       {loading ? (
  //         <div className="text-center py-12">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
  //           <p className="text-white mt-4">Cargando agendas...</p>
  //         </div>
  //       ) : error ? (
  //         <div className="text-center py-12">
  //           <p className="text-blue-400">{error}</p>
  //         </div>
  //       ) : (
  //         <>
  //           {/* Navegación mejorada */}
  //           <div className="flex justify-center items-center gap-6 mb-8">
  //             <Button
  //               variant="outline"
  //               onClick={diasAnteriores}
  //               className="cursor-pointer bg-gradient-to-r from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-medium"
  //             >
  //               <ChevronLeft className="h-4 w-4" />
  //               <span className="hidden md:inline ml-2">Días anteriores</span>
  //             </Button>

  //             <div className="text-center px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
  //               <h3 className="text-lg font-semibold text-white">
  //                 {months[hoy.current.getMonth()]} {hoy.current.getFullYear()}
  //               </h3>
  //             </div>

  //             <Button
  //               variant="outline"
  //               onClick={diasPosteriores}
  //               className="cursor-pointer bg-gradient-to-r from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-medium"
  //             >
  //               <span className="hidden md:inline mr-2">Días posteriores</span>
  //               <ChevronRight className="h-4 w-4" />
  //             </Button>
  //           </div>

  //           {/* Línea de tiempo horizontal mejorada */}
  //           <div className="max-w-7xl mx-auto">
  //             <style jsx>{`
  //               @keyframes slideInUp {
  //                 from {
  //                   opacity: 0;
  //                   transform: translateY(30px);
  //                 }
  //                 to {
  //                   opacity: 1;
  //                   transform: translateY(0);
  //                 }
  //               }

  //               @keyframes fadeInScale {
  //                 from {
  //                   opacity: 0;
  //                   transform: scale(0.8);
  //                 }
  //                 to {
  //                   opacity: 1;
  //                   transform: scale(1);
  //                 }
  //               }

  //               @keyframes pulse {
  //                 0%,
  //                 100% {
  //                   transform: scale(1);
  //                 }
  //                 50% {
  //                   transform: scale(1.05);
  //                 }
  //               }

  //               .day-card {
  //                 animation: slideInUp 0.6s ease-out forwards;
  //               }

  //               .event-card {
  //                 animation: fadeInScale 0.4s ease-out forwards;
  //                 animation-delay: calc(var(--delay) * 0.1s);
  //               }

  //               .today-indicator {
  //                 animation: pulse 2s infinite;
  //               }

  //               .timeline-line {
  //                 background: linear-gradient(
  //                   90deg,
  //                   transparent 0%,
  //                   rgba(255, 255, 255, 0.3) 20%,
  //                   rgba(255, 255, 255, 0.6) 50%,
  //                   rgba(255, 255, 255, 0.3) 80%,
  //                   transparent 100%
  //                 );
  //               }
  //             `}</style>

  //             {/* Línea de tiempo visual mejorada */}
  //             <div className="relative mb-8">
  //               <div className="absolute top-8 left-0 right-0 h-0.5 timeline-line transform"></div>
  //               <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
  //                 {diasAMostrar.map((fecha, index) => {
  //                   const eventosDelDia = obtenerEventosDelDia(fecha);
  //                   const esElDiaDeHoy = esHoy(fecha);

  //                   return (
  //                     <div
  //                       key={index}
  //                       className="relative day-card"
  //                       style={{ animationDelay: `${index * 0.1}s` }}
  //                     >
  //                       {/* Indicador de día en la línea */}
  //                       <div className="absolute top-7 left-1/2 transform -translate-x-1/2 z-10">
  //                         <div
  //                           className={cn(
  //                             "w-4 h-4 rounded-full border-3 transition-all duration-500",
  //                             esElDiaDeHoy
  //                               ? "bg-blue-500 border-[#BA0028] shadow-lg shadow-blue-400/50 today-indicator"
  //                               : eventosDelDia.length > 0
  //                               ? "bg-white border-gray-300 shadow-md"
  //                               : "bg-slate-400 border-slate-300"
  //                           )}
  //                         ></div>
  //                       </div>

  //                       {/* Card del día blueiseñada */}
  //                       <div
  //                         className={cn(
  //                           "rounded-2xl p-6 border-2 transition-all duration-500 mt-12 min-h-[400px] overflow-hidden relative",
  //                           "hover:shadow-2xl hover:scale-105 transform",
  //                           esElDiaDeHoy
  //                             ? "border-[#BA0028] bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 shadow-2xl shadow-blue-400/20"
  //                             : eventosDelDia.length > 0
  //                             ? "border-gray-300 bg-gradient-to-br from-slate-700 to-slate-800 hover:border-gray-200"
  //                             : "border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 opacity-75"
  //                         )}
  //                       >
  //                         {/* Efectos de fondo */}
  //                         <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

  //                         {/* Cabecera del día */}
  //                         <div className="text-center mb-6 relative z-10">
  //                           <div
  //                             className={cn(
  //                               "text-sm font-semibold uppercase tracking-wider",
  //                               esElDiaDeHoy
  //                                 ? "text-blue-500"
  //                                 : "text-slate-300"
  //                             )}
  //                           >
  //                             {format(fecha, "EEE", { locale: es })}
  //                           </div>
  //                           <div
  //                             className={cn(
  //                               "text-3xl font-bold mt-1",
  //                               esElDiaDeHoy ? "text-blue-600" : "text-white"
  //                             )}
  //                           >
  //                             {format(fecha, "d")}
  //                           </div>
  //                           <div
  //                             className={cn(
  //                               "text-sm mt-1",
  //                               esElDiaDeHoy
  //                                 ? "text-blue-300"
  //                                 : "text-slate-400"
  //                             )}
  //                           >
  //                             {format(fecha, "MMM", { locale: es })}
  //                           </div>
  //                           {esElDiaDeHoy && (
  //                             <div className="inline-block text-xs text-slate-900 font-bold mt-2 bg-[#EA0017] px-3 py-1 rounded-full shadow-lg">
  //                               HOY
  //                             </div>
  //                           )}
  //                         </div>

  //                         {/* Eventos del día */}
  //                         <div className="space-y-3 relative z-10">
  //                           {eventosDelDia.length > 0 ? (
  //                             eventosDelDia.map((evento, eventoIndex) => (
  //                               <div
  //                                 key={evento.id}
  //                                 className="event-card bg-gradient-to-r from-slate-600/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-500/30 hover:from-white/10 hover:to-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
  //                                 style={
  //                                   {
  //                                     "--delay": eventoIndex,
  //                                   } as React.CSSProperties
  //                                 }
  //                                 onClick={() => handleEventoClick(evento)}
  //                               >
  //                                 <div className="flex items-center justify-between mb-2">
  //                                   <div className="text-xs font-bold text-white bg-gradient-to-r from-[#063585] to-[#0a4a9a] px-3 py-1 rounded-full shadow-sm">
  //                                     {evento.horaInicio}
  //                                   </div>
  //                                   <div className="text-xs text-slate-300 bg-white/10 px-2 py-1 rounded-full">
  //                                     {evento.horaFin}
  //                                   </div>
  //                                 </div>
  //                                 <h4 className="text-sm font-semibold text-white mb-2 leading-tight">
  //                                   {evento.nombre}
  //                                 </h4>
  //                                 <div className="flex items-center justify-between">
  //                                   <Badge
  //                                     className={cn(
  //                                       "text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#063585]/80 to-[#0a4a9a]/80 text-white shadow-sm border border-white/20 font-medium"
  //                                     )}
  //                                   >
  //                                     {evento.tipo}
  //                                   </Badge>
  //                                   <Clock className="h-3 w-3 text-slate-300" />
  //                                 </div>
  //                               </div>
  //                             ))
  //                           ) : (
  //                             <div className="text-center py-12">
  //                               <div className="text-slate-400 text-sm font-medium">
  //                                 Sin eventos programados
  //                               </div>
  //                               <div className="w-8 h-8 rounded-full bg-slate-600/50 mx-auto mt-3 flex items-center justify-center">
  //                                 <CalendarIcon className="h-4 w-4 text-slate-400" />
  //                               </div>
  //                             </div>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             </div>
  //           </div>

  //           {/* Botón Ver más mejorado */}
  //           <div className="text-center mt-12">
  //             <Link href="/agenda">
  //               <Button
  //                 variant="outline"
  //                 className="bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white text-[#063585] border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold cursor-pointer hover:scale-105 transform"
  //               >
  //                 Ver más agendas
  //                 <ChevronRightIcon className="h-4 w-4 ml-2" />
  //               </Button>
  //             </Link>
  //           </div>
  //         </>
  //       )}
  //     </div>

  //     {/* Agregar el modal al final del componente */}
  //     <VisualizarReunionModal
  //       open={modalAbierto}
  //       onOpenChange={setModalAbierto}
  //       evento={eventoSeleccionado}
  //     />
  //   </section>
  // );

  return (
    <section
      ref={sectionRef}
      className="py-16 relative bg-[#EEF5F9]"
    >
      <div className="w-11/12 md:w-4/5 mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#063585] mb-6 tracking-wide">
            {tituloAgenda || ""}
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-16 h-0.5 bg-black rounded-full"></div>
          </div>

          <p className="text-gray-700 max-w-2xl mx-auto text-base leading-relaxed">
            {descripcionAgenda || ""}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="text-black mt-4">Cargando agendas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-blue-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Navegación */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <Button
                variant="outline"
                onClick={diasAnteriores}
                className="cursor-pointer bg-gradient-to-r from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white hover:text-blue-200 border-0 shadow-md transition-all duration-300 px-6 py-3 rounded-xl font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Días anteriores</span>
              </Button>

              <div className="text-center px-6 py-2 bg-white rounded-xl border border-gray-300 shadow-sm">
                <h3 className="text-lg font-semibold text-black">
                  {months[hoy.current.getMonth()]} {hoy.current.getFullYear()}
                </h3>
              </div>

              <Button
                variant="outline"
                onClick={diasPosteriores}
                className="cursor-pointer bg-gradient-to-r from-[#063585] to-[#0a4a9a] hover:from-[#0a4a9a] hover:to-[#063585] text-white hover:text-blue-200 border-0 shadow-md transition-all duration-300 px-6 py-3 rounded-xl font-medium"
              >
                <span className="hidden md:inline mr-2">Días posteriores</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Línea de tiempo */}
            <div className="max-w-7xl mx-auto">
              {/* Estilos */}
              <style jsx>{`
              @keyframes slideInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }

              @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
              }

              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }

              .day-card { animation: slideInUp 0.6s ease-out forwards; }
              .event-card { animation: fadeInScale 0.4s ease-out forwards; animation-delay: calc(var(--delay) * 0.1s); }
              .today-indicator { animation: pulse 2s infinite; }
              .timeline-line {
                background: linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(0, 0, 0, 0.1) 20%,
                  rgba(0, 0, 0, 0.3) 50%,
                  rgba(0, 0, 0, 0.1) 80%,
                  transparent 100%
                );
              }
            `}</style>

              {/* Timeline visual */}
              <div className="relative mb-8">
                <div className="absolute top-8 left-0 right-0 h-0.5 timeline-line transform"></div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                  {diasAMostrar.map((fecha, index) => {
                    const eventosDelDia = obtenerEventosDelDia(fecha);
                    const esElDiaDeHoy = esHoy(fecha);

                    return (
                      <div
                        key={index}
                        className="relative day-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Indicador */}
                        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 z-10">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2",
                              esElDiaDeHoy
                                ? "bg-blue-500 border-blue-700 shadow-md today-indicator"
                                : eventosDelDia.length > 0
                                  ? "bg-blue-500 border-blue-900"
                                  : "bg-gray-300 border-gray-400"
                            )}
                          ></div>
                        </div>

                        {/* Card del día */}
                        <div
                          className={cn(
                            "rounded-2xl p-6 border transition-all duration-500 mt-12 min-h-[400px] overflow-hidden relative bg-white shadow hover:shadow-lg hover:scale-105 transform",
                            esElDiaDeHoy
                              ? "border-blue-500"
                              : eventosDelDia.length > 0
                                ? "border-blue-200"
                                : "border-gray-300 opacity-90"
                          )}
                        >
                          {/* Cabecera */}
                          <div className="text-center mb-6 relative z-10">
                            <div className={cn("text-sm font-semibold uppercase tracking-wider", esElDiaDeHoy ? "text-blue-500" : "text-gray-500")}>
                              {format(fecha, "EEE", { locale: es })}
                            </div>
                            <div className={cn("text-3xl font-bold mt-1", esElDiaDeHoy ? "text-blue-600" : "text-black")}>
                              {format(fecha, "d")}
                            </div>
                            <div className={cn("text-sm mt-1", esElDiaDeHoy ? "text-blue-300" : "text-gray-500")}>
                              {format(fecha, "MMM", { locale: es })}
                            </div>
                            {esElDiaDeHoy && (
                              <div className="inline-block text-xs text-white font-bold mt-2 bg-blue-600 px-3 py-1 rounded-full shadow">
                                HOY
                              </div>
                            )}
                          </div>

                          {/* Eventos */}
                          <div className="space-y-3 relative z-10">
                            {eventosDelDia.length > 0 ? (
                              eventosDelDia.map((evento, eventoIndex) => (
                                <div
                                  key={evento.id}
                                  className="event-card bg-gray-100 rounded-xl p-4 border border-gray-300 hover:bg-gray-200 transition-all duration-300 hover:scale-105 cursor-pointer"
                                  style={
                                    {
                                      "--delay": eventoIndex,
                                    } as React.CSSProperties
                                  }
                                  onClick={() => handleEventoClick(evento)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                                      {evento.horaInicio}
                                    </div>
                                    <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                      {evento.horaFin}
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-semibold text-black mb-2 leading-tight">
                                    {evento.nombre}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <Badge className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium">
                                      {evento.tipo}
                                    </Badge>
                                    <Clock className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-12">
                                <div className="text-gray-500 text-sm font-medium">
                                  Sin eventos programados
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto mt-3 flex items-center justify-center">
                                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botón Ver más */}
            <div className="text-center mt-12">
              <Link href="/agenda">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-blue-800 hover:text-blue-700 border border-gray-300 shadow transition-all duration-300 px-8 py-3 rounded-xl font-semibold cursor-pointer hover:scale-105 transform"
                >
                  Ver más agendas
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <VisualizarReunionModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        evento={eventoSeleccionado}
      />
    </section>
  );

}
