import apiClient from './api-client';
import Cookies from 'js-cookie';
import { useAuthStore } from './store';

// Tipos de datos
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  passwordChangeRequired: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface ActivationRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Duración de las cookies
const ACCESS_TOKEN_EXPIRES = 1; // 1 día
const REFRESH_TOKEN_EXPIRES = 7; // 7 días

/**
 * Servicio de autenticación para manejar operaciones relacionadas con la autenticación
 */
const AuthService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/v1/auth/login', credentials);
      
      // Guardar tokens en cookies
      this.setTokens(response.data);
      
      // Actualizar el estado de autenticación en el store global
      useAuthStore.getState().checkAuthStatus();
      
      // Si se requiere cambio de contraseña, guardar esta información
      if (response.data.passwordChangeRequired) {
        localStorage.setItem('passwordChangeRequired', 'true');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  /**
   * Registrar un nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<any> {
    try {
      const response = await apiClient.post<AuthResponse>('/v1/auth/register', credentials);
      
      // No guardamos tokens ni actualizamos estado de autenticación
      // Ya que el usuario debe activar su cuenta primero
      
      return {
        success: true,
        message: "Registro exitoso. Por favor revise su correo electrónico para activar su cuenta."
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  /**
   * Cerrar sesión
   */
  logout(): void {
    // Eliminar tokens de las cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Limpiar datos del usuario del store global
    useAuthStore.getState().clearUser();
    
    // Redirigir a la página de login si estamos en el navegador
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Manejar logout automático cuando se detecta token inválido o problemas de conexión
   */
  handleTokenInvalidation(reason?: string): void {
    console.warn('Token invalidado:', reason || 'Razón no especificada');
    
    // Eliminar tokens de las cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Limpiar datos del usuario del store global
    useAuthStore.getState().clearUser();
    
    // No redirigir automáticamente para evitar loops de redirección
    // El middleware se encargará de la redirección
  },
  
  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Intentar obtener del store global primero
      const { user, isAuthenticated } = useAuthStore.getState();
      if (user && this.isAuthenticated() && isAuthenticated) {
        return user;
      }
      
      // Si no hay datos en el store o el token no es válido, obtener de la API
      const response = await apiClient.get<User>('/v1/users/me');
      
      // Guardar en el store global para futuras referencias
      useAuthStore.getState().setUser(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  },
  
  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const isAuth = !!Cookies.get('accessToken');
    // Actualizar el estado del store si es necesario
    if (isAuth !== useAuthStore.getState().isAuthenticated) {
      useAuthStore.getState().checkAuthStatus();
    }
    return isAuth;
  },
  
  /**
   * Guardar tokens en cookies
   */
  setTokens(authResponse: AuthResponse): void {
    Cookies.set('accessToken', authResponse.accessToken, { 
      expires: ACCESS_TOKEN_EXPIRES,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    Cookies.set('refreshToken', authResponse.refreshToken, { 
      expires: REFRESH_TOKEN_EXPIRES,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Actualizar estado de autenticación en el store
    useAuthStore.getState().checkAuthStatus();
  },

  /**
   * Activar cuenta de usuario mediante token
   */
  async activateAccount(activationRequest: ActivationRequest): Promise<any> {
    try {
      const response = await apiClient.post('/v1/account/activate', activationRequest);
      return response.data;
    } catch (error) {
      console.error('Error al activar cuenta:', error);
      throw error;
    }
  },

  /**
   * Solicitar un nuevo token de activación
   */
  async requestActivationToken(email: string): Promise<any> {
    try {
      const response = await apiClient.post('/v1/account/request-activation', { email });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar nuevo token de activación:', error);
      throw error;
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<any> {
    try {
      const response = await apiClient.post('/v1/account/forgot-password', request);
      return response.data;
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      throw error;
    }
  },

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<any> {
    try {
      const response = await apiClient.post('/v1/account/reset-password', request);
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  },

  /**
   * Cambiar la contraseña del usuario autenticado
   */
  async changePassword(request: ChangePasswordRequest): Promise<any> {
    try {
      const response = await apiClient.post('/v1/users/me/password', request);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  },

  /**
   * Establecer una nueva contraseña (para usuarios que necesitan cambiarla en el primer inicio)
   */
  async setPassword(newPassword: string, confirmPassword: string): Promise<any> {
    try {
      const response = await apiClient.post('/v1/users/me/set-password', { 
        newPassword, 
        confirmPassword 
      });
      
      // Eliminar la marca de cambio requerido si existe
      localStorage.removeItem('passwordChangeRequired');
      
      return response.data;
    } catch (error) {
      console.error('Error al establecer la contraseña:', error);
      throw error;
    }
  },
  
  /**
   * Verificar si el usuario necesita cambiar su contraseña
   */
  requiresPasswordChange(): boolean {
    return localStorage.getItem('passwordChangeRequired') === 'true';
  },
  
  /**
   * Marcar que el usuario ya cambió su contraseña
   */
  clearPasswordChangeRequired(): void {
    localStorage.removeItem('passwordChangeRequired');
  }
};

export default AuthService; 