"use client";

import type React from "react";

import { useState } from "react";
import { X, Upload, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { uploadImages } from "./actions";

export function PhotoUploadModal() {
  const [photos, setPhotos] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Tipo de archivo no válido",
          description: "Por favor selecciona un archivo de imagen válido",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Archivo demasiado grande",
          description: "El tamaño máximo permitido es 10MB",
        });
        return;
      }

      const preview = URL.createObjectURL(file);

      setPhotos((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          file,
          preview,
        },
      ]);

      e.target.value = "";
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photoToRemove = prev.find((photo) => photo.id === id);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      return prev.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (photos.length === 0) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`image-${index}`, photo.file);
      });

      const result = await uploadImages(formData);

      if (result.success) {
        toast({
          title: "Imágenes subidas correctamente",
          description: `Se han subido ${photos.length} imágenes a la base de datos.`,
        });

        photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
        setPhotos([]);
        setOpen(false);
      } else {
        throw new Error(result.error || "Error al subir las imágenes");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al subir las imágenes",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isUploading) return;
        setOpen(newOpen);
        if (!newOpen) {
          photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
          setPhotos([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Subir Fotografías
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Fotografías</DialogTitle>
          <DialogDescription>
            Agrega tus fotografías una a una. Cada imagen se guardará como un
            registro independiente en la base de datos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Haz clic para seleccionar</span>{" "}
                o arrastra una imagen
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF hasta 10MB
              </p>
            </div>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          {photos.length > 0 && (
            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-md overflow-hidden"
                  >
                    <Image
                      src={photo.preview || "/placeholder.svg"}
                      alt={photo.file.name}
                      width={150}
                      height={150}
                      className="object-cover w-full h-24"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo.id)}
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs truncate px-1 py-0.5">
                      {photo.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {photos.length}{" "}
            {photos.length === 1 ? "foto seleccionada" : "fotos seleccionadas"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={photos.length === 0 || isUploading}
              onClick={handleSubmit}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Subir Fotografías"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
