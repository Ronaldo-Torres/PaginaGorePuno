"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Upload, Loader2, Plus, Trash2, Award } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import NoticiaService from "@/services/NoticiaService";
import BoletinService from "@/services/BoletinService";
interface ImageData {
  id: string;
  url: string;
  name: string;
  descripcion: string;
  esPrincipal: boolean;
}

interface NewImageData {
  id: string;
  file: File;
  preview: string;
  nombre: string;
}

export function PhotoGalleryUpload({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) {
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [newImages, setNewImages] = useState<NewImageData[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageToDelete, setImageToDelete] = useState<ImageData | null>(null);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    if (isOpen) {
      loadExistingImages();
    }
  }, [isOpen]);

  const loadExistingImages = async () => {
    setIsLoading(true);
    try {
      const images = await NoticiaService.fetchImages(data.id);
      setExistingImages(images as any);

      console.log(images);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar imágenes",
        description: "No se pudieron cargar las imágenes existentes.",
      });
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            variant: "destructive",
            title: "Tipo de archivo no válido",
            description: `${file.name} no es una imagen válida.`,
          });
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "Archivo demasiado grande",
            description: `${file.name} excede el tamaño máximo de 10MB.`,
          });
          return;
        }

        const preview = URL.createObjectURL(file);

        setNewImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            file,
            preview,
            nombre: file.name,
          },
        ]);
      });

      e.target.value = "";
    }
  };

  const handleNombreChange = (id: string, nombre: string) => {
    setNewImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, nombre } : img))
    );
  };

  const removeNewImage = (id: string) => {
    setNewImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (newImages.length === 0) return;

    try {
      setIsUploading(true);

      // Crear un FormData por cada imagen
      for (const image of newImages) {
        const formData = new FormData();
        formData.append("file", image.file);
        // Si el nombre personalizado está vacío, usar el nombre original del archivo
        const nombreFinal = image.nombre.trim() || image.file.name;
        formData.append("nombre", nombreFinal);
        formData.append("noticiaId", data.id as string);

        console.log("Enviando imagen:", {
          nombre: nombreFinal,
          noticiaId: data.id,
        });

        // Enviar cada imagen individualmente
        await NoticiaService.createImagen(formData);
      }

      toast({
        title: "Imágenes subidas correctamente",
        description: `Se han subido ${newImages.length} imágenes nuevas.`,
      });

      // Limpiar las nuevas imágenes y recargar las existentes
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
      setNewImages([]);
      await loadExistingImages();
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

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      const result = await NoticiaService.deleteImagen(imageToDelete.id);
      try {
        await loadExistingImages();
        setExistingImages((prev) =>
          prev.filter((img) => img.id !== imageToDelete.id)
        );
        toast({
          title: "Imagen eliminada",
          description: "La imagen se ha eliminado correctamente.",
        });
      } catch (error) {
        throw new Error((error as string) || "Error al eliminar la imagen");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar la imagen",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
      });
    } finally {
      setImageToDelete(null);
    }
  };

  const handlePrincipal = async (image: ImageData) => {
    try {
      const newEsPrincipal = !image.esPrincipal;
      await NoticiaService.updateImagen(image.id, {
        esPrincipal: newEsPrincipal,
      });
      await loadExistingImages();
    } catch (error) {
      console.error("Error al actualizar la imagen principal:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        if (isUploading) return;
        setOpen(newOpen);
        if (!newOpen) {
          newImages.forEach((image) => URL.revokeObjectURL(image.preview));
          setNewImages([]);
        }
        onClose();
        setExistingImages([]);
      }}
    >
      <DialogContent className="sm:max-w-[900px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Galería de Imágenes de la noticia</DialogTitle>
          <DialogDescription>
            Ver imágenes existentes y subir nuevas imágenes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium">Imágenes Existentes</h3>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-32 w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))
                  : existingImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative rounded-md overflow-hidden group ${
                          image.esPrincipal ? "border-4 border-teal-500" : ""
                        }`}
                      >
                        <div className="relative">
                          <Image
                            src={
                              `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${image.url}` ||
                              "/placeholder.svg"
                            }
                            alt={image.descripcion}
                            width={200}
                            height={200}
                            className="object-cover w-full h-32"
                          />
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {image.descripcion}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 bg-white/90 hover:bg-white"
                            onClick={() => handlePrincipal(image)}
                          >
                            {image.esPrincipal ? (
                              <Award className="h-3 w-3 text-teal-500" />
                            ) : (
                              <Award className="h-3 w-3 text-gray-500" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 bg-white/90 hover:bg-white"
                                onClick={() => setImageToDelete(image)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto
                                  eliminará permanentemente la imagen de
                                  nuestros servidores.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteImage}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Subir Nuevas Imágenes</h3>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {newImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-md overflow-hidden space-y-2"
                  >
                    <div className="relative">
                      <Image
                        src={image.preview || "/placeholder.svg"}
                        alt={image.file.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-32 rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(image.id)}
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={image.nombre}
                        onChange={(e) =>
                          handleNombreChange(image.id, e.target.value)
                        }
                        placeholder="Nombre de la imagen"
                        className="h-8 text-xs"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                ))}
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Agregar fotos
                  </span>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    multiple
                  />
                </label>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {newImages.length}{" "}
            {newImages.length === 1 ? "nueva foto" : "nuevas fotos"}{" "}
            seleccionadas
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onClose()}
              disabled={isUploading}
            >
              Cerrar
            </Button>
            <Button
              type="submit"
              disabled={newImages.length === 0 || isUploading}
              onClick={handleSubmit}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Subir Nuevas"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
