import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Documentos() {
  return (
    <section className="py-12 bg-[#42464f] text-white">
      <div className="w-4/5 mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-1">REPOSITORIO</h2>
            <p className="text-sm text-gray-300 mb-6">DE DOCUMENTOS</p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#063585] text-xs font-bold">
                  1
                </div>
                <span>Reglamento Interno</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#063585] text-xs font-bold">
                  2
                </div>
                <span>Balances de los consejeros</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#063585] text-xs font-bold">
                  3
                </div>
                <span>Acuerdos Regionales</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#063585] text-xs font-bold">
                  4
                </div>
                <span>Ordenanzas Regionales</span>
              </li>
              
            </ul>

            <Button
              variant="outline"
              className="mt-6 px-6 py-2 border-2 border-white text-[#285391] font-medium rounded-md hover:bg-white hover:text-[#285391] transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Link
                href="/documentos"
                className="flex items-center gap-2 justify-between"
              >
                <FileText className="h-4 w-4" />
                Ir a documentos
              </Link>
            </Button>
          </div>

          {/*  <div className="md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-sm h-64">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-lg transform -rotate-6"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-lg transform rotate-3"></div>
              <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
                <Image
                  src="/documento.jpeg"
                  alt="Documento"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-2">
                  DESTACADO
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Separator className="my-6 opacity-30 h-[0.5px]" />
    </section>
  );
}
