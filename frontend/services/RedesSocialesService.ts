import axiosInstance from '@/lib/api-client';

export interface RedesSociales {
  id?: number;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  telegram: string | null;
  pinterest: string | null;
  snapchat: string | null;
  kick: string | null;
  twitch?: string | null;
  parametro?: string | null;
  consejero?: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    cargo: string;
    descripcion: string;
    correo: string;
    telefono: string;
    direccion: string;
    activo: boolean;
    url_imagen: string;
    redesSociales: any;
    imagen: any;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: any;
}


const getRedesSociales = async (id: number): Promise<RedesSociales> => {
  try {
    const response = await axiosInstance.get(`/v1/redsocial/consejero/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener redes sociales:', error);
    throw error;
  }
};

const createRedesSociales = async (redesSociales: RedesSociales): Promise<RedesSociales> => {
  try {
    const response = await axiosInstance.post('/v1/redsocial', redesSociales, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear redes sociales:', error);
    throw error;
  }
};

// Actualiza un proyecto existente
const updateRedesSociales = async (id: number, redesSociales: RedesSociales): Promise<RedesSociales> => {
  try {
    const response = await axiosInstance.put(`/v1/redsocial/${id}`, redesSociales, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar redes sociales:', error);
    throw error;
  }
};

// Elimina un proyecto
const deleteRedesSociales = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/redsocial/${id}`);
  } catch (error) {
    console.error('Error al eliminar redes sociales:', error);
    throw error;
  }
};

/* const activarNoticia = async (id: number, activo: boolean): Promise<Noticias> => {
  try {
    const response = await axiosInstance.put(`/api/v1/noticias/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar noticia:', error);
    throw error;
  }
}; */



const RedesSocialesService = {
  getRedesSociales,
  createRedesSociales,
  updateRedesSociales,
  deleteRedesSociales,
};

export default RedesSocialesService;
