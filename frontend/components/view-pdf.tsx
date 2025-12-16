import React, { useState } from "react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ViewerWrapper = ({ fileUrl }: { fileUrl: string }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Configuración personalizada
  const viewerStyles = {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    overflow: "hidden",
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
  };

  return (
    <div style={viewerStyles}>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer
          fileUrl={fileUrl}
          defaultScale={SpecialZoomLevel.PageFit} // Ajusta la página para que se vea completa
          scrollMode={ScrollMode.Vertical}
          onPageChange={(e) => setCurrentPage(e.currentPage)}
        />
      </Worker>
    </div>
  );
};

export default ViewerWrapper;
