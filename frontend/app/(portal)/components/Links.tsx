"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Tipo para los enlaces
type LinkInteres = {
  id: number;
  nombre: string;
  url: string;
  imagen: string;
};

export default function Links({ linkInteres, tituloEnlaces, descripcionEnlaces }: { linkInteres: LinkInteres[], tituloEnlaces: string, descripcionEnlaces: string }) {
  // Configurar AutoScroll para movimiento continuo
  const autoScrollPlugin = AutoScroll({
    playOnInit: true,
    speed: 1,
    stopOnInteraction: false,
    stopOnMouseEnter: false,
  });

  return (
    <section className="bg-white py-16">
      <div className="w-11/12 md:w-4/5 mx-auto px-4">
        {/* Header unificado */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#063585] mb-6 tracking-wide">
            {tituloEnlaces || ""}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
            <div className="w-2 h-2 bg-[#063585] rounded-full"></div>
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
          </div>

          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            {descripcionEnlaces || ""}
          </p>
        </div>

        {linkInteres.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hay enlaces disponibles.
          </div>
        ) : (
          <div className="relative">
            <div className="relative mx-auto max-w-7xl">
              <Carousel
                opts={{
                  loop: true,
                  align: "start",
                }}
                plugins={[autoScrollPlugin]}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {linkInteres.map((link, index) => (
                    <CarouselItem
                      key={`${link.id}-${index}`}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <div className="flex justify-center">
                        <Link
                          href={link.url}
                          className="block group w-full max-w-[200px]"
                          target="_blank"
                        >
                          <div className="relative transition-all duration-300 p-4 group-hover:scale-105 h-full">
                            <div className="relative aspect-[3/2] w-full h-16 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-slate-100">
                              <Image
                                src={
                                  process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
                                    link.imagen || "/placeholder.svg"
                                }
                                alt={link.nombre}
                                fill
                                className="object-contain rounded"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Gradientes laterales para efecto fade */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
