import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface ViewerWrapperProps {
  fileUrl: string;
}

const ViewerWrapper: React.FC<ViewerWrapperProps> = ({ fileUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFileUrl = useRef<string>("");

  // Memoizar la URL del worker para evitar re-renderizados
  const workerUrl = useMemo(() => 
    `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`, 
    []
  );

  // Memoizar el callback para evitar re-renderizados
  const handlePageChange = useCallback((e: any) => {
    setCurrentPage(e.currentPage);
  }, []);

  // Efecto para manejar cambios de URL
  useEffect(() => {
    if (fileUrl !== previousFileUrl.current) {
      setIsLoading(true);
      setHasError(false);
      previousFileUrl.current = fileUrl;
    }
  }, [fileUrl]);

  // Efecto para detectar cuando el PDF se carga correctamente
  useEffect(() => {
    if (currentPage > 0 && isLoading) {
      setIsLoading(false);
    }
  }, [currentPage, isLoading]);

  // Memoizar el componente Worker para evitar recreaciones
  const workerComponent = useMemo(() => (
    <Worker workerUrl={workerUrl}>
      <Viewer
        fileUrl={fileUrl}
        defaultScale={SpecialZoomLevel.PageWidth}
        scrollMode={ScrollMode.Vertical}
        onPageChange={handlePageChange}
        renderError={(error) => {
          setHasError(true);
          setIsLoading(false);
          return (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium mb-1">Error al cargar el PDF</p>
                <p className="text-sm text-gray-500">{error.message}</p>
              </div>
            </div>
          );
        }}
        renderLoader={(percentages) => {
          setIsLoading(true);
          return (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center p-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600 font-medium">Cargando PDF...</p>
                <p className="text-xs text-gray-500">{Math.round(percentages)}%</p>
              </div>
            </div>
          );
        }}
      />
    </Worker>
  ), [fileUrl, workerUrl, handlePageChange]);

  // Memoizar el contenedor principal
  const containerComponent = useMemo(() => (
    <div 
      ref={containerRef}
      className="w-full h-full pdf-viewer-container" 
      style={{ 
        height: '100%',
        position: 'relative',
        overflow: 'auto',
        willChange: 'auto'
      }}
    >
      {workerComponent}
    </div>
  ), [workerComponent]);

  return containerComponent;
};

export default ViewerWrapper;
