"use client";
import { useEffect, useState } from "react";
import PrincipalService from "@/services/PrincipalService";
import Consejeros from "./consejeros";
import { Loader2 } from "lucide-react";

interface ConsejeroData {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  url_imagen: string;
  redesSociales?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function ConsejerosPage() {
  const [consejeros, setConsejeros] = useState<ConsejeroData[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllConsejeros = async () => {
    try {
      const response = await PrincipalService.getAllConsejeros();
      await new Promise((resolve) => setTimeout(resolve, 800));
      setConsejeros(response.data);
    } catch (error) {
      console.error("Error al obtener los consejeros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllConsejeros();
  }, []);

  return (
    <div className="mt-20 min-h-screen bg-gray-50">
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <Loader2 className="w-8 h-8 animate-pulse" />

        </div>
      ) : (
        <Consejeros data={consejeros} tipo="directorregional" />
      )}
    </div>
  );
}
