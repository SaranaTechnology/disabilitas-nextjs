import { apiClient, type LoginCredentials, type RegisterCredentials, type Session } from '@/lib/api/client';

export const authService = {
  signUp: async (credentials: RegisterCredentials) => {
    return await apiClient.auth.signUp(credentials);
  },

  signIn: async (credentials: LoginCredentials) => {
    return await apiClient.auth.signInWithPassword(credentials);
  },

  signOut: async () => {
    return await apiClient.auth.signOut();
  },

  getCurrentUser: async () => {
    return await apiClient.auth.getSession();
  },

  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return apiClient.auth.onAuthStateChange(callback);
  }
};
