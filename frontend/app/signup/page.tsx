"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import AuthService from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsLoading(true);

      // Enviar datos de registro sin confirmPassword
      const { confirmPassword, ...registerData } = formData;

      const response = await AuthService.register(registerData);

      // Mensaje de éxito mejorado con énfasis en la expiración del enlace
      toast.success(
        "Registro exitoso. Hemos enviado un correo de activación a tu dirección de email. El enlace de activación expirará en 24 horas."
      );

      setIsSuccess(true);

      // Redirigir al login después de un breve retraso para que el usuario pueda leer el mensaje
      setTimeout(() => {
        router.push("/login");
      }, 5000); // Aumentamos el tiempo para permitir leer el mensaje
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
          <CardDescription>
            Regístrate para acceder a todas las funciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center py-6 text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-semibold">¡Registro exitoso!</h3>
              <p className="text-muted-foreground">
                Hemos enviado un correo electrónico de activación a{" "}
                <strong>{formData.email}</strong>
              </p>
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <InfoIcon className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-700">Importante</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Debes activar tu cuenta haciendo clic en el enlace del correo
                  electrónico <strong>antes de 24 horas</strong> o tendrás que
                  solicitar un nuevo enlace de activación.
                </AlertDescription>
              </Alert>
              <p className="text-sm mt-4">
                Serás redirigido a la página de inicio de sesión en unos
                segundos...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Registrarse"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Iniciar sesión
            </Link>
          </div>
          <div className="text-muted-foreground text-center text-xs">
            Al registrarte, aceptas nuestros{" "}
            <Link
              href="/terminos-de-servicio"
              className="underline underline-offset-4"
            >
              Términos de servicio
            </Link>{" "}
            y{" "}
            <Link
              href="/politica-de-privacidad"
              className="underline underline-offset-4"
            >
              Política de privacidad
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
