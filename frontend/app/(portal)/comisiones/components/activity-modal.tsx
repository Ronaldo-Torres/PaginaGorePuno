"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PrincipalService from "@/services/PrincipalService";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividad: {
    id: number;
    nombre: string;
    fecha: string;
    descripcion: string;
    fotos: string[];
  } | null;
}

export function ActivityModal({
  isOpen,
  onClose,
  actividad,
}: ActivityModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagenesActividad, setImagenesActividad] = useState<any[]>([]);

  const getImagenesActividad = async () => {
    try {
      const response = await PrincipalService.getImagenesActividad(
        actividad?.id || 0
      );
      setImagenesActividad(response.data);
    } catch (error) {
      console.error("Error al obtener las imágenes de la actividad", error);
    }
  };

  useEffect(() => {
    if (actividad) {
      getImagenesActividad();
    }
  }, [actividad]);

  if (!actividad) return null;

  const mainPhoto = imagenesActividad.find(
    (imagenesActividad) => imagenesActividad.esPrincipal === true
  ) || { url: "", esPrincipal: false };
  const photos = imagenesActividad.filter(
    (imagenesActividad) => !imagenesActividad.esPrincipal
  );

  const allPhotos = [mainPhoto, ...photos];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + allPhotos.length) % allPhotos.length
    );
  };


  const FullscreenImage = () => (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0"></DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-gray-100">
            <div className="space-y-3">
              <DialogTitle className="text-3xl font-bold text-[#062854] leading-tight tracking-tight">
                {actividad.nombre}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actividad de Comisión
                </span>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-base font-semibold text-gray-700">
                {new Date(actividad.fecha).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed text-base">
                {actividad.descripcion}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-[#062854]">
                  Galería de fotos
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={allPhotos[currentPhotoIndex]?.url || "/placeholder.svg"}
                  alt={`Foto ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={prevPhoto}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Foto {currentPhotoIndex + 1} de {allPhotos.length}
                </span>
                <Button variant="outline" size="icon" onClick={nextPhoto}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {allPhotos.map((photo, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2",
                      currentPhotoIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <FullscreenImage />
    </>
  );
}
