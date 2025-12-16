"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import AuthService from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { FaReact } from "react-icons/fa";

// Esquema de validación
const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula",
      })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Verificar token al cargar la página
  useEffect(() => {
    if (!token) {
      setTokenError("No se ha proporcionado un token válido");
      setIsTokenChecking(false);
      return;
    }

    // El token existe, permitir el restablecimiento
    setIsTokenChecking(false);
  }, [token]);

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Manejar el envío del formulario
  const onSubmit = async (values: FormValues) => {
    if (!token) {
      setError("No se ha proporcionado un token válido");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.resetPassword({
        token,
        newPassword: values.newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Ha ocurrido un error al restablecer la contraseña"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isTokenChecking) {
      return (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>Verificando token...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Estamos verificando la validez de su solicitud...
            </p>
          </CardContent>
        </Card>
      );
    }

    if (tokenError) {
      return (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>Error en el token</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold">
              No se puede restablecer la contraseña
            </h3>
            <p className="mt-2 text-muted-foreground">{tokenError}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Restablecer contraseña</CardTitle>
          <CardDescription>
            Cree una nueva contraseña para su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">
                ¡Contraseña restablecida!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Su contraseña ha sido cambiada correctamente. Ya puede iniciar
                sesión con su nueva contraseña.
              </p>
              <Button className="mt-6" onClick={() => router.push("/login")}>
                Ir a Iniciar Sesión
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Restableciendo...
                    </>
                  ) : (
                    "Restablecer contraseña"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/login" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <FaReact className="size-4" />
          </div>
          Sistema base
        </a>
        {renderContent()}
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <Link href="/terminos-de-servicio">Términos de servicio</Link> y{" "}
          <Link href="/politica-de-privacidad">Política de privacidad</Link>.
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <FaReact className="size-4" />
            </div>
            Sistema base
          </a>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Restablecer contraseña</CardTitle>
              <CardDescription>Cargando...</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Cargando...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
