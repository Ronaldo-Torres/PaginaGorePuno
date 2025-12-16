"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FacebookPreviewProps {
  enabled?: boolean;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function FacebookPreview({ enabled = false }: FacebookPreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const extractMetaTags = () => {
      const getMetaContent = (property: string) => {
        const meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        return meta?.getAttribute('content') || '';
      };

      const data: PreviewData = {
        title: getMetaContent('og:title') || document.title,
        description: getMetaContent('og:description') || 
                    (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.getAttribute('content') || '',
        image: getMetaContent('og:image'),
        url: getMetaContent('og:url') || window.location.href,
      };

      setPreviewData(data);
    };

    // Extraer meta tags después de un delay para asegurar que se hayan aplicado
    const timer = setTimeout(extractMetaTags, 2000);
    
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || !previewData) return null;

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-md z-50">
      <div className="p-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-bold text-sm">Preview de Facebook</h3>
        <p className="text-xs opacity-90">Cómo se vería al compartir</p>
      </div>
      
      <div className="p-0">
        {/* Imagen - Siempre mostrar imagen (original o fallback) */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={previewData.image || 'https://consejoregional.regionpuno.gob.pe/logo.png'}
            alt="Preview"
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.log('❌ Error cargando imagen en preview, usando fallback');
              target.src = 'https://consejoregional.regionpuno.gob.pe/logo.png';
            }}
          />
        </div>
        
        {/* Contenido */}
        <div className="p-3 border-t border-gray-200">
          {/* URL */}
          <div className="text-xs text-gray-500 uppercase mb-1 truncate">
            {previewData.url.replace(/^https?:\/\//, '')}
          </div>
          
          {/* Título */}
          <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
            {previewData.title || 'Sin título'}
          </div>
          
          {/* Descripción */}
          <div className="text-xs text-gray-600 line-clamp-2">
            {previewData.description || 'Sin descripción'}
          </div>
        </div>
      </div>
      
      {/* Información de debug */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="text-xs space-y-1">
          <div><strong>Imagen:</strong> {previewData.image ? '✅ Sí' : '❌ No'}</div>
          <div><strong>Título:</strong> {previewData.title ? '✅ Sí' : '❌ No'}</div>
          <div><strong>Desc:</strong> {previewData.description ? '✅ Sí' : '❌ No'}</div>
        </div>
      </div>
    </div>
  );
}