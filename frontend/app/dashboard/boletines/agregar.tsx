"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FileText, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import BoletinService, { Boletines } from "@/services/BoletinService";
import ViewerWrapper from "@/app/(portal)/components/view-pdf";
import { useToast } from "@/components/ui/use-toast";

interface BoletinFormData extends Boletines {
  activo: boolean;
  url: string;
  fechaPublicacion: Date;
  categoria: string;
  titulo: string;
  contenido: string;
  urlDocumento: string;
  estado: string;
  imagen: string;
}

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateData?: (newData: BoletinFormData) => void;
  data?: Boletines | null;
  fetchData: () => void;
}

const Agregar = ({ isOpen, onClose, data, fetchData }: AgregarProps) => {
  const [formData, setFormData] = useState<BoletinFormData>({
    titulo: data?.titulo || "",
    contenido: data?.contenido || "",
    categoria: data?.categoria || "",
    url: data?.url || "",
    activo: data?.activo ?? false,
    fechaPublicacion: data?.fechaPublicacion
      ? new Date(data.fechaPublicacion)
      : new Date(),
    urlDocumento: data?.urlDocumento || "",
    estado: data?.estado || "ACTIVO",
    imagen: data?.imagen || "",
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setFormData({
        titulo: data.titulo,
        contenido: data.contenido,
        categoria: data.categoria,
        activo: data.activo,
        fechaPublicacion: new Date(data.fechaPublicacion),
        url: data.url,
        urlDocumento: data.urlDocumento,
        estado: data.estado,
        imagen: data.imagen,
      });
      if (data.urlDocumento) {
        setPhotoUrl(
          process.env.NEXT_PUBLIC_STORAGE_BASE_URL + data.urlDocumento
        );
      }
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        categoria: "",
        url: "",
        activo: false,
        fechaPublicacion: new Date(),
        urlDocumento: "",
        estado: "ACTIVO",
        imagen: "",
      });
      setPhotoUrl(null);
    }
  }, [data, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setPhotoUrl(URL.createObjectURL(file));
        setShowPreview(true);
      } else {
        toast({
          title: "Formato no válido",
          description: "Por favor, selecciona un archivo PDF.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e);
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
      handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleInputChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "fechaPublicacion"
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      if (selectedFile) {
        formData.set("file", selectedFile);
      }

      try {
        if (data && data.id) {
          await BoletinService.updateBoletin(data.id, formData);
        } else {
          await BoletinService.createBoletin(formData);
        }
        onClose();
        fetchData();
      } catch (error) {
        console.error("Error al guardar el boletín:", error);
      }
    }
  };

  const handleClose = () => {
    setPhotoUrl(null);
    setSelectedFile(null);
    setShowPreview(false);
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPhotoUrl(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  console.log(formData.fechaPublicacion);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] rounded-lg h-[90vh] sm:h-[90vh] overflow-y-auto mx-4 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {data ? "Editar Boletín" : "Crear Nuevo Boletín"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data ? "editar" : "crear"} un Boletín.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="flex flex-col sm:grid sm:grid-cols-2 gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChangeForm}
                placeholder="Ej. Boletín de la Semana"
                maxLength={250}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaPublicacion">
                Fecha Publicación <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fechaPublicacion"
                name="fechaPublicacion"
                value={formData.fechaPublicacion.toISOString().split("T")[0]}
                onChange={handleInputChangeForm}
                placeholder="Ej. 2025-01-01"
                maxLength={250}
                required
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChangeForm}
                placeholder="Ej. Noticias, Eventos, Anuncios"
                maxLength={250}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea
                id="contenido"
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChangeForm}
                placeholder="Ingrese el contenido del boletín"
                className="min-h-[120px]"
                maxLength={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL Contenido</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChangeForm}
                placeholder="https://ejemplo.com/documento"
                maxLength={250}
              />
              <p className="text-sm text-muted-foreground">
                URL opcional para contenido externo relacionado
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="activo"
                name="activo"
                checked={formData.activo}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    activo: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="activo">Activo</Label>
              <p className="text-sm text-muted-foreground">
                Marque esta casilla para publicar el boletín inmediatamente
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden flex flex-col h-[50vh] sm:h-[70vh]">
              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Documento PDF</h3>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Seleccionar PDF</span>
                  </Button>

                  {(selectedFile || photoUrl) && (
                    <div className="flex items-center gap-2 border rounded-md p-2 flex-1">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm truncate flex items-center gap-2">
                          {selectedFile
                            ? selectedFile.name
                            : "Archivo PDF subido"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Documento PDF
                          </span>
                          {!selectedFile && photoUrl && (
                            <a
                              href={photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              Descargar
                            </a>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={handleRemoveFile}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {photoUrl ? (
                  <div className="h-full">
                    <ViewerWrapper fileUrl={photoUrl} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No hay documento PDF</p>
                    <p className="text-sm text-center mt-2">
                      Selecciona un archivo PDF para previsualizarlo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">{data ? "Actualizar" : "Guardar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Agregar;
