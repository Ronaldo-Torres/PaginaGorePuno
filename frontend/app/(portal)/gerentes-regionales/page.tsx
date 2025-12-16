"use client";

import { useEffect, useState } from "react";

import Consejeros from "../consejeros/consejeros";
import PrincipalService from "@/services/PrincipalService";




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




export default function DirectoRegional() {

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
        <main className="w-4/5 mx-auto px-4 md:w-4/5 py-12 mt-30 h-full">

            <Consejeros data={consejeros} tipo="gerenteregional" />
            
        </main>
    );
}
