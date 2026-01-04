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
        setTherapyState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setTherapyState(prev => ({ 
        ...prev, 
        isLoading: false, 
        therapies: response.data || [] 
      }));
      return response;
    } catch (error: any) {
      setTherapyState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const fetchTherapy = async (id: string) => {
    setTherapyState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await therapyService.getTherapy(id);
      if (response.error) {
        setTherapyState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setTherapyState(prev => ({ 
        ...prev, 
        isLoading: false, 
        therapies: response.data ? [response.data] : [] 
      }));
      return response;
    } catch (error: any) {
      setTherapyState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  return {
    ...therapyState,
    fetchTherapies,
    fetchTherapy,
  };
};