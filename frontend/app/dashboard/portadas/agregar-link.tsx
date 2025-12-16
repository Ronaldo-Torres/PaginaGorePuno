"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConsejeroService from "@/services/ConsejeroService";
import { X } from "lucide-react";
import PortadaService from "@/services/PortadaService";

interface ConsejeroFormData {
  id?: number;
  nombre: string;
  url: string;
  imagen: string;
}

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateData?: (newData: Omit<ConsejeroFormData, "id">) => void;
  data?: ConsejeroFormData | null;
  fetchData: () => void;
}

export function Agregar({ isOpen, onClose, data, fetchData }: AgregarProps) {
  const initialFormState: ConsejeroFormData = {
    nombre: data?.nombre || "",
    url: data?.url || "",
    imagen: data?.imagen || "",
  };

  const [formData, setFormData] = useState<ConsejeroFormData>(initialFormState);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        nombre: data.nombre,
        url: data.url,
        imagen: data.imagen,
      });
      // Cargar la imagen desde url_imagen si está disponible
      if (data.imagen) {
        setPhotoUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + data.imagen);
      }
    } else {
      setFormData(initialFormState);
      setPhotoUrl(null); // Resetear la imagen si no hay datos
    }
  }, [data, isOpen]);

  const handleChange = (field: keyof ConsejeroFormData) => (e: any) => {
    const value = e && e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPhotoUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB
      if (file.size > maxSizeInBytes) {
        alert("La imagen excede el tamaño máximo permitido de 50 MB.");
        return;
      }
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);

      if (selectedFile) {
        formData.set("file", selectedFile);
      }

      if (data && data.id) {
        await PortadaService.updateLink(data.id, formData);
      } else {
        await PortadaService.createLink(formData);
      }
      onClose();
      fetchData();
    }
  };

  const handleClose = () => {
    setPhotoUrl(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{data ? "Editar Link" : "Crear Nuevo Link"}</DialogTitle>
          <DialogDescription>
            Complete los campos para {data ? "editar" : "crear"} un Link.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6 pt-2"
        >
          {/* Formulario de información personal */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="nombre" className="w-24">
                  Nombre Entidad<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese nombre"
                  className="flex-1"
                  value={formData.nombre}
                  onChange={handleChange("nombre")}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="link" className="w-24">
                  Link URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="Ingrese link"
                  className="flex-1"
                  value={formData.url}
                  onChange={handleChange("url")}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Label htmlFor="url_imagen" className="w-full">
                Imagen de la entidad
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Esta es la imagen que se mostrará en la página. Tamaño
                recomendado: 50MB, formato: PNG, JPG, GIF.
              </p>
              <div
                className={`w-full max-w-md aspect-square flex flex-col items-center justify-center border-2 ${
                  isDragging ? "border-primary" : "border-dashed"
                } rounded-md p-6 cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {photoUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={photoUrl || "/placeholder.svg"}
                      alt="Fotografía de la persona"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPhotoUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl text-muted-foreground mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                    <p className="text-center text-muted-foreground">
                      Haz clic para seleccionar o arrastra una imagen
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Agregar;
