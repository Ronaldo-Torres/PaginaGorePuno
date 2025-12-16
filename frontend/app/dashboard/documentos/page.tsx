import React from "react";
import { CardTipos } from "./components/card-tipos";
import { FaFolderOpen } from "react-icons/fa";

const page = () => {
  return (
    <div className=" mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FaFolderOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Documentos</h1>
            <p className="text-muted-foreground text-lg">
              Administra y gestiona todos los documentos del Gobierno Regional de Puno
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Categorías de Documentos</h2>
          <p className="text-muted-foreground">
            Selecciona una categoría para administrar los documentos correspondientes
          </p>
        </div>

        <CardTipos />
      </div>
    </div>
  );
};

export default page;
