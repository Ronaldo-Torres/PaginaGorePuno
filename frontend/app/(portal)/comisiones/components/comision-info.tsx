import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users } from "lucide-react";
import Image from "next/image";

interface Consejero {
  id: number;
  nombres: string;
  apellidos: string;
  foto: string;
  cargo?: string;
}

interface ComisionInfoProps {
  consejeroComision: {
    nombre: string;
    descripcion: string;
    consejeros?: Consejero[];
  };
}

export default function ComisionInfo({ consejeroComision }: ComisionInfoProps) {
  const consejeros = consejeroComision?.consejeros || [];

  return (
    <div className="space-y-8">
      {/* Título principal de la comisión */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#062854]">
          {consejeroComision?.nombre}
        </h1>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Comisión de Trabajo
          </span>
          <div className="w-16 h-1 bg-gradient-to-l from-yellow-400 to-yellow-500 rounded-full"></div>
        </div>
      </div>

      {/* Descripción de la comisión */}
      {consejeroComision?.descripcion && (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg text-center max-w-3xl mx-auto">
            {consejeroComision.descripcion}
          </p>
        </div>
      )}

      {/* Fotos de los consejeros */}
      {consejeros.length > 0 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
          <CardHeader className="pb-6 border-b border-gray-100">
            <CardTitle className="flex items-center text-2xl font-bold text-[#062854]">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-[#062854]" />
              </div>
              Integrantes de la Comisión
              <span className="ml-auto bg-yellow-400 text-[#062854] px-3 py-1 rounded-full text-sm font-bold">
                {consejeros.length}
              </span>
            </CardTitle>
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Miembros Activos
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consejeros.map((consejero) => (
                <div
                  key={consejero.id}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                >
                  {/* Foto del consejero */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/10 transition-all duration-500"></div>
                    <Image
                      src={`http://localhost:8080/api/uploads/${consejero.foto}`}
                      alt={`${consejero.nombres} ${consejero.apellidos}`}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                              <div class="text-center">
                                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                                  <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                  </svg>
                                </div>
                                <p class="text-sm text-gray-500 font-medium">Foto no disponible</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />

                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062854]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Botón de info que aparece en hover */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Información del consejero */}
                  <div className="p-6 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50 transition-all duration-500">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-[#062854] mb-1 group-hover:text-blue-600 transition-colors duration-300">
                        {consejero.nombres}
                      </h3>
                      <h4 className="text-lg font-bold text-[#062854] mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {consejero.apellidos}
                      </h4>
                      {consejero.cargo && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-[#062854] group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                          {consejero.cargo}
                        </div>
                      )}
                    </div>

                    {/* Línea decorativa */}
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent group-hover:via-yellow-400 transition-all duration-500"></div>
                  </div>

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
