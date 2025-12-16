import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ViewerWrapper from "../components/view-pdf";
import { Button } from "@/components/ui/button";
import { FaDownload, FaFilePdf } from "react-icons/fa";

interface Documento {
  id: number;
  numeroDocumento: string;
  nombreDocumento: string;
  descripcion: string;
  fechaEmision: string;
  activo: boolean;
  urlDocumento: string;
  tipoDocumento: {
    id: number;
    nombre: string;
    descripcion: string;
    codigo: string;
    activo: boolean;
    anio: {
      id: number;
      anio: string;
    };
  };
  anio: {
    id: number;
    anio: string;
  };
}

const DocumentoModal = ({
  isOpen,
  onClose,
  documento,
}: {
  isOpen: boolean;
  onClose: () => void;
  documento: Documento;
}) => {
  if (!documento) return null;

  const handleDownload = (nombreBlDoc: string, fileName: string) => {
    const fullUrl = `${nombreBlDoc}`;

    // Crear un enlace temporal y simular clic para descargar
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //concatenar el url storage a la url del documento
  const urlDocumento = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${documento.urlDocumento}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] w-full h-[95vh] p-0 bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="flex flex-col h-full rounded-xl overflow-hidden">
          <style jsx>{`
            .rpv-core__viewer {
              height: 100% !important;
              overflow: auto !important;
            }
            
            .rpv-core__page-layer {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .rpv-core__page {
              margin: 0 auto 1rem auto !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Asegurar que el contenedor del PDF tenga scroll */
            .rpv-core__inner-page {
              overflow: auto !important;
            }
          `}</style>
          {/* Header simplificado */}
          <div className="flex-shrink-0 bg-[#062854] text-white rounded-t-xl">
            <div className="p-3 md:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FaFilePdf className="h-5 w-5 text-white flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm md:text-base font-bold text-white truncate">
                      {documento.tipoDocumento?.codigo} {documento.numeroDocumento}-{documento.anio?.anio}
                    </h2>
                    <p className="text-white/80 text-xs md:text-sm truncate">
                      {documento.nombreDocumento}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 flex-shrink-0"
                  onClick={() =>
                    handleDownload(urlDocumento, documento.nombreDocumento)
                  }
                >
                  <FaDownload className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Descargar</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido del documento con scroll completo */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="min-h-[80vh]">
              <ViewerWrapper fileUrl={urlDocumento} />
            </div>
            
            {/* Descripción al final del contenido */}
            {documento.descripcion && (
              <div className="bg-white border-t border-gray-200 mt-4">
                <div className="p-4 rounded-b-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#062854] rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#062854] mb-1">Descripción</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {documento.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoModal;
