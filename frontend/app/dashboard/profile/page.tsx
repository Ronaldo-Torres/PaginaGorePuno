"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthService, { User } from "@/lib/auth-service";
import { useUser, useUserActions } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconCamera,
  IconUpload,
  IconX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { buildAvatarUrl, getInitials } from "@/lib/avatar-utils";
import { ProfileAPI } from "@/lib/api-client";


// Esquemas de validación con Zod
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), {
      message: "Formato de teléfono inválido",
    }),
  avatar: z.string().optional(),
});


const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


type ProfileFormData = z.infer<typeof profileFormSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user: storeUser, isAuthenticated } = useUser();
  const { setUser } = useUserActions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Configurar react-hook-form con Zod para el perfil
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatar: "",
    },
  });


  // Configurar react-hook-form con Zod para contraseña
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  // Manejo de upload de avatar
  const handleAvatarChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          toast.error("Por favor selecciona un archivo de imagen válido");
          return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("La imagen no puede ser mayor a 5MB");
          return;
        }

        // Crear preview para mostrar inmediatamente
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAvatarPreview(result);
          // No establecer en el form, solo para preview
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );


  const handleAvatarRemove = useCallback(async () => {
    try {
      setSaving(true);

      // Llamar a la API para eliminar el avatar (interceptor maneja autenticación)
      const updatedUserData = await ProfileAPI.removeAvatar();

      // Actualizar el estado del usuario en el store global
      if (storeUser) {
        const updatedUser: User = {
          ...storeUser,
          avatar: undefined,
        };
        setUser(updatedUser);
      }

      // Limpiar el preview y el input de archivo
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Avatar eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar avatar:", error);
      // El interceptor maneja automáticamente errores 401/403
      toast.error("No se pudo eliminar el avatar");
    } finally {
      setSaving(false);
    }
  }, [storeUser, setUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verificar autenticación tanto con el store como con el servicio
        if (!isAuthenticated || !AuthService.isAuthenticated()) {
          router.push("/login");
          return;
        }

        // Si ya tenemos los datos del usuario en el store, usarlos
        if (storeUser) {
          profileForm.reset({
            firstName: storeUser.firstName,
            lastName: storeUser.lastName,
            email: storeUser.email,
            phone: (storeUser as any).phone || "",
            avatar: storeUser.avatar || "",
          });
          // Usar la URL construida correctamente para el preview inicial
          setAvatarPreview(buildAvatarUrl(storeUser.avatar) || null);
          setLoading(false);
          return;
        }

        // Si no, obtenerlos del servicio
        const userData = await AuthService.getCurrentUser();
        profileForm.reset({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: (userData as any).phone || "",
          avatar: userData.avatar || "",
        });
        // Usar la URL construida correctamente para el preview inicial
        setAvatarPreview(buildAvatarUrl(userData.avatar) || null);
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
        toast.error("No se pudo cargar la información del usuario");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, storeUser, isAuthenticated, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setSaving(true);

    try {
      // Obtener archivo de avatar si existe
      const avatarFile = fileInputRef.current?.files?.[0] || null;

      // Llamar a la API real para actualizar el perfil
      const updatedUserData = await ProfileAPI.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: avatarFile || undefined,
      });

      // Actualizar el estado del usuario en el store global
      if (storeUser) {
        const updatedUser: User = {
          ...storeUser,
          firstName: data.firstName,
          lastName: data.lastName,
          // Actualizar avatar con la respuesta del servidor
          avatar: updatedUserData.avatar || storeUser.avatar,
          ...(data.phone && { phone: data.phone }),
        };

        // Actualizar en el store global
        setUser(updatedUser);

        // Actualizar el preview con la nueva imagen del servidor
        setAvatarPreview(buildAvatarUrl(updatedUser.avatar) || null);
      }

      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);

      // El interceptor maneja automáticamente errores 401/403
      // Manejar diferentes tipos de error
      if (error.response?.status === 400) {
        toast.error("Datos de perfil inválidos");
      } else if (error.response?.status === 413) {
        toast.error("La imagen es demasiado grande");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("No se pudo actualizar el perfil");
      }
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setSaving(true);

    try {
      // Llamar a la API para cambiar la contraseña (interceptor maneja autenticación)
      await ProfileAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Contraseña actualizada correctamente");

      // Limpiar el formulario
      passwordForm.reset();
      
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);

      // El interceptor maneja automáticamente errores 401
      // Manejar diferentes tipos de error
      if (error.response?.status === 403) {
        toast.error("La contraseña actual es incorrecta");
      } else if (error.response?.status === 400) {
        toast.error("La nueva contraseña no cumple con los requisitos");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("No se pudo actualizar la contraseña");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              {/* Header Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>

              <div className="grid gap-6">
                {/* Información Personal Card Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Avatar Section Skeleton */}
                      <div className="lg:col-span-1">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                              <Skeleton className="h-32 w-32 lg:h-48 lg:w-48 rounded-full" />
                              <div className="text-center w-full">
                                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                                <Skeleton className="h-3 w-40 mx-auto mb-4" />
                                <div className="flex flex-col gap-2">
                                  <Skeleton className="h-8 w-full" />
                                  <Skeleton className="h-8 w-full" />
                                  <Skeleton className="h-8 w-full" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Form Section Skeleton */}
                      <div className="lg:col-span-2">
                        <Card>
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Nombre y Apellido */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-16" />
                                  <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-16" />
                                  <Skeleton className="h-10 w-full" />
                                </div>
                              </div>

                              {/* Email */}
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-48" />
                              </div>

                              {/* Teléfono */}
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-64" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-32" />
                  </CardFooter>
                </Card>

                {/* Cambiar Contraseña Card Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-80" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Contraseña actual */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>

                      {/* Nueva contraseña */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>

                      {/* Confirmar contraseña */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>

                      {/* Alert skeleton */}
                      <div className="flex gap-3 p-4 border rounded-lg">
                        <Skeleton className="h-4 w-4 rounded-sm flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Skeleton className="h-9 w-40" />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
              <p className="text-muted-foreground">
                Gestiona tu información personal y preferencias de cuenta
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y foto de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      {/* Layout principal con imagen a la izquierda e información a la derecha */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar Section - Columna izquierda */}
                        <div className="lg:col-span-1">
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                  <Avatar className="h-32 w-32 lg:h-48 lg:w-48">
                                    <AvatarImage
                                      src={
                                        avatarPreview ||
                                        buildAvatarUrl(storeUser?.avatar)
                                      }
                                      alt="Avatar preview"
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-slate-800 to-slate-900 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-800 text-2xl lg:text-4xl">
                                      {getInitials(
                                        profileForm.watch("firstName"),
                                        profileForm.watch("lastName")
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  {avatarPreview &&
                                    avatarPreview !==
                                      buildAvatarUrl(storeUser?.avatar) && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-3 -right-3 h-8 w-8 rounded-full p-0"
                                        onClick={() => {
                                          // Solo cancelar la selección local
                                          setAvatarPreview(
                                            buildAvatarUrl(storeUser?.avatar) ||
                                              null
                                          );
                                          if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                          }
                                        }}
                                      >
                                        <IconX className="h-4 w-4" />
                                      </Button>
                                    )}
                                </div>
                                <div className="text-center">
                                  <h4 className="text-lg font-semibold">
                                    Foto de Perfil
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Sube una imagen para tu avatar (máx. 5MB)
                                  </p>
                                  <div className="flex flex-col gap-2">
                                    {/* Mostrar "Subir Imagen" solo si no hay avatar */}
                                    {!avatarPreview && !storeUser?.avatar && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          fileInputRef.current?.click()
                                        }
                                        className="w-full"
                                        disabled={saving}
                                      >
                                        <IconUpload className="h-4 w-4 mr-2" />
                                        Subir Imagen
                                      </Button>
                                    )}

                                    {/* Mostrar "Cambiar" solo si ya hay avatar */}
                                    {(avatarPreview || storeUser?.avatar) && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          fileInputRef.current?.click()
                                        }
                                        className="w-full"
                                        disabled={saving}
                                      >
                                        <IconCamera className="h-4 w-4 mr-2" />
                                        Cambiar
                                      </Button>
                                    )}

                                    {/* Mostrar "Eliminar" solo si hay avatar */}
                                    {(avatarPreview || storeUser?.avatar) && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleAvatarRemove}
                                        className="w-full"
                                        disabled={saving}
                                      >
                                        <IconX className="h-4 w-4 mr-2" />
                                        {saving
                                          ? "Eliminando..."
                                          : "Eliminar Avatar"}
                                      </Button>
                                    )}

                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleAvatarChange}
                                      className="hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Personal Information - Columna derecha */}
                        <div className="lg:col-span-2">
                          <Card>
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <FormField
                                    control={profileForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Nombre"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={profileForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Apellido"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={profileForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Correo Electrónico</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="email"
                                          placeholder="usuario@ejemplo.com"
                                          {...field}
                                          disabled={true}
                                          className="bg-muted/50"
                                        />
                                      </FormControl>
                                      <p className="text-xs text-muted-foreground">
                                        El correo electrónico no se puede
                                        cambiar
                                      </p>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={profileForm.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Número de Teléfono</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="tel"
                                          placeholder="...."
                                          {...field}
                                        />
                                      </FormControl>
                                      <p className="text-xs text-muted-foreground">
                                        Formato: 123456789
                                      </p>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={profileForm.handleSubmit(onProfileSubmit)}
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña actual</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Contraseña actual"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nueva contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nueva contraseña"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirmar contraseña"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Alerta informativa sobre cambio de contraseña */}
                      <Alert className="bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-blue-200">
                        <IconInfoCircle className="h-4 w-4 text-slate-600" />
                        <AlertDescription>
                          Por seguridad, recibirás un correo electrónico de
                          confirmación después de cambiar tu contraseña.
                        </AlertDescription>
                      </Alert>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button
                    onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                    disabled={saving}
                  >
                    {saving ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
