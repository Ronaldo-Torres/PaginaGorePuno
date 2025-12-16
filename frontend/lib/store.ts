import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './auth-service';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

// Verificar autenticación basado en el token
const checkIsAuthenticated = () => {
  return typeof window !== 'undefined' && !!Cookies.get('accessToken');
};

// Interfaz para el estado de autenticación
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  checkAuthStatus: () => void;
}

// Store para manejo de autenticación utilizando zustand con persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: checkIsAuthenticated(),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      checkAuthStatus: () => set({ isAuthenticated: checkIsAuthenticated() })
    }),
    {
      name: 'auth-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Hook para acceder al estado del usuario autenticado
export const useUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  // Verificar estado de autenticación usando un efecto en lugar de durante el renderizado
  useEffect(() => {
    useAuthStore.getState().checkAuthStatus();
  }, []);
  
  return { user, isAuthenticated };
};

// Hook para acceder a las acciones de actualización del usuario
export const useUserActions = () => {
  const { setUser, clearUser } = useAuthStore();
  return { setUser, clearUser };
}; 