import axiosInstance from '@/lib/api-client';

export interface ConsejeroGaleria {
  id: string; // UUID
  descripcion: string;
  consejeroId: number;
  nombre?: string;
  urlImagen?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  activo?: boolean;
  [key: string]: any;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  first: boolean;
  last: boolean;
  numberOfElements: number;
  [key: string]: any;
}

interface ApiError {
  response?: {
    data: any;
  };
  message: string;
}

// Obtiene la galería de un consejero de forma paginada
const getGaleriaConsejeros = async (
  consejeroId: string, 
  page: number = 0, 
  size: number = 10, 
  orderBy?: string, 
  direction?: string
): Promise<PageData<ConsejeroGaleria>> => {
  try {
    // Construir parámetros solo si se proporcionan
    const params: any = { page, size };
    if (orderBy) params.orderBy = orderBy;
    if (direction) params.direction = direction;

    const response = await axiosInstance.get(`/v1/galeria/${consejeroId}/galeria-consejeros`, {
      params,
    });
    console.log("Datos recibidos de getGaleriaConsejeros:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener galería de consejeros:', error);
    throw error;
  }
};

// Crea una nueva foto en la galería del consejero
const createGaleriaConsejero = async (
  consejeroGaleriaId: string,
  file: File,
  descripcion: string,
  consejeroId: number,
  nombre?: string
): Promise<ConsejeroGaleria> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('descripcion', descripcion);
    formData.append('consejeroId', consejeroId.toString());
    if (nombre) {
      formData.append('nombre', nombre);
    }

    const response = await axiosInstance.post(
      `/v1/galeria/${consejeroGaleriaId}/galeria-consejeros`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log("Foto de galería creada:", response.data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error al crear foto de galería:', apiError.response?.data || apiError.message);
    throw error;
  }
};

// Actualiza una foto existente en la galería del consejero
const updateGaleriaConsejero = async (
  galeriaId: string,
  file?: File,
  descripcion?: string,
  consejeroId?: number,
  nombre?: string
): Promise<ConsejeroGaleria> => {
  try {
    const formData = new FormData();
    
    if (file) {
      formData.append('file', file);
    }
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }
    if (consejeroId) {
      formData.append('consejeroId', consejeroId.toString());
    }
    if (nombre) {
      formData.append('nombre', nombre);
    }

    const response = await axiosInstance.put(
      `/v1/galeria/${galeriaId}/galeria-consejeros`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log("Foto de galería actualizada:", response.data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error al actualizar foto de galería:', apiError.response?.data || apiError.message);
    throw error;
  }
};

// Elimina una foto de la galería del consejero
const deleteGaleriaConsejero = async (galeriaId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/galeria/${galeriaId}/galeria-consejeros`);
    console.log("Foto de galería eliminada exitosamente");
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error al eliminar foto de galería:', apiError.response?.data || apiError.message);
    throw error;
  }
};

// Obtiene una foto específica de la galería (método auxiliar)
const getGaleriaConsejeroById = async (galeriaId: string): Promise<ConsejeroGaleria> => {
  try {
    const response = await axiosInstance.get(`/v1/galeria/${galeriaId}/galeria-consejeros`);
    console.log("Foto de galería obtenida:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener foto de galería por ID:', error);
    throw error;
  }
};

// Exportar todas las funciones del servicio
const GaleriaService = {
  getGaleriaConsejeros,
  createGaleriaConsejero,
  updateGaleriaConsejero,
  deleteGaleriaConsejero,
  getGaleriaConsejeroById,
};

export default GaleriaService;
