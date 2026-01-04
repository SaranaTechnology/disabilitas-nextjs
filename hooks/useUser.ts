import { useState } from 'react';
import { userService } from '@/lib/api/services/userService';
import type { User, ProfileUpdate } from '@/lib/api/client';

interface UserState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    users: [],
    isLoading: false,
    error: null,
  });

  const fetchUser = async (id: string) => {
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await userService.getUser(id);
      if (response.error) {
        setUserState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setUserState(prev => ({ ...prev, isLoading: false, user: response.data as User }));
      return response;
    } catch (error: any) {
      setUserState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const fetchCurrentUser = async () => {
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await userService.getCurrentUser();
      if (response.error) {
        setUserState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setUserState(prev => ({ ...prev, isLoading: false, user: response.data as User }));
      return response;
    } catch (error: any) {
      setUserState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const fetchUsers = async () => {
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await userService.listUsers();
      if (response.error) {
        setUserState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setUserState(prev => ({ ...prev, isLoading: false, users: (response.data || []) as User[] }));
      return response;
    } catch (error: any) {
      setUserState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const updateUser = async (id: string, data: ProfileUpdate) => {
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await userService.updateUser(id, data);
      if (response.error) {
        setUserState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setUserState(prev => ({ ...prev, isLoading: false, user: response.data as User }));
      return response;
    } catch (error: any) {
      setUserState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const deleteUser = async (id: string) => {
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await userService.deleteUser(id);
      if (response.error) {
        setUserState(prev => ({ ...prev, isLoading: false, error: response.error }));
        return { error: response.error };
      }
      setUserState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (error: any) {
      setUserState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return { error: error.message };
    }
  };

  return {
    ...userState,
    fetchUser,
    fetchCurrentUser,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};
