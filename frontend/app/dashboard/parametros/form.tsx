"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./image-uploader";
import { toast } from "@/components/ui/use-toast";
import ParametroService from "@/services/ParametroService";
import { ProgressDemo } from "./ProgressDemo";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok, 
  FaWhatsapp, 
  FaTelegram, 
  FaPinterest, 
  FaSnapchat, 
  FaTwitch, 
  FaLinkedin,
  FaLink
} from "react-icons/fa";
import { Label } from "@/components/ui/label";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface NewImageData {
  id: string;
  file: File;
  preview: string;
}

const formSchema = z.object({
  nombreInstitucion: z.string().optional(),
  descripcion: z.string().optional(),
  direccionInstitucion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
  logoInstitucionLight: z
    .any()
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      `El tamaño máximo del archivo es 50MB.`
    )
    .optional(),
  logoInstitucionDark: z
    .any()
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      `El tamaño máximo del archivo es 50MB.`
    )
    .optional(),
  mision: z.string().optional(),
  vision: z.string().optional(),
  objetivos: z.string().optional(),
  valores: z.string().optional(),
  historia: z.string().optional(),
  mapaInstitucion: z.string().optional(),
  nosotros: z.string().optional(),
  telefonoInstitucion: z.string().optional(),
  telefonoInstitucion2: z.string().optional(),
  correoInstitucion: z.string().optional(),
  encargadoTransparencia: z.string().optional(),
  cargoEncargadoTransparencia: z.string().optional(),
  numeroResolucionTransparencia: z.string().optional(),
  encargadoTransparenciaSecundario: z.string().optional(),
  cargoEncargadoTransparenciaSecundario: z.string().optional(),
  numeroResolucionTransparenciaSecundario: z.string().optional(),
  mesaPartesUrl: z.string().optional(),
  consultaTramiteUrl: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  pinterest: z.string().optional(),
  snapchat: z.string().optional(),
  kick: z.string().optional(),
  twitch: z.string().optional(),
  linkedin: z.string().optional(),
  tituloPresidencia: z.string().optional(),
  descripcionPresidencia: z.string().optional(),
  tituloServicio: z.string().optional(),
  descripcionServicio: z.string().optional(),
  tituloAgenda: z.string().optional(),
  descripcionAgenda: z.string().optional(),
  tituloNoticias: z.string().optional(),
  descripcionNoticias: z.string().optional(),
  tituloBoletin: z.string().optional(),
  descripcionBoletin: z.string().optional(),
  tituloDocumentos: z.string().optional(),
  descripcionDocumentos: z.string().optional(),
  tituloEnlaces: z.string().optional(),
  descripcionEnlaces: z.string().optional(),
  tituloVideo: z.string().optional(),
  descripcionVideo: z.string().optional(),
});

export function ConfigForm() {
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [parametro, setParametro] = useState<{
    logoInstitucionLight: File | null;
    logoInstitucionDark: File | null;
    nombreInstitucion: string;
    descripcion?: string | null;
    direccionInstitucion?: string | null;
    telefono?: string | null;
    email?: string | null;
    mision?: string | null;
    vision?: string | null;
    objetivos?: string | null;
    valores?: string | null;
    historia?: string | null;
    mapaInstitucion?: string | null;
    nosotros?: string | null;
    telefonoInstitucion?: string | null;
    telefonoInstitucion2?: string | null;
    correoInstitucion?: string | null;
    encargadoTransparencia?: string | null;
    cargoEncargadoTransparencia?: string | null;
    numeroResolucionTransparencia?: string | null;
    encargadoTransparenciaSecundario?: string | null;
    cargoEncargadoTransparenciaSecundario?: string | null;
    numeroResolucionTransparenciaSecundario?: string | null;
    mesaPartesUrl?: string | null;
    consultaTramiteUrl?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    tiktok?: string | null;
    whatsapp?: string | null;
    telegram?: string | null;
    pinterest?: string | null;
    snapchat?: string | null;
    kick?: string | null;
    twitch?: string | null;
    linkedin?: string | null;
    tituloPresidencia?: string | null;
    descripcionPresidencia?: string | null;
    tituloServicio?: string | null;
    descripcionServicio?: string | null;
    tituloAgenda?: string | null;
    descripcionAgenda?: string | null;
    tituloNoticias?: string | null;
    descripcionNoticias?: string | null;
    tituloBoletin?: string | null;
    descripcionBoletin?: string | null;
    tituloDocumentos?: string | null;
    descripcionDocumentos?: string | null;
    tituloEnlaces?: string | null;
    descripcionEnlaces?: string | null;
    tituloVideo?: string | null;
    descripcionVideo?: string | null;
  }>({
    logoInstitucionLight: null,
    logoInstitucionDark: null,
    nombreInstitucion: "",
    descripcion: null,
    direccionInstitucion: null,
    telefono: null,
    email: null,
    mision: null,
    vision: null,
    objetivos: null,
    valores: null,
    historia: null,
    mapaInstitucion: null,
    nosotros: null,
    telefonoInstitucion: null,
    telefonoInstitucion2: null,
    correoInstitucion: null,
    encargadoTransparencia: null,
    cargoEncargadoTransparencia: null,
    numeroResolucionTransparencia: null,
    encargadoTransparenciaSecundario: null,
    cargoEncargadoTransparenciaSecundario: null,
    numeroResolucionTransparenciaSecundario: null,
    mesaPartesUrl: null,
    consultaTramiteUrl: null,
    facebook: null,
    instagram: null,
    twitter: null,
    youtube: null,
    tiktok: null,
    whatsapp: null,
    telegram: null,
    pinterest: null,
    snapchat: null,
    kick: null,
    twitch: null,
    linkedin: null,
    tituloPresidencia: null,
    descripcionPresidencia: null,
    tituloServicio: null,
    descripcionServicio: null,
    tituloAgenda: null,
    descripcionAgenda: null,
    tituloNoticias: null,
    descripcionNoticias: null,
    tituloBoletin: null,
    descripcionBoletin: null,
    tituloDocumentos: null,
    descripcionDocumentos: null,
    tituloEnlaces: null,
    descripcionEnlaces: null,
    tituloVideo: null,
    descripcionVideo: null,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreInstitucion: parametro?.nombreInstitucion || "",
      descripcion: parametro?.descripcion || "",
      direccionInstitucion: parametro?.direccionInstitucion || "",
      telefono: parametro?.telefono || "",
      email: parametro?.email || "",
      mision: parametro?.mision || "",
      vision: parametro?.vision || "",
      objetivos: parametro?.objetivos || "",
      valores: parametro?.valores || "",
      historia: parametro?.historia || "",
      mapaInstitucion: parametro?.mapaInstitucion || "",
      telefonoInstitucion: parametro?.telefonoInstitucion || "",
      telefonoInstitucion2: parametro?.telefonoInstitucion2 || "",
      correoInstitucion: parametro?.correoInstitucion || "",
      nosotros: parametro?.nosotros || "",
      encargadoTransparencia: parametro?.encargadoTransparencia || "",
      cargoEncargadoTransparencia: parametro?.cargoEncargadoTransparencia || "",
      numeroResolucionTransparencia:
        parametro?.numeroResolucionTransparencia || "",
      encargadoTransparenciaSecundario:
        parametro?.encargadoTransparenciaSecundario || "",
      cargoEncargadoTransparenciaSecundario:
        parametro?.cargoEncargadoTransparenciaSecundario || "",
      numeroResolucionTransparenciaSecundario:
        parametro?.numeroResolucionTransparenciaSecundario || "",
      mesaPartesUrl: parametro?.mesaPartesUrl || "",
      consultaTramiteUrl: parametro?.consultaTramiteUrl || "",
      facebook: parametro?.facebook || "",
      instagram: parametro?.instagram || "",
      twitter: parametro?.twitter || "",
      youtube: parametro?.youtube || "",
      tiktok: parametro?.tiktok || "",
      whatsapp: parametro?.whatsapp || "",
      telegram: parametro?.telegram || "",
      pinterest: parametro?.pinterest || "",
      snapchat: parametro?.snapchat || "",
      kick: parametro?.kick || "",
      twitch: parametro?.twitch || "",
      linkedin: parametro?.linkedin || "",
      tituloPresidencia: parametro?.tituloPresidencia || "",
      descripcionPresidencia: parametro?.descripcionPresidencia || "",
      tituloServicio: parametro?.tituloServicio || "",
      descripcionServicio: parametro?.descripcionServicio || "",
      tituloAgenda: parametro?.tituloAgenda || "",
      descripcionAgenda: parametro?.descripcionAgenda || "",
      tituloNoticias: parametro?.tituloNoticias || "",
      descripcionNoticias: parametro?.descripcionNoticias || "",
      tituloBoletin: parametro?.tituloBoletin || "",
      descripcionBoletin: parametro?.descripcionBoletin || "",
      tituloDocumentos: parametro?.tituloDocumentos || "",
      descripcionDocumentos: parametro?.descripcionDocumentos || "",
      tituloEnlaces: parametro?.tituloEnlaces || "",
      descripcionEnlaces: parametro?.descripcionEnlaces || "",
      tituloVideo: parametro?.tituloVideo || "",
      descripcionVideo: parametro?.descripcionVideo || "",
    },
  });

  const getParametros = async () => {
    setGlobalLoading(true);
    setLoading(true);
    const id = 1; // Cambia esto si necesitas otro ID
    try {
      const response = await ParametroService.getParametro(id);
      console.log(response);
      setParametro(response);

      // Establecer las URLs de las imágenes para la previsualización
      if (response.logoInstitucionLight) {
        setLogoLightPreview(
          process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
            response.logoInstitucionLight
        ); // Asumiendo que esta es la URL
      }
      if (response.logoInstitucionDark) {
        setLogoDarkPreview(
          process.env.NEXT_PUBLIC_STORAGE_BASE_URL +
            response.logoInstitucionDark
        ); // Asumiendo que esta es la URL
      }

      form.reset(response); // Establece los valores en el formulario
    } catch (error) {
      console.error("Error al obtener parámetros:", error);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getParametros();
    };

    fetchData();
  }, []); // Added getParametros to the dependency array

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setGlobalLoading(true);
    const formData = new FormData();

    console.log("=== DATOS DEL FORMULARIO ===");
    console.log("Valores completos:", values);

    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== "logoInstitucionLight" &&
        key !== "logoInstitucionDark"
      ) {
        formData.append(key, value);
        console.log(`Agregando al FormData: ${key} = ${value}`); // Added logging
      }
    });

    if (values.logoInstitucionLight) {
      formData.append("file1", values.logoInstitucionLight);
      console.log("Agregando archivo light:", values.logoInstitucionLight.name); // Added logging
    }
    if (values.logoInstitucionDark) {
      formData.append("file2", values.logoInstitucionDark);
      console.log("Agregando archivo dark:", values.logoInstitucionDark.name); // Added logging
    }

    console.log("=== FORM DATA ENVIADO ==="); // Added logging
    for (let [key, value] of formData.entries()) { // Added logging
      console.log(`${key}: ${value}`); // Added logging
    }

    try {
      const response = await ParametroService.updateParametro(1, formData);
      console.log("Respuesta del servidor:", response); // Added logging
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente.",
      });
    } catch (error) {
      console.error("Error al enviar datos:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleFileChange = (file: File | null, mode: "light" | "dark") => {
    if (file) {
      form.setValue(
        mode === "light" ? "logoInstitucionLight" : "logoInstitucionDark",
        file
      );
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mode === "light") {
          setLogoLightPreview(reader.result as string);
        } else {
          setLogoDarkPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <FaFacebook className="h-6 w-6 text-blue-600" />;
      case 'instagram': return <FaInstagram className="h-6 w-6 text-pink-500" />;
      case 'twitter': return <FaTwitter className="h-6 w-6 text-blue-400" />;
      case 'youtube': return <FaYoutube className="h-6 w-6 text-red-600" />;
      case 'tiktok': return <FaTiktok className="h-6 w-6 text-black" />;
      case 'whatsapp': return <FaWhatsapp className="h-6 w-6 text-green-500" />;
      case 'telegram': return <FaTelegram className="h-6 w-6 text-blue-500" />;
      case 'pinterest': return <FaPinterest className="h-6 w-6 text-red-500" />;
      case 'snapchat': return <FaSnapchat className="h-6 w-6 text-yellow-400" />;
      case 'twitch': return <FaTwitch className="h-6 w-6 text-purple-600" />;
      case 'linkedin': return <FaLinkedin className="h-6 w-6 text-blue-700" />;
      case 'kick': return <FaLink className="h-6 w-6 text-gray-600" />;
      default: return <FaLink className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <>
      {globalLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <ProgressDemo />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full px-4 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Columna 1: Información General */}
            <Card className="w-full col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombreInstitucion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Institución</FormLabel>
                        <FormControl>
                          <Input placeholder="Mi Institución" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="direccionInstitucion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Calle Principal 123, Ciudad"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="telefonoInstitucion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefonoInstitucion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono Secundario</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="correoInstitucion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="correo@institucion.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mapaInstitucion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación en Google Maps</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://maps.app.goo.gl/..."
                          {...field}
                          maxLength={1000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mesaPartesUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesa de Partes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.mesa-partes.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultaTramiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consulta de Tramites</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.consulta-tramites.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nosotros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nosotros</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nosotros"
                          {...field}
                          maxLength={1000}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Columna 2: Logos */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Logos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoInstitucionLight"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Logo para modo claro</FormLabel>
                      <FormControl>
                        <ImageUploader
                          onFileSelected={(file) =>
                            handleFileChange(file, "light")
                          }
                          preview={logoLightPreview}
                        />
                      </FormControl>
                      <FormDescription>
                        PNG, JPG, GIF hasta 50MB (Modo claro)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoInstitucionDark"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Logo para modo oscuro</FormLabel>
                      <FormControl>
                        <div className="bg-slate-700 p-4 rounded-md">
                          <ImageUploader
                            onFileSelected={(file) =>
                              handleFileChange(file, "dark")
                            }
                            preview={logoDarkPreview}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        PNG, JPG, GIF hasta 50MB (Modo oscuro)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección: Misión, Visión, Objetivos y Valores */}
            <Card className="w-full col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Misión, Visión, Objetivos y Valores</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Misión</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de la misión de la empresa..."
                          {...field}
                          className="min-h-[100px]"
                          maxLength={1000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visión</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de la visión de la empresa..."
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objetivos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de los objetivos de la empresa..."
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valores"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valores</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de los valores de la empresa..."
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección: Historia */}
            <Card className="w-full col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Historia</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="historia"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de la historia de la empresa..."
                          {...field}
                          className="min-h-[200px]"
                          maxLength={5000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección: Transparencia */}
            <Card className="w-full col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Información de Transparencia</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="encargadoTransparencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encargado de Transparencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del encargado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cargoEncargadoTransparencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cargo del encargado de Transparencia
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo del encargado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroResolucionTransparencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número de Resolución de Transparencia
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Número de Resolución" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="encargadoTransparenciaSecundario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Encargado de Transparencia Secundario
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del encargado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cargoEncargadoTransparenciaSecundario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cargo del encargado de Transparencia Secundario
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo del encargado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroResolucionTransparenciaSecundario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número de Resolución de Transparencia Secundario
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Número de Resolución" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección: Redes Sociales */}
            <Card className="w-full col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('facebook')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Facebook" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('instagram')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Instagram" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('twitter')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Twitter" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('youtube')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de YouTube" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('tiktok')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de TikTok" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('whatsapp')}
                          </div>
                          <FormControl>
                            <Input placeholder="Número de WhatsApp" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telegram</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('telegram')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Telegram" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pinterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pinterest</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('pinterest')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Pinterest" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="snapchat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Snapchat</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('snapchat')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Snapchat" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kick"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kick</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('kick')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Kick" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitch</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('twitch')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de Twitch" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center w-12 h-10 bg-gray-50 rounded-md">
                            {getSocialIcon('linkedin')}
                          </div>
                          <FormControl>
                            <Input placeholder="URL de LinkedIn" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sección: Secciones Principales */}
            <Card className="w-full col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Secciones Principales</CardTitle>
                <CardDescription>
                  Configura los títulos y descripciones de las secciones principales del portal
                </CardDescription>
              </CardHeader>
                             <CardContent className="space-y-6">
                 {/* Presidencia */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloPresidencia"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Presidencia</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Presidencia Regional" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionPresidencia"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Presidencia</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Conoce al presidente regional" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Servicios */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloServicio"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Servicios</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Servicios Regionales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionServicio"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Servicios</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Servicios que ofrecemos" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Agenda */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloAgenda"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Agenda</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Agenda Regional" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionAgenda"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Agenda</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Eventos y actividades" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Noticias */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloNoticias"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Noticias</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Noticias Regionales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionNoticias"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Noticias</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Últimas noticias" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Boletines */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloBoletin"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Boletines</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Boletines Oficiales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionBoletin"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Boletines</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Boletines informativos" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Documentos */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloDocumentos"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Documentos</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Documentos Oficiales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionDocumentos"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Documentos</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Documentos oficiales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Enlaces */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloEnlaces"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Enlaces</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Enlaces de Interés" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionEnlaces"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Enlaces</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Enlaces importantes" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 {/* Video */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="tituloVideo"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Título Video</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Videos Institucionales" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="descripcionVideo"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Descripción Video</FormLabel>
                         <FormControl>
                           <Input placeholder="Ej: Videos de la región" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               </CardContent>
            </Card>

            {/* Sección: Nosotros */}
          </div>

          <div className="mt-4 flex justify-end w-full">
            <Button type="submit" onClick={() => onSubmit(form.getValues())}>
              Guardar Información
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
