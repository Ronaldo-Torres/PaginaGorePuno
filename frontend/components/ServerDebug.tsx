"use client";

import { useEffect, useState } from "react";

interface ServerDebugProps {
  enabled?: boolean;
}

export default function ServerDebug({ enabled = false }: ServerDebugProps) {
  const [serverInfo, setServerInfo] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Verificar variables de entorno y configuración
    const info = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      storageBaseUrl: process.env.NEXT_PUBLIC_STORAGE_BASE_URL,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
    };

    setServerInfo(info);
  }, [enabled]);

  if (!enabled || !serverInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50 text-xs">
      <h3 className="font-bold mb-2">🔧 Server Debug Info</h3>
      
      <div className="space-y-1">
        <div><strong>API URL:</strong> {serverInfo.apiUrl || 'No configurada'}</div>
        <div><strong>Base URL:</strong> {serverInfo.baseUrl || 'No configurada'}</div>
        <div><strong>Storage URL:</strong> {serverInfo.storageBaseUrl || 'No configurada'}</div>
        <div><strong>Current URL:</strong> {serverInfo.currentUrl}</div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600">
        <div><strong>Es bot?</strong> {serverInfo.userAgent.includes('bot') ? 'Sí' : 'No'}</div>
        <div><strong>Es Facebook?</strong> {serverInfo.userAgent.includes('facebook') ? 'Sí' : 'No'}</div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600 text-yellow-300">
        <div className="text-xs">Variables de entorno en producción:</div>
        <div className="text-xs">NEXT_PUBLIC_API_URL debe apuntar al backend</div>
        <div className="text-xs">NEXT_PUBLIC_STORAGE_BASE_URL debe ser accesible públicamente</div>
      </div>
    </div>
  );
}