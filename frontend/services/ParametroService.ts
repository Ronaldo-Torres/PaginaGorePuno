import axiosInstance from '@/lib/api-client';

export interface Parametros {
  id?: number;
  nombreInstitucion: string;
  direccionInstitucion: string;
  correoInstitucion: string;
  telefonoInstitucion: string;
  telefonoInstitucion2: string;
  logoInstitucionLight: string;
  logoInstitucionDark: string;
  mesaPartesUrl: string;
  consultaTramiteUrl: string;
  encargadoTransparencia: string;
  cargoEncargadoTransparencia: string;
  numeroResolucionTransparencia: string;
  encargadoTransparenciaSecundario: string;
  cargoEncargadoTransparenciaSecundario: string;
  numeroResolucionTransparenciaSecundario: string;
  nosotros: string;
  mision: string;
  vision: string;
  objetivos: string;
  valores: string;
  historia: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
  telegram: string;
  pinterest: string;
  snapchat: string;
  kick: string;
  twitch: string;
  linkedin: string;

  tituloPresidencia: string;
  descripcionPresidencia: string;
  tituloServicio: string;
  descripcionServicio: string;
  tituloAgenda: string;
  descripcionAgenda: string;
  tituloNoticias: string;
  descripcionNoticias: string;
  tituloBoletin: string;
  descripcionBoletin: string;
  tituloDocumentos: string;
  descripcionDocumentos: string;
  tituloEnlaces: string;
  descripcionEnlaces: string;
  tituloVideo: string;
  descripcionVideo: string;
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
const getAllParametros = async (page: number = 0, size: number = 10, search: string = "", estado: string | null = null): Promise<PageData<Parametros>> => {
  try {
    const response = await axiosInstance.get('/v1/parametros', {
      params: { page, size, search, estado },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener operador:', error);
    throw error;
  }
};

// Crea un nuevo proyecto
const createParametro = async (parametro: FormData): Promise<Parametros> => {
  try {
    const response = await axiosInstance.post('/v1/parametros', parametro, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear parametro:', error);
    throw error;
  }
};

// Actualiza un proyecto existente
const updateParametro = async (id: number, parametro: FormData): Promise<Parametros> => {
  try {
    const response = await axiosInstance.put(`/v1/parametros/${id}`, parametro, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar parametro:', error);
    throw error;
  }
};

// Elimina un proyecto
const deleteParametro = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/parametros/${id}`);
  } catch (error) {
    console.error('Error al eliminar parametro:', error);
    throw error;
  }
};

const getParametro = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/v1/parametros/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener parametro:', error);
    throw error;
  }
};

const ParametroService = {
  getAllParametros,
  createParametro,
  updateParametro,
  deleteParametro,
  getParametro,
};

export default ParametroService;
