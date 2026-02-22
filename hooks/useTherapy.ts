import { useState } from 'react';
import { therapyService } from '@/lib/api/services/therapyService';

interface TherapyState {
  therapies: any[];
  isLoading: boolean;
  error: string | null;
}

export const useTherapy = () => {
  const [therapyState, setTherapyState] = useState<TherapyState>({
    therapies: [],
    isLoading: false,
    error: null,
  });

  const fetchTherapies = async () => {
    setTherapyState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await therapyService.getTherapies();
      if (response.error) {
        setTherapyState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
        return { error: response.error };
      }
      setTherapyState(prev => ({
        ...prev,
        isLoading: false,
        therapies: Array.isArray(response.data) ? response.data : []
      }));
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setTherapyState(prev => ({ ...prev, isLoading: false, error: message }));
      return { error: message };
    }
  };

  const fetchTherapy = async (id: string) => {
    setTherapyState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await therapyService.getTherapy(id);
      if (response.error) {
        setTherapyState(prev => ({ ...prev, isLoading: false, error: response.error ?? null }));
        return { error: response.error };
      }
      setTherapyState(prev => ({
        ...prev,
        isLoading: false,
        therapies: response.data ? [response.data] : []
      }));
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setTherapyState(prev => ({ ...prev, isLoading: false, error: message }));
      return { error: message };
    }
  };

  return {
    ...therapyState,
    fetchTherapies,
    fetchTherapy,
  };
};