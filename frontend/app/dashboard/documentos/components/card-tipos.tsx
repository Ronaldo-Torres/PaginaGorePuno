"use client";
import {
  FaArrowRight,
  FaBalanceScale,
  FaFileContract,
  FaGavel
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const documentosTransparencia = [
  {
    id: 1,
    nombre: "Normatividad Regional",
    descripcion: "Normatividad Regional",
    tipo: "consejo",
    icon: FaGavel,
    count: "Gobierno/SGD"
  },
  {
    id: 2,
    nombre: "Documentos de Gestión",
    descripcion: "Documentos de Gestión",
    tipo: "normativos",
    icon: FaFileContract,
    count: "Gobierno"
  },
  {
    id: 3,
    nombre: "Participación ciudadana",
    descripcion: "Participación ciudadana",
    tipo: "balances",
    icon: FaBalanceScale,
    count: "Gobierno"
  },
  {
    id: 4,
    nombre: "Transparencia",
    descripcion: "Transparencia",
    tipo: "transparencia",
    icon: FaBalanceScale,
    count: "Gobierno"
  },
];

export function CardTipos() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentosTransparencia.map((documento) => {
        const Icon = documento.icon;
        return (
          <Card key={documento.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {documento.count}
                </Badge>
              </div>
              <CardTitle className="text-xl font-semibold">
                {documento.nombre}
              </CardTitle>
              <CardDescription>
                {documento.descripcion}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Activo</span>
                <span>•</span>
                <span>habilitado para vision del publico</span>
              </div>
            </CardContent>

            <CardFooter>
              <Link href={`/dashboard/documentos/${documento.tipo}`} className="w-full">
                <Button className="w-full cursor-pointer">
                  Administrar
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
