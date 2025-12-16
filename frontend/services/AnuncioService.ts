import axiosInstance from '@/lib/api-client';

export interface Anuncios {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  url: string;
  activo: boolean;
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
const getAnuncios = async (page: number = 0, size: number = 10, search: string = "", tipo: number | null = null): Promise<PageData<Anuncios>> => {
  try {
    const response = await axiosInstance.get(`/v1/anuncios`, {
      params: { page, size, search, tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener boletines:', error);
    throw error;
  }
};

const getAnuncio = async (id: number): Promise<Anuncios> => {
  try {
    const response = await axiosInstance.get(`/v1/anuncios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener anuncio:', error);
    throw error;
  }
};

const createAnuncio = async (anuncio: Anuncios, file?: File): Promise<Anuncios> => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    // Convertir el objeto anuncio a un Blob JSON y agregarlo al FormData
    formData.append('anuncio', new Blob([JSON.stringify(anuncio)], {
      type: 'application/json'
    }));

    const response = await axiosInstance.post('/v1/anuncios', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear anuncio:', error);
    throw error;
  }
};

// Actualiza un proyecto existente
const updateAnuncio = async (id: number, anuncio: Anuncios, file?: File): Promise<Anuncios> => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    // Convertir el objeto anuncio a un Blob JSON y agregarlo al FormData
    formData.append('anuncio', new Blob([JSON.stringify(anuncio)], {
      type: 'application/json'
    }));

    const response = await axiosInstance.put(`/v1/anuncios/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar anuncio:', error);
    throw error;
  }
};

// Elimina un proyecto
const deleteAnuncio = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/anuncios/${id}`);
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    throw error;
  }
};

const activarAnuncio = async (id: number, activo: boolean): Promise<Anuncios> => {
  try {
    const response = await axiosInstance.put(`/v1/anuncios/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar anuncio:', error);
    throw error;
  }
};

const AnuncioService = {
  getAnuncios,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
  activarAnuncio,
  getAnuncio,
};

export default AnuncioService;
