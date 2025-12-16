import type { Metadata } from 'next';
import PrincipalService from "@/services/PrincipalService";
import NoticiaClientPage from "./client-page";

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
}

// Generar metadata en el servidor
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    console.log('🚀 Generando metadata para noticia ID:', params.id);
    
    // Hacer fetch directo al API en el servidor (usando la misma ruta que PrincipalService)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${apiUrl}/public/principal/noticia/${params.id}`, {
      cache: 'no-store', // No cachear para obtener datos frescos
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const noticia = await response.json();
    
    if (!noticia) {
      console.log('❌ Noticia no encontrada');
      return {
        title: 'Noticia no encontrada | Gobierno Regional de Puno',
        description: 'La noticia solicitada no fue encontrada.',
      };
    }

    console.log('✅ Noticia encontrada:', noticia.titulo);

    // Limpiar HTML de las descripciones
    const limpiarHTML = (texto: string) => {
      return texto?.replace(/<[^>]*>/g, '').trim() || '';
    };

    const descripcionLimpia = limpiarHTML(noticia.entradilla || noticia.introduccion || noticia.titulo);
    
    // Construir URL de imagen con fallback robusto
    const logoFallback = 'https://consejoregional.regionpuno.gob.pe/logo.png';
    let imagenUrl = logoFallback;
    
    const imagenPrincipal = noticia.imagenes?.find((img: any) => img.esPrincipal);
    
    if (imagenPrincipal && imagenPrincipal.url) {
      try {
        const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || 'https://consejoregional.regionpuno.gob.pe/api';
        
        if (imagenPrincipal.url.startsWith('http')) {
          // URL absoluta
          imagenUrl = imagenPrincipal.url;
        } else {
          // URL relativa - construir URL completa
          const cleanBaseUrl = storageBaseUrl.replace(/\/+$/, ''); // Quitar barras finales
          const cleanImageUrl = imagenPrincipal.url.startsWith('/') ? imagenPrincipal.url : '/' + imagenPrincipal.url;
          imagenUrl = cleanBaseUrl + cleanImageUrl;
        }
        
        console.log('🖼️ Imagen construida:', imagenUrl);
      } catch (error) {
        console.log('❌ Error construyendo URL de imagen, usando fallback:', error);
        imagenUrl = logoFallback;
      }
    } else {
      console.log('📷 No hay imagen principal, usando logo por defecto');
    }

    const urlCanonical = `https://consejoregional.regionpuno.gob.pe/noticias/${params.id}`;

    console.log('🔍 Metadata generada:', {
      title: noticia.titulo,
      description: descripcionLimpia,
      image: imagenUrl,
      url: urlCanonical
    });

    return {
      title: `${noticia.titulo} | Gobierno Regional de Puno`,
      description: descripcionLimpia,
      
      openGraph: {
        title: noticia.titulo,
        description: descripcionLimpia,
        url: urlCanonical,
        siteName: 'Gobierno Regional de Puno',
        images: [
          {
            url: imagenUrl,
            width: 1200,
            height: 630,
            alt: noticia.titulo,
          },
        ],
        locale: 'es_PE',
        type: 'article',
        publishedTime: noticia.fechaPublicacion,
        authors: [noticia.autor],
      },
      
      twitter: {
        card: 'summary_large_image',
        title: noticia.titulo,
        description: descripcionLimpia,
        images: [imagenUrl],
      },

      other: {
        'article:published_time': noticia.fechaPublicacion,
        'article:author': noticia.autor,
      },
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    
    return {
      title: `Noticia ${params.id} | Gobierno Regional de Puno`,
      description: 'Consulta las últimas noticias del Gobierno Regional de Puno',
      
      openGraph: {
        title: `Noticia ${params.id} | Gobierno Regional de Puno`,
        description: 'Consulta las últimas noticias del Gobierno Regional de Puno',
        url: `https://consejoregional.regionpuno.gob.pe/noticias/${params.id}`,
        siteName: 'Gobierno Regional de Puno',
        images: [
          {
            url: 'https://consejoregional.regionpuno.gob.pe/logo.png',
            width: 1200,
            height: 630,
            alt: 'Gobierno Regional de Puno',
          },
        ],
        locale: 'es_PE',
        type: 'article',
      },
    };
  }
}

// Server Component que renderiza el cliente
export default async function PaginaNoticia({ params }: Props) {
  // Intentar obtener la noticia en el servidor para pasarla al cliente
  let noticia = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${apiUrl}/public/principal/noticia/${params.id}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      noticia = await response.json();
    } else {
      console.error(`Error fetching noticia in server component: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al obtener noticia en servidor:', error);
  }

  return <NoticiaClientPage params={params} initialNoticia={noticia} />;
}