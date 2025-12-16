"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { FaReact } from "react-icons/fa";
import Image from "next/image";

// Esquema de validación
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido" })
    .min(1, { message: "El correo electrónico es obligatorio" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Manejar el envío del formulario
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword({ email: values.email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Ha ocurrido un error al procesar su solicitud"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logoheader.png" alt="Logo" width={50} height={50} />
          Gobierno Regional Puno
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Recuperar contraseña</CardTitle>
            <CardDescription>
              Ingrese su correo electrónico y le enviaremos instrucciones para
              restablecer su contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">¡Correo enviado!</h3>
                <p className="mt-2 text-muted-foreground">
                  Si el correo electrónico existe en nuestro sistema, recibirá
                  instrucciones para restablecer su contraseña. Por favor revise
                  su bandeja de entrada y siga las instrucciones en el correo.
                </p>
                <Button className="mt-6" onClick={() => router.push("/login")}>
                  Volver a Iniciar Sesión
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="usuario@ejemplo.com"
                            type="email"
                            autoComplete="email"
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
                        Enviando...
                      </>
                    ) : (
                      "Enviar instrucciones"
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
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <Link href="/terminos-de-servicio">Términos de servicio</Link> y{" "}
          <Link href="/politica-de-privacidad">Política de privacidad</Link>.
        </div>
      </div>
    </div>
  );
}
