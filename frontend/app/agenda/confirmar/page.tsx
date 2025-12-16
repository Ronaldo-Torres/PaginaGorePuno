"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import AgendaService from "@/services/AgendaService";

function ConfirmarAsistenciaContent() {
  const searchParams = useSearchParams();
  const [estado, setEstado] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [mensaje, setMensaje] = useState("");
  const token = searchParams.get("token");
  const respuesta = searchParams.get("respuesta");

  useEffect(() => {
    const confirmarAsistencia = async () => {
      if (!token || !respuesta) {
        setEstado("error");
        setMensaje("Parámetros inválidos");
        return;
      }

      try {
        const response = await AgendaService.confirmarAsistencia(
          token,
          respuesta
        );
        setEstado("success");
        setMensaje("Su respuesta ha sido registrada correctamente");
      } catch (error: any) {
        setEstado("error");
        setMensaje(error.response?.data || "Error al procesar la confirmación");
      }
    };

    confirmarAsistencia();
  }, [token, respuesta]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Confirmación de Asistencia</CardTitle>
          <CardDescription>Procesando su respuesta...</CardDescription>
        </CardHeader>
        <CardContent>
          {estado === "loading" && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {estado === "success" && (
            <Alert className="bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>¡Éxito!</AlertTitle>
              <AlertDescription>{mensaje}</AlertDescription>
            </Alert>
          )}

          {estado === "error" && (
            <Alert className="bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{mensaje}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center">
            <Button onClick={() => window.close()} variant="outline">
              Cerrar ventana
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmarAsistencia() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Confirmación de Asistencia</CardTitle>
            <CardDescription>Cargando...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ConfirmarAsistenciaContent />
    </Suspense>
  );
}
