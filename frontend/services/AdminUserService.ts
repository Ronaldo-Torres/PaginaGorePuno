import apiClient from "@/lib/api-client";
import { User, Role, CreateUserRequest, UpdateUserRequest } from "@/types/user";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  sendEmail?: boolean;
  password?: string;
  enabled?: boolean;
  avatar?: File;
}

const AdminUserService = {
  // Obtener todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/v1/admin/users");
    return response.data;
  },

  // Obtener usuarios paginados con filtros
  getUsersPage: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id",
    order: string = "desc",
    search?: string,
    role: string = "all"
  ): Promise<PageResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      order,
      ...(search && { search }),
      role,
    });

    const response = await apiClient.get(`/v1/admin/users/page?${params}`);
    return response.data;
  },

  // Crear o actualizar usuario
  saveUser: async (data: UserFormData, userId?: string): Promise<User> => {
    const formData = new FormData();
    
    // Datos comunes para crear y actualizar
    formData.append("firstName", data.firstName.trim());
    formData.append("lastName", data.lastName.trim());
    formData.append("email", data.email.trim());
    if (data.phone?.trim()) formData.append("phone", data.phone.trim());
    if (data.avatar) formData.append("avatar", data.avatar);
    formData.append("roleIds", data.roleId);

    if (userId) {
      // Actualizar usuario existente
      const response = await apiClient.put(`/v1/admin/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Crear nuevo usuario
      formData.append("sendActivationEmail", (data.sendEmail ?? true).toString());
      if (!data.sendEmail && data.password) {
        formData.append("password", data.password);
      }
      if (!data.sendEmail) {
        formData.append("enabled", (data.enabled ?? false).toString());
      }

      const response = await apiClient.post("/v1/admin/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }
  },

  // Eliminar usuario
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/v1/admin/users/${userId}`);
    return response.data;
  },

  // Cambiar estado del usuario (activar/desactivar)
  toggleUserStatus: async (userId: string, enabled: boolean): Promise<User> => {
    const response = await apiClient.patch(`/v1/admin/users/${userId}/status`, {
      enabled,
    });
    return response.data;
  },

  // Eliminar avatar del usuario
  removeUserAvatar: async (userId: string): Promise<User> => {
    const response = await apiClient.delete(`/v1/admin/users/${userId}/avatar`);
    return response.data;
  },

  // Resetear contraseña del usuario
  resetUserPassword: async (userId: string): Promise<{ message: string; email: string }> => {
    const response = await apiClient.post(`/v1/admin/users/${userId}/reset-password`);
    return response.data;
  },

  // Obtener roles
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get("/v1/admin/roles");
    return response.data;
  },
};

export default AdminUserService;