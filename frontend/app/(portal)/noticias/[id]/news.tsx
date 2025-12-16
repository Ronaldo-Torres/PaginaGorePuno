import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaShare,
  FaTags,
  FaImages,
  FaQuoteLeft,
  FaInfoCircle,
} from "react-icons/fa";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  image: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  }
};

interface Imagen {
  id: string;
  url: string;
  descripcion?: string;
  esPrincipal?: boolean;
}

interface Consejero {
  id: string;
  nombre: string;
}

interface Comision {
  id: string;
  nombre: string;
}

interface NoticiaProps {
  imagenes: Imagen[];
  titulo: string;
  entradilla: string;
  introduccion: string;
  contenido: string;
  conclusion?: string;
  categoria?: string;
  fechaPublicacion: string;
  autor: string;
  tags: string[];
  consejeros: Consejero[];
  comisiones: Comision[];
  gorro?: string;
  bajada?: string;
  nota?: string;
  onImageClick?: (imageUrl: string) => void;
}

const Noticia = ({
  noticia,
  onImageClick,
}: {
  noticia: NoticiaProps;
  onImageClick?: (imageUrl: string) => void;
}) => {
  if (!noticia) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <FaInfoCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Noticia no encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const imagenes = noticia.imagenes || [];
  const imagenPrincipal = imagenes.find((imagen) => imagen.esPrincipal);

  // console.log(noticia)
  // console.log(imagenes)

  const compartirEnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const compartirEnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const texto = encodeURIComponent(noticia.titulo);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${texto}`, "_blank");
  };

  const copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
    // Aquí podrías usar un toast en lugar de alert
    alert("Enlace copiado al portapapeles");
  };

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const tags = noticia.tags || [];
  const consejeros = noticia.consejeros || [];
  const comisiones = noticia.comisiones || [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container as any}
    >
      <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl">
        {/* Antetítulo (Gorro) - Manteniendo colores rojos originales */}
        {noticia.gorro && (
          <motion.div
            variants={animations.item as any}
            className="bg-red-100 text-red-800 px-6 py-3 border-l-4 border-red-500"
          >
            <div className="flex items-center gap-2">
              <FaQuoteLeft className="h-3 w-3 text-red-600" />
              <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: noticia.gorro }} />
            </div>
          </motion.div>
        )}

        {/* Header del Artículo */}
        <motion.div variants={animations.item as any} className="p-6 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {noticia.titulo}
          </h1>

          {/* Bajada o entradilla */}
          {noticia.bajada && (
            <div
              className="text-lg text-gray-700 font-medium leading-relaxed mb-6 p-4 bg-gray-50 rounded-xl border-l-4 border-[#184482]"
              dangerouslySetInnerHTML={{ __html: noticia.bajada }}
            />
          )}

          {/* Metadatos */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#184482]/10 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="h-3 w-3 text-[#184482]" />
              </div>
              <span className="font-medium text-sm">{formatearFecha(noticia.fechaPublicacion)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                <FaUser className="h-3 w-3 text-green-600" />
              </div>
              <span className="font-medium text-sm">{noticia.autor}</span>
            </div>

            {noticia.categoria && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {noticia.categoria}
              </Badge>
            )}
          </div>
        </motion.div>

        <CardContent className="p-6 pt-0">
          {/* Introducción */}
          {noticia.introduccion && (
            <motion.div
              variants={animations.item as any}
              className="mb-8"
            >
              <div
                className="text-base font-medium text-gray-800 leading-relaxed p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500"
                dangerouslySetInnerHTML={{ __html: noticia.introduccion }}
              />
            </motion.div>
          )}

          {/* Fotografía principal */}
          {imagenPrincipal && (
            <motion.figure
              variants={animations.image as any}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer">
                <Image
                  src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + imagenPrincipal.url}
                  alt="Imagen principal de la noticia"
                  width={800}
                  height={500}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  onClick={() =>
                    onImageClick?.(
                      process.env.NEXT_PUBLIC_STORAGE_BASE_URL + imagenPrincipal.url
                    )
                  }
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaImages className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              {imagenPrincipal.descripcion && (
                <figcaption className="text-sm text-gray-600 mt-3 italic text-center px-4">
                  {imagenPrincipal.descripcion}
                </figcaption>
              )}
            </motion.figure>
          )}

          {/* Cuerpo de la noticia */}
          <motion.div variants={animations.item as any} className="space-y-6">
            {/* Contenido principal */}
            <div
              className="prose prose-base max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            />

            {/* Galería de imágenes */}
            {imagenes.filter((img) => !img.esPrincipal).length > 0 && (
              <motion.div
                variants={animations.item as any}
                className="my-8"
              >
                <div className="mb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FaImages className="h-4 w-4 text-[#184482]" />
                    Galería de Imágenes
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imagenes
                    .filter((img) => !img.esPrincipal)
                    .map((imagen, index) => (
                      <motion.figure
                        key={imagen.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="overflow-hidden rounded-xl shadow-lg">
                          <Image
                            src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + imagen.url}
                            alt={imagen.descripcion || "Imagen de la noticia"}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            onClick={() =>
                              onImageClick?.(
                                process.env.NEXT_PUBLIC_STORAGE_BASE_URL + imagen.url
                              )
                            }
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        </div>
                        {imagen.descripcion && (
                          <figcaption className="text-sm text-gray-600 mt-2 italic">
                            {imagen.descripcion}
                          </figcaption>
                        )}
                      </motion.figure>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Conclusión */}
            {noticia.conclusion && (
              <motion.div
                variants={animations.item as any}
                className="mt-8"
              >
                <div
                  className="text-base text-gray-800 leading-relaxed p-4 bg-green-50 rounded-xl border-l-4 border-green-500"
                  dangerouslySetInnerHTML={{ __html: noticia.conclusion }}
                />
              </motion.div>
            )}

            {/* Nota */}
            {noticia.nota && (
              <motion.div
                variants={animations.item as any}
                className="mt-6"
              >
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div
                      className="text-sm text-gray-800"
                      dangerouslySetInnerHTML={{ __html: noticia.nota }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Compartir en Redes Sociales */}
          <motion.div
            variants={animations.item as any}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FaShare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Compartir artículo:</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={compartirEnFacebook}
                  className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                >
                  <FaFacebook className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Facebook</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={compartirEnTwitter}
                  className="flex items-center gap-2 border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors duration-300"
                >
                  <FaTwitter className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Twitter</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copiarEnlace}
                  className="flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                >
                  <FaLink className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Copiar enlace</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tags y Enlaces - Manteniendo el color rojo original */}
          <motion.div
            variants={animations.item as any}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="space-y-4">
              {/* Header de Tags - Manteniendo color rojo original */}
              <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg">
                <FaTags className="h-3 w-3" />
                TAGS DE LA NOTICIA
              </div>
              
              {/* Tags y Enlaces */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Link key={tag} href={`/noticias/todas?tag=${tag}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-50 transition-colors duration-300 border-gray-300 text-gray-700 text-xs"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
                
                {consejeros.map((consejero) => (
                  <Link key={consejero.id} href={`/noticias/todas?consejero=${consejero.nombre}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 transition-colors duration-300 border-blue-300 text-blue-700 text-xs"
                    >
                      👤 {consejero.nombre}
                    </Badge>
                  </Link>
                ))}
                
                {comisiones.map((comision) => (
                  <Link key={comision.id} href={`/noticias/todas?comision=${comision.nombre}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-50 transition-colors duration-300 border-purple-300 text-purple-700 text-xs"
                    >
                      🏛️ {comision.nombre}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Noticia;
