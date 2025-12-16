"use client";

import { useState, useEffect, type SVGProps } from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PrincipalService from "@/services/PrincipalService";

const textAnimation = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function TiktokLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11 2v6.414a6.85 6.85 0 1 0 5.6 6.736v-3.736a8.6 8.6 0 0 0 3.4.686h1V6.5h-1c-1.903 0-3.4-1.537-3.4-3.5V2zm2 2h1.688c.394 2.22 2.08 3.996 4.312 4.41v1.618c-1.038-.152-1.975-.542-2.843-1.123L14.6 7.863v7.287a4.85 4.85 0 1 1-4.6-4.844v1.604a3.25 3.25 0 1 0 3 3.24zM8.5 15.15a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0"
      ></path>
    </svg>
  );
}

export default function Principal({
  nombreInstitucion,
  mesaPartesUrl,
  consultaTramiteUrl,
  correoInstitucion,
  redesSociales,
}: {
  nombreInstitucion: string;
  mesaPartesUrl: string;
  consultaTramiteUrl: string;
  correoInstitucion: string;
  redesSociales: {
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    tiktok: string;
    whatsapp: string;
    telegram: string;
    pinterest: string;
    snapchat: string;
    twitch: string;
  };
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [portadas, setPortadas] = useState([]);
  const [cantidadDeObjetos, setCantidadDeObjetos] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAllPortadas = async () => {
    setLoading(true);
    const response = await PrincipalService.getAllPortadas();
    setPortadas(response.data);
    setCantidadDeObjetos(response.data.length);
    setLoading(false);
  };

  useEffect(() => {
    getAllPortadas();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % cantidadDeObjetos);
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [loading, cantidadDeObjetos]);

  return (
    <div className="relative min-h-[50vh] md:min-h-screen w-full flex items-center justify-center">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {portadas[currentSlide] && (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={
                  portadas[currentSlide]?.imagen
                    ? process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
                      portadas[currentSlide]?.imagen
                    : ""
                }
                alt={`Background for ${portadas[currentSlide]?.titulo}`}
                fill
                style={{ objectFit: "cover" }}
                quality={100}
                priority
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 py-12 md:py-0">
          <AnimatePresence mode="wait">
            {portadas[currentSlide] && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center w-full"
              >
                <motion.h1
                  className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-center lg:text-left"
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  {portadas[currentSlide]?.titulo
                    ?.split("")
                    .map((char, index) => (
                      <motion.span
                        key={`titulo-${index}-${char}`}
                        variants={letterAnimation}
                      >
                        {char}
                      </motion.span>
                    ))}
                  <motion.span
                    className="mt-2 block font-serif italic text-center lg:text-left text-lg sm:text-xl md:text-2xl"
                    variants={textAnimation}
                    initial="hidden"
                    animate="visible"
                  >
                    {portadas[currentSlide]?.subtitulo
                      ?.split("")
                      .map((char, index) => (
                        <motion.span
                          key={`descripcion-${index}-${char}`}
                          variants={letterAnimation}
                        >
                          {char}
                        </motion.span>
                      ))}
                  </motion.span>
                </motion.h1>
                <p className="mb-6 max-w-xl text-sm sm:text-base md:text-lg text-white/90 text-center lg:text-left mx-auto lg:mx-0">
                  {portadas[currentSlide]?.descripcion}
                </p>
                <div className="flex gap-4 justify-center lg:justify-start">
                  {portadas[currentSlide] &&
                    portadas[currentSlide]?.urlBoton && (
                      <Link
                        href={portadas[currentSlide]?.urlBoton}
                        target={
                          portadas[currentSlide]?.urlBoton.startsWith(
                            "https://"
                          )
                            ? "_blank"
                            : ""
                        }
                        className="inline-flex items-center rounded-md bg-[#FF9F1C] px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-[#FF9F1C]/90"
                      >
                        {portadas[currentSlide]?.nombreBoton}
                      </Link>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Social Media Links */}
      <motion.div
        className="absolute right-4 top-1/3 -translate-y-1/2 space-y-4 hidden md:block bg-white/20 backdrop-blur-sm p-3 rounded-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {redesSociales?.twitter && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href={redesSociales?.twitter || ""}
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062854] text-white transition-colors hover:bg-[#062854]/80"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
        {redesSociales?.facebook && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href={redesSociales?.facebook || ""}
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062854] text-white transition-colors hover:bg-[#062854]/80"
            >
              <Facebook className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
        {redesSociales?.instagram && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href={redesSociales?.instagram || ""}
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062854] text-white transition-colors hover:bg-[#062854]/80"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
        {redesSociales?.tiktok && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href={redesSociales?.tiktok || ""}
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062854] text-white transition-colors hover:bg-[#062854]/80"
            >
              <TiktokLine className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
        {redesSociales?.youtube && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href={redesSociales?.youtube || ""}
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062854] text-white transition-colors hover:bg-[#062854]/80"
            >
              <Youtube className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile Social Links */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 flex justify-center space-x-3 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {redesSociales?.twitter && (
          <Link
            href={redesSociales?.twitter || ""}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#062854] text-white"
          >
            <Twitter className="h-4 w-4" />
          </Link>
        )}
        {redesSociales?.facebook && (
          <Link
            href={redesSociales?.facebook || ""}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#062854] text-white"
          >
            <Facebook className="h-4 w-4" />
          </Link>
        )}
        {redesSociales?.instagram && (
          <Link
            href={redesSociales?.instagram || ""}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#062854] text-white"
          >
            <Instagram className="h-4 w-4" />
          </Link>
        )}
        {redesSociales?.tiktok && (
          <Link
            href={redesSociales?.tiktok || ""}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#062854] text-white"
          >
            <TiktokLine className="h-4 w-4" />
          </Link>
        )}
        {redesSociales?.youtube && (
          <Link
            href={redesSociales?.youtube || ""}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#062854] text-white"
          >
            <Youtube className="h-4 w-4" />
          </Link>
        )}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 flex -translate-x-1/2 space-x-2">
        {portadas.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
