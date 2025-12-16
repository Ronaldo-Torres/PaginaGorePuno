import axiosInstance from '@/lib/api-client';

export interface Agendas {
  id?: number;
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  color: string;
  tipo: string;
  estado: string;
  publico: boolean;
  documento?: string; // URL del documento PDF
  lugar: string;
  visible: boolean;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Página actual
  size: number;   // Tamaño de página
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  mensaje: string;
  estado: string;
  agendaId: number;
  userId: string[];
}

class AgendaService {
  async getAgendas() {
    try {
      console.log("Haciendo petición a: /v1/agendas"); // Para debugging
      const response = await axiosInstance.get('/v1/agendas');
      console.log("Respuesta del servidor:", response.data); // Para debugging
      return response.data;
    } catch (error) {
      console.error("Error al obtener agendas:", error);
      throw error;
    }
  }

  async getAgendasPorEstado(estado: string) {
    try {
      console.log(`Haciendo petición a: /v1/agendas/estado/${estado}`); // Para debugging
      const response = await axiosInstance.get(`/v1/agendas/estado/${estado}`);
      console.log(`Respuesta del servidor para estado ${estado}:`, response.data); // Para debugging
      return response.data;
    } catch (error) {
      console.error(`Error al obtener agendas por estado ${estado}:`, error);
      throw error;
    }
  }

  async createAgenda(agenda: Agendas, file?: File | null) {
    try {
      console.log("Enviando agenda para crear:", agenda); // Para debugging
      
      const formData = new FormData();
      // Añadir todos los campos de la agenda al FormData
      formData.append('nombre', agenda.nombre);
      formData.append('descripcion', agenda.descripcion);
      formData.append('horaInicio', agenda.horaInicio);
      formData.append('horaFin', agenda.horaFin);
      formData.append('fecha', agenda.fecha);
      formData.append('color', agenda.color);
      formData.append('tipo', agenda.tipo);
      formData.append('estado', agenda.estado);
      formData.append('lugar', agenda.lugar);
      formData.append('publico', agenda.publico.toString());
      
      if (file) {
        formData.append('file', file);
      }
      
      const response = await axiosInstance.post('/v1/agendas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Respuesta del servidor:", response.data); // Para debugging
      return response.data;
    } catch (error) {
      console.error("Error al crear agenda:", error);
      throw error;
    }
  }

  async updateAgenda(id: number, agenda: Agendas, file?: File | null) {
    try {
      console.log("Enviando agenda para actualizar:", agenda); // Para debugging
      
      const formData = new FormData();
      // Añadir todos los campos de la agenda al FormData
      formData.append('id', id.toString());
      formData.append('nombre', agenda.nombre);
      formData.append('descripcion', agenda.descripcion || '');
      formData.append('horaInicio', agenda.horaInicio);
      formData.append('horaFin', agenda.horaFin);
      formData.append('fecha', agenda.fecha);
      formData.append('color', agenda.color || '');
      formData.append('tipo', agenda.tipo);
      formData.append('estado', agenda.estado);
      formData.append('lugar', agenda.lugar || '');
      formData.append('publico', (agenda.publico || false).toString());
      
      // Si hay un documento existente, mantenerlo
      if (agenda.documento) {
        formData.append('documento', agenda.documento);
      }
      
      // Si hay un nuevo archivo, agregarlo
      if (file) {
        formData.append('file', file);
      }
      
      const response = await axiosInstance.put(`/v1/agendas/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Respuesta del servidor:", response.data); // Para debugging
      return response.data;
    } catch (error) {
      console.error("Error al actualizar agenda:", error);
      throw error;
    }
  }

  async deleteAgenda(id: number) {
    try {
      console.log("Eliminando agenda con id:", id); // Para debugging
      const response = await axiosInstance.delete(`/v1/agendas/${id}`);
      console.log("Respuesta del servidor:", response.data); // Para debugging
      return response.data;
    } catch (error) {
      console.error("Error al eliminar agenda:", error);
      throw error;
    }
  }

  async notificarAgenda(data: Notification) {
    try {
      const response = await axiosInstance.post(`/v1/agendas/notificar`, data);
      return response.data;
    } catch (error) {
      console.error("Error al notificar agenda:", error);
      throw error;
    }
  }

  async reenviarNotificacion(id: number) {
    try {
      const response = await axiosInstance.post(`/v1/agendas/reenviar/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al reenviar notificación:", error);
      throw error;
    }
  }

  async getNotificacionByAgendaId(agendaId: number) {
    try {
      const response = await axiosInstance.get(`/v1/agendas/notificaciones/${agendaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener notificaciones por agendaId:", error);
      throw error;
    }
  }

  async confirmarAsistencia(token: string, respuesta: string) {
    try {
        console.log('Iniciando confirmación de asistencia:', { token, respuesta });
        const response = await axiosInstance.get(`/v1/agendas/confirmar`, {
            params: {
                token,
                respuesta
            }
        });
        console.log('Respuesta exitosa:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error detallado en confirmación:', {
            mensaje: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        throw error;
    }
  }
}

const agendaService = new AgendaService();

export default agendaService;