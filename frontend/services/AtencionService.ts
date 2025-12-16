import axiosInstance from "@/lib/api-client";

export interface Atencion {
    id: number;
    nombre: string;
    descripcion: string;
    telefono: string;
    email: string;
    imagen: string;
    estado: string;
}

export interface PageData<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

const getAtenciones = async (page: number = 0, size: number = 10, search: string = ""): Promise<PageData<Atencion>> => {
    try {

        let params = {};
        if (search !== "") {
            params = { search };
        }

        const response = await axiosInstance.get(`/v1/atenciones`, {
            params: { page, size, ...params },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener atenciones:', error);
        throw error;
    }
}

const createAtencion = async (atencion: FormData): Promise<Atencion> => {
    try {
        const response = await axiosInstance.post(`/v1/atenciones`, atencion, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear atencion:', error);
        throw error;
    }
}

const updateAtencion = async (id: number, atencion: FormData): Promise<Atencion> => {
    try {
        const response = await axiosInstance.put(`/v1/atenciones/${id}`, atencion, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar atencion:', error);
        throw error;
    }
}

const deleteAtencion = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/v1/atenciones/${id}`);
    } catch (error) {
        console.error('Error al eliminar atencion:', error);
        throw error;
    }
}

const AtencionService = {
    getAtenciones,
    createAtencion,
    updateAtencion,
    deleteAtencion,
}

export default AtencionService;