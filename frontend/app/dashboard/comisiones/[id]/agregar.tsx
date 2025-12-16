"use client";
import { useState, useEffect } from "react";
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
import ComisionService from "@/services/ComisionService";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
interface ActividadFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  tipo: string;
  activo: boolean;
  comision: any;
}

interface AgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateData?: (newData: Omit<ActividadFormData, "id">) => void;
  data?: ActividadFormData | null;
  fetchData: () => void;
}

export function Agregar({ isOpen, onClose, data, fetchData }: AgregarProps) {
  const initialFormState: ActividadFormData = {
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    categoria: "",
    tipo: "",
    activo: false,
    comision: {
      id: "",
    },
  };

  const [formData, setFormData] = useState<ActividadFormData>(initialFormState);

  const { id } = useParams();

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [data, isOpen]);

  const handleChange = (field: keyof ActividadFormData) => (e: any) => {
    const value = e && e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendData = {
      ...formData,
      comision: {
        id: Number(id),
      },
    };
    if (data && data.id) {
      await ComisionService.updateActividad(Number(id), sendData);
    } else {
      await ComisionService.createActividad(sendData);
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
            {data ? "Editar Actividad" : "Crear Nueva Actividad"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos para {data ? "editar" : "crear"} una actividad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre de la actividad <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange("nombre")}
                  className="flex-1"
                  required
                  maxLength={250}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange("descripcion")}
                className="col-span-3"
                required
                maxLength={250}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaInicio" className="text-right">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange("fecha")}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hora" className="text-right">
                Hora
              </Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={handleChange("hora")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lugar" className="text-right">
                Lugar
              </Label>
              <Input
                id="lugar"
                value={formData.lugar}
                onChange={handleChange("lugar")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoria
              </Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={handleChange("categoria")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={handleChange("tipo")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Activo
              </Label>
              <Switch
                checked={formData.activo}
                onCheckedChange={handleChange("activo")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {data ? "Guardar Cambios" : "Crear Actividad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Agregar;
