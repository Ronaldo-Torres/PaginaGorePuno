"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IconCamera, IconUpload, IconX, IconMail } from "@tabler/icons-react";
import { toast } from "sonner";
import { buildAvatarUrl, getInitials } from "@/lib/avatar-utils";
import { Role, User } from "@/types/user";
import AdminUserService from "@/services/AdminUserService";
import RoleService from "@/services/RoleService";

// Esquema de validación con Zod
const formSchema = z
  .object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    roleId: z.string().min(1, "Seleccione un rol"),
    sendEmail: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    enabled: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.sendEmail) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  );

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onUserCreated: () => void;
  onUserUpdated: () => void;
  onToggleUserStatus?: (userId: string, currentStatus: boolean) => void;
}

// Función para formatear el nombre del rol
const formatRoleName = (roleName: string) => {
  switch (roleName) {
    case "ADMIN":
      return "Administrador";
    case "USER":
      return "Usuario";
    case "SUPER_ADMIN":
      return "Super Administrador";
    default:
      // Convertir SNAKE_CASE a formato título
      return roleName
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
  }
};

export default function UserForm({
  isOpen,
  onClose,
  user,
  onUserCreated,
  onUserUpdated,
  onToggleUserStatus,
}: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<
    boolean | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleId: "",
      sendEmail: true,
      password: "",
      confirmPassword: "",
      enabled: false,
    },
  });

  const { handleSubmit, reset, watch, setValue } = form;
  const sendEmail = watch("sendEmail");

  // Función para obtener la URL del avatar
  const getAvatarUrl = useCallback((avatarPath: string): string => {
    // Si es una URL completa, usarla directamente
    if (avatarPath.startsWith("http")) return avatarPath;
    // Concatenar con la URL base del storage
    const storageUrl =
      process.env.NEXT_PUBLIC_STORAGE_BASE_URL ||
      "http://localhost:8080/storage";
    return `${storageUrl}/${avatarPath}`;
  }, []);

  // Obtener la URL del avatar actual
  const currentAvatarUrl = useMemo(() => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return getAvatarUrl(user.avatar);
    return undefined;
  }, [avatarPreview, user?.avatar, getAvatarUrl]);

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

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAvatarPreview(result);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleAvatarRemove = useCallback(async () => {
    if (user) {
      try {
        setIsLoading(true);
        await AdminUserService.removeUserAvatar(user.uuid);
        toast.success("Avatar eliminado correctamente");
        setAvatarPreview(null);
        if (user) {
          user.avatar = null;
        }
        onUserUpdated();
      } catch (error) {
        console.error("Error al eliminar avatar:", error);
        toast.error("No se pudo eliminar el avatar");
      } finally {
        setIsLoading(false);
      }
    } else {
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [user, onUserUpdated]);

  // Envío del formulario
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const avatarFile = fileInputRef.current?.files?.[0];

      await AdminUserService.saveUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          roleId: data.roleId,
          sendEmail: data.sendEmail,
          password: data.password,
          enabled: data.enabled,
          avatar: avatarFile,
        },
        user?.uuid
      );

      if (user) {
        onUserUpdated();
      } else {
        onUserCreated();
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast.error("No se pudo guardar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear contraseña del usuario
  const handleResetPassword = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await AdminUserService.resetUserPassword(user.uuid);
      toast.success(response.message);
      toast.success(response.email);
      onUserUpdated();
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
      toast.error("No se pudo resetear la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar formulario cuando cambia el usuario o se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Encontrar el rol actual del usuario
        const currentRole = user.roleDetails?.[0] || user.roles?.[0];
        console.log("Current user data:", user); // Para debugging
        console.log("Current role:", currentRole); // Para debugging

        form.reset({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          roleId: currentRole?.id?.toString() || "",
          sendEmail: true,
          password: "",
          confirmPassword: "",
          enabled: user.enabled || false,
        });

        // Actualizar el preview del avatar si existe
        if (user.avatar) {
          const avatarUrl = buildAvatarUrl(user.avatar);
          setAvatarPreview(avatarUrl || null);
        } else {
          setAvatarPreview(null);
        }
      } else {
        // Reset form for new user
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          roleId: "",
          sendEmail: true,
          password: "",
          confirmPassword: "",
          enabled: false,
        });
        setAvatarPreview(null);
      }
    }
  }, [user, isOpen, form]);

  // Cargar roles al abrir el formulario
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleService.getRolesList();
        setRoles(response);
      } catch (error) {
        console.error("Error al obtener roles:", error);
        toast.error("No se pudieron cargar los roles");
      }
    };
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Función para manejar el cambio de estado del usuario
  const handleStatusChange = async (newStatus: boolean) => {
    if (!user) return;

    try {
      setIsLoading(true);
      await AdminUserService.toggleUserStatus(user.uuid, newStatus);
      toast.success(
        newStatus
          ? "Usuario activado correctamente"
          : "Usuario desactivado correctamente"
      );
      onUserUpdated();
      setIsStatusDialogOpen(false);
      onClose();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      toast.error(
        newStatus
          ? "No se pudo activar el usuario"
          : "No se pudo desactivar el usuario"
      );
    } finally {
      setIsLoading(false);
      setPendingStatusChange(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Modifica los datos del usuario seleccionado."
              : "Completa el formulario para crear un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Avatar Section */}
                <div className="w-full md:w-1/3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <Avatar className="h-32 w-32 sm:h-40 sm:w-40">
                            <AvatarImage
                              src={avatarPreview || ""}
                              alt={`${form.watch("firstName")} ${form.watch(
                                "lastName"
                              )}`}
                              className="object-cover"
                              onError={(e) => {
                                console.error("Error loading avatar:", e);
                              }}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-2xl sm:text-3xl">
                              {getInitials(
                                form.watch("firstName"),
                                form.watch("lastName")
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {avatarPreview && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                              onClick={handleAvatarRemove}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          )}
                          {user && user.avatar && !avatarPreview && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                              onClick={handleAvatarRemove}
                              disabled={isLoading}
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
                            Sube una imagen para el avatar del usuario (máx.
                            5MB)
                          </p>
                          <div className="flex flex-col gap-2">
                            {!avatarPreview && !user?.avatar && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <IconUpload className="h-4 w-4 mr-2" />
                                Subir Imagen
                              </Button>
                            )}
                            {(avatarPreview || user?.avatar) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <IconCamera className="h-4 w-4 mr-2" />
                                Cambiar
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

                        {/* Estado del usuario */}
                        {user && onToggleUserStatus && (
                          <div className="w-full pt-6 mt-6 border-t">
                            <div className="flex flex-row items-center justify-between rounded-lg p-4 bg-muted/50">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      user.enabled
                                        ? "bg-green-500 animate-pulse"
                                        : "bg-orange-500"
                                    }`}
                                  />
                                  {user.enabled ? "Activo" : "Inactivo"}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  {user.enabled
                                    ? "Usuario con acceso al sistema"
                                    : "Usuario sin acceso al sistema"}
                                </FormDescription>
                              </div>
                              <Switch
                                checked={user.enabled}
                                onCheckedChange={(checked) => {
                                  setPendingStatusChange(checked);
                                  setIsStatusDialogOpen(true);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Form Fields */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apellido</FormLabel>
                              <FormControl>
                                <Input placeholder="Apellido" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Teléfono</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="...." {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Formato: 123456789
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Selector de Rol */}
                      <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un rol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem
                                    key={role.id}
                                    value={role.id.toString()}
                                  >
                                    {formatRoleName(role.name)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {user
                                ? "Selecciona el nuevo rol para el usuario"
                                : "Selecciona el rol para el nuevo usuario"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Settings for new users only */}
                  {!user && (
                    <Card>
                      <CardContent className="p-6 space-y-6">
                        <FormField
                          control={form.control}
                          name="sendEmail"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                  <IconMail className="h-5 w-5 text-primary" />
                                  Enviar credenciales por email
                                </FormLabel>
                                <FormDescription>
                                  {field.value
                                    ? "Se enviará un email con un enlace de activación y contraseña temporal."
                                    : "El usuario será creado con acceso inmediato y la contraseña especificada."}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {!sendEmail && (
                          <>
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contraseña</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Contraseña"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    La contraseña debe tener al menos 8
                                    caracteres.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirmar Contraseña</FormLabel>
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
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Acciones de administrador para usuarios existentes */}
                  {user && (
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          Acciones de Administrador
                        </h4>
                        <div className="space-y-6">
                          {/* Estado del usuario */}
                          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    user.enabled
                                      ? "bg-green-500 animate-pulse"
                                      : "bg-orange-500"
                                  }`}
                                />
                                Estado del Usuario
                              </FormLabel>
                              <FormDescription>
                                {user.enabled
                                  ? "El usuario tiene acceso activo al sistema"
                                  : "El usuario está desactivado y no puede acceder al sistema"}
                              </FormDescription>
                            </div>
                            <Switch
                              checked={user.enabled}
                              onCheckedChange={(checked) => {
                                setPendingStatusChange(checked);
                                setIsStatusDialogOpen(true);
                              }}
                            />
                          </div>

                          {/* Resetear contraseña */}
                          <div className="flex flex-col space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsResetPasswordDialogOpen(true)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              <IconMail className="h-4 w-4 mr-2" />
                              Resetear Contraseña
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              El reseteo de contraseña enviará nuevas
                              credenciales al correo del usuario.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-shrink-0 mt-6 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Procesando..."
                    : user
                    ? "Guardar cambios"
                    : "Crear usuario"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>

      {/* Modal de confirmación para resetear contraseña */}
      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Reseteo de Contraseña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas resetear la contraseña de{" "}
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                ⚠️ Importante:
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Se generará una nueva contraseña temporal</li>
                <li>• Se enviará por correo al usuario</li>
                <li>• Deberá cambiar la contraseña en el primer login</li>
                <li>• Esta acción no se puede deshacer</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? "Reseteando..." : "Resetear Contraseña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para cambio de estado */}
      <Dialog
        open={isStatusDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStatusChange(null);
          }
          setIsStatusDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas{" "}
              {pendingStatusChange ? "activar" : "desactivar"} a{" "}
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className={`${
                pendingStatusChange
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
              } p-4 rounded-lg border`}
            >
              <h4
                className={`font-medium ${
                  pendingStatusChange
                    ? "text-green-800 dark:text-green-200"
                    : "text-orange-800 dark:text-orange-200"
                } mb-2`}
              >
                ⚠️ Importante:
              </h4>
              <ul
                className={`text-sm ${
                  pendingStatusChange
                    ? "text-green-700 dark:text-green-300"
                    : "text-orange-700 dark:text-orange-300"
                } space-y-1`}
              >
                {pendingStatusChange ? (
                  <>
                    <li>• El usuario podrá acceder al sistema</li>
                    <li>• Se restaurarán sus permisos y accesos</li>
                    <li>• Recibirá notificaciones del sistema</li>
                  </>
                ) : (
                  <>
                    <li>• El usuario no podrá acceder al sistema</li>
                    <li>• Se suspenderán temporalmente sus permisos</li>
                    <li>• No recibirá notificaciones del sistema</li>
                    <li>• Se cerrará su sesión actual si está activa</li>
                  </>
                )}
                <li>• Esta acción se puede revertir en cualquier momento</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPendingStatusChange(null);
                setIsStatusDialogOpen(false);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant={pendingStatusChange ? "default" : "destructive"}
              onClick={() => {
                if (pendingStatusChange !== null) {
                  handleStatusChange(pendingStatusChange);
                }
              }}
              disabled={isLoading}
            >
              {isLoading
                ? "Procesando..."
                : pendingStatusChange
                ? "Activar Usuario"
                : "Desactivar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
