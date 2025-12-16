import axiosInstance from '@/lib/api-client';

export interface Comision {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  // Agrega las demás propiedades de Proyecto según tu modelo
  [key: string]: any;
}

export interface Actividad {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  // Agrega las demás propiedades de Proyecto según tu modelo
  [key: string]: any;
}



export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: any;
}

export interface ConsejeroComision {
  id?: number;
  comision: any;
  consejero: any;
  cargo: string;
}

// Obtiene todos los comisiones de forma paginada
const getAllComisiones = async (page: number = 0, size: number = 10, search: string = "", estado: string | null = null): Promise<PageData<Comision>> => {
  try {
    const response = await axiosInstance.get('/v1/comisiones', {
      params: { page, size, search, estado },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener comision:', error);
    throw error;
  }
};

const getComision = async (id: number): Promise<Comision> => {
  try {
    const response = await axiosInstance.get(`/v1/comisiones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener comision:', error);
    throw error;
  }
};



// Crea un nuevo comision
const createComision = async (comision: Comision): Promise<Comision> => {
  try {
    const response = await axiosInstance.post('/v1/comisiones', comision);
    return response.data;
  } catch (error) {
    console.error('Error al crear comision:', error);
    throw error;
  }
};

// Actualiza un comision existente
const updateComision = async (id: number, comision: Comision): Promise<Comision> => {
  try {
    const response = await axiosInstance.put(`/v1/comisiones/${id}`, comision);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar comision:', error);
    throw error;
  }
};

// Elimina un comision
const deleteComision = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/comisiones/${id}`);
  } catch (error) {
    console.error('Error al eliminar comision:', error);
    throw error;
  }
};

const activarComision = async (id: number, activo: boolean): Promise<Comision> => {
  try {
    const response = await axiosInstance.put(`/v1/comisiones/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar comision:', error);
    throw error;
  }
};

// Actividades
const getActividades = async (id: number, page: number, size: number, search: string, estado: string | null): Promise<PageData<Actividad>> => {
  try {
    const response = await axiosInstance.get(`/v1/comisiones/${id}/actividades`, {
      params: { page, size, search, estado },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    throw error;
  }
};

const createActividad = async (actividad: Actividad): Promise<Actividad> => {
  try {
    const response = await axiosInstance.post(`/v1/comisiones/actividades`, actividad);
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error);
    throw error;
  }
};

const updateActividad = async (id: number, actividad: Actividad): Promise<Actividad> => {
  try {
    const response = await axiosInstance.put(`/v1/comisiones/${id}/actividades`, actividad);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    throw error;
  }
};

const deleteActividad = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/comisiones/${id}/actividades`);
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    throw error;
  }
};

const activarActividad = async (id: number, activo: boolean): Promise<Actividad> => {
  try {
    const response = await axiosInstance.put(`/v1/comisiones/${id}/actividades/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar actividad:', error);
    throw error;
  }
};

//comisonn- consejero
const createConsejeroComision = async (consejeroComision: ConsejeroComision): Promise<ConsejeroComision> => {
  try {
    const response = await axiosInstance.post(`/v1/comisiones/consejeros`, consejeroComision);
    return response.data;
  } catch (error) {
    console.error('Error al crear consejero comision:', error);
    throw error;
  }
};

const getConsejeros = async (id: number, page: number, size: number): Promise<PageData<ConsejeroComision>> => {
  try {
    const response = await axiosInstance.get(`/v1/comisiones/${id}/consejeros`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener consejeros:', error);
    throw error;
  }
};

const deleteConsejeroComision = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/comisiones/${id}/consejeros`);
  } catch (error) {
    console.error('Error al eliminar consejero comision:', error);
    throw error;
  }
};

const activarConsejeroComision = async (id: number, activo: boolean): Promise<ConsejeroComision> => {
  try {
    const response = await axiosInstance.put(`/v1/comisiones/activar/${id}/consejeros`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar consejero comision:', error);
    throw error;
  }
};

// Imagenes de actividad

interface ImageData {
  id: string
  url: string
  name: string
}

// Función para crear imágenes
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
    singleFormData.append('actividadId', formData.get('actividadId') as string); 
    const response = await axiosInstance.post(`/v1/comisiones/actividad/imagenes`, singleFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    responses.push(response.data); 
  }
  
  return responses;
}

const fetchImages = async (id: string): Promise<ImageData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula un retraso de red

  const response = await axiosInstance.get(`/v1/comisiones/actividad/${id}/imagenes`)
  return response.data.content
}

const deleteImagen = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/comisiones/actividad/${id}/imagenes`)
}

const ComisionService = {
  getAllComisiones,
  createComision,
  updateComision,
  deleteComision,
  activarComision,
  getActividades,
  createActividad,
  updateActividad,
  deleteActividad,
  getComision,
  createConsejeroComision,
  getConsejeros,
  deleteConsejeroComision,
  activarConsejeroComision,
  fetchImages,
  deleteImagen,
  createImagen,
  activarActividad,
};

export default ComisionService;
