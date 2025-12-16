"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

/**
 * Componente para sincronizar el estado de autenticación al inicio de la aplicación
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar si hay un token de acceso al cargar la aplicación
    const hasToken = !!Cookies.get("accessToken");
    const { isAuthenticated, checkAuthStatus } = useAuthStore.getState();

    // Sincronizar el estado de Zustand con el estado real de las cookies
    if (hasToken !== isAuthenticated) {
      checkAuthStatus();
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // No realizar redirecciones hasta que el estado esté inicializado
    if (!isInitialized) return;

    // Verificar el token actual
    const hasToken = !!Cookies.get("accessToken");

    // Manejar redirecciones basadas en autenticación
    const authRequired = pathname.startsWith("/dashboard");
    const authPages = ["/login", "/signup", "/forgot-password"];
    const isAuthPage = authPages.includes(pathname);

    // Si el usuario está en una página que requiere autenticación pero no está autenticado
    if (authRequired && !hasToken) {
      router.push("/login");
    }

    // Si el usuario está autenticado pero está en una página de autenticación, redirigir al dashboard
    if (hasToken && isAuthPage) {
      router.push("/dashboard");
    }
  }, [pathname, router, isInitialized]);

  return <>{children}</>;
}
