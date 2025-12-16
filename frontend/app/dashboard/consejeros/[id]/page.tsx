"use client";

import React from "react";
import GaleriaCrud from "./galeria-crud";

interface ConsejeroGaleriaPageProps {
  params: {
    id: string;
  };
}

const ConsejeroGaleriaPage = ({ params }: ConsejeroGaleriaPageProps) => {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-white dark:bg-muted/50 md:min-h-min p-8">
      <div className="mb-8">
                          <div>
          <div className="text-xl sm:text-2xl font-bold">Galería del Consejero</div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestión de fotografías oficiales
          </p>
        </div>
      </div>
      <GaleriaCrud consejeroId={params.id} />
    </div>
  );
};

export default ConsejeroGaleriaPage;
