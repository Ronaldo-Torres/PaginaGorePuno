"use client";
import { Label } from "@/components/ui/label";
import ComisionService from "@/services/ComisionService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import ConsejeroService from "@/services/ConsejeroService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/DataTable";
import TableConsejeroComision from "./table-consejero-comision";
import { useParams } from "next/navigation";

// Define la interfaz para el consejero
interface Consejero {
  id: number;
  cargo: string;
  dni: string;
  nombre: string;
  apellido: string;
  comision: {
    id: number;
  };
}

interface FormData {
  cargo: string;
  consejero: any;
  comision: any;
}

const ConsejeroComision = () => {
  const [consejeros, setConsejeros] = useState<Consejero[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Success state to show success message
  const params = useParams();
  const comisionId = params.id as string;
  const [formData, setFormData] = useState<FormData>({
    cargo: "",
    consejero: {
      id: "",
    },
    comision: {
      id: comisionId,
    },
  });

  const getConsejeros = async () => {
    setLoading(true);
    const response = await ConsejeroService.getConsejeros();
    setConsejeros(response as any[]); // Update the list of consejeros
    setLoading(false);
  };

  useEffect(() => {
    getConsejeros(); // Fetch the consejeros when the component mounts
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await ComisionService.createConsejeroComision(formData);

      if (response) {
        // After successful form submission
        setSuccess(true); // Set success state to true to show the success message
        getConsejeros(); // Refetch the consejeros to update the table
        setTimeout(() => {
          setSuccess(false); // Hide the success message after 3 seconds
        }, 3000);
        handleResetForm(); // Reset the form fields
      }
    } catch (error) {
      console.error("Error al crear el consejero de comisión:", error);
    }
  };

  const handleResetForm = () => {
    setFormData({
      cargo: "",
      consejero: {
        id: "",
      },
      comision: { id: comisionId },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-2 mb-4">
          <Label htmlFor="integrantes">Integrantes</Label>
          <div className="flex gap-2">
            <Select
              value={formData.cargo}
              onValueChange={(value) =>
                setFormData({ ...formData, cargo: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cargo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Presidente</SelectItem>
                <SelectItem value="1">Secretario</SelectItem>
                <SelectItem value="2">Vocal</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.consejero.id.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, consejero: { id: Number(value) } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un consejero..." />
              </SelectTrigger>
              <SelectContent>
                {consejeros.map((consejero) => (
                  <SelectItem
                    key={consejero.id}
                    value={consejero.id.toString()}
                  >
                    {consejero.dni} {""} {consejero.nombre} {consejero.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit">
              <Plus />
              Agregar
            </Button>
          </div>
        </div>
      </form>

      {success && (
        <div className="text-green-500 mb-4 ">
          ¡Consejero agregado con éxito!
        </div>
      )}

      <TableConsejeroComision success={success} />
    </div>
  );
};

export default ConsejeroComision;
