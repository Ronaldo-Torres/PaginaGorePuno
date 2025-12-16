import apiClient from "@/lib/api-client";
import { Privilege } from "./RoleService";

export interface CreatePrivilegeDto {
  name: string;
  description: string;
}

export interface UpdatePrivilegeDto {
  name: string;
  description: string;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const PrivilegeService = {
  // Obtener lista completa de privilegios (sin paginación)
  getAllPrivileges: async () => {
    const response = await apiClient.get<Privilege[]>("/v1/privileges/list");
    return response.data;
  },

  // Obtener todos los privilegios
  getPrivileges: async (pageRequest?: PageRequest) => {
    const { page = 0, size = 10, sortBy = 'name', sortDir = 'asc' } = pageRequest || {};
    const response = await apiClient.get<PageResponse<Privilege>>("/v1/privileges", {
      params: {
        page,
        size,
        sortBy,
        sortDir
      }
    });
    return response.data;
  },

  // Obtener un privilegio por ID
  getPrivilegeById: async (id: number) => {
    const response = await apiClient.get<Privilege>(`/v1/privileges/${id}`);
    return response.data;
  },

  // Obtener un privilegio por nombre
  getPrivilegeByName: async (name: string) => {
    const response = await apiClient.get<Privilege>(`/v1/privileges/name/${name}`);
    return response.data;
  },

  // Crear un nuevo privilegio
  createPrivilege: async (privilegeData: CreatePrivilegeDto) => {
    const response = await apiClient.post<Privilege>("/v1/privileges", privilegeData);
    return response.data;
  },

  // Actualizar un privilegio
  updatePrivilege: async (id: number, privilegeData: UpdatePrivilegeDto) => {
    const response = await apiClient.put<Privilege>(`/v1/privileges/${id}`, privilegeData);
    return response.data;
  },

  // Eliminar un privilegio
  deletePrivilege: async (id: number) => {
    await apiClient.delete(`/v1/privileges/${id}`);
  },
};

export default PrivilegeService; 