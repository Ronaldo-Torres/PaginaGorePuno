import axiosInstance from '@/lib/api-client';

const getAnios = async() => {
    try {
        const response = await axiosInstance.get("/v1/anios");
        return response.data;
    } catch (error) {
        console.error("Error al obtener años:", error);
        throw error;
    }
}

const AnioService = {
    getAnios,
};

export default AnioService;