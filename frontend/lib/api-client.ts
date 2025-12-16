import axios from 'axios';
import Cookies from 'js-cookie';

// Configuración de la URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Crear una instancia de axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contador para errores de conexión consecutivos
let consecutiveConnectionErrors = 0;
const MAX_CONNECTION_ERRORS = 2; // Reducido para detectar más rápido

// Función para resetear contador de errores (exportada para uso externo si es necesario)
export const resetConnectionErrorCount = () => {
  consecutiveConnectionErrors = 0;
  console.log('Interceptor: Connection error count reset');
};

// Función temporal para debug - simular pérdida de servidor
export const simulateServerLoss = () => {
  console.warn('DEBUG: Simulating server loss...');
  forceLogoutDueToConnectionLoss();
};

// Interceptor para añadir el token de autenticación en las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor robusto para manejar autenticación automáticamente
apiClient.interceptors.response.use(
  (response) => {
    // Reset contador de errores en respuesta exitosa
    consecutiveConnectionErrors = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Manejar errores 401 - Token expirado/inválido
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        console.log('Interceptor: Attempting token refresh...');
        
        // Intentar renovar el token
        const response = await axios.post(`${API_URL}/v1/auth/refresh-token`, { 
          refreshToken 
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Guardar los nuevos tokens
        Cookies.set('accessToken', accessToken, { 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        Cookies.set('refreshToken', newRefreshToken, { 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        
        console.log('Interceptor: Token refreshed successfully');
        
        // Actualizar el encabezado y reintentar la solicitud
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError: any) {
        console.error('Interceptor: Token refresh failed:', refreshError);
        
        // No se pudo renovar - invalidar sesión
        handleAuthenticationFailure('Token refresh failed');
        return Promise.reject(refreshError);
      }
    }
    
    // Manejar errores 403 - Forbidden (usualmente por permisos)
    if (error.response?.status === 403) {
      console.warn('Interceptor: 403 Forbidden - insufficient permissions');
      // No hacer logout automático, solo log del error
    }
    
    // Manejar errores de conexión (sin respuesta del servidor)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        consecutiveConnectionErrors++;
        console.warn(`Interceptor: Network error detected (${consecutiveConnectionErrors}/${MAX_CONNECTION_ERRORS}):`, error.message);
        console.warn('Current path:', typeof window !== 'undefined' ? window.location.pathname : 'SSR');
        
        // Si estamos en el dashboard y hemos tenido múltiples errores consecutivos
        if (typeof window !== 'undefined' && 
            window.location.pathname.startsWith('/dashboard') && 
            consecutiveConnectionErrors >= MAX_CONNECTION_ERRORS) {
          
          console.warn('Interceptor: Multiple connection failures detected - forcing logout');
          
          // Redirección inmediata al login con limpieza de estado
          forceLogoutDueToConnectionLoss();
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Función helper para manejar fallos de autenticación
function handleAuthenticationFailure(reason: string) {
  console.warn('Interceptor: Authentication failure -', reason);
  
  // Limpiar cookies
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  
  // Importación dinámica para evitar dependencias circulares
  if (typeof window !== 'undefined') {
    import('./auth-service').then(({ default: AuthService }) => {
      AuthService.handleTokenInvalidation(reason);
    });
    
    // Mostrar mensaje según el tipo de error
    import('sonner').then(({ toast }) => {
      if (reason.includes('conexión perdida') || reason.includes('Servidor no disponible')) {
        toast.error('Se perdió la conexión con el servidor. Serás redirigido al login.');
      } else if (reason.includes('Token refresh failed')) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        toast.error('Sesión terminada. Serás redirigido al login.');
      }
    });
    
    // Redirigir al login después de un breve delay para mostrar el mensaje
    setTimeout(() => {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }, 1500);
  }
}

// Función específica para logout por pérdida de conexión
function forceLogoutDueToConnectionLoss() {
  console.error('Interceptor: Forcing logout due to connection loss');
  
  // Limpiar cookies inmediatamente
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  
  if (typeof window !== 'undefined') {
    // Limpiar también localStorage si hay datos ahí
    localStorage.removeItem('passwordChangeRequired');
    
    // Mostrar mensaje inmediato
    import('sonner').then(({ toast }) => {
      toast.error('Se perdió la conexión con el servidor. Redirigiendo al login...', {
        duration: 3000,
      });
    });
    
    // Importar AuthService para limpiar estado
    import('./auth-service').then(({ default: AuthService }) => {
      AuthService.handleTokenInvalidation('Pérdida de conexión con el servidor');
    });
    
    // Redirección inmediata (sin delay)
    console.log('Interceptor: Redirecting to /login...');
    window.location.replace('/login');
  }
}

/**
 * Interfaces para los tipos de datos que devuelve la API
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles?: string[] | null;
  enabled: boolean;
  createdAt: string | null;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  passwordChangeRequired: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleIds: number[];
  sendActivationEmail?: boolean;
  password?: string;
  enabled?: boolean;
  avatar?: File;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: File;
}

/**
 * API para gestión de usuarios (admin)
 */
export const UserAPI = {
  /**
   * Obtiene todos los usuarios del sistema (solo admin)
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/v1/admin/users');
    return response.data;
  },

  /**
   * Obtiene usuarios de manera paginada (solo admin)
   */
  getUsersPage: async (params: PaginationParams): Promise<PageResponse<User>> => {
    const { page, size, sort = 'id', order = 'desc', search, role } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    queryParams.append('sort', sort);
    queryParams.append('order', order);
    
    if (search) {
      queryParams.append('search', search);
    }
    
    if (role && role !== 'all') {
      queryParams.append('role', role);
    }
    
    const response = await apiClient.get<PageResponse<User>>(`/v1/admin/users/page?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Crea un nuevo usuario (solo admin)
   */
  createUser: async (userData: CreateUserRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('phone', userData.phone || '');
    formData.append('email', userData.email);
    formData.append('roleIds', userData.roleIds.join(','));
    
    if (userData.phone) {
      formData.append('phone', userData.phone);
    }
    if (userData.sendActivationEmail !== undefined) {
      formData.append('sendActivationEmail', userData.sendActivationEmail.toString());
    }
    if (userData.password) {
      formData.append('password', userData.password);
    }
    if (userData.enabled !== undefined) {
      formData.append('enabled', userData.enabled.toString());
    }
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await apiClient.post('/v1/admin/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Actualiza un usuario existente (solo admin)
   */
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('phone', userData.phone || '');
    formData.append('email', userData.email);
    
    if (userData.phone) {
      formData.append('phone', userData.phone);
    }
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await apiClient.put(`/v1/admin/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Elimina un usuario (solo admin)
   */
  deleteUser: async (userId: string): Promise<any> => {
    const response = await apiClient.delete(`/v1/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Cambia el estado de activación de un usuario (solo admin)
   */
  toggleUserStatus: async (userId: string, enabled: boolean): Promise<any> => {
    const response = await apiClient.patch(`/v1/admin/users/${userId}/status`, { enabled });
    return response.data;
  },

  /**
   * Elimina el avatar de un usuario (solo admin)
   */
  removeUserAvatar: async (userId: string): Promise<any> => {
    const response = await apiClient.delete(`/v1/admin/users/${userId}/avatar`);
    return response.data;
  },

  /**
   * Resetea la contraseña de un usuario y envía credenciales por email (solo admin)
   */
  resetUserPassword: async (userId: string): Promise<any> => {
    const response = await apiClient.post(`/v1/admin/users/${userId}/reset-password`);
    return response.data;
  }
};

/**
 * API para perfil de usuario
 */
export const ProfileAPI = {
  /**
   * Obtiene el perfil del usuario actual
   */
  getCurrentProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/v1/users/me');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario actual
   */
  updateProfile: async (profileData: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: File;
  }): Promise<any> => {
    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    
    if (profileData.phone) {
      formData.append('phone', profileData.phone);
    }
    
    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar);
    }

    const response = await apiClient.put('/v1/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Cambia la contraseña del usuario actual
   */
  changePassword: async (passwordData: ChangePasswordRequest): Promise<any> => {
    const response = await apiClient.put('/v1/users/me/password', passwordData);
    return response.data;
  },

  /**
   * Elimina el avatar del usuario actual
   */
  removeAvatar: async (): Promise<any> => {
    const response = await apiClient.delete('/v1/users/me/avatar');
    return response.data;
  }
};

export default apiClient; 