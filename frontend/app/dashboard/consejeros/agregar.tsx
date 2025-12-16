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
import ConsejeroService from "@/services/ConsejeroService";
import { Search, X, Eye, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PhotoUploadModal } from "../comisiones/[id]/PhotoUploadModal";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormRedes } from "./form-redes";

interface ConsejeroFormData {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  descripcion: string;
  correo: string;
  telefono: string;
  direccion: string;
  cargo: string;
  url_imagen: string;
  estado: string;
  documento?: string;
  activo?: boolean;

  // Alcalde
  entidad: string;
  provincia: string;
  distrito: string;

  // Redes sociales (solo para lectura)
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
  pinterest?: string;
  snapchat?: string;
  kick?: string;
  twitch?: string;
  linkedin?: string;
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
    dni: data?.dni || "",
    nombre: data?.nombre || "",
    apellido: data?.apellido || "",
    descripcion: data?.descripcion || "",
    correo: data?.correo || "",
    telefono: data?.telefono || "",
    direccion: data?.direccion || "",
    estado: data?.activo ? "ACTIVO" : "INACTIVO",
    cargo: data?.cargo || "",
    url_imagen: data?.url_imagen || "",
    documento: data?.documento || "",
    activo: data?.activo || false,

    // Alcalde
    entidad: data?.entidad || "",
    provincia: data?.provincia || "",
    distrito: data?.distrito || "",

    // Redes sociales (solo para lectura)
    facebook: data?.facebook || "",
    instagram: data?.instagram || "",
    twitter: data?.twitter || "",
    youtube: data?.youtube || "",
    tiktok: data?.tiktok || "",
    whatsapp: data?.whatsapp || "",
    telegram: data?.telegram || "",
    pinterest: data?.pinterest || "",
    snapchat: data?.snapchat || "",
    kick: data?.kick || "",
    twitch: data?.twitch || "",
    linkedin: data?.linkedin || "",
  };

  const [formData, setFormData] = useState<ConsejeroFormData>(initialFormState);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isRedesModalOpen, setIsRedesModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (data) {
      console.log("Data recibida completa:", data);
      const formDataToSet = {
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        descripcion: data.descripcion,
        correo: data.correo,
        telefono: data.telefono,
        direccion: data.direccion,
        cargo: data.cargo,
        url_imagen: data.url_imagen,
        estado: data.activo ? "ACTIVO" : "INACTIVO",
        documento: data.documento,
        activo: data.activo,

        // Alcalde
        entidad: data.entidad || "",
        provincia: data.provincia || "",
        distrito: data.distrito || "",

        // Redes sociales (solo para lectura)
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        twitter: data.twitter || "",
        youtube: data.youtube || "",
        tiktok: data.tiktok || "",
        whatsapp: data.whatsapp || "",
        telegram: data.telegram || "",
        pinterest: data.pinterest || "",
        snapchat: data.snapchat || "",
        kick: data.kick || "",
        twitch: data.twitch || "",
        linkedin: data.linkedin || "",
      };
      console.log("FormData a establecer:", formDataToSet);
      setFormData(formDataToSet);

      if (data.url_imagen) {
        setPhotoUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + data.url_imagen);
      }

      if (data.documento) {
        console.log("Documento encontrado:", data.documento);
        const fileName = data.documento.split("/").pop() || "";
        console.log("Nombre del archivo extraído:", fileName);
        setDocumentName(fileName);
      }
    } else {
      setFormData(initialFormState);
      setPhotoUrl(null);
      setDocumentName("");
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Documento seleccionado:", file);
      console.log("Tipo de documento:", file.type);
      console.log("Tamaño del documento:", file.size);

      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (file.size > maxSizeInBytes) {
        alert("El documento excede el tamaño máximo permitido de 10 MB.");
        return;
      }

      if (file.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF.");
        return;
      }

      setSelectedDocument(file);
      setDocumentName(file.name);
      console.log("Documento guardado en estado:", file.name);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);

      console.log("Datos del formulario antes de enviar:");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      if (selectedFile) {
        formData.set("file", selectedFile);
        console.log("Imagen adjuntada:", selectedFile.name);
      }

      if (selectedDocument) {
        formData.set("documento", selectedDocument);
        console.log("Documento adjuntado:", selectedDocument.name);
      }

      try {
        if (data && data.id) {
          console.log("Actualizando consejero ID:", data.id);
          await ConsejeroService.updateConsejero(data.id, formData);
        } else {
          console.log("Creando nuevo consejero");
          await ConsejeroService.createConsejero(formData);
        }
        onClose();
        fetchData();
      } catch (error) {
        console.error("Error al guardar:", error);
      }
    }
  };

  const handleClose = () => {
    setPhotoUrl(null);
    setSelectedFile(null);
    setSelectedDocument(null);
    setDocumentName("");
    setIsRedesModalOpen(false);
    onClose();
  };

  const getDisplayFileName = (fileName: string) => {
    if (!fileName) return "";
    const name = fileName.split("/").pop() || fileName;
    if (name.length <= 10) return name;
    const extension = name.split(".").pop();
    return `${name.substring(0, 7)}...${extension}`;
  };

  const handleViewDocument = () => {
    if (selectedDocument) {
      // Si hay un documento seleccionado pero aún no subido, crear URL temporal
      const url = URL.createObjectURL(selectedDocument);
      window.open(url, "_blank");
      // Limpiar la URL temporal después de abrir
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else if (formData.documento && process.env.NEXT_PUBLIC_STORAGE_BASE_URL) {
      // Si es un documento ya guardado en el servidor
      const url = process.env.NEXT_PUBLIC_STORAGE_BASE_URL + formData.documento;
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>
              {data ? "Editar Consejero" : "Crear Nuevo Consejero"}
            </DialogTitle>
            <DialogDescription>
              Complete los campos para {data ? "editar" : "crear"} un Consejero.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <form
              id="consejero-form"
              ref={formRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-2"
            >
              {/* Formulario de información personal */}
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="cargo" className="w-full sm:w-24">
                      Cargo <span className="text-red-500">*</span>
                    </Label>

                    {/* seleccionar cargo */}
                    <div className="flex-1 w-full">
                      <Select
                        name="cargo"
                        value={formData.cargo}
                        onValueChange={handleChange("cargo")}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GOBERNACION">GOBERNACION</SelectItem>
                          <SelectItem value="VICEGOBERNACION">VICEGOBERNACION</SelectItem>
                          <SelectItem value="GERENTEREGIONAL">GERENTE REGIONAL</SelectItem>
                          <SelectItem value="DIRECTOREGIONAL">DIRECTO REGIONAL</SelectItem>
                          <SelectItem value="ALCALDE">ALCALDE</SelectItem>
                          <SelectItem value="CONSEJERO">CONSEJERO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Campos solo si el cargo es ALCALDE */}
                  {formData.cargo === "ALCALDE" && (
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Label htmlFor="entidad" className="w-full sm:w-24">
                          Entidad <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="entidad"
                          name="entidad"
                          placeholder="Ingrese entidad"
                          className="flex-1 w-full"
                          value={formData.entidad || ""}
                          onChange={handleChange("entidad" as keyof ConsejeroFormData)}
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Label htmlFor="provincia" className="w-full sm:w-24">
                          Provincia <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="provincia"
                          name="provincia"
                          placeholder="Ingrese provincia"
                          className="flex-1 w-full"
                          value={formData.provincia || ""}
                          onChange={handleChange("provincia" as keyof ConsejeroFormData)}
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Label htmlFor="distrito" className="w-full sm:w-24">
                          Distrito <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="distrito"
                          name="distrito"
                          placeholder="Ingrese distrito"
                          className="flex-1 w-full"
                          value={formData.distrito || ""}
                          onChange={handleChange("distrito" as keyof ConsejeroFormData)}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="dni" className="w-full sm:w-24">
                      DNI <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex-1 w-full flex gap-2">
                      <Input
                        id="dni"
                        name="dni"
                        placeholder="Ingrese DNI"
                        className="flex-1"
                        required
                        value={formData.dni}
                        onChange={handleChange("dni")}
                        pattern="[0-9]{8}"
                        maxLength={8}
                        inputMode="numeric"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="nombre" className="w-full sm:w-24">
                      Nombres <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Ingrese nombres"
                      className="flex-1 w-full"
                      value={formData.nombre}
                      onChange={handleChange("nombre")}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="apellido" className="w-full sm:w-24">
                      Apellidos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      placeholder="Ingrese apellidos"
                      className="flex-1 w-full"
                      value={formData.apellido}
                      onChange={handleChange("apellido")}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="descripcion" className="w-full sm:w-24">
                      Descripcion <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Ingrese descripción"
                      className="flex-1 w-full"
                      value={formData.descripcion}
                      onChange={handleChange("descripcion")}
                      required
                      maxLength={250}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="correo" className="w-full sm:w-24">
                      Correo
                    </Label>
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      placeholder="Ingrese correo"
                      className="flex-1 w-full"
                      value={formData.correo}
                      onChange={handleChange("correo")}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="telefono" className="w-full sm:w-24">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="Ingrese teléfono"
                      className="flex-1 w-full"
                      value={formData.telefono}
                      onChange={handleChange("telefono")}
                      pattern="[0-9]{9}"
                      maxLength={9}
                      inputMode="numeric"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="direccion" className="w-full sm:w-24">
                      Dirección
                    </Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      placeholder="Ingrese dirección"
                      className="flex-1 w-full"
                      value={formData.direccion}
                      onChange={handleChange("direccion")}
                    />
                  </div>


                  {/* Campo para subir documento PDF */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Label htmlFor="documento" className="w-full sm:w-24">
                      Documento
                    </Label>
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-10 px-3 flex items-center gap-2"
                            onClick={() => documentInputRef.current?.click()}
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {documentName
                                ? getDisplayFileName(documentName)
                                : "Seleccionar documento PDF"}
                            </span>
                          </Button>
                          <input
                            type="file"
                            id="documento"
                            name="documento"
                            ref={documentInputRef}
                            onChange={handleDocumentChange}
                            accept=".pdf"
                            className="hidden"
                          />
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {(selectedDocument || formData.documento) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={handleViewDocument}
                              title="Ver documento"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {(documentName || formData.documento) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => {
                                setSelectedDocument(null);
                                setDocumentName("");
                                setFormData((prev) => ({
                                  ...prev,
                                  documento: "",
                                }));
                                if (documentInputRef.current) {
                                  documentInputRef.current.value = "";
                                }
                              }}
                              title="Eliminar documento"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Máximo 10MB, solo archivos PDF
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previsualización de la foto */}
              <div className="flex flex-col items-center justify-center">
                <Label htmlFor="url_imagen" className="w-full">
                  Fotografia de consejero
                  <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Esta es la fotografía que se mostrará en la página. Tamaño
                  recomendado: 500x500 píxeles.
                </p>
                <div
                  className={`w-full max-w-md aspect-square flex flex-col items-center justify-center border-2 ${isDragging ? "border-primary" : "border-dashed"
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

              {/* Botón para editar redes sociales */}
              {data && data.id && (
                <div className="lg:col-span-2 border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Redes Sociales</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsRedesModalOpen(true)}
                    >
                      Editar Redes Sociales
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Haz clic en "Editar Redes Sociales" para gestionar las redes sociales del consejero.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Footer con botones */}
          <DialogFooter className="p-6 border-t bg-background">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" form="consejero-form">
              Guardar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

      {/* Modal de Redes Sociales */}
      <FormRedes
        isOpen={isRedesModalOpen}
        onClose={() => setIsRedesModalOpen(false)}
        consejeroId={data?.id}
        redesActuales={{
          facebook: data?.facebook,
          instagram: data?.instagram,
          twitter: data?.twitter,
          youtube: data?.youtube,
          tiktok: data?.tiktok,
          whatsapp: data?.whatsapp,
          telegram: data?.telegram,
          pinterest: data?.pinterest,
          snapchat: data?.snapchat,
          kick: data?.kick,
          twitch: data?.twitch,
          linkedin: data?.linkedin,
        }}
        onUpdate={fetchData}
      />
    </Dialog>
  );
}

export default Agregar;
