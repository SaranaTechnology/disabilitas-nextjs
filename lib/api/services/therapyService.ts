import { apiClient } from '@/lib/api/client';

export const therapyService = {
  getTherapies: async () => {
    // Public therapy listing endpoint
    return await apiClient.from('public/therapy').select('*').execute();
  },

  getTherapy: async (id: string) => {
    // Filter by id via query param against the public endpoint
    return await apiClient.from('public/therapy').select('*').eq('id', id);
  }
};
