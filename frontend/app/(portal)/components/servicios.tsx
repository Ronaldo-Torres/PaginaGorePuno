"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Upload,
  CheckCircle,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import PrincipalService from "@/services/PrincipalService";

// Types improve code readability and maintainability
interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  icono: string;
  url: string | null;
}

type FormData = {
  email: string;
  phone: string;
  message: string;
  image: File | null;
};

interface FormErrors {
  email?: string;
  phone?: string;
  message?: string;
  image?: string;
}

const INITIAL_FORM_DATA: FormData = {
  email: "",
  phone: "",
  message: "",
  image: null,
};

const INITIAL_FORM_ERRORS: FormErrors = {};

export default function Servicios({
  servicios = [],
  tituloServicio,
  descripcionServicio,
}: {
  servicios?: Servicio[];
  tituloServicio: string;
  descripcionServicio: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>(INITIAL_FORM_ERRORS);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de teléfono
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  // Validación de imagen
  const validateImage = (file: File | null): boolean => {
    if (!file) return true;
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  // Improved Dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        const file = acceptedFiles[0];
        if (validateImage(file)) {
          setFormData((prev) => ({ ...prev, image: file }));
          setFormErrors((prev) => ({ ...prev, image: undefined }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            image: "La imagen debe ser JPG, PNG o GIF y no exceder 5MB",
          }));
        }
      }
    }, []),
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB max size
  });

  // Handle service click with proper type checking
  const handleServiceClick = useCallback((service: Servicio) => {
    if (service.id === 7) {
      setSelectedService(service);
      setIsModalOpen(true);
    } else if (service.url) {
      // Verificar si la URL comienza con http:// o https://
      if (
        service.url.startsWith("http://") ||
        service.url.startsWith("https://")
      ) {
        window.open(service.url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = service.url;
      }
    }
  }, []);

  // Close modal handler
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_FORM_ERRORS);
    setAcceptedTerms(false);
  }, []);

  // Form submission handler with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    // Validación de email
    if (!formData.email) {
      errors.email = "El correo electrónico es requerido";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Ingrese un correo electrónico válido";
    }

    // Validación de teléfono
    if (!formData.phone) {
      errors.phone = "El teléfono es requerido";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Ingrese un número de teléfono válido";
    }

    // Validación de mensaje
    if (!formData.message) {
      errors.message = "El mensaje es requerido";
    } else if (formData.message.length < 10) {
      errors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    // Validación de imagen
    if (formData.image && !validateImage(formData.image)) {
      errors.image = "La imagen debe ser JPG, PNG o GIF y no exceder 5MB";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores indicados.",
        variant: "destructive",
      });
      return;
    }

    setFormSubmitted(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telefono", formData.phone);
      formDataToSend.append("descripcion", formData.message);
      if (formData.image) {
        formDataToSend.append("file", formData.image);
      }

      await PrincipalService.createAtencion(formDataToSend);

      toast({
        title: "Consulta enviada",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un problema al enviar tu consulta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setFormSubmitted(false);
    }
  };

  // Extract image URL helper
  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/placeholder.svg?height=60&width=60";
    return `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${path}`;
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-16 relative">
      <div className="w-11/12 md:w-4/5 mx-auto px-4">

        {/* Professional section header */}
        <div className="text-center mb-16 servicios-header">
          <h2 className="text-2xl md:text-3xl font-bold text-[#063585] mb-6 tracking-wide servicios-title">
            {tituloServicio || ""}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
            <div className="w-2 h-2 bg-[#063585] rounded-full"></div>
            <div className="w-16 h-0.5 bg-[#063585] rounded-full"></div>
          </div>

          {/* <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed servicios-subtitle">
            {descripcionServicio || ""}
          </p> */}
        </div>

        {servicios.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[250px] text-center servicios-empty">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg text-slate-500 font-medium">
              No hay servicios disponibles en este momento.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Estamos trabajando para ofrecerte los mejores servicios
            </p>
          </div>
        ) : (
          // Flex de servicios centrado y responsivo
          <div className="servicios-grid flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {servicios.map((service, index) => (
              <div
                key={`service-${service.id}`}
                onClick={() => handleServiceClick(service)}
                className="servicio-card-modern group flex flex-col items-center p-6 bg-white cursor-pointer min-h-[240px] relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-[#063585]/20 w-[200px] flex-shrink-0"
                aria-label={`Servicio: ${service.nombre}`}
              >
                {/* Top accent line */}
                <div className="servicio-accent absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#063585] to-[#0a4a9a] rounded-t-xl"></div>

                {/* Service icon */}
                <div className="servicio-icon-container relative mb-4 z-10">
                  <div className="servicio-icon-wrapper relative w-16 h-16 bg-gradient-to-br from-[#063585]/5 to-[#063585]/10 rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={getImageUrl(service.imagen) || "/placeholder.svg"}
                      alt={service.nombre || "Servicio"}
                      width={32}
                      height={32}
                      className="servicio-icon object-contain"
                    />
                  </div>
                </div>

                {/* Service title */}
                <h3 className="servicio-title text-lg font-semibold text-slate-800 text-center mb-3 line-clamp-2 group-hover:text-[#063585] transition-colors duration-300">
                  {service.nombre || `Servicio sin nombre`}
                </h3>

                {/* Divider */}
                <div className="servicio-divider-line h-px w-12 bg-gradient-to-r from-transparent via-[#063585] to-transparent mb-3"></div>

                {/* Service description */}
                <p className="servicio-description text-center text-sm text-slate-600 line-clamp-3 leading-relaxed flex-grow">
                  {service.descripcion || "Descripción no disponible"}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Professional Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-lg border shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,1.2fr]">
            {/* Left side with image */}
            <div className="relative hidden md:block overflow-hidden bg-slate-100">
              <div className="h-full relative">
                {selectedService?.imagen && (
                  <Image
                    src={getImageUrl(selectedService.imagen)}
                    alt={selectedService.nombre}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#063585]/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedService?.nombre || "Atención al Cliente"}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {selectedService?.descripcion ||
                      "Estamos aquí para ayudarte con cualquier consulta"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side with form */}
            <div className="p-6 md:p-8 bg-white">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">
                  Denuncia ciudadana
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  Complete el formulario y nos pondremos en contacto con usted a
                  la brevedad.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <Mail className="h-4 w-4 text-[#063585]" />
                    Correo electrónico <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full rounded-lg border-slate-200 focus:border-[#063585] focus:ring-[#063585]/20 transition-all duration-300 ${formErrors.email ? "border-red-500" : ""
                      }`}
                    aria-required="true"
                    aria-invalid={!!formErrors.email}
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <Phone className="h-4 w-4 text-[#063585]" />
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+51 999 999 999"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      setFormErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full rounded-lg border-slate-200 focus:border-[#063585] focus:ring-[#063585]/20 transition-all duration-300 ${formErrors.phone ? "border-red-500" : ""
                      }`}
                    aria-required="true"
                    aria-invalid={!!formErrors.phone}
                    aria-describedby={
                      formErrors.phone ? "phone-error" : undefined
                    }
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="image"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <Upload className="h-4 w-4 text-[#063585]" />
                    Adjuntar imagen (opcional)
                  </Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${formErrors.image
                        ? "border-red-500 bg-red-50/50"
                        : "border-slate-200 hover:border-[#063585]/50 bg-slate-50/50 hover:bg-blue-50/50"
                      }`}
                  >
                    <input {...getInputProps()} aria-label="Subir imagen" />
                    {isDragActive ? (
                      <p className="text-[#063585] font-medium">
                        Suelta la imagen aquí ...
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-slate-600 text-sm">
                          Arrastra y suelta una imagen aquí, o haz clic para
                          seleccionar
                        </p>
                      </div>
                    )}
                    {formData.image && (
                      <div className="mt-3">
                        <div className="relative w-20 h-20 mx-auto rounded-lg overflow-hidden border border-slate-200">
                          <Image
                            src={
                              URL.createObjectURL(formData.image) ||
                              "/placeholder.svg"
                            }
                            alt="Vista previa"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-1 truncate">
                          {formData.image.name}
                        </p>
                      </div>
                    )}
                  </div>
                  {formErrors.image && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.image}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <MessageSquare className="h-4 w-4 text-[#063585]" />
                    Mensaje <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Detalle de la queja o sugerencia"
                    required
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        message: undefined,
                      }));
                    }}
                    className={`w-full min-h-[100px] rounded-lg border-slate-200 focus:border-[#063585] focus:ring-[#063585]/20 transition-all duration-300 resize-none ${formErrors.message ? "border-red-500" : ""
                      }`}
                    aria-required="true"
                    aria-invalid={!!formErrors.message}
                    aria-describedby={
                      formErrors.message ? "message-error" : undefined
                    }
                  />
                  {formErrors.message && (
                    <p id="message-error" className="text-sm text-red-500 mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="updates"
                      className="h-4 w-4 rounded border-slate-300 text-[#063585] focus:ring-[#063585]/20"
                    />
                  </div>
                  <Label htmlFor="updates" className="text-sm text-slate-600">
                    Deseo recibir actualizaciones por correo electrónico
                  </Label>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="submit"
                    disabled={formSubmitted}
                    className="w-full bg-[#063585] hover:bg-[#0a4a9a] text-white py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formSubmitted ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                        <span>Enviar consulta</span>
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
