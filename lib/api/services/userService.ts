import { apiClient, type User, type ProfileUpdate } from '@/lib/api/client';

export const userService = {
  getCurrentUser: async () => {
    return await apiClient.users.getCurrent();
  },

  getUser: async (id: string) => {
    return await apiClient.users.get(id);
  },

  updateUser: async (id: string, data: ProfileUpdate) => {
    return await apiClient.users.update(id, data);
  },

  deleteUser: async (id: string) => {
    return await apiClient.users.delete(id);
  },

  listUsers: async () => {
    return await apiClient.users.list();
  }
};