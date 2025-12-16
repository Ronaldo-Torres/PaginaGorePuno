"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/lib/auth-service";
import { useUserActions } from "@/lib/store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaInfo, FaCheckCircle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { setUser } = useUserActions();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingActivation, setIsSendingActivation] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Realizar el login
      await AuthService.login(formData);

      // Obtener datos del usuario y guardarlos en el store
      const userData = await AuthService.getCurrentUser();
      setUser(userData);

      toast.success("Inicio de sesión exitoso");

      // Asegurar que la redirección ocurra después de actualizar el estado
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);

      // Verificar si el error es por cuenta no activada
      if (
        error.response?.data?.error?.includes("not activated") ||
        error.response?.data?.message?.includes("no activada") ||
        error.message?.includes("activated")
      ) {
        // Mostrar el diálogo de activación
        setShowActivationDialog(true);
      } else {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!formData.email) {
      toast.error("Por favor, ingresa tu correo electrónico");
      return;
    }

    setIsSendingActivation(true);
    try {
      await AuthService.requestActivationToken(formData.email);

      // Mostrar mensaje de éxito
      toast.success(
        "Se ha enviado un nuevo enlace de activación a tu correo electrónico. Recuerda activar tu cuenta antes de 24 horas."
      );

      // Cerrar el diálogo y mostrar la confirmación
      setShowActivationDialog(false);

      // Mostrar alerta de éxito
      toast.custom(
        (t) => (
          <>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <div className="flex items-center mb-3">
              <FaCheckCircle className="text-green-500 h-6 w-6 mr-2" />
              <h3 className="font-semibold text-lg">Enlace enviado</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Se ha enviado un nuevo enlace de activación a{" "}
              <strong>{formData.email}</strong>
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
              <p className="text-yellow-800 font-medium">
                Recuerda activar tu cuenta antes de 24 horas o tendrás que
                solicitar un nuevo enlace.
              </p>
            </div>
          </div>
          </>
        ),
        { duration: 6000 }
      );
    } catch (error) {
      toast.error("Ha ocurrido un error al enviar el enlace de activación");
    } finally {
      setIsSendingActivation(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold text-[#062854] tracking-wide">
            Iniciar Sesión
          </CardTitle>
          <div className="flex items-center justify-center space-x-3 mt-2">
            <div className="w-8 h-0.5 bg-[#062854] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#062854] rounded-full"></div>
            <div className="w-8 h-0.5 bg-[#062854] rounded-full"></div>
          </div>
          <CardDescription className="text-gray-600 mt-3">
            Accede a tu cuenta del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#062854] font-medium text-sm">
                Correo electrónico
              </Label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-[#062854] focus:ring-[#062854] transition-all duration-300"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#062854] font-medium text-sm">
                  Contraseña
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#062854] hover:text-[#285391] underline-offset-4 hover:underline transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#062854] focus:ring-[#062854] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#062854] transition-colors duration-300"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#062854] to-[#285391] hover:from-[#285391] hover:to-[#062854] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Enlaces legales */}
      <div className="text-center text-xs text-white/80">
        Al iniciar sesión, aceptas nuestros{" "}
        <Link 
          href="/terminos-de-servicio" 
          className="text-white underline underline-offset-4 hover:text-white/90 transition-colors duration-300"
        >
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link 
          href="/politica-de-privacidad"
          className="text-white underline underline-offset-4 hover:text-white/90 transition-colors duration-300"
        >
          Política de privacidad
        </Link>
        .
      </div>

      {/* Diálogo para cuentas no activadas */}
      <Dialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#062854] font-bold tracking-wide">
              Cuenta no activada
            </DialogTitle>
            <DialogDescription className="text-gray-600 leading-relaxed">
              Tu cuenta no ha sido activada. Debes activarla haciendo clic en el
              enlace que te enviamos por correo electrónico. El enlace de
              activación es válido por 24 horas. Si no has recibido el correo o
              el enlace ha expirado, puedes solicitar uno nuevo a continuación.
            </DialogDescription>
          </DialogHeader>

          <Alert className="my-4 bg-yellow-50 border-yellow-200 rounded-xl">
            <FaInfo className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700 font-semibold">
              Importante
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              El enlace de activación es válido solo por{" "}
              <strong>24 horas</strong>. Después de este tiempo, tendrás que
              solicitar uno nuevo.
            </AlertDescription>
          </Alert>

          <div className="py-2 text-center bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              Correo electrónico: <strong className="text-[#062854]">{formData.email}</strong>
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowActivationDialog(false)}
              className="sm:w-auto w-full rounded-xl border-2 border-gray-200 hover:border-[#062854] transition-all duration-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResendActivation}
              disabled={isSendingActivation}
              className="sm:w-auto w-full bg-gradient-to-r from-[#062854] to-[#285391] hover:from-[#285391] hover:to-[#062854] rounded-xl transition-all duration-300"
            >
              {isSendingActivation ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar nuevo enlace de activación"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
