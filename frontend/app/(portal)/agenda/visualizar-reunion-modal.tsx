"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, Clock, User, FileText, X, ExternalLink } from "lucide-react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaFilePdf,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock as FaClockPending,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ViewerWrapper from "../components/view-pdf";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  },
  header: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }
};

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
  { 
    id: "pendiente", 
    label: "Pendiente", 
    color: "#f59e0b", 
    bgColor: "#fef3c7",
    icon: FaClockPending
  },
  {
    id: "confirmada",
    label: "Confirmada",
    color: "#22c55e",
    bgColor: "#dcfce7",
    icon: FaCheckCircle
  },
  {
    id: "no-confirmada",
    label: "No confirmada",
    color: "#ef4444",
    bgColor: "#fee2e2",
    icon: FaExclamationTriangle
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
    description?: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: {
      tipo: string;
      estado: string;
      consejero: string;
      documento?: string;
    };
  } | null;
}

export default function VisualizarReunionModal({
  open,
  onOpenChange,
  evento,
}: VisualizarReunionModalProps) {
  if (!evento) return null;

  const tipoReunion = tiposReunion.find(
    (t) => t.id === evento.extendedProps.tipo
  );
  const estadoReunion = estadosReunion.find(
    (e) => e.id === evento.extendedProps.estado
  );

  const fechaInicio = parseISO(evento.start);
  const fechaFin = parseISO(evento.end);
  const tieneDocumento = !!evento.extendedProps.documento;

  // Calcular duración
  const duracionMinutos = Math.floor(
    (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60)
  );
  const horas = Math.floor(duracionMinutos / 60);
  const minutos = duracionMinutos % 60;
  const duracionTexto = horas > 0 
    ? `${horas}h ${minutos > 0 ? `${minutos}m` : ''}`
    : `${minutos}m`;

  const IconoEstado = estadoReunion?.icon || FaClockPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-0 shadow-2xl rounded-2xl p-0">
        <style jsx>{`
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
          .rpv-core__inner-page {
            overflow: auto !important;
          }
        `}</style>
        <motion.div
          variants={animations.container as any}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full"
        >
          {/* Header Elegante */}
          <motion.div
            variants={animations.header}
            className="relative px-6 py-8 bg-gradient-to-r from-[#184482] to-[#1a4c94]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tipoReunion?.color || "#aaabaf" }}
                  ></div>
                  <Badge 
                    className="text-xs font-semibold px-3 py-1"
                  style={{
                    backgroundColor: tipoReunion?.color || "#aaabaf",
                    color: "#fff",
                      border: "none"
                  }}
                >
                  {tipoReunion?.label || evento.extendedProps.tipo}
                  </Badge>
                  {/*
                    <Badge 
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1"
                      style={{
                        backgroundColor: estadoReunion?.bgColor || "#fef3c7",
                        color: estadoReunion?.color || "#f59e0b",
                        border: `1px solid ${estadoReunion?.color || "#f59e0b"}20`
                      }}
                    >
                      <IconoEstado className="h-3 w-3" />
                      {estadoReunion?.label || evento.extendedProps.estado}
                    </Badge>
                  */}
                </div>
                
               
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {evento.title}
              </h1>

              {evento.description && (
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl">
                  {evento.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* Contenido Principal */}
          <div className="overflow-auto max-h-[calc(90vh-200px)] p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información de la Reunión */}
              <motion.div variants={animations.item} className="space-y-6">
                {/* Card de Información Básica */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                      <FaCalendarAlt className="h-5 w-5 text-[#184482]" />
                      Información del Evento
                    </h3>

            <div className="space-y-4">
                      {/* Fecha */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#184482]/10 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#184482]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">Fecha</p>
                          <p className="text-gray-600 text-sm font-medium">
                    {format(fechaInicio, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

                      {/* Horario */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">Horario</p>
                          <p className="text-gray-600 text-sm font-medium">
                            {format(fechaInicio, "HH:mm", { locale: es })} - {format(fechaFin, "HH:mm", { locale: es })}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Duración: {duracionTexto}
                          </p>
                        </div>
                      </div>

                      {/* Responsable */}
                      {/*<div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">Responsable</p>
                          <p className="text-gray-600 text-sm font-medium">
                            {evento.extendedProps.consejero}
                          </p>
                        </div>
                      </div>*/} 
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Estado */}
                {/*<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                      <IconoEstado className="h-5 w-5 text-[#184482]" />
                      Estado de la Reunión
                    </h3>
                    
                    <div className="flex items-center gap-3 p-4 rounded-xl"
                         style={{ backgroundColor: estadoReunion?.bgColor || "#fef3c7" }}>
                      <IconoEstado 
                        className="h-6 w-6" 
                        style={{ color: estadoReunion?.color || "#f59e0b" }}
                      />
                      <div>
                        <p className="font-semibold text-sm"
                           style={{ color: estadoReunion?.color || "#f59e0b" }}>
                          {estadoReunion?.label || evento.extendedProps.estado}
                        </p>
                        <p className="text-xs text-gray-600">
                          {estadoReunion?.id === "confirmada" && "La reunión ha sido confirmada"}
                          {estadoReunion?.id === "pendiente" && "Esperando confirmación"}
                          {estadoReunion?.id === "no-confirmada" && "Reunión no confirmada"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>*/}
              </motion.div>

              {/* Documento PDF */}
              {tieneDocumento && (
                <motion.div variants={animations.item} className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                          <FaFilePdf className="h-5 w-5 text-red-600" />
                          Documento Anexo
                        </h3>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(
                            `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${evento.extendedProps.documento}`,
                            "_blank"
                          )}
                          className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="hidden sm:inline">Abrir en nueva pestaña</span>
                          <span className="sm:hidden">Abrir</span>
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FaFilePdf className="h-5 w-5 text-red-600" />
                          </div>
                <div>
                            <p className="font-semibold text-gray-800 text-sm">Documento PDF</p>
                            <p className="text-xs text-gray-500">
                              Haz clic para ver el documento completo
                  </p>
                </div>
              </div>
                        
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm border h-[400px]">
                          <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                            <ViewerWrapper
                              fileUrl={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${evento.extendedProps.documento}`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer con Acciones */}
          <motion.div 
            variants={animations.item}
            className="border-t bg-gray-50/80 backdrop-blur-sm px-6 py-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="h-4 w-4" />
                <span>
                  Evento programado para el {format(fechaInicio, "d 'de' MMMM", { locale: es })}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
          {tieneDocumento && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(
                      `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${evento.extendedProps.documento}`,
                      "_blank"
                    )}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Ver PDF
                  </Button>
                )}
                
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-[#184482] hover:bg-[#1a4c94] text-white transition-all duration-300"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
