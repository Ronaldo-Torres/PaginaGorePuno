import axiosInstance from '@/lib/api-client';

export interface Boletines {
  id?: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  estado: string;
  categoria: string;
  url?: string;
  activo: boolean;
  imagen: string;
  urlDocumento: string;
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
const getBoletines = async (page: number = 0, size: number = 10, search: string = "", tipo: number | null = null): Promise<PageData<Boletines>> => {
  try {
    const response = await axiosInstance.get(`/v1/boletines`, {
      params: { page, size, search, tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener boletines:', error);
    throw error;
  }
};

const getBoletin = async (id: number): Promise<Boletines> => {
  try {
    const response = await axiosInstance.get(`/v1/boletines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener boletin:', error);
    throw error;
  }
};

const createBoletin = async (boletin: Boletines): Promise<Boletines> => {
  try {
    const response = await axiosInstance.post('/v1/boletines', boletin, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear boletín:', error);
    throw error;
  }
};

// Actualiza un proyecto existente
const updateBoletin = async (id: number, boletin: Boletines): Promise<Boletines> => {
  try {
    const response = await axiosInstance.put(`/v1/boletines/${id}`, boletin, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar boletín:', error);
    throw error;
  }
};

// Elimina un proyecto
const deleteBoletin = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/boletines/${id}`);
  } catch (error) {
    console.error('Error al eliminar boletin:', error);
    throw error;
  }
};

const activarBoletin = async (id: number, activo: boolean): Promise<Boletines> => {
  try {
    const response = await axiosInstance.put(`/v1/boletines/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar boletin:', error);
    throw error;
  }
};
const fetchImages = async (id: string): Promise<ImageData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula un retraso de red
  
    const response = await axiosInstance.get(`/v1/boletines/${id}/imagenes`)
    return response.data.content
  }
  
  const deleteImagen = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/boletines/${id}/imagenes`)
  }

const createImagen = async (formData: FormData): Promise<ImageData[]> => {
    const imagenes: File[] = [];
  
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        imagenes.push(value);
      }
    }
    console.log(imagenes);
  
    const responses: ImageData[] = []; 
  
    for (const imagen of imagenes) {
      const singleFormData = new FormData(); 
      singleFormData.append('file', imagen);
      singleFormData.append('nombre', imagen.name);
      singleFormData.append('boletinId', formData.get('boletinId') as string); 
      const response = await axiosInstance.post(`/v1/boletines/imagenes`, singleFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      responses.push(response.data); 
    }
    return responses;
  }

  const updateImagen = async (id: string, data: Partial<ImageData>): Promise<ImageData> => {
    const response = await axiosInstance.put(`/v1/boletines/imagenes/${id}/activar`, data);
    return response.data;
  }



const BoletinService = {
  getBoletines,
  createBoletin,
  updateBoletin,
  deleteBoletin,
  activarBoletin,
  getBoletin,
  fetchImages,
  createImagen,
  deleteImagen,
  updateImagen,
};

export default BoletinService;
