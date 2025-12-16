"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ComisionService from "@/services/ComisionService";

interface OperarioFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
}

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateData?: (newData: Omit<OperarioFormData, "id">) => void;
  data?: OperarioFormData | null;
  fetchData: () => void;
}

export function Agregar({ isOpen, onClose, data, fetchData }: AgregarProps) {
  const initialFormState: OperarioFormData = {
    nombre: "",
    descripcion: "",
    fechaInicio: new Date(new Date().getFullYear(), 0, 1),
    fechaFin: new Date(new Date().getFullYear(), 11, 31),
    activo: false,
  };

  const [formData, setFormData] = useState<OperarioFormData>(initialFormState);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data, isOpen]);

  const handleChange = (field: keyof OperarioFormData) => (e: any) => {
    const value = e && e.target ? e.target.value : e;
    if (field === "fechaInicio" || field === "fechaFin") {
      setFormData((prev) => ({ ...prev, [field]: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendData = {
      ...formData,
    };
    if (data && data.id) {
      await ComisionService.updateComision(data.id, sendData);
    } else {
      await ComisionService.createComision(sendData);
    }
    onClose();
    fetchData();
    setFormData(initialFormState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Editar comision" : "Crear Nueva comision"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data ? "editar" : "crear"} una comision.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre de la comision <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange("nombre")}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripcion <span className="text-red-500">*</span>
              </Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange("descripcion")}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaInicio" className="text-right">
                Fecha de inicio
              </Label>
              <Input
                id="fechaInicio"
                type="date"
                value={
                  formData.fechaInicio instanceof Date
                    ? formData.fechaInicio.toISOString().split("T")[0]
                    : new Date(formData.fechaInicio).toISOString().split("T")[0]
                }
                onChange={handleChange("fechaInicio")}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFin" className="text-right">
                Fecha de fin
              </Label>
              <Input
                id="fechaFin"
                type="date"
                value={
                  formData.fechaFin instanceof Date
                    ? formData.fechaFin.toISOString().split("T")[0]
                    : new Date(formData.fechaFin).toISOString().split("T")[0]
                }
                onChange={handleChange("fechaFin")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Switch
                id="estado"
                checked={formData.activo}
                onCheckedChange={handleChange("activo")}
              />
              <Label htmlFor="estado">Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {data ? "Guardar Cambios" : "Crear parametro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Agregar;
