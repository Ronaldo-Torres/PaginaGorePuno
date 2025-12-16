import axiosInstance from '@/lib/api-client';

export interface Noticias {
  id?: number;
  gorro: string;
  titulo: string;
  bajada: string;
  introduccion: string;
  contenido: string;
  conclusion: string;
  nota?: string;
  fechaPublicacion: Date;
  destacado: boolean;
  url?: string;
  activo: boolean;
  destacadoAntigua: boolean;
  autor: string;
  estado?: string;
  tags?: string[];
  consejeros?: number[];
  comisiones?: number[];
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: any;
}

// Obtiene todos los proyectos de forma paginada
const getNoticias = async (
  page: number = 0, 
  size: number = 10, 
  search: string = "", 
  tipo: number | null = null,
  destacadoAntigua: boolean | null = null,
  destacado: boolean | null = null
): Promise<PageData<Noticias>> => {
  try {
    const params = { 
      page, 
      size, 
      search,
      destacadoAntigua,
      destacado
    };
    
    
    const response = await axiosInstance.get(`/v1/noticias`, {
      params
    });
    
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    throw error;
  }
};

const getNoticia = async (id: number): Promise<Noticias> => {
  try {
    const response = await axiosInstance.get(`/v1/noticias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    throw error;
  }
};

const createNoticia = async (noticia: Noticias): Promise<Noticias> => {
  try {
    const response = await axiosInstance.post('/v1/noticias', noticia, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear noticia:', error);
    throw error;
  }
};

// Actualiza un proyecto existente
const updateNoticia = async (id: number, noticia: Noticias): Promise<Noticias> => {
  try {
    const response = await axiosInstance.put(`/v1/noticias/${id}`, noticia, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    throw error;
  }
};

// Elimina un proyecto
const deleteNoticia = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/noticias/${id}`);
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    throw error;
  }
};

const activarNoticia = async (id: number, activo: boolean): Promise<Noticias> => {
  try {
    const response = await axiosInstance.put(`/v1/noticias/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar noticia:', error);
    throw error;
  }
};

const fetchImages = async (id: string): Promise<ImageData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula un retraso de red
  
    const response = await axiosInstance.get(`/v1/noticias/${id}/imagenes`)
    return response.data.content
  }
  
  const deleteImagen = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/noticias/${id}/imagenes`)
  }
  
const createImagen = async (formData: FormData): Promise<ImageData[]> => {
    try {
      const response = await axiosInstance.post(`/v1/noticias/imagenes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return [response.data];
    } catch (error) {
      console.error('Error al crear imagen:', error);
      throw error;
    }
  }

  const updateImagen = async (id: string, imagen: ImageData): Promise<ImageData> => {
    const response = await axiosInstance.put(`/v1/noticias/imagenes/${id}/activar`, imagen);
    return response.data;
  }


  const getAllConsejeros = async () => {
    try {
      const response = await axiosInstance.get('/v1/consejeros/all');
      return response.data;
    } catch (error) {
      console.error('Error al obtener consejeros:', error);
      throw error;
    }
  };

  const getAllComisiones = async () => {
    try {
      const response = await axiosInstance.get('/v1/comisiones/all');
      return response.data;
    } catch (error) {
      console.error('Error al obtener comisiones:', error);
      throw error;
    }
  };

const NoticiaService = {
  getNoticias,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  activarNoticia,
  getNoticia,
  fetchImages,
  createImagen,
  deleteImagen,
  updateImagen,
  getAllConsejeros,
  getAllComisiones,
};

export default NoticiaService;
