"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Facebook, Twitter, Linkedin, FileText, ArrowLeft, Crown, Star, MapPin, Mail, Phone, X } from "lucide-react";
import { FaList } from "react-icons/fa";

type MesaDirectiva = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cargo: string;
  descripcion: string;
  correo: string;
  telefono: string;
  celular: string | null;
  direccion: string;
  activo: boolean;
  provincia: string | null;
  url_imagen: string;
  documento: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
};

export default function MesaDirectiva({
  mesaDirectiva,
  tituloPresidencia,
  descripcionPresidencia,
}: {
  mesaDirectiva: MesaDirectiva[];
  tituloPresidencia: string;
  descripcionPresidencia: string;
}) {
  const consejeros = mesaDirectiva;
  const [selectedConsejero, setSelectedConsejero] = useState<number | null>(null);

  function capitalizarNombre(nombre: string) {
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="pb-12 px-5 relative overflow-hidden">
      {/* Decoraciones de fondo simplificadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-[#063585]/8 to-blue-400/3 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-[#063585]/6 to-purple-400/3 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        
        {/* Header compacto */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >

          {/* <h2 className="text-2xl md:text-3xl font-bold text-[#063585] mb-6 tracking-wide">
            {tituloPresidencia || ""}
          </h2> */}
          
          {/* <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
            <div className="w-2 h-2 bg-[#063585] rounded-full"></div>
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
          </div> */}
          
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
           {descripcionPresidencia || ""}
          </p>
        </motion.div>

        {/* Grid de consejeros compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center"
        >
          {consejeros.map((consejero, index) => {
            const isPresident = consejero.cargo.toLowerCase().includes("presidente") && !consejero.cargo.toLowerCase().includes("vice");
            const isSelected = selectedConsejero === consejero.id;
            const isOtherSelected = selectedConsejero !== null && selectedConsejero !== consejero.id;

            // Si otro consejero está seleccionado, no renderizar este
            if (isOtherSelected) return null;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className={`group relative w-full max-w-[320px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-white/20 backdrop-blur-sm ${
                  isSelected ? "ring-2 ring-[#063585]/30" : ""
                }`}
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))"
                }}
              >
                {/* Imagen con mejor proporción */}
                <div className="relative aspect-[3/3.8] w-full overflow-hidden">
                  <Image
                    src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + consejero.url_imagen}
                    alt={consejero.nombre}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Overlay gradient suave */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063585]/80 via-[#063585]/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                </div>

                {/* Badge del cargo en posición inferior */}
                <div className="absolute bottom-24 right-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`px-3 py-2 rounded-xl text-white backdrop-blur-md shadow-lg border border-white/20 ${
                      isPresident 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-[#063585] to-[#0a4a9a]"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {capitalizarNombre(consejero.cargo)}
                    </span>
                  </motion.div>
                </div>

                {/* Contenido compacto */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="relative p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold mb-1 text-white leading-tight">
                        {capitalizarNombre(consejero.nombre)}
                      </h3>
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">
                        {capitalizarNombre(consejero.apellido)}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3 text-gray-300" />
                      <span className="text-gray-200 text-xs">
                        {consejero.provincia || "Puno, Perú"}
                      </span>
                    </div>

                    <p className="text-gray-100 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {consejero.descripcion}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedConsejero(isSelected ? null : consejero.id)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs shadow-md ${
                        isSelected
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#063585]"
                          : "bg-white/20 backdrop-blur-sm text-white hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-500 hover:text-[#063585] border border-white/30"
                      }`}
                    >
                      {isSelected ? "Ver menos" : "Conocer más"}
                      <div className="ml-2 w-1 h-1 bg-current rounded-full"></div>
                    </motion.button>
                  </div>
                </div>
                
              </motion.div>
            );
          })}

          {/* Panel de información detallada compacto */}
          {selectedConsejero && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8 h-full border border-white/20 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))"
              }}
            >
              {/* Decoración de fondo sutil */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#063585]/8 to-transparent rounded-full -translate-y-4 translate-x-4"></div>
              
              {consejeros.map((consejero) => {
                if (consejero.id !== selectedConsejero) return null;
                const isPresident = consejero.cargo.toLowerCase().includes("presidente") && !consejero.cargo.toLowerCase().includes("vice");

                return (
                  <div key={consejero.id} className="space-y-6 relative z-10">
                    {/* Header del panel compacto */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-[#063585] leading-tight">
                              {capitalizarNombre(consejero.nombre)}
                            </h3>
                            <h4 className="text-lg font-semibold text-[#0a4a9a]">
                              {capitalizarNombre(consejero.apellido)}
                            </h4>
                          </div>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`inline-block px-4 py-2 rounded-xl text-white shadow-md ${
                            isPresident
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                              : "bg-gradient-to-r from-[#063585] to-[#0a4a9a]"
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {capitalizarNombre(consejero.cargo)}
                          </span>
                        </motion.div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedConsejero(null)}
                        className="flex items-center gap-2 text-[#063585] hover:text-[#0a4a9a] transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
                      >
                        <X className="w-6 h-6 text-white bg-red-500 rounded-full p-1" />
                      </motion.button>
                    </div>

                    {/* Información personal compacta */}
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                      <h4 className="font-bold text-[#063585] mb-3 flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4" />
                        Información Personal
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500 font-medium">DNI:</span>
                          <p className="text-slate-700">{consejero.dni}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Provincia:</span>
                          <p className="text-slate-700">{consejero.provincia || "Puno"}</p>
                        </div>
                        {consejero.correo && (
                          <div className="col-span-2">
                            <span className="text-slate-500 font-medium">Correo:</span>
                            <p className="text-slate-700">{consejero.correo}</p>
                          </div>
                        )}
                        {consejero.telefono && (
                          <div>
                            <span className="text-slate-500 font-medium">Teléfono:</span>
                            <p className="text-slate-700">{consejero.telefono}</p>
                          </div>
                        )}
                        {consejero.celular && (
                          <div>
                            <span className="text-slate-500 font-medium">Celular:</span>
                            <p className="text-slate-700">{consejero.celular}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Descripción compacta */}
                    <div>
                      <h4 className="font-bold text-[#063585] mb-3 flex items-center gap-2 text-sm">
                        <FaList className="w-4 h-4" />
                        Descripción
                      </h4>
                      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {consejero.descripcion}</p>
                      </div>
                    </div>

                    {/* Redes sociales compactas */}
                    {(consejero.facebook || consejero.twitter || consejero.instagram) && (
                      <div>
                        <h4 className="font-bold text-[#063585] mb-3 text-sm">Redes Sociales</h4>
                        <div className="flex gap-3">
                          {consejero.facebook && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              href={consejero.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md group"
                              title="Facebook"
                            >
                              <Facebook className="w-5 h-5" />
                            </motion.a>
                          )}
                          {consejero.twitter && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              href={consejero.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-md group"
                              title="Twitter"
                            >
                              <Twitter className="w-5 h-5" />
                            </motion.a>
                          )}
                          {consejero.instagram && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              href={consejero.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-100 hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md group"
                              title="Instagram"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}

        </motion.div>
      </div>
    </section>
  );
}
