"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { NextSeo, ArticleJsonLd } from "next-seo";

import Noticia from "./news";
import PrincipalService from "@/services/PrincipalService";
import NoticiasRelacionadas from "./noticias-relacionas";

// Interfaces
interface NoticiaData {
  id: number;
  titulo: string;
  entradilla?: string;
  introduccion?: string;
  contenido: string;
  categoria?: string;
  fechaPublicacion: string;
  fechaActualizacion?: string;
  autor: string;
  tags?: string[];
  imagenes?: Array<{
    id: string;
    url: string;
    descripcion?: string;
    esPrincipal?: boolean;
  }>;
}

interface Props {
  params: { id: string };
  initialNoticia?: NoticiaData | null;
}

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
  button: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }
};

export default function NoticiaClientPage({ params, initialNoticia }: Props) {
  const { id } = params;
  const [noticia, setNoticia] = useState<NoticiaData | null>(initialNoticia || null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState<any[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialNoticia);
  const [error, setError] = useState<string | null>(null);

  const getNoticia = useCallback(async () => {
    if (initialNoticia) return; // Ya tenemos datos del servidor
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await PrincipalService.getNoticia(parseInt(id));
      setNoticia(response);
    } catch (error) {
      console.error("❌ Error al cargar la noticia:", error);
      setError(`Error al cargar la noticia: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, initialNoticia]);

  useEffect(() => {
    getNoticia();
  }, [getNoticia]);

  const getNoticiasByCategoria = async () => {
    try {
      const response = await PrincipalService.getNoticiasByCategoria({
        categoria: noticia?.categoria,
        page: 0,
        size: 10,
      });
      setNoticiasRelacionadas(response.content);
    } catch (error) {
      console.error("Error al cargar noticias relacionadas:", error);
    }
  };

  useEffect(() => {
    noticia && getNoticiasByCategoria();
  }, [noticia]);

  // Preparar datos SEO cuando se carga la noticia
  const getSEOData = () => {
    if (!noticia) return null;

    const imagenPrincipal = noticia.imagenes?.find(img => img.esPrincipal);
    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || 'https://consejoregional.regionpuno.gob.pe/api/';
    const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://consejoregional.regionpuno.gob.pe';
    
    // Construir URL de imagen con fallback robusto
    const logoFallback = `${siteBaseUrl}/logo.png`;
    let imagenUrl = logoFallback;
    
    if (imagenPrincipal && imagenPrincipal.url) {
      try {
        if (imagenPrincipal.url.startsWith('http')) {
          // URL absoluta
          imagenUrl = imagenPrincipal.url;
        } else {
          // URL relativa - construir URL completa
          const cleanBaseUrl = storageBaseUrl.replace(/\/+$/, ''); // Quitar barras finales
          const cleanImageUrl = imagenPrincipal.url.startsWith('/') ? imagenPrincipal.url : '/' + imagenPrincipal.url;
          imagenUrl = cleanBaseUrl + cleanImageUrl;
        }
        
      } catch (error) {
        imagenUrl = logoFallback;
      }
    }

    // Asegurar HTTPS para producción
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl && typeof window !== 'undefined') {
      baseUrl = window.location.origin;
      // Forzar HTTPS en producción
      if (window.location.hostname !== 'localhost' && !baseUrl.startsWith('https://')) {
        baseUrl = baseUrl.replace('http://', 'https://');
      }
    }
    if (!baseUrl) {
      baseUrl = 'https://consejoregional.regionpuno.gob.pe';
    }
    const urlCanonical = `${baseUrl}/noticias/${id}`;

    // Limpiar HTML de las descripciones
    const limpiarHTML = (texto: string) => {
      return texto.replace(/<[^>]*>/g, '').trim();
    };

    const descripcionLimpia = limpiarHTML(noticia.entradilla || noticia.introduccion || noticia.titulo);

    return {
      title: `${noticia.titulo} | Gobierno Regional de Puno`,
      description: descripcionLimpia,
      canonical: urlCanonical,
      noindex: false,
      nofollow: false,
      openGraph: {
        type: 'article',
        title: noticia.titulo,
        description: descripcionLimpia,
        url: urlCanonical,
        site_name: 'Gobierno Regional de Puno',
        images: [
          {
            url: imagenUrl,
            width: 1200,
            height: 630,
            alt: noticia.titulo,
            type: 'image/jpeg',
          }
        ],
        article: {
          publishedTime: noticia.fechaPublicacion,
          modifiedTime: noticia.fechaActualizacion || noticia.fechaPublicacion,
          author: [noticia.autor],
          section: noticia.categoria || 'Noticias',
          tags: noticia.tags || [],
        }
      },
      twitter: {
        card: 'summary_large_image',
        title: noticia.titulo,
        description: descripcionLimpia,
        image: imagenUrl,
        site: '@ConsejoRegionalPuno',
        creator: '@ConsejoRegionalPuno',
      },
      additionalMetaTags: [
        {
          name: 'author',
          content: noticia.autor
        },
        {
          name: 'keywords',
          content: noticia.tags ? noticia.tags.join(', ') : 'Gobierno Regional Puno, noticias, gobierno regional'
        },
        {
          property: 'article:published_time',
          content: noticia.fechaPublicacion
        },
        {
          property: 'article:author',
          content: noticia.autor
        },
        {
          property: 'og:locale',
          content: 'es_PE'
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          name: 'robots',
          content: 'index,follow'
        },
        {
          name: 'googlebot',
          content: 'index,follow'
        }
      ]
    };
  };

  const seoData = getSEOData();

  return (
    <>
      {/* SEO Component - Solo para actualización dinámica, los meta tags principales vienen del servidor */}
      {seoData && <NextSeo {...seoData} />}
      
      {/* JSON-LD solo si hay datos específicos */}
      {seoData && noticia && (
        <ArticleJsonLd
            url={seoData.canonical}
            title={noticia?.titulo || ''}
            images={[seoData.openGraph.images[0].url]}
            datePublished={noticia?.fechaPublicacion || ''}
            dateModified={noticia?.fechaActualizacion || noticia?.fechaPublicacion || ''}
            authorName={[
              {
                name: noticia?.autor || '',
                url: seoData.canonical
              }
            ]}
            publisherName="Gobierno Regional de Puno"
            publisherLogo="https://consejoregional.regionpuno.gob.pe/logo.png"
            description={noticia?.entradilla || noticia?.introduccion || noticia?.titulo || ''}
          />
      )}

      <motion.div
      className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animations.container as any}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Botón de Volver Mejorado */}
        <motion.div
          variants={animations.button as any}
          className="mb-8"
        >
          <Link
            href="/noticias"
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#184482]/30 transition-all duration-300 group"
          >
            <div className="w-7 h-7 bg-[#184482]/10 rounded-full flex items-center justify-center group-hover:bg-[#184482]/20 transition-colors duration-300">
              <FaArrowLeft className="h-3 w-3 text-[#184482]" />
            </div>
            <span className="font-medium text-sm text-gray-800 group-hover:text-[#184482] transition-colors duration-300">
              Volver a Noticias
            </span>
          </Link>
        </motion.div>

        {/* Contenido Principal */}
        {error ? (
          <motion.div
            variants={animations.item as any}
            className="flex justify-center items-center py-20"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Error al cargar la noticia</p>
                <p className="text-gray-600 text-sm">{error}</p>
                <button 
                  onClick={getNoticia}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            variants={animations.item as any}
            className="flex justify-center items-center py-20"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#184482] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Cargando noticia...</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Columna Principal - Noticia */}
            <motion.div
              variants={animations.item as any}
              className="lg:col-span-3"
            >
              {noticia && <Noticia noticia={{
              ...noticia,
              entradilla: noticia.entradilla || '',
              introduccion: noticia.introduccion || '',
              consejeros: [],
              comisiones: [],
              imagenes: noticia.imagenes || [],
              tags: noticia.tags || []
            }} onImageClick={setModalImage} />}
            </motion.div>

            {/* Sidebar - Noticias Relacionadas */}
            <motion.div
              variants={animations.item as any}
              className="lg:col-span-1"
            >
              <div className="sticky top-4">
                <NoticiasRelacionadas noticiasRelacionadas={noticiasRelacionadas} />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Modal para Imagen Mejorado */}
      {modalImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de Cerrar Mejorado */}
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Imagen con Bordes Redondeados */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <Image
                src={modalImage}
                alt="Imagen ampliada"
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
      </motion.div>
    </>
  );
}