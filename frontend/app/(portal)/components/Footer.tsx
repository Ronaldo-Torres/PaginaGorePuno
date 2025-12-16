"use client";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export default function Footer({
  nombreInstitucion,
  encargadoTransparencia,
  cargoEncargadoTransparencia,
  direccionInstitucion,
  telefonoInstitucion,
  redesSociales,
  correoInstitucion,
}: {
  nombreInstitucion?: string | null;
  encargadoTransparencia?: string | null;
  cargoEncargadoTransparencia?: string | null;
  direccionInstitucion?: string | null;
  telefonoInstitucion?: string | null;
  redesSociales?: any;
}) {

  // return (
  //   <footer className="bg-[#343A40] text-white py-12">
  //     <div className="w-11/12 md:w-4/5 mx-auto px-4">
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

  //         {/* Información básica */}
  //         <div>
  //           <h3 className="text-lg font-bold mb-4 text-yellow-300">
  //             {nombreInstitucion || "Gobierno Regional de Puno"}
  //           </h3>
  //           <div className="space-y-3 text-sm text-gray-300">
  //             <div className="flex items-center gap-2">
  //               <MapPin className="h-4 w-4 text-yellow-300 flex-shrink-0" />
  //               <span>{direccionInstitucion || "Jr. Deustua 356"}, Puno</span>
  //               </div>
  //             <div className="flex items-center gap-2">
  //               <Phone className="h-4 w-4 text-yellow-300 flex-shrink-0" />
  //               <span>{telefonoInstitucion || "987 654 321"}</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Mail className="h-4 w-4 text-yellow-300 flex-shrink-0" />
  //               <span>{correoInstitucion || "gore@regionpuno.gob.pe"}</span>
  //             </div>
  //             </div>
  //           </div>

  //         {/* Enlaces rápidos */}
  //         <div>
  //           <h3 className="text-lg font-bold mb-4 text-yellow-300">
  //             Enlaces Rápidos
  //           </h3>
  //           <div className="space-y-2 text-sm">
  //             <Link href="/" className="block text-gray-300 hover:text-yellow-300 transition-colors">
  //               Inicio
  //             </Link>
  //             <Link href="/consejeros" className="block text-gray-300 hover:text-yellow-300 transition-colors">
  //               Consejeros
  //             </Link>
  //             <Link href="/agenda" className="block text-gray-300 hover:text-yellow-300 transition-colors">
  //               Agenda
  //             </Link>
  //             <Link href="/documentos" className="block text-gray-300 hover:text-yellow-300 transition-colors">
  //               Documentos
  //             </Link>
  //           </div>
  //         </div>

  //         {/* Autoridad */}
  //         <div>

  //           <div className="bg-white/10 rounded-lg p-4">
  //             <h4 className="font-semibold text-white mb-1">
  //                 {encargadoTransparencia || "ENCARGADO TRANSPARENCIA"}
  //             </h4>
  //             <p className="text-sm text-yellow-300">
  //               {cargoEncargadoTransparencia || "CARGO ENCARGADO TRANSPARENCIA"}
  //             </p>
  //             <p className="text-xs text-gray-300 mt-1">
  //               {new Date().getFullYear()}
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Redes sociales */}
  //       {redesSociales && (
  //         <div className="border-t border-white/20 pt-6 mb-6">
  //           <div className="flex justify-center space-x-6">
  //             {redesSociales.facebook && (
  //               <Link
  //                 href={redesSociales.facebook}
  //                 target="_blank"
  //                 className="text-gray-300 hover:text-blue-400 transition-colors"
  //               >
  //                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
  //                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  //                 </svg>
  //               </Link>
  //             )}

  //             {redesSociales.youtube && (
  //               <Link
  //                 href={redesSociales.youtube}
  //                 target="_blank"
  //                 className="text-gray-300 hover:text-red-400 transition-colors"
  //               >
  //                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
  //                   <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  //                 </svg>
  //               </Link>
  //             )}
  //           </div>
  //         </div>
  //       )}

  //       {/* Copyright */}
  //       <div className="border-t border-white/20 pt-6 text-center">
  //         <p className="text-sm text-gray-300">
  //           © {new Date().getFullYear()} Gobierno Regional de Puno. Todos los derechos reservados.
  //         </p>
  //       </div>
  //     </div>
  //   </footer>
  // );

  return (
    <footer className="bg-black/90 text-white py-12">
      <div className="w-11/12 md:w-4/5 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3  gap-8 mb-8">


          {/* Informacion */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b-2 border-white uppercase">
              {nombreInstitucion || "Gobierno Regional de Puno"}
            </h3>
            <div className="flex items-center space-x-1">
              <Image
                src="/logo.png"
                alt="Logo Gobierno Regional de Puno"
                width={50}
                height={150}
              />
              <Image
                src="/logonameFooter.png"
                alt="Logo Gobierno Regional de Puno"
                width={150}
                height={150}
              />
            </div>


            <p className="text-sm font-light my-4">
              La gestión pública es moderna, transparente y democrática en el marco del Estado de derecho, con equidad y justicia social. Su territorio está ordenado y articulado con perspectiva geopolítica.
            </p>
            <div className="w-full flex items-center justify-end mt-6">
              <Image
                src="/tra.png"
                alt="Logo Gobierno Regional de Puno"
                width={250}
                height={150}
              />
            </div>

          </div>


          {/* Transparencia Web */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b-2 border-white">
              TRANSPARENCIA WEB
            </h3>

            <p className="mb-1 font-semibold">
              {encargadoTransparencia || "ENCARGADO TRANSPARENCIA"}
            </p>
            <p className="text-[12px] text-white">
              {cargoEncargadoTransparencia || "CARGO ENCARGADO TRANSPARENCIA"}
            </p>
            <p className="text-xs text-white mt-1">
              {new Date().getFullYear()}
            </p>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b-2 border-white">
              CONTACTO
            </h3>
            <div className="flex flex-col items-center text-center">
              <Image
                src="/escudoperu.png"
                alt="Logo Gobierno Regional de Puno"
                width={80}
                height={80}
              />
              <h3 className="mt-2">República del Perú</h3>
              <h3>Gobierno Regional Puno</h3>
            </div>

            <div className="space-y-3 text-sm text-white mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white flex-shrink-0" />
                <span>{direccionInstitucion || "Jr. Deustua 356"}, Puno</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-white flex-shrink-0" />
                <span>{telefonoInstitucion || "(+051) 354000"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white flex-shrink-0" />
                <span>{correoInstitucion || "gobernacion@regionpuno.gob.pe"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Redes sociales */}
        {redesSociales && (
          <div className="border-t border-gray-300 pt-6 mb-6">
            <div className="flex justify-center space-x-6">
              {redesSociales.facebook && (
                <Link
                  href={redesSociales.facebook}
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              )}

              {redesSociales.youtube && (
                <Link
                  href={redesSociales.youtube}
                  target="_blank"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-md text-white">
            Abg. Richard, HANCCO SONCCO - Gobernador Regional
          </p>
          <p className="text-[11px] text-white mt-1">
            Copyright © 2023-2026 Gobierno Regional Puno. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );

}
