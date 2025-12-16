import { DocumetoSyncDTO } from "@/types/documento";
import axiosInstance from '@/lib/api-client';

class DocumentoService {
  async createDocumento(formData: FormData) {

    console.log("CREAR- Datos enviados a /v1/documentos:");
    for (let pair of formData.entries()) {
      console.log(`   ${pair[0]}:`, pair[1]);
    }

    try {
      const response = await axiosInstance.post("/v1/documentos", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en createDocumento:", error);
      throw error;
    }
  }

  async updateDocumento(id: number, formData: FormData) {

    console.log("EDITAR- Datos enviados a /v1/documentos:");
    for (let pair of formData.entries()) {
      console.log(`   ${pair[0]}:`, pair[1]);
    }

    try {
      const response = await axiosInstance.put(`/v1/documentos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en updateDocumento:", error);
      throw error;
    }
  }

  async getDocumentos() {
    try {
      const response = await axiosInstance.get("/v1/documentos");
      return response.data;
    } catch (error) {
      console.error("Error en getDocumentos:", error);
      throw error;
    }
  }

  async getDocumentosByTipo(id: number, codigo: string, anio: number, page: number = 0, size: number = 10, search: string = '', filter: string = '') {

    // console.log("Datos de getDocumentosByTipo: id =", id, "codigo =", codigo, "page =", page, "size =", size, "search =", search, "anio =", anio);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      if (filter) {
        params.append('filter', filter);
      }

      const response = await axiosInstance.get(`/v1/documentos/tipo/${id}/anio/${anio}?${params.toString()}`);
      return response.data;

    } catch (error) {
      console.error("Error en getDocumentosByTipo:", error);
      throw error;
    }
  }

  async getConsejeros() {
    try {
      const response = await axiosInstance.get("/v1/documentos/consejeros");
      return response.data;
    } catch (error) {
      console.error("Error en getConsejeros:", error);
      throw error;
    }
  }

  async getComisiones() {
    try {
      const response = await axiosInstance.get("/v1/documentos/comisiones");
      return response.data;
    } catch (error) {
      console.error("Error en getComisiones:", error);
      throw error;
    }
  }

  async getDocumentosSgd(codigoOficina: string, tipoDocumento: string, anio: string, emisiones: string[]) {
    try {
      const response = await axiosInstance.post(`/sgd/documentos/all?codigoOficina=${codigoOficina}&tipoDocumento=${tipoDocumento}&anio=${anio}`, emisiones);
      return response.data;
    } catch (error) {
      console.error("Error en getDocumentosSgd:", error);
      throw error;
    }
  }

  async updateDocumentoCategories(id: number, categories: {
    tags?: string;
    consejeroIds?: number[];
    comisionIds?: number[];
  }) {
    try {
      const response = await axiosInstance.patch(`/v1/documentos/${id}/categories`, categories);
      return response.data;
    } catch (error) {
      console.error("Error en updateDocumentoCategories:", error);
      throw error;
    }
  }

  async sincronizarDocumentos(documentoSincronizacion: DocumetoSyncDTO) {
    try {
      const response = await axiosInstance.post(`/v1/documentos/sincronizar`, documentoSincronizacion);
      return response.data;
    } catch (error) {
      console.error("Error en sincronizarDocumentos:", error);
      throw error;
    }
  }

  async getDocumentosByTipoSgd(
    codigoOficina: string,
    tipoDocumento: string,
    anio: string,
    page: number = 0,
    size: number = 10,
    search: string = '') {
    try {
      const response = await axiosInstance.post(`/sgd/documentos/crp?codigoOficina=${codigoOficina}&tipoDocumento=${tipoDocumento}&anio=${anio}&page=${page}&size=${size}&search=${search}`,
        [], {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en getDocumentosByTipoSgd:", error);
      throw error;
    }
  }

  async getDocumentoSincronizacion(codigoEmision: string) {
    try {
      const response = await axiosInstance.get(`/v1/documentos/sincronizar/${codigoEmision}`);
      return response.data;
    } catch (error) {
      console.error("Error en getDocumentoSincronizacion:", error);
      throw error;
    }
  }

  async actualizarSincronizacion(id: number, data: DocumetoSyncDTO) {
    try {
      const response = await axiosInstance.put(`/v1/documentos/sincronizar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error en actualizarSincronizacion:", error);
      throw error;
    }
  }


}

export default new DocumentoService();
