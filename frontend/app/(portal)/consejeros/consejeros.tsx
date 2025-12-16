"use client";

import { useState, useEffect, useRef } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Crown,
  Shield,
  User,
  ChevronDown,
  Youtube,
} from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./consejeros.css";

interface Consejero {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  url_imagen: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  sexo: string;
  provincia: string;
}

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  hero: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }
};

const getRoleIcon = (cargo: string) => {
  if (
    cargo.toLowerCase().includes("directorregional")
  ) {
    return Crown;
  } else if (cargo.toLowerCase().includes("gerenteregional")) {
    return Shield;
  } else {
    return User;
  }
};

type ConsejerosProps = {
  data: Consejero[];
  tipo: "directorregional" | "gerenteregional"; // o más tipos si aplica
};

export default function Consejeros({ data, tipo }: ConsejerosProps) {
  const router = useRouter();
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  console.log("tipo", tipo)
  console.log("data", data)

  let mostrarPersonas: Consejero[] = [];

  if (tipo === "directorregional") {
    mostrarPersonas = data.filter((c) =>
      c.cargo.toLowerCase().includes("directoregional")
    );
  } else if (tipo === "gerenteregional") {
    mostrarPersonas = data.filter((c) =>
      c.cargo.toLowerCase().includes("gerenteregional")
    );
  }
  

  const scrollToBottomSection = () => {
    if (bottomSectionRef.current) {
      const yOffset = -60;
      const y =
        bottomSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const titulosPorTipo: Record<string, string> = {
    directorregional: "DIRECTORES",
    gerenteregional: "GERENTES",
  };

  return (
    <>
      <section
        className="relative pt-16 pb-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #184482 0%, #1a4c94 50%, #0f2847 100%)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 12px
                )`,
              }}
            />
          </div>

          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white/20 animate-float-slow"></div>
          <div className="absolute top-20 right-16 w-24 h-24 rounded-full border border-white/15 animate-pulse"></div>
          <div className="absolute bottom-16 left-20 w-20 h-20 rounded-full border border-white/10 animate-float-reverse"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full border-2 border-white/25 animate-pulse"></div>

          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="absolute top-16 right-1/4 w-16 h-16 border-l-2 border-t-2 border-white/20 rotate-45"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 border-r-2 border-b-2 border-white/15 rotate-12"></div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={animations.container as any}
        >

          <motion.div className="mb-12" variants={animations.hero as any}>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              {titulosPorTipo[tipo]} REGIONALES
              <br />
            </h1>
            <p className="text-blue-100 text-base max-w-2xl mx-auto font-light leading-relaxed">
              Nuestros líderes que dirigen y coordinan las actividades del
              Gobierno Regional, trabajando por el desarrollo y bienestar de
              nuestra región.
            </p>
          </motion.div>

          {/* {topMembers.length > 0 && (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto"
              variants={animations.container as any}
            >
              {topMembers.map((member, index) => {
                const isPresident =
                  member?.cargo.toLowerCase().includes("presidente") &&
                  !member?.cargo.toLowerCase().includes("vice");

                return (
                  <motion.div
                    key={member?.id}
                    variants={animations.item as any}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => router.push(`/consejeros/${member?.id}`)}
                  >
                    <motion.div
                      className="mb-4"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`flex items-center space-x-2 px-8 py-4 rounded-full shadow-xl role-badge backdrop-blur-sm border border-white/20 ${isPresident
                          ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white"
                          : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
                          }`}
                      >
                        <span className="text-sm font-bold tracking-wider uppercase">
                          {isPresident ? "Presidente" : "Vicepresidente"}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="relative mb-6 group image-glow"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-3 border-white/30 relative z-10 group-hover:border-white/50 transition-all duration-300">
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${member?.url_imagen}` ||
                            "/placeholder.svg"
                          }
                          alt={`${member?.nombre} ${member?.apellido}`}
                          width={224}
                          height={224}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-400/15 to-blue-600/15 blur-2xl rounded-full transform scale-110 group-hover:scale-120 transition-transform duration-300"></div>
                    </motion.div>

                    <motion.div
                      className="text-center"
                      variants={animations.item as any}
                    >
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight tracking-tight">
                        {member?.nombre} {member?.apellido}
                      </h3>


                      <div className="flex justify-center space-x-3">
                        {member?.facebook && (
                          <Link href={member?.facebook} target="_blank">
                            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg backdrop-blur-sm">
                              <Facebook className="w-5 h-5" />
                            </div>
                          </Link>
                        )}
                        {member?.twitter && (
                          <Link href={member?.twitter} target="_blank">
                            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-sky-500 hover:scale-110 hover:shadow-lg backdrop-blur-sm">
                              <Twitter className="w-5 h-5" />
                            </div>
                          </Link>
                        )}
                        {member?.instagram && (
                          <Link href={member?.instagram} target="_blank">
                            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-pink-600 hover:scale-110 hover:shadow-lg backdrop-blur-sm">
                              <Instagram className="w-5 h-5" />
                            </div>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )} */}

          {mostrarPersonas.length > 0 && (
            <motion.button
              onClick={scrollToBottomSection}
              className="absolute -bottom-25 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center scroll-indicator"
              aria-label="Ver más"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base mb-3 opacity-90 font-medium cursor-pointer">
                Ver más
              </span>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown size={28} />
              </motion.div>
            </motion.button>
          )}

        </motion.div>

      </section>


      {/* {otherConsejeros.length > 0 && (
        <section
          ref={bottomSectionRef}
          className="px-4 bg-gray-50 flex flex-col py-20"
        >
          <motion.div
            className="max-w-7xl mx-auto w-full flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={animations.container as any}
          >
            <motion.div
              className="text-center mb-16"
              variants={animations.hero as any}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4 tracking-wide">
                Consejeros
                <span className="text-[#184482] ml-2">Regionales</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-base font-light leading-relaxed">
                Representantes que trabajan por el desarrollo de nuestra región
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              variants={animations.container as any}
            >
              {otherConsejeros.map((consejero, index) => {

                const IconComponent = getRoleIcon(consejero.cargo);

                return (

                  <motion.div
                    key={consejero.id}
                    variants={animations.card as any}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group member-card cursor-pointer border border-gray-100"
                    onClick={() => router.push(`/consejeros/${consejero.id}`)}
                  >
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#184482]/5 to-[#1a4c94]/5">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-sm">
                          <span className="text-xs font-bold uppercase tracking-wide">
                            {consejero.sexo === "MASCULINO" ? "CONSEJERO"
                              : consejero.sexo === "FEMENINO" ? "CONSEJERA"
                                : "CONSEJERO"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <motion.div
                        className="relative mx-auto w-24 h-24 mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden border-3 border-[#184482]/20 relative z-10 group-hover:border-[#184482]/40 transition-all duration-300">
                          <Image
                            src={
                              `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejero.url_imagen}` ||
                              "/placeholder.svg"
                            }
                            alt={`${consejero.nombre} ${consejero.apellido}`}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#184482]/10 to-[#1a4c94]/10 blur-xl rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                      </motion.div>

                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                          {consejero.nombre}
                        </h3>
                        <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                          {consejero.apellido}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                          {consejero.provincia}
                        </p>
                      </div>

                      <div className="flex justify-center space-x-2">
                        {consejero?.facebook && (
                          <Link href={consejero.facebook} target="_blank">
                            <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
                          </Link>
                        )}
                        {consejero?.twitter && (
                          <Link href={consejero.twitter} target="_blank">
                            <Twitter className="w-4 h-4 text-gray-600 hover:text-blue-400 transition-colors duration-300" />
                          </Link>
                        )}
                        {consejero?.instagram && (
                          <Link href={consejero.instagram} target="_blank">
                            <Instagram className="w-4 h-4 text-gray-600 hover:text-pink-600 transition-colors duration-300" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-center text-xs text-[#184482] font-medium">
                        <span>Ver perfil completo</span>
                        <FaChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>
        </section>
      )}  */}


      {mostrarPersonas.length > 0 && (
        <section
          ref={bottomSectionRef}
          className="px-4 bg-gray-50 flex flex-col py-20"
        >
          <motion.div
            className="max-w-7xl mx-auto w-full flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={animations.container as any}
          >
            {/* <motion.div
              className="text-center mb-16"
              variants={animations.hero as any}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4 tracking-wide">
                <h1>{titulosPorTipo[tipo]}</h1>
                <span className="text-[#184482] ml-2">Regionales</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-base font-light leading-relaxed">
                Representantes que trabajan por el desarrollo de nuestra región
              </p>
            </motion.div> */}

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              variants={animations.container as any}
            >
              {mostrarPersonas.map((consejero, index) => {

                const IconComponent = getRoleIcon(consejero.cargo);

                return (

                  <motion.div
                    key={consejero.id}
                    variants={animations.card as any}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group member-card cursor-pointer border border-gray-100"
                    onClick={() => router.push(`/consejeros/${consejero.id}`)}
                  >

                    {/* Header con badge */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#184482]/5 to-[#1a4c94]/5">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#184482] to-[#1a4c94] text-white rounded-full shadow-sm">
                          <span className="text-xs font-bold uppercase tracking-wide">
                            {/* {consejero.sexo === "MASCULINO" ? "GOBERNADOR REGIONAL"
                              : consejero.sexo === "FEMENINO" ? "GOBERNADORA REGIONAL"
                                : "GOBERNADOR REGIONAL"} */}
                            {consejero.descripcion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Imagen del consejero */}
                    <div className="p-6">
                      <motion.div
                        className="relative mx-auto w-24 h-24 mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden border-3 border-[#184482]/20 relative z-10 group-hover:border-[#184482]/40 transition-all duration-300">
                          <Image
                            src={
                              `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${consejero.url_imagen}` ||
                              "/placeholder.svg"
                            }
                            alt={`${consejero.nombre} ${consejero.apellido}`}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#184482]/10 to-[#1a4c94]/10 blur-xl rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                      </motion.div>

                      {/* Información del consejero */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                          {consejero.nombre}
                        </h3>
                        <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                          {consejero.apellido}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                          {consejero.provincia}
                        </p>
                      </div>

                      {/* Redes sociales solo mostrar las redes sociales diferentes de null */}
                      <div className="flex justify-center space-x-2">
                        {consejero?.facebook && (
                          <Link href={consejero.facebook} target="_blank">
                            <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
                          </Link>
                        )}
                        {consejero?.twitter && (
                          <Link href={consejero.twitter} target="_blank">
                            <Twitter className="w-4 h-4 text-gray-600 hover:text-blue-400 transition-colors duration-300" />
                          </Link>
                        )}
                        {consejero?.instagram && (
                          <Link href={consejero.instagram} target="_blank">
                            <Instagram className="w-4 h-4 text-gray-600 hover:text-pink-600 transition-colors duration-300" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Footer con indicador de hover */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-center text-xs text-[#184482] font-medium">
                        <span>Ver perfil completo</span>
                        <FaChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>
        </section>
      )}



    </>
  );
}
