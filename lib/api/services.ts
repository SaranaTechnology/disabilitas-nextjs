import { apiClient, type User, type Appointment, type RegisterCredentials, type LoginCredentials, type AppointmentInsert, type ProfileUpdate, type AppointmentUpdate } from './client';

// Auth Service
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

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return apiClient.auth.onAuthStateChange(callback);
  }
};

// User Service
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

// Appointment Service
export const appointmentService = {
  getAppointment: async (id: string) => {
    return await apiClient.appointments.get(id);
  },

  listAppointments: async () => {
    return await apiClient.appointments.list();
  },

  createAppointment: async (data: AppointmentInsert) => {
    return await apiClient.appointments.create(data);
  },

  updateAppointment: async (id: string, data: AppointmentUpdate) => {
    return await apiClient.appointments.update(id, data);
  },

  deleteAppointment: async (id: string) => {
    return await apiClient.appointments.delete(id);
  },

  getUserAppointments: async (userId: string) => {
    return await apiClient.appointments.getUserAppointments(userId);
  },

  getTherapistAppointments: async (therapistId: string) => {
    return await apiClient.appointments.getTherapistAppointments(therapistId);
  }
};

// Therapy Location Service
export const therapyLocationService = {
  list: async (params: { city_code?: string; limit?: number } = {}) => {
    return await apiClient.public.therapyLocations.list(params);
  },

  get: async (id: string) => {
    return await apiClient.public.therapyLocations.get(id);
  },

  register: async (data: any) => {
    return await apiClient.public.therapyLocationRegister.submit(data);
  }
};

// Therapist Service (public therapists/providers search)
export const therapistService = {
  list: async (params: {
    search?: string;
    location?: string;
    specialization?: string;
    page_size?: number;
  } = {}) => {
    return await apiClient.public.therapists.list(params);
  }
};

// Location Service (geographic data)
export const locationService = {
  getCountries: async () => {
    return await apiClient.locations.countries();
  },

  getStates: async (countryCode?: string) => {
    return await apiClient.locations.states(countryCode);
  },

  getCities: async (stateCode?: string) => {
    return await apiClient.locations.cities(stateCode);
  }
};

// Article Service
export const articleService = {
  list: async (params: { q?: string; category?: string; limit?: number; offset?: number } = {}) => {
    return await apiClient.public.articles.list(params);
  },

  get: async (idOrSlug: string) => {
    return await apiClient.public.articles.get(idOrSlug);
  },

  getCategories: async () => {
    return await apiClient.public.articles.getCategories();
  }
};

// Resource Service
export const resourceService = {
  list: async (params: { category?: string; limit?: number; offset?: number } = {}) => {
    return await apiClient.public.resources.list(params);
  },

  get: async (id: string) => {
    return await apiClient.public.resources.get(id);
  },

  getCategories: async () => {
    return await apiClient.public.resources.getCategories();
  }
};

// Contact Service
export const contactService = {
  submit: async (data: any) => {
    return await apiClient.public.contact.submit(data);
  }
};

// Forum Service
export const forumService = {
  listThreads: async () => {
    return await apiClient.forum.listThreads();
  },

  getThread: async (id: string) => {
    return await apiClient.forum.getThread(id);
  },

  createThread: async (data: { user_id: string; title: string; body: string }) => {
    return await apiClient.forum.createThread(data);
  },

  addComment: async (threadId: string, data: { user_id: string; body: string }) => {
    return await apiClient.forum.addComment(threadId, data);
  }
};
