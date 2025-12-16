import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import PrincipalService from "@/services/PrincipalService";
import { DownloadIcon, FileTextIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewerWrapper from "../components/view-pdf";
import { FileText } from "lucide-react";

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

interface Anexo {
  nuEmi: string;
  deDet: string;
  urlAnexo: string;
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
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnexo, setSelectedAnexo] = useState<Anexo | null>(null);
  const [verPDF, setVerPDF] = useState(false);

  useEffect(() => {
    const fetchAnexo = async () => {
      try {
        const response = await PrincipalService.getAnexoSgd(documento.id);
        setAnexos(response);
      } catch (error) {
        console.error("Error al obtener anexos:", error);
      }
    };

    if (documento.id) {
      fetchAnexo();
    }
  }, [documento.id]);

  console.log(anexos);

  const handleDownload = (urlAnexo: string, fileName: string) => {
    const fullUrl = `${urlAnexo}`;

    // Crear un enlace temporal y simular clic para descargar
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPdf = (anexo: Anexo) => {
    setSelectedAnexo(anexo);
    // En dispositivos móviles, activamos la vista de PDF
    if (window.innerWidth < 768) {
      setVerPDF(true);
    }
  };

  const volverALista = () => {
    setVerPDF(false);
  };

  const cerrarModal = () => {
    setVerPDF(false);
    setSelectedAnexo(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={cerrarModal}>
      <DialogContent className="max-w-auto md:max-w-[80vw] max-h-auto w-full bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-[#184482]">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#062854]">
                {documento.tipoDocumento?.codigo} {documento.numeroDocumento}-
                {documento.anio?.anio || new Date().getFullYear()}
              </h2>
              <p className="text-gray-600 mt-2">{documento.nombreDocumento}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Vista para móviles: Mostrar una sección a la vez */}
        <div className="md:hidden flex flex-col w-full">
          {!verPDF ? (
            // Lista de anexos en vista móvil
            <div className="w-full">
              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  Cargando anexos...
                </div>
              ) : anexos.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-2">
                    Anexos del documento
                  </h2>
                  <div className="divide-y divide-gray-100">
                    {anexos.map((item, index) => (
                      <div
                        key={`${item.id}_${index}`}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.nombreDocumento}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Nº Emisión: {item.numeroDocumento}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleViewPdf(item)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Ver PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No hay anexos disponibles para este documento
                </div>
              )}
            </div>
          ) : (
            // Visor de PDF en vista móvil
            <div className="w-full">
              <div className="flex items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={volverALista}
                  className="mr-2 bg-white text-[#184482] border-[#184482]/20 hover:bg-[#184482]/5"
                >
                  Volver
                </Button>
                <h2 className="text-lg font-medium text-[#184482] truncate">
                  {selectedAnexo?.nombreDocumento}
                </h2>
              </div>
              <div className="h-[50vh] bg-red-500">
                {selectedAnexo && (
                  <ViewerWrapper fileUrl={`${selectedAnexo.urlAnexo}`} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vista para desktop: Mostrar ambas secciones lado a lado */}
        <div className="hidden md:flex w-full h-full gap-4">
          {/* Panel izquierdo: Lista de anexos */}
          <div className="w-1/3 overflow-auto border-r pr-4 max-h-[70vh]">
            {loading ? (
              <div className="py-8 text-center text-gray-500">
                Cargando anexos...
              </div>
            ) : anexos.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  Anexos del documento
                </h2>
                <div className="divide-y divide-gray-100">
                  {anexos.map((item, index) => (
                    <div
                      key={`${item.id}_${index}`}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.nombreDocumento}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Nº Emisión: {item.numeroDocumento}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewPdf(item)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No hay anexos disponibles para este documento
              </div>
            )}
          </div>

          {/* Panel derecho: Visor de PDF */}
          <div className="w-2/3 h-full">
            {selectedAnexo ? (
              <div className="h-full flex flex-col">
                <div className="mb-2 pb-2 border-b">
                  <h2 className="text-lg font-medium text-[#184482]">
                    {selectedAnexo.nombreDocumento}
                  </h2>
                </div>
                <div className="flex-grow h-[70vh]">
                  <ViewerWrapper fileUrl={`${selectedAnexo.urlAnexo}`} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                <div className="text-center p-8">
                  <FileTextIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Seleccione un anexo para visualizar su contenido</p>
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
