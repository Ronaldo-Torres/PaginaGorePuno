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
import { Textarea } from "@/components/ui/textarea";
import AtencionService from "@/services/AtencionService";
import { X } from "lucide-react";

interface ConsejeroFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  email: string;
  imagen: string;
  estado: string;
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
    id: data?.id || undefined,
    nombre: data?.nombre || "",
    descripcion: data?.descripcion || "",
    telefono: data?.telefono || "",
    email: data?.email || "",
    imagen: data?.imagen || "",
    estado: data?.estado || "",
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
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        telefono: data.telefono,
        email: data.email,
        imagen: data.imagen,
        estado: data.estado,
      });
      if (data.imagen) {
        setPhotoUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + data.imagen);
      }
    } else {
      setFormData(initialFormState);
      setPhotoUrl(null);
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
      const formDataToSend = new FormData(formRef.current);

      if (selectedFile) {
        formDataToSend.set("file", selectedFile);
      }

      try {
        if (data && data.id) {
          await AtencionService.updateAtencion(data.id, formDataToSend);
        } else {
          await AtencionService.createAtencion(formDataToSend);
        }
        onClose();
        fetchData();
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
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
          <DialogTitle>
            {data ? "Editar Atencion" : "Crear Nuevo Atencion"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data ? "editar" : "crear"} un Atencion.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-2"
        >
          {/* Formulario de información */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
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

              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="descripcion">
                  Descripcion <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ingrese descripcion"
                  className="flex-1"
                  value={formData.descripcion}
                  onChange={handleChange("descripcion")}
                  required
                  maxLength={1000}
                />
              </div>

              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Ingrese telefono"
                  className="flex-1"
                  value={formData.telefono}
                  onChange={handleChange("telefono")}
                  type="text"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Ingrese email"
                  className="flex-1"
                  value={formData.email}
                  onChange={handleChange("email")}
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Previsualización de la foto */}
          <div className="flex flex-col items-center justify-center">
            <Label htmlFor="imagen" className="w-full">
              Imagen de la atención
              <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Esta es la imagen que se mostrará en la página. Tamaño
              recomendado: 500x500 píxeles.
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
                    alt="Imagen de la atención"
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
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                  <p className="text-center text-muted-foreground">
                    Haz clic para seleccionar o arrastra una imagen
                  </p>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    PNG, JPG, GIF hasta 50MB
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
