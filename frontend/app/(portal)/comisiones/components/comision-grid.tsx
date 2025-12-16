"use client";

import { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Member {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

interface ComisionGridProps {
  consejeroComision: any[];
  comisionName: string;
  consejero: any;
}

export default function ComisionGrid({
  consejeroComision,
  comisionName,
  consejero,
}: ComisionGridProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-6">
        {consejeroComision.map((consejeroComision: any, index: number) => {
          return (
            <motion.div
              key={consejeroComision.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02] w-[260px]"
              onClick={() =>
                router.push(`/consejeros/${consejeroComision.consejero.id}`)
              }
            >
              {/* Gradiente solo en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>

              {/* Efectos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-400/20 rounded-full -translate-y-16 translate-x-16 z-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 z-20"></div>

              {/* Imagen de fondo */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejeroComision.consejero.url_imagen}` ||
                    "/placeholder.svg"
                  }
                  alt={consejeroComision.consejero.nombre}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 consejero-card-image-sharp"
                  style={
                    {
                      imageRendering: "crisp-edges",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Contenido principal */}
              <div className="absolute inset-0 z-30 flex flex-col justify-end items-center p-4 text-white">
                {/* Badge del cargo */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#062854] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  {consejeroComision.cargo}
                </div>

                {/* Información del consejero */}
                <div className="space-y-3 text-center w-full">
                  <h3 className="text-lg font-bold text-white leading-tight group-hover:text-yellow-300 transition-all duration-300 tracking-wide">
                    {consejeroComision.consejero.nombre}
                  </h3>

                  <p className="text-yellow-200 text-xs font-medium uppercase tracking-wider leading-relaxed">
                    {consejeroComision.cargo} de la Comisión
                  </p>

                  {/* Línea decorativa mejorada */}
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-lg group-hover:w-20 transition-all duration-300 mx-auto"></div>

                  {/* Redes sociales mejoradas - solo mostrar si existen */}
                  {(consejeroComision.consejero.facebook || consejeroComision.consejero.twitter || consejeroComision.consejero.instagram) && (
                    <div className="flex space-x-3 pt-2 justify-center">
                      {consejeroComision.consejero.facebook && (
                        <a
                          href={consejeroComision.consejero.facebook}
                          className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-white hover:from-[#063585] hover:to-[#0a4a9a] hover:shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 group/social"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebookF className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}
                      {consejeroComision.consejero.twitter && (
                        <a
                          href={consejeroComision.consejero.twitter}
                          className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-white hover:from-[#063585] hover:to-[#0a4a9a] hover:shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 group/social"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}
                      {consejeroComision.consejero.instagram && (
                        <a
                          href={consejeroComision.consejero.instagram}
                          className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-white hover:from-[#063585] hover:to-[#0a4a9a] hover:shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 group/social"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedinIn className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Overlay hover con patrón */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40"></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
