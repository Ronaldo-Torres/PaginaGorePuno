"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FaUsers,
  FaCalendar,
  FaFileAlt,
  FaChevronRight,
  FaBars,
  FaAward,
} from "react-icons/fa";
import ComisionInfo from "./components/comision-info";
import ComisionGrid from "./components/comision-grid";
import { ActivityModal } from "./components/activity-modal";
import PrincipalService from "@/services/PrincipalService";
import Link from "next/link";
import "tailwind-scrollbar-hide";
import "./comisiones.css";

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

interface Comision {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Actividad {
  id: number;
  titulo: string;
  bajada: string;
  fechaPublicacion: string;
  fotos: string[];
}

export default function ComisionesPage() {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [activeComision, setActiveComision] = useState<number | null>(null);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consejeroComision, setConsejeroComision] = useState<any[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const currentComision = comisiones.find((comision) => comision.id === activeComision);

  const getAllComisiones = async () => {
    setLoading(true);
    try {
      const response = await PrincipalService.getAllComisiones();
      setComisiones(response.data);
    } catch (error) {
      console.error("Error al obtener las comisiones:", error);
    } finally {
      setLoading(false);
    }
  };

  const getConsejeroComision = async () => {
    if (activeComision !== null) {
      try {
        const response = await PrincipalService.getConsejeroComision(activeComision);
        setConsejeroComision(response.data);
      } catch (error) {
        console.error("Error al obtener los consejeros de la comisión:", error);
      }
    }
  };

  const getActividades = async () => {
    if (activeComision !== null) {
      try {
        const response = await PrincipalService.getActividades(activeComision);
        setActividades(response.data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    }
  };

  useEffect(() => {
    getAllComisiones();
  }, []);

  useEffect(() => {
    if (comisiones.length > 0 && !activeComision) {
      setActiveComision(comisiones[0].id);
    }
  }, [comisiones]);

  useEffect(() => {
    if (activeComision) {
      getActividades();
      getConsejeroComision();
    }
  }, [activeComision]);

  const handleComisionChange = (value: string) => {
    setActiveComision(Number(value));
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#184482] to-[#1a4c94] transform -skew-y-1 rounded-2xl opacity-10"></div>
          <div className="relative z-10 py-12 px-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184482] to-[#1a4c94]"
            >
              Nuestras Comisiones
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-lg"
            >
              <FaUsers className="h-5 w-5 mr-2" />
              <span className="font-semibold tracking-wide">
                Consejo Regional de Puno
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Selector de Comisiones */}
        <motion.div
          variants={animations.item}
          className="mb-8 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
        >
          <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
            <h2 className="flex items-center gap-2 font-medium text-[#184482]">
              <FaBars className="h-4 w-4" />
              Seleccionar Comisión
              {comisiones.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {comisiones.length}
                </Badge>
              )}
            </h2>
          </div>

          <div className="p-6">
            {/* Grid de botones de comisiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comisiones.map((comision, index) => (
                <motion.button
                  key={comision.id}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${activeComision === comision.id
                      ? "bg-[#184482]/10 border-[#184482] text-[#184482]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-[#184482]/50 hover:bg-[#184482]/5"
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveComision(comision.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${activeComision === comision.id ? "bg-[#184482]" : "bg-gray-300"
                      }`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{comision.nombre}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{comision.descripcion}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Select móvil */}
            <div className="md:hidden mt-6">
              <Select
                value={activeComision?.toString() || ""}
                onValueChange={handleComisionChange}
              >
                <SelectTrigger className="w-full h-12 border-2 border-[#184482]/30 focus:border-[#184482]">
                  <SelectValue placeholder="Selecciona una comisión" />
                </SelectTrigger>
                <SelectContent>
                  {comisiones.map((comision) => (
                    <SelectItem key={comision.id} value={comision.id.toString()}>
                      {comision.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Contenido de la Comisión */}
        {currentComision && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Información de la Comisión */}
            <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              whileHover={{
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                  <FaAward className="h-4 w-4" />
                  {currentComision.nombre}
                  <Badge variant="outline" className="ml-2">
                    {consejeroComision.length} miembros
                  </Badge>
                </h2>
              </div>

              <div className="p-6">
                <ComisionInfo consejeroComision={currentComision} />
              </div>
            </motion.div>

            {/* Grid de Consejeros */}
            <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              whileHover={{
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                  <FaUsers className="h-4 w-4" />
                  Miembros de la Comisión
                </h2>
              </div>

              <div className="p-6">
                <ComisionGrid
                  consejeroComision={consejeroComision}
                  consejero={currentComision}
                  comisionName={currentComision?.nombre}
                />
              </div>
            </motion.div>

            {/* Actividades */}
            <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              whileHover={{
                y: -4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-100 bg-[#184482]/5">
                <h2 className="flex items-center gap-2 font-medium text-[#184482]">
                  <FaFileAlt className="h-4 w-4" />
                  Actividades Realizadas
                  {actividades.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {actividades.length}
                    </Badge>
                  )}
                </h2>
              </div>

              <div className="p-6">
                {actividades.length > 0 ? (
                  <div className="space-y-4">
                    {actividades.map((actividad, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#184482]/30 hover:bg-[#184482]/5 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="bg-[#184482]/10 text-[#184482] border-[#184482]/20">
                              Actividad
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaCalendar className="h-3 w-3" />
                            {new Date(actividad.fechaPublicacion).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          {actividad.titulo}
                        </h3>

                        <div
                          className="text-xs text-gray-600 mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: actividad.bajada }}
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-[#184482]">
                              <FaFileAlt className="h-3 w-3" />
                              <span>Comisión: {currentComision.nombre}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Enlace a todas las actividades */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-center">
                        <Link
                          href={`/noticias/todas?comision=${currentComision.nombre}`}
                          className="inline-flex items-center gap-2 text-sm text-[#184482] hover:text-[#1a4c94] font-medium transition-colors"
                        >
                          Ver todas las actividades
                          <FaChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaFileAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">
                      Esta comisión no cuenta con actividades registradas actualmente.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        actividad={selectedActividad}
      />
    </motion.div>
  );
}
