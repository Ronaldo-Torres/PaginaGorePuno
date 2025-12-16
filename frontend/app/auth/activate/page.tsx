"use client";

import { useEffect, useState, Suspense } from "react"; 
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, InfoIcon } from "lucide-react";
import Link from "next/link";
import { FaReact } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ActivateAccountContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isRequestingNewToken, setIsRequestingNewToken] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [tokenSent, setTokenSent] = useState<{
    email: string;
    time: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError("No se ha proporcionado un token de activación válido");
      return;
    }

    const activateAccount = async () => {
      try {
        await AuthService.activateAccount({ token });
        setIsSuccess(true);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            "Ha ocurrido un error durante la activación de la cuenta"
        );
        // Si el token expiró, mostrar opción para solicitar uno nuevo
        if (
          err.response?.data?.error?.includes("expirado") ||
          err.response?.status === 400
        ) {
          setShowRequestForm(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [token]);

  const handleRequestNewToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, ingrese su correo electrónico");
      return;
    }

    setIsRequestingNewToken(true);
    try {
      await AuthService.requestActivationToken(email);
      toast.success(
        "Se ha enviado un nuevo enlace de activación a tu correo electrónico. Recuerda activar tu cuenta antes de 24 horas."
      );
      setShowRequestForm(false);
      setError(null);
      setIsSuccess(false);
      setTokenSent({
        email: email,
        time: new Date().toLocaleString(),
      });
    } catch (err) {
      toast.error("Ocurrió un error al procesar tu solicitud");
    } finally {
      setIsRequestingNewToken(false);
    }
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
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Activación de Cuenta</CardTitle>
            <CardDescription>
              {isLoading
                ? "Procesando su solicitud..."
                : tokenSent
                ? "Nuevo enlace enviado"
                : "Resultado de la activación"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Estamos verificando su token de activación...
                </p>
              </div>
            ) : tokenSent ? (
              <div className="flex flex-col items-center py-6 text-center space-y-4">
                <Mail className="h-16 w-16 text-blue-500 mb-2" />
                <h3 className="text-xl font-semibold">
                  Nuevo enlace de activación enviado
                </h3>
                <p className="text-muted-foreground">
                  Hemos enviado un nuevo enlace de activación a{" "}
                  <strong>{tokenSent.email}</strong> a las {tokenSent.time}.
                </p>

                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                  <InfoIcon className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-700">
                    Importante
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Debes activar tu cuenta haciendo clic en el enlace del
                    correo electrónico <strong>antes de 24 horas</strong> o
                    tendrás que solicitar un nuevo enlace de activación.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button asChild>
                    <Link href="/login">Ir a Iniciar Sesión</Link>
                  </Button>
                </div>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">
                  ¡Cuenta activada correctamente!
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Su cuenta ha sido activada con éxito. Ahora puede iniciar
                  sesión con sus credenciales.
                </p>
                <Button className="mt-6" onClick={() => router.push("/login")}>
                  Ir a Iniciar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold">
                  No se pudo activar la cuenta
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {error || "El token de activación es inválido o ha expirado."}
                </p>

                {showRequestForm ? (
                  <div className="mt-6 w-full max-w-xs">
                    <p className="mb-4 text-sm">
                      ¿Ha expirado tu enlace de activación? Solicita uno nuevo:
                    </p>
                    <form
                      onSubmit={handleRequestNewToken}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isRequestingNewToken}
                      >
                        {isRequestingNewToken ? (
                          <>
                            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Enviando...
                          </>
                        ) : (
                          "Solicitar nuevo enlace"
                        )}
                      </Button>

                      <Alert className="mt-4">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Nota</AlertTitle>
                        <AlertDescription>
                          El nuevo enlace de activación expirará en 24 horas.
                        </AlertDescription>
                      </Alert>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button variant="outline" asChild>
                      <Link href="/">Volver al Inicio</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/login">Ir a Iniciar Sesión</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <Link href="/terminos-de-servicio">Términos de servicio</Link> y{" "}
          <Link href="/politica-de-privacidad">Política de privacidad</Link>.
        </div>
      </div>
    </div>
  );
}

export default function ActivateAccountPage() {
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
              <CardTitle>Activación de Cuenta</CardTitle>
              <CardDescription>Cargando...</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Cargando...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ActivateAccountContent />
    </Suspense>
  );
}
