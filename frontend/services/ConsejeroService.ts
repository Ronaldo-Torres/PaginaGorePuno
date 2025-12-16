import axiosInstance from '@/lib/api-client';

export interface Consejero {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  descripcion: string;
  correo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  cargo: string;
  url_imagen: string;
  documento?: string;
  createdAt?: string;
  updatedAt?: string;
  // Agrega las demás propiedades de Proyecto según tu modelo
  [key: string]: any;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
  pinterest?: string;
  snapchat?: string;
  kick?: string;
  twitch?: string;
  linkedin?: string;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: any;
}

interface ApiError {
  response?: {
    data: any;
  };
  message: string;
}

// Obtiene todos los consejeros de forma paginada
const getAllConsejeros = async (page: number = 0, size: number = 10, search: string = "", estado: string | null = null): Promise<PageData<Consejero>> => {
  try {
    const response = await axiosInstance.get('/v1/consejeros', {
      params: { page, size, search, estado },
    });
    console.log("Datos recibidos de getAllConsejeros:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener consejeros:', error);
    throw error;
  }
};

// Crea un nuevo consejero
const createConsejero = async (consejero: FormData): Promise<Consejero> => {
  try {
    console.log("Enviando datos al servidor (createConsejero):");
    for (let [key, value] of consejero.entries()) {
      console.log("asdaasdasdasdaa: ", key, value);
      if (value instanceof File) {
        console.log(key, ":", value.name, "(File - type:", value.type, ", size:", value.size, "bytes)");
      } else {
        console.log(key, ":", value);
      }
    }

    const response = await axiosInstance.post('/v1/consejeros', consejero, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Respuesta del servidor (createConsejero):", response.data);
    return response.data;

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error detallado al crear consejero:', apiError.message);
    if (apiError.response) {
      console.error('Respuesta del servidor:', apiError.response.data);
    }
    throw error;
  }
};

// Actualiza un consejero existente
const updateConsejero = async (id: number, consejero: FormData): Promise<Consejero> => {
  try {
    console.log("Actualizando consejero ID:", id);
    console.log("Datos enviados al servidor (updateConsejero):");
    for (let [key, value] of consejero.entries()) {
      if (value instanceof File) {
        console.log(key, ":", value.name, "(File - type:", value.type, ", size:", value.size, "bytes)");
      } else {
        console.log(key, ":", value);
      }
    }

    const response = await axiosInstance.put(`/v1/consejeros/${id}`, consejero, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Respuesta del servidor (updateConsejero):", response.data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error detallado al actualizar consejero:', apiError.message);
    if (apiError.response) {
      console.error('Respuesta del servidor:', apiError.response.data);
    }
    throw error;
  }
};

// Elimina un consejero
const deleteConsejero = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/consejeros/${id}`);
  } catch (error) {
    console.error('Error al eliminar consejero:', error);
    throw error;
  }
};

const getConsejeros = async (): Promise<Consejero[]> => {
  try {
    const response = await axiosInstance.get('/v1/consejeros/all');
    return response.data;
  } catch (error) {
    console.error('Error al obtener consejeros:', error);
    throw error;
  }
};

const activarConsejero = async (id: number, activo: boolean): Promise<Consejero> => {
  try {
    const response = await axiosInstance.post(`/v1/consejeros/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar consejero:', error);
    throw error;
  }
};


const ConsejeroService = {
  getAllConsejeros,
  createConsejero,
  updateConsejero,
  deleteConsejero,
  getConsejeros,
  activarConsejero,
};

export default ConsejeroService;
