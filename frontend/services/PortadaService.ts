import axiosInstance from '@/lib/api-client';
import axios from "axios";

export interface Portadas {
  id?: number;
  titulo: string;
  descripcion: String;
  activo: boolean;
  imagen: String;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: any;
}

export interface LinkInteres {
  id: number;
  nombre: string;
  url: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  url: string;
}

// Obtiene todos los proyectos de forma paginada
const getPortadas = async (page: number = 0, size: number = 10, search: string = "", tipo: number | null = null): Promise<PageData<Portadas>> => {
  try {
    const response = await axiosInstance.get(`/v1/portadas`, {
      params: { page, size, search, tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener portadas:', error);
    throw error;
  }
};

const getPortada = async (id: number): Promise<Portadas> => {
  try {
    const response = await axiosInstance.get(`/v1/portadas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener portada:', error);
    throw error;
  }
};

const createPortada = async (formData: FormData): Promise<Portadas> => {
  const response = await axiosInstance.post("/v1/portadas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Actualiza un proyecto existente
const updatePortada = async (id: number, portada: FormData): Promise<Portadas> => {
  try {
    const response = await axiosInstance.put(`/v1/portadas/${id}`, portada, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar portada:', error);
    throw error;
  }
};

// Elimina un proyecto
const deletePortada = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/portadas/${id}`);
  } catch (error) {
    console.error('Error al eliminar portada:', error);
    throw error;
  }
};

const activarPortada = async (id: number, activo: boolean): Promise<Portadas> => {
  try {
    const response = await axiosInstance.put(`/v1/portadas/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar portada:', error);
    throw error;
  }
};

const getLinks = async (page: number = 0, size: number = 10, search: string = "", tipo: number | null = null): Promise<PageData<LinkInteres>> => {
  try {
    const response = await axiosInstance.get(`/v1/portadas/links`, {
      params: { page, size, search, tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener portadas:', error);
    throw error;
  }
};

const createLink = async (formData: FormData): Promise<LinkInteres> => {
  const response = await axiosInstance.post("/v1/portadas/links", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updateLink = async (id: number, formData: FormData): Promise<LinkInteres> => {
  const response = await axiosInstance.put(`/v1/portadas/links/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteLink = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/portadas/links/${id}`);
  } catch (error) {
    console.error('Error al eliminar link:', error);
    throw error;
  }
};


const getServicios = async (page: number = 0, size: number = 10, search: string = "", tipo: number | null = null): Promise<PageData<Servicio>> => {
  try {
    const response = await axiosInstance.get(`/v1/portadas/servicios`, {
      params: { page, size, search, tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener portadas:', error);
    throw error;
  }
};

const activarLink = async (id: number, activo: boolean): Promise<LinkInteres> => {
  const response = await axiosInstance.put(`/v1/portadas/links/${id}/activar`, { activo });
  return response.data;
};

const createServicio = async (formData: FormData): Promise<Servicio> => {
  const response = await axiosInstance.post("/v1/portadas/servicios", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updateServicio = async (id: number, formData: FormData): Promise<Servicio> => {
  const response = await axiosInstance.put(`/v1/portadas/servicios/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteServicio = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/portadas/servicios/${id}`);
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    throw error;
  }
};

const activarServicio = async (id: number, activo: boolean): Promise<Servicio> => {
  try {
    const response = await axiosInstance.put  (`/v1/portadas/servicios/${id}/activar`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al activar servicio:', error);
    throw error;
  }
};


const PortadaService = {
  getPortadas,
  createPortada,
  updatePortada,
  deletePortada,
  activarPortada,
  getPortada,
  getLinks,
  getServicios,
  createLink,
  updateLink,
  deleteLink,
  activarLink,
  createServicio,
  updateServicio,
  deleteServicio,
  activarServicio,
};

export default PortadaService;
