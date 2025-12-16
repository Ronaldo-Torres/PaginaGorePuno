import type { Metadata } from 'next';
import PrincipalService from '@/services/PrincipalService';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Intentar obtener la noticia en el servidor
    const noticia = await PrincipalService.getNoticia(parseInt(params.id));
    
    if (!noticia) {
      return {
        title: 'Noticia no encontrada | Gobierno Regional de Puno',
        description: 'La noticia solicitada no fue encontrada.',
      };
    }

    // Limpiar HTML de las descripciones
    const limpiarHTML = (texto: string) => {
      return texto.replace(/<[^>]*>/g, '').trim();
    };

    const descripcionLimpia = limpiarHTML(noticia.entradilla || noticia.introduccion || noticia.titulo);
    
    // Construir URL de imagen
    const imagenPrincipal = noticia.imagenes?.find((img: any) => img.esPrincipal);
    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || 'https://consejoregional.regionpuno.gob.pe/api/';
    const imagenUrl = imagenPrincipal 
      ? `${storageBaseUrl}${imagenPrincipal.url}`
      : 'https://consejoregional.regionpuno.gob.pe/logo.png';

    const urlCanonical = `https://consejoregional.regionpuno.gob.pe/noticias/${params.id}`;

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
    console.error('Error generating metadata:', error);
    
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