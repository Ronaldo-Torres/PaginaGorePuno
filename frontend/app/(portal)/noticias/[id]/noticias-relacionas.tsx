import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaNewspaper, FaCalendarAlt, FaArrowRight, FaImage } from "react-icons/fa";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  },
  item: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  },
  header: {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }
};

interface NoticiaRelacionada {
  id: number;
  titulo: string;
  fechaPublicacion: string;
  urlImagenPrincipal?: string;
  categoria?: string;
  gorro?: string;
}

const NoticiasRelacionadas = ({
  noticiasRelacionadas,
}: {
  noticiasRelacionadas: NoticiaRelacionada[];
}) => {
  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const truncarTitulo = (titulo: string, maxLength: number = 65) => {
    return titulo.length > maxLength ? `${titulo.slice(0, maxLength)}...` : titulo;
  };

  if (!noticiasRelacionadas || noticiasRelacionadas.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-3xl">
        {/* Header - Manteniendo color rojo original */}
        <div className="bg-red-600 text-white p-4 rounded-t-3xl">
          <h2 className="flex items-center gap-2 font-bold text-base">
            <FaNewspaper className="h-4 w-4" />
            Noticias Relacionadas
          </h2>
        </div>
        
        <CardContent className="p-6 text-center text-gray-500">
          <FaNewspaper className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-sm">No hay noticias relacionadas disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container as any}
    >
      <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-3xl">
        {/* Header - Manteniendo color rojo original con más redondeo */}
        <motion.div
          variants={animations.header as any}
          className="bg-red-600 text-white p-4 rounded-t-3xl"
        >
          <h2 className="flex items-center gap-2 font-bold text-base">
            <FaNewspaper className="h-4 w-4" />
            Noticias Relacionadas
            <Badge variant="outline" className="ml-2 bg-white/20 border-white/30 text-white text-xs px-2 py-1 rounded-full">
              {noticiasRelacionadas.length}
            </Badge>
          </h2>
        </motion.div>
        
        {/* Lista de Noticias */}
        <div className="divide-y divide-gray-100">
          {noticiasRelacionadas.map((item, index) => (
            <motion.div
              key={item?.id}
              variants={animations.item as any}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/noticias/${item?.id}`}
                className="group block p-4 hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex gap-3">
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-12 overflow-hidden rounded-xl bg-gray-100">
                      {item?.urlImagenPrincipal ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${item.urlImagenPrincipal}`}
                          alt="Imagen de la noticia"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                          <FaImage className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"></div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Título */}
                    <h3 className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-[#184482] transition-colors duration-300 line-clamp-2">
                      {truncarTitulo(item?.titulo || "Sin título")}
                    </h3>

                    {/* Gorro/Antetítulo si existe */}
                    {item?.gorro && (
                      <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg inline-block">
                        {item.gorro.length > 25 ? `${item.gorro.slice(0, 25)}...` : item.gorro}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span className="text-xs">{formatearFecha(item?.fechaPublicacion || "")}</span>
                      </div>
                      
                      {/* Indicador de hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaArrowRight className="h-3 w-3 text-[#184482]" />
                      </div>
                    </div>

                    {/* Categoría si existe */}
                    {item?.categoria && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gray-50 text-gray-600 border-gray-200 px-2 py-0.5 rounded-lg"
                      >
                        {item.categoria}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer con enlace a todas las noticias */}
        <motion.div
          variants={animations.item as any}
          className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl"
        >
          <Link
            href="/noticias/todas"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-[#184482] hover:text-[#1a4c94] transition-colors duration-300 group"
          >
            <span>Ver todas las noticias</span>
            <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default NoticiasRelacionadas;
