import { LoginForm } from "@/components/login-form";
import { FaUserShield, FaBuilding } from "react-icons/fa";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header del login */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border shadow-lg">
              <Image 
                src="/logoheader.png" 
                alt="Logo Gobierno Regional Puno" 
                width={80} 
                height={80}
                className="drop-shadow-sm"
              />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-wide">
            Sistema de Gestión
          </h1>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-0.5 bg-primary/60 rounded-full"></div>
            <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
            <div className="w-12 h-0.5 bg-primary/60 rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-base font-medium">
            Gobierno Regional de Puno
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FaUserShield className="h-4 w-4" />
              <span className="text-sm font-medium">Acceso Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FaBuilding className="h-4 w-4" />
              <span className="text-sm font-medium">Gobierno Regional</span>
            </div>
          </div>
        </div>

        {/* Formulario de login */}
        <LoginForm />
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            © 2025 Gobierno Regional de Puno
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
