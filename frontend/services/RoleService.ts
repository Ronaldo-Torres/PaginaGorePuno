import apiClient from "@/lib/api-client";

export interface Privilege {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  privileges: Privilege[];
}

export interface CreateRoleDto {
  name: string;
  privileges: Privilege[];
}

export interface UpdateRoleDto {
  name: string;
  privileges: Privilege[];
}

const RoleService = {
  // Obtener todos los roles
  getRoles: async () => {
    const response = await apiClient.get<Role[]>("/v1/roles");
    return response.data;
  },

  // Obtener un rol por ID
  getRoleById: async (id: number) => {
    const response = await apiClient.get<Role>(`/v1/roles/${id}`);
    return response.data;
  },

  // Crear un nuevo rol
  createRole: async (roleData: CreateRoleDto) => {
    const response = await apiClient.post<Role>("/v1/roles", {
      name: roleData.name,
      privileges: roleData.privileges,
    });
    return response.data;
  },

  // Actualizar un rol
  updateRole: async (id: number, roleData: UpdateRoleDto) => {
    const response = await apiClient.put<Role>(`/v1/roles/${id}`, {
      name: roleData.name,
      privileges: roleData.privileges,
    });
    return response.data;
  },

  // Eliminar un rol
  deleteRole: async (id: number) => {
    await apiClient.delete(`/v1/roles/${id}`);
  },

  // Obtener lista simplificada de roles (para selects)
  getRolesList: async () => {
    const response = await apiClient.get<Role[]>("/v1/roles/list");
    return response.data;
  },
};

export default RoleService;
