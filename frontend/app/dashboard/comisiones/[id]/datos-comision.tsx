"use client";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ComisionService from "@/services/ComisionService";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ActividadFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  estado: string;
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const DatosComision = ({
  comision,
  onRefresh,
}: {
  comision: any;
  onRefresh: () => void;
}) => {
  const initialFormState: ActividadFormData = {
    nombre: comision.nombre,
    descripcion: comision.descripcion,
    fechaInicio:
      comision.fechaInicio instanceof Date
        ? comision.fechaInicio
        : new Date(comision.fechaInicio),
    fechaFin:
      comision.fechaFin instanceof Date
        ? comision.fechaFin
        : new Date(comision.fechaFin),
    activo: comision.activo,
    estado: comision.activo ? "ACTIVO" : "INACTIVO",
  };

  const [formData, setFormData] = useState<ActividadFormData>(initialFormState);

  const { id } = useParams();

  useEffect(() => {
    if (comision) {
      setFormData({
        nombre: comision.nombre,
        descripcion: comision.descripcion,
        fechaInicio:
          comision.fechaInicio instanceof Date
            ? comision.fechaInicio
            : new Date(comision.fechaInicio),
        fechaFin:
          comision.fechaFin instanceof Date
            ? comision.fechaFin
            : new Date(comision.fechaFin),
        activo: comision.activo,
        estado: comision.activo ? "ACTIVO" : "INACTIVO",
      });
    }
  }, [comision]);

  const handleChange = (field: keyof ActividadFormData) => (e: any) => {
    const value = e && e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      activo: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendData = {
      ...formData,
      fechaInicio: formatDate(formData.fechaInicio),
      fechaFin: formatDate(formData.fechaFin),
      comision: {
        id: Number(id),
      },
    };
    if (comision && comision.id) {
      await ComisionService.updateComision(comision.id, sendData);
      onRefresh();
    } else {
      await ComisionService.createComision(sendData);
      onRefresh();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nombre">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            placeholder="Nombre de la Comisión"
            value={formData.nombre}
            onChange={handleChange("nombre")}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="mision">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="mision"
            placeholder="Descripción de la Comisión"
            value={formData.descripcion}
            onChange={handleChange("descripcion")}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="fechaInicio">
              Fecha de Inicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fechaInicio"
              placeholder="Fecha de Inicio"
              value={formatDate(formData.fechaInicio)}
              onChange={handleChange("fechaInicio")}
              disabled={true}
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="fechaFin">
              Fecha de Fin <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fechaFin"
              placeholder="Fecha de Fin"
              value={formatDate(formData.fechaFin)}
              onChange={handleChange("fechaFin")}
              disabled={true}
            />
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label htmlFor="activo" className="justify-self-center">
            Estado de la Comisión (visible en la página principal)
          </Label>
          <Switch
            id="activo"
            checked={formData.activo}
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DatosComision;
