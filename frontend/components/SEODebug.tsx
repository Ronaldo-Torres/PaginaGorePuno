"use client";

import { useEffect, useState } from "react";

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export default function SEODebug({ enabled = false }: { enabled?: boolean }) {
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const getAllMetaTags = () => {
      const metas = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[property^="article:"], meta[name="description"]');
      const tags: MetaTag[] = [];
      
      metas.forEach((meta) => {
        const element = meta as HTMLMetaElement;
        tags.push({
          name: element.getAttribute('name') || undefined,
          property: element.getAttribute('property') || undefined,
          content: element.getAttribute('content') || '',
        });
      });
      
      setMetaTags(tags);
    };

    // Verificar meta tags después de un pequeño delay para asegurar que se hayan aplicado
    const timer = setTimeout(getAllMetaTags, 1000);
    
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || typeof window === 'undefined') return null;

  const refreshMetaTags = () => {
    const getAllMetaTags = () => {
      const metas = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[property^="article:"], meta[name="description"]');
      const tags: MetaTag[] = [];
      
      metas.forEach((meta) => {
        const element = meta as HTMLMetaElement;
        tags.push({
          name: element.getAttribute('name') || undefined,
          property: element.getAttribute('property') || undefined,
          content: element.getAttribute('content') || '',
        });
      });
      
      setMetaTags(tags);
    };
    getAllMetaTags();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-lg max-h-96 overflow-y-auto z-50 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">SEO Debug - Meta Tags</h3>
        <button 
          onClick={refreshMetaTags}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Refrescar
        </button>
      </div>
      
      <div className="space-y-1">
        <div><strong>Title:</strong> {document.title}</div>
        <div><strong>URL:</strong> {window.location.href}</div>
        <div><strong>Total Meta Tags:</strong> {metaTags.length}</div>
      </div>

      <div className="mt-3">
        <strong>Meta Tags Detectados:</strong>
        <div className="mt-1 space-y-1 max-h-48 overflow-y-auto">
          {metaTags.map((tag, index) => (
            <div key={index} className="text-xs bg-gray-800 p-1 rounded">
              <span className="text-blue-300">
                {tag.property || tag.name}:
              </span>{' '}
              <span className="text-gray-300 break-all">{tag.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600 space-y-2">
        <strong>Herramientas de Debug:</strong>
        <div className="space-y-1">
          <a 
            href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(window.location.href)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 text-xs"
          >
            🔗 Facebook Debugger
          </a>
          <a 
            href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(window.location.href)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 text-xs"
          >
            🔗 Twitter Card Validator
          </a>
          <div className="text-yellow-300 text-xs mt-2">
            ⚠️ En localhost, Facebook no puede acceder. Deploy para probar.
          </div>
        </div>
      </div>
    </div>
  );
}