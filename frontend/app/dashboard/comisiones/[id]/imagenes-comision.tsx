"use client";

import type React from "react";

import { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
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

export default function PhotoUploadModal() {
  const [photos, setPhotos] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Crear un objeto URL para la previsualización
      const preview = URL.createObjectURL(file);

      // Agregar la nueva foto al estado
      setPhotos([
        ...photos,
        {
          id: Math.random().toString(36).substring(2, 9),
          file,
          preview,
        },
      ]);

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = "";
    }
  };

  const removePhoto = (id: string) => {
    // Encontrar la foto para liberar el objeto URL
    const photoToRemove = photos.find((photo) => photo.id === id);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }

    // Filtrar las fotos para eliminar la seleccionada
    setPhotos(photos.filter((photo) => photo.id !== id));
  };

  const handleSubmit = () => {
    // Aquí puedes implementar la lógica para enviar las fotos al servidor
    console.log(
      "Fotos para subir:",
      photos.map((p) => p.file)
    );

    // Cerrar el modal después de enviar
    setOpen(false);

    // Opcional: limpiar las fotos después de enviar
    // photos.forEach(photo => URL.revokeObjectURL(photo.preview))
    // setPhotos([])
  };

  // Limpiar los objetos URL cuando se cierra el componente
  const handleClose = () => {
    if (!open) {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
      setPhotos([]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) handleClose();
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
            Agrega tus fotografías una a una. Puedes eliminar las que no quieras
            antes de subirlas.
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={photos.length === 0}
              onClick={handleSubmit}
            >
              Subir Fotografías
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
