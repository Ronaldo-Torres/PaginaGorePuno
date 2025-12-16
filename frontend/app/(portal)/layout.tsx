"use client";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type React from "react";
import {
  Suspense,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { ThemeProvider } from "next-themes";
import PrincipalService from "@/services/PrincipalService";
import Documentos from "./components/documentos";
import { usePathname } from "next/navigation";
import { Outfit } from "next/font/google";
import { Roboto } from "next/font/google";
import { TriangleSpinner } from "@/components/spiners";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Tipos para la respuesta de getAllPrincipal
interface Portada {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  nombreBoton: string;
  urlBoton: string | null;
  imagen: string | null;
}

interface LinkInteres {
  id: number;
  nombre: string;
  url: string;
  imagen: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  url: string | null;
  icono: string;
}

interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  fecha: string;
  activo: boolean;
}

interface Anuncio {
  id: number | null;
  titulo: string | null;
  descripcion: string | null;
  url: string | null;
  fecha: string | null;
  activo: boolean | null;
  tipo: string | null;
  imagen: string | null;
  atentamente: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface MesaDirectiva {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  imagen: string;
  descripcion: string;
}

interface Parametro {
  id: number | null;
  mesaPartesUrl: string | null;
  consultaTramiteUrl: string | null;
  correoInstitucion: string | null;
  nombreInstitucion: string | null;
  direccionInstitucion: string | null;
  telefonoInstitucion: string | null;
  telefonoInstitucion2: string | null;
  mapaInstitucion: string | null;
  encargadoTransparencia: string | null;
  cargoEncargadoTransparencia: string | null;
  numeroResolucionTransparencia: string | null;
  encargadoTransparenciaSecundario: string | null;
  cargoEncargadoTransparenciaSecundario: string | null;
  numeroResolucionTransparenciaSecundario: string | null;
  nosotros: string | null;
  mision: string | null;
  vision: string | null;
  objetivos: string | null;
  valores: string | null;
  historia: string | null;
  logoInstitucionLight: string | null;
  logoInstitucionDark: string | null;
  redesSociales: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  } | null;
  tituloPresidencia: string | null;
  descripcionPresidencia: string | null;
  tituloServicio: string | null;
  descripcionServicio: string | null;
  tituloAgenda: string | null;
  descripcionAgenda: string | null;
  tituloNoticias: string | null;
  descripcionNoticias: string | null;
  tituloBoletin: string | null;
  descripcionBoletin: string | null;
  tituloDocumentos: string | null;
  descripcionDocumentos: string | null;
  tituloEnlaces: string | null;
  descripcionEnlaces: string | null;
  tituloVideo: string | null;
  descripcionVideo: string | null;
}

interface PrincipalResponse {
  portadas: Portada[];
  linkInteres: LinkInteres[];
  noticias: Noticia[];
  servicios: Servicio[];
  mesaDirectiva: MesaDirectiva[];
  anuncio: Anuncio;
  parametro: Parametro;
}

interface PrincipalContextType {
  principal: PrincipalResponse | null;
  loading: boolean;
  error: string | null;
}

// Context para compartir los datos
const PrincipalContext = createContext<PrincipalContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export const usePrincipal = () => {
  const context = useContext(PrincipalContext);
  if (context === undefined) {
    throw new Error("usePrincipal must be used within a PrincipalProvider");
  }
  return context;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [principal, setPrincipal] = useState<PrincipalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const getParametro = async () => {
    try {
      setLoading(true);
      setError(null);

      // Agregar una tardanza de 3 segundos para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await PrincipalService.getAllPrincipal();
      setPrincipal(response.data);
    } catch (error) {
      console.log(error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getParametro();
  }, []);

  // Determinar si es la página principal
  const isHomePage = pathname === "/";

  return (
    <div
      style={
        {
          "--secondary-foreground": "#ffffff",
        } as React.CSSProperties
      }
      suppressHydrationWarning
      className={outfit.className}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        disableTransitionOnChange
      >
        <PrincipalContext.Provider value={{ principal, loading, error }}>
          {loading ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <TriangleSpinner />
                <p className="text-gray-600 text-lg mt-4">Cargando...</p>
              </div>
            </div>
          ) : (
            <>
              <Navbar
                loading={loading}
                correoInstitucion={principal?.parametro?.correoInstitucion}
                direccionInstitucion={
                  principal?.parametro?.direccionInstitucion
                }
                telefonoInstitucion={principal?.parametro?.telefonoInstitucion}
                telefonoInstitucion2={
                  principal?.parametro?.telefonoInstitucion2
                }
                logoInstitucionDark={principal?.parametro?.logoInstitucionDark}
                logoInstitucionLight={
                  principal?.parametro?.logoInstitucionLight
                }
                isHomePage={isHomePage}
              />
              <main
                className={`flex-grow ${!isHomePage ? "pt-[88px]" : "pt-0"}`}
              >
                {children}
              </main>
              {/* <Documentos /> */}
              <Footer
                nombreInstitucion={principal?.parametro?.nombreInstitucion}
                encargadoTransparencia={
                  principal?.parametro?.encargadoTransparencia
                }
                cargoEncargadoTransparencia={
                  principal?.parametro?.cargoEncargadoTransparencia
                }
                direccionInstitucion={
                  principal?.parametro?.direccionInstitucion
                }
                telefonoInstitucion={principal?.parametro?.telefonoInstitucion}
                redesSociales={principal?.parametro?.redesSociales}
              />
            </>
          )}
        </PrincipalContext.Provider>
      </ThemeProvider>
    </div>
  );
}
