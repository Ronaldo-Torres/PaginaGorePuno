"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaFilter,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VisualizacionCalendario from "./visualizacion-calendario";
import PrincipalService from "@/services/PrincipalService";
import { useToast } from "@/components/ui/use-toast";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  }
};

// Tipos de reuniones disponibles para consejeros con colores mejorados
const tiposReunion = [
  { id: "reuniones", label: "Reuniones", color: "#1fef8e" }, // Verde más claro
  { id: "otros", label: "Otros", color: "#93c5fd" }, // Azul más claro
];

// Interfaz para datos de la API
interface AgendaData {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  estado: string;
  documento: string;
  consejero?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

// Interfaz para los eventos del calendario
interface Evento {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    tipo: string;
    estado: string;
    documento: string;
    consejero: string;
  };
}

export default function AgendaPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(
    new Date().getMonth()
  );
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const agendaLazyLoader = useRef(PrincipalService.getAgendasLazy());
  const [dataInitialized, setDataInitialized] = useState(false);

  // Generar meses del año
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Inicializar carga cuando el componente sea visible
  useEffect(() => {
    if (dataInitialized) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          console.log(
            "[AgendaPage] Componente visible, inicializando carga de datos"
          );
          cargarEventos();
          setDataInitialized(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Recargar eventos cuando cambia el mes seleccionado
  useEffect(() => {
    if (dataInitialized && mesSeleccionado !== null) {
      console.log(
        `[AgendaPage] Mes seleccionado cambiado a ${mesSeleccionado}, recargando datos`
      );
      cargarEventos();
    }
  }, [mesSeleccionado, dataInitialized]);

  // Función para cargar eventos
  const cargarEventos = async () => {
    try {
      setIsLoading(true);

      // Usar el mes seleccionado o el actual si es null
      const mes =
        mesSeleccionado !== null
          ? mesSeleccionado + 1
          : new Date().getMonth() + 1;

      // Cargar eventos desde el backend usando el método lazy
      const eventosData = (await agendaLazyLoader.current.loadWhenVisible(
        containerRef.current,
        mes
      )) as AgendaData[];

      // Mostrar datos de ejemplo para debug
      if (eventosData && eventosData.length > 0) {
      }

      // Transformar los datos al formato necesario para el calendario
      const eventosFormateados = transformarEventos(
        Array.isArray(eventosData) ? eventosData : []
      );

      setEventos(eventosFormateados);
    } catch (error) {
      console.error("Error al cargar las agendas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reuniones desde el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para transformar datos de la API al formato necesario para el calendario
  const transformarEventos = (agendas: AgendaData[]): Evento[] => {
    if (!agendas || !Array.isArray(agendas)) return [];

    return agendas.map((agenda) => {
      // Determinar el tipo de reunión y su color correspondiente
      const tipo = agenda.tipo ? agenda.tipo.toLowerCase() : "otros";
      const tipoSeleccionado = tiposReunion.find(
        (t) => t.id.toLowerCase() === tipo
      );
      const colorTipo = tipoSeleccionado ? tipoSeleccionado.color : "#aaabaf";

      // Determinar el estado de la reunión
      let estado = "pendiente";
      if (agenda.estado) {
        const estadoLower = agenda.estado.toLowerCase();
        if (estadoLower.includes("confirm")) {
          estado = "confirmada";
        } else if (estadoLower.includes("no_confirm")) {
          estado = "no-confirmada";
        }
      }

      // Crear objeto de evento para el calendario
      return {
        id: agenda.id?.toString() || "",
        title: agenda.nombre || "Reunión sin título",
        description: agenda.descripcion || "Reunión sin descripción",
        start: `${agenda.fecha}T${agenda.horaInicio}`,
        end: `${agenda.fecha}T${agenda.horaFin}`,
        backgroundColor: colorTipo,
        borderColor: colorTipo,
        extendedProps: {
          tipo: tipo,
          estado: estado,
          documento: agenda.documento || "",
          consejero: agenda.consejero
            ? `${agenda.consejero.nombre} ${agenda.consejero.apellido}`
            : "Sin consejero asignado",
        },
      };
    });
  };

  // Manejador para cuando se cambia el mes en el componente hijo
  const handleMesChange = (nuevoMes: number | null) => {
    setMesSeleccionado(nuevoMes);
  };

  return (
    <motion.div
      ref={containerRef}
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Header Elegante */}
        <motion.div
          variants={animations.title}
          className="mb-12 text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              AGENDA INSTITUCIONAL
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-5 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaCalendarAlt className="h-5 w-5 mr-2" />
              <span className="font-semibold tracking-wide">
                Gobierno Regional de Puno
              </span>
            </motion.div>

          </div>
        </motion.div>

        {/* Filtros y Controles */}
        <motion.div
          variants={animations.item}
          className="mb-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
        >
          <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
            <h2 className="flex items-center gap-2 font-medium text-[#184482]">
              <FaFilter className="h-4 w-4" />
              Filtros y Configuración
              {eventos.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {eventos.length} eventos
                </Badge>
              )}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selector de Mes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Mes a visualizar
                </label>
                <Select
                  value={mesSeleccionado?.toString() || ""}
                  onValueChange={(value) => setMesSeleccionado(parseInt(value))}
                >
                  <SelectTrigger className="w-full h-12 border-2 border-[#184482]/30 focus:border-[#184482]">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((mes, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {mes} {new Date().getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Información de Tipos */}
               {/*<div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Tipos de eventos
                </label>
                <div className="flex flex-wrap gap-2">
                  {tiposReunion.map((tipo) => (
                    <div
                      key={tipo.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tipo.color }}
                      ></div>
                      <span className="text-xs font-medium text-gray-700">
                        {tipo.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>*/}

              {/* Estadísticas */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Estadísticas del mes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <FaClock className="h-3 w-3 text-green-600" />
                    <div>
                      <span className="text-xs text-green-700 block">Total</span>
                      <span className="text-sm font-semibold text-green-700">
                        {eventos.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <FaUsers className="h-3 w-3 text-blue-600" />
                    <div>
                      <span className="text-xs text-blue-700 block">Activos</span>
                      <span className="text-sm font-semibold text-blue-700">
                        {eventos.filter(e => e.extendedProps.estado === "confirmada").length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendario */}
        <motion.div
          variants={animations.item}
          className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          whileHover={{
            y: -4,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
            <h2 className="flex items-center gap-2 font-medium text-[#184482]">
              <FaCalendarAlt className="h-4 w-4" />
              Calendario de Eventos
              {mesSeleccionado !== null && (
                <Badge variant="outline" className="ml-2">
                  {meses[mesSeleccionado]} {new Date().getFullYear()}
                </Badge>
              )}
            </h2>
          </div>
          
          <div className="p-6">
        {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
                  <div className="w-10 h-10 border-4 border-[#184482] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Cargando agenda...</p>
            </div>
          </div>
        ) : (
          <VisualizacionCalendario
            eventos={eventos}
            onMesChange={handleMesChange}
            mesInicial={mesSeleccionado}
          />
        )}
          </div>
        </motion.div>

        {/* Lista de Próximos Eventos */}
        {!isLoading && eventos.length > 0 && (
          <motion.div
            variants={animations.item}
            className="mt-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
            whileHover={{
              y: -4,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
              <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                <FaFileAlt className="h-4 w-4" />
                Próximos Eventos
                <Badge variant="secondary" className="ml-2">
                  {eventos.filter(evento => new Date(evento.start) > new Date()).slice(0, 5).length}
                </Badge>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {eventos
                  .filter(evento => new Date(evento.start) > new Date())
                  .slice(0, 5)
                  .map((evento) => (
                  <div
                    key={evento.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: evento.backgroundColor }}
                        ></div>
                        <Badge variant="outline" className="bg-[#184482]/10 text-[#184482] border-[#184482]/20">
                          {evento.extendedProps.tipo}
                        </Badge>
                       {/*<Badge 
                          variant="outline" 
                          className={`${
                            evento.extendedProps.estado === "confirmada"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {evento.extendedProps.estado}
                        </Badge>*/}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaClock className="h-3 w-3" />
                        {new Date(evento.start).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {evento.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {evento.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-[#184482]">
                          <FaUsers className="h-3 w-3" />
                          <span>{evento.extendedProps.consejero}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-purple-600">
                          <FaClock className="h-3 w-3" />
                          <span>
                            {new Date(evento.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(evento.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
      </div>
    </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
