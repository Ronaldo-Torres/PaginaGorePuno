"use client";

import { useEffect, useState } from "react";

interface DebugInfo {
  currentUrl: string;
  domain: string;
  metaTags: Array<{
    property?: string;
    name?: string;
    content: string;
  }>;
  hasOgImage: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgUrl: boolean;
}

export default function ProductionDebug({ enabled = false }: { enabled?: boolean }) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const gatherDebugInfo = () => {
      const currentUrl = window.location.href;
      const domain = window.location.hostname;
      
      // Obtener todos los meta tags relevantes
      const metaTags: Array<{property?: string; name?: string; content: string}> = [];
      
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[property^="article:"], meta[name="description"]').forEach((meta) => {
        const element = meta as HTMLMetaElement;
        metaTags.push({
          property: element.getAttribute('property') || undefined,
          name: element.getAttribute('name') || undefined,
          content: element.getAttribute('content') || '',
        });
      });

      // Verificar meta tags críticos
      const hasOgImage = !!document.querySelector('meta[property="og:image"]');
      const hasOgTitle = !!document.querySelector('meta[property="og:title"]');
      const hasOgDescription = !!document.querySelector('meta[property="og:description"]');
      const hasOgUrl = !!document.querySelector('meta[property="og:url"]');

      setDebugInfo({
        currentUrl,
        domain,
        metaTags,
        hasOgImage,
        hasOgTitle,
        hasOgDescription,
        hasOgUrl,
      });
    };

    // Recopilar información después de un delay
    const timer = setTimeout(gatherDebugInfo, 2000);
    
    return () => clearTimeout(timer);
  }, [enabled]);

  const testFacebookDebugger = () => {
    if (debugInfo) {
      const fbDebuggerUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(debugInfo.currentUrl)}`;
      window.open(fbDebuggerUrl, '_blank');
    }
  };

  const copyMetaTagsToClipboard = () => {
    if (debugInfo) {
      const metaTagsText = debugInfo.metaTags
        .map(tag => `${tag.property || tag.name}: ${tag.content}`)
        .join('\n');
      
      navigator.clipboard.writeText(metaTagsText);
      alert('Meta tags copiados al portapapeles');
    }
  };

  if (!enabled || !debugInfo) return null;

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-blue-500 rounded-lg shadow-xl max-w-md z-50 max-h-[80vh] overflow-y-auto">
      <div className="p-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-bold text-sm">Debug de Producción</h3>
        <p className="text-xs opacity-90">Diagnóstico completo para Facebook</p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Información básica */}
        <div>
          <h4 className="font-bold text-sm mb-2">📍 Información del Sitio</h4>
          <div className="text-xs space-y-1">
            <div><strong>URL:</strong> <span className="break-all">{debugInfo.currentUrl}</span></div>
            <div><strong>Dominio:</strong> {debugInfo.domain}</div>
          </div>
        </div>

        {/* Estado de meta tags críticos */}
        <div>
          <h4 className="font-bold text-sm mb-2">✅ Meta Tags Críticos</h4>
          <div className="text-xs space-y-1">
            <div className={debugInfo.hasOgTitle ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.hasOgTitle ? '✅' : '❌'} og:title
            </div>
            <div className={debugInfo.hasOgDescription ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.hasOgDescription ? '✅' : '❌'} og:description
            </div>
            <div className={debugInfo.hasOgImage ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.hasOgImage ? '✅' : '❌'} og:image
            </div>
            <div className={debugInfo.hasOgUrl ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.hasOgUrl ? '✅' : '❌'} og:url
            </div>
          </div>
        </div>

        {/* Meta tags detectados */}
        <div>
          <h4 className="font-bold text-sm mb-2">🏷️ Meta Tags ({debugInfo.metaTags.length})</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {debugInfo.metaTags.map((tag, index) => (
              <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                <strong className="text-blue-600">{tag.property || tag.name}:</strong>
                <div className="break-all">{tag.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          <button
            onClick={testFacebookDebugger}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded"
          >
            🔗 Abrir Facebook Debugger
          </button>
          
          <button
            onClick={copyMetaTagsToClipboard}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs py-2 px-3 rounded"
          >
            📋 Copiar Meta Tags
          </button>
        </div>

        {/* Información de la imagen */}
        <div>
          <h4 className="font-bold text-sm mb-2">🖼️ Imagen de Facebook</h4>
          <div className="text-xs space-y-1">
            {debugInfo.metaTags.find(tag => tag.property === 'og:image') ? (
              <>
                <div className="text-green-600">✅ Imagen detectada</div>
                <div className="break-all text-gray-600">
                  {debugInfo.metaTags.find(tag => tag.property === 'og:image')?.content}
                </div>
                {debugInfo.metaTags.find(tag => tag.property === 'og:image')?.content.includes('logo.png') && (
                  <div className="text-yellow-600">🔄 Usando logo como fallback</div>
                )}
              </>
            ) : (
              <div className="text-red-600">❌ No se detectó imagen</div>
            )}
          </div>
        </div>

        {/* Diagnóstico automático */}
        <div>
          <h4 className="font-bold text-sm mb-2">🔍 Diagnóstico</h4>
          <div className="text-xs space-y-1">
            {!debugInfo.hasOgImage && (
              <div className="text-red-600">⚠️ Falta og:image - Facebook no mostrará imagen</div>
            )}
            {!debugInfo.hasOgTitle && (
              <div className="text-red-600">⚠️ Falta og:title - Facebook no mostrará título</div>
            )}
            {!debugInfo.hasOgDescription && (
              <div className="text-red-600">⚠️ Falta og:description - Facebook no mostrará descripción</div>
            )}
            {debugInfo.hasOgImage && debugInfo.hasOgTitle && debugInfo.hasOgDescription && (
              <div className="text-green-600">✅ Todos los meta tags básicos están presentes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}