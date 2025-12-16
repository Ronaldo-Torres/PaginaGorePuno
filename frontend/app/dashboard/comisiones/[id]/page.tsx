"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsejeroService from "@/services/ConsejeroService";
import { TableDocumento } from "./tableDocumento";
import DatosComision from "./datos-comision";
import ComisionService from "@/services/ComisionService";
import { useParams } from "next/navigation";
import ConsejeroComision from "./consejero-comision";

export default function page() {
  const [consejeros, setConsejeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comision, setComision] = useState([]);
  const { id } = useParams();

  const getConsejeros = async () => {
    setLoading(true);
    const response = await ConsejeroService.getConsejeros();
    setConsejeros(response as any);
    setLoading(false);
  };

  useEffect(() => {
    getConsejeros();
  }, []);

  const getComision = async () => {
    setLoading(true);
    const response = await ComisionService.getComision(Number(id));
    setComision(response as any);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getComision();
    }
  }, [id]);

  const refreshComision = async () => {
    await getComision();
  };

  console.log(comision);

  return (
    <>
      <main className="w-full mx-auto p-10 bg-muted/50 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 order-1 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Datos de la comision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DatosComision
                  comision={comision}
                  onRefresh={refreshComision}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:w-1/2 order-2 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Consejeros de la comision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsejeroComision />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* <TableDocumento /> */}
    </>
  );
}
