import axiosInstance from '@/lib/api-client';

export interface Parametros {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Obtiene  todos los tipos de documento
const getTiposDocumento = async (grupo: string) => {
  try {
    const response = await axiosInstance.get(`/v1/tipo-documentos?grupo=${grupo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    throw error;
  }
};

const TipoDocumentoService = {
  getTiposDocumento,
};

export default TipoDocumentoService;
