import type {
  ApiResponse,
  User,
  Session,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Appointment,
  AppointmentInsert,
  AppointmentUpdate,
  Profile,
  ProfileUpdate,
  ForumThread,
  ForumComment,
  Resource,
  ResourceInsert,
  ResourceUpdate,
  Country,
  State,
  City,
  TherapyLocation,
  TherapyLocationInsert,
  TherapyLocationUpdate,
  TherapyLocationRegister,
  ContactMessage,
  ContactMessageInsert,
  ContactMessageUpdate,
  Article,
  ArticleSummary,
  ArticleInsert,
  ArticleUpdate,
  Notification,
  NotificationStats,
  NotificationListParams,
  NotificationCreate,
  Event,
  EventCreate,
  EventUpdate,
  EventParticipant,
  RSVPStatus,
  Community,
  CommunityCreate,
  CommunityListParams,
  PasswordResetRequest,
  PasswordResetValidate,
  PasswordReset
} from './types';

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082/v1';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

    // Load existing token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
      this.authToken = localStorage.getItem(tokenKey);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));

        // Clear token on 401 Unauthorized
        if (response.status === 401) {
          this.removeAuthToken();
        }

        return { data: null, error: errorData.error || errorData.message || response.statusText, status: response.status };
      }

      const data = await response.json();
      return { data: data.data, error: undefined, ...(data.meta && { meta: data.meta }) };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { data: null, error: 'Request timeout' };
        }
        return { data: null, error: error.message };
      }
      return { data: null, error: 'Unknown error occurred' };
    }
  }

  private async fetchUrl<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));

        // Clear token on 401 Unauthorized
        if (response.status === 401) {
          this.removeAuthToken();
        }

        return { data: null as unknown as T, error: errorData.error || errorData.message || response.statusText, status: response.status };
      }

      const data = await response.json();
      return { data: data.data, error: undefined, ...(data.meta && { meta: data.meta }) };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { data: null as unknown as T, error: 'Request timeout' };
        }
        return { data: null as unknown as T, error: error.message };
      }
      return { data: null as unknown as T, error: 'Unknown error occurred' };
    }
  }

  // Auth methods
  auth = {
    signUp: async (credentials: RegisterCredentials) => {
      const response = await this.makeRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.data && !response.error) {
        this.setAuthToken(response.data.token);
      }
      
      return response;
    },

    signInWithPassword: async (credentials: LoginCredentials) => {
      const response = await this.makeRequest<{ access_token: string; refresh_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.data && !response.error) {
        this.setAuthToken(response.data.access_token);
        // Decode JWT to get user info
        const payload = JSON.parse(atob(response.data.access_token.split('.')[1]));
        const user: User = {
          id: payload.uid,
          email: credentials.email,
          role: payload.role,
        };
        return { data: { token: response.data.access_token, user }, error: undefined };
      }

      return response as any;
    },

    signOut: async () => {
      // Always clear all tokens first, regardless of API response
      this.clearAllTokens();

      try {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
        });
      } catch (e) {
        // Ignore API errors on logout - tokens are already cleared
      }

      return { data: null, error: undefined };
    },

    getSession: async (): Promise<{ data: { session: Session | null } }> => {
      if (!this.authToken) {
        return { data: { session: null } };
      }

      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(this.authToken.split('.')[1]));
        const user: User = {
          id: payload.uid,
          email: '', // Will be fetched from /me endpoint if needed
          role: payload.role,
        };

        // Try to get more user info from /me endpoint
        const response = await this.makeRequest<{ user_id: string; role: string }>('/me');
        if (response.data) {
          user.id = response.data.user_id;
          user.role = response.data.role;
        }

        const session: Session = {
          user,
          access_token: this.authToken,
        };

        return { data: { session } };
      } catch (e) {
        this.removeAuthToken();
        return { data: { session: null } };
      }
    },

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      // For API-based auth, we'll simulate the state change events
      // This is a simplified version - you might want to implement WebSocket or polling for real-time updates
      const checkAuthState = async () => {
        const { data: { session } } = await this.auth.getSession();
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };

      // Initial check
      checkAuthState();

      // Return unsubscribe function
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              // Cleanup if needed
            }
          }
        }
      };
    },

    // Password reset methods
    requestPasswordReset: async (data: PasswordResetRequest) => {
      return await this.makeRequest<{ message: string }>('/auth/password/reset-request', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    validateResetToken: async (data: PasswordResetValidate) => {
      return await this.makeRequest<{ valid: boolean }>('/auth/password/validate-token', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    resetPassword: async (data: PasswordReset) => {
      return await this.makeRequest<{ message: string }>('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

  };

  // Public endpoints
  public = {
    therapists: {
      list: async (params: {
        search?: string;
        location?: string;
        specialization?: string;
        available?: boolean;
        sort?: 'rating' | 'created_at';
        order?: 'asc' | 'desc';
        page_size?: number;
      } = {}) => {
        const qs = new URLSearchParams();
        if (params.search) qs.set('search', params.search);
        if (params.location) qs.set('city_code', params.location);
        if (params.page_size) qs.set('limit', String(params.page_size));
        const suffix = qs.toString() ? `?${qs.toString()}` : '';
        return await this.makeRequest(`/public/therapists${suffix}`);
      },
      fetchCursor: async (cursorUrl: string) => {
        return await this.fetchUrl(cursorUrl);
      }
    },
    resources: {
      list: async (params: { category?: string; limit?: number; offset?: number } = {}) => {
        const qs = new URLSearchParams();
        if (params.category) qs.set('category', params.category);
        if (params.limit) qs.set('limit', String(params.limit));
        if (params.offset) qs.set('offset', String(params.offset));
        const suffix = qs.toString() ? `?${qs.toString()}` : '';
        return await this.makeRequest<Resource[]>(`/public/resources${suffix}`);
      },
      get: async (id: string) => {
        return await this.makeRequest<Resource>(`/public/resources/${id}`);
      },
      getCategories: async () => {
        return await this.makeRequest<string[]>(`/public/resources/categories`);
      }
    },
    therapyLocations: {
      list: async (params: { city_code?: string; limit?: number } = {}) => {
        const qs = new URLSearchParams();
        if (params.city_code) qs.set('city_code', params.city_code);
        if (params.limit) qs.set('limit', String(params.limit));
        const suffix = qs.toString() ? `?${qs.toString()}` : '';
        return await this.makeRequest<TherapyLocation[]>(`/therapy/locations${suffix}`);
      },
      get: async (id: string) => {
        return await this.makeRequest<TherapyLocation>(`/therapy/locations/${id}`);
      }
    },
    contact: {
      submit: async (data: ContactMessageInsert) => {
        return await this.makeRequest<ContactMessage>('/public/contact', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    therapyLocationRegister: {
      submit: async (data: TherapyLocationRegister) => {
        return await this.makeRequest<{ id: string; message: string }>('/public/therapy/locations/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    articles: {
      list: async (params: { q?: string; category?: string; limit?: number; offset?: number } = {}) => {
        const qs = new URLSearchParams();
        if (params.q) qs.set('q', params.q);
        if (params.category) qs.set('category', params.category);
        if (params.limit) qs.set('limit', String(params.limit));
        if (params.offset) qs.set('offset', String(params.offset));
        const suffix = qs.toString() ? `?${qs.toString()}` : '';
        return await this.makeRequest<ArticleSummary[]>(`/public/articles${suffix}`);
      },
      get: async (idOrSlug: string) => {
        return await this.makeRequest<Article>(`/public/articles/${idOrSlug}`);
      },
      getCategories: async () => {
        return await this.makeRequest<string[]>('/public/articles/categories');
      }
    }
  };

  // Location API methods
  locations = {
    countries: async (params: { q?: string; limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.q) qs.set('q', params.q);
      if (params.limit) qs.set('limit', String(params.limit));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      const response = await this.makeRequest<{ count: number; total: number; items: Country[] }>(`/locations/countries${suffix}`);
      return { ...response, data: response.data?.items || [], total: response.data?.total || 0 };
    },
    states: async (countryCode?: string, params: { q?: string; limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (countryCode) qs.set('country_code', countryCode);
      if (params.q) qs.set('q', params.q);
      if (params.limit) qs.set('limit', String(params.limit));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      const response = await this.makeRequest<{ count: number; total: number; items: State[] }>(`/locations/states${suffix}`);
      return { ...response, data: response.data?.items || [], total: response.data?.total || 0 };
    },
    cities: async (stateCode?: string, params: { q?: string; limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (stateCode) qs.set('state_code', stateCode);
      if (params.q) qs.set('q', params.q);
      if (params.limit) qs.set('limit', String(params.limit));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      const response = await this.makeRequest<{ count: number; total: number; items: City[] }>(`/locations/cities${suffix}`);
      return { ...response, data: response.data?.items || [], total: response.data?.total || 0 };
    }
  };

  // Admin therapy locations
  adminTherapyLocations = {
    list: async (params: { limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.limit) qs.set('limit', String(params.limit));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<TherapyLocation[]>(`/therapy/locations${suffix}`);
    },
    create: async (data: TherapyLocationInsert) => {
      return await this.makeRequest<TherapyLocation>('/therapy/locations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: TherapyLocationUpdate) => {
      return await this.makeRequest<TherapyLocation>(`/therapy/locations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/therapy/locations/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Admin contacts methods
  adminContacts = {
    list: async (params: { status?: string; limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.status) qs.set('status', params.status);
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<ContactMessage[]>(`/admin/contacts${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<ContactMessage>(`/admin/contacts/${id}`);
    },
    update: async (id: string, data: ContactMessageUpdate) => {
      return await this.makeRequest<ContactMessage>(`/admin/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/admin/contacts/${id}`, {
        method: 'DELETE',
      });
    },
    getUnreadCount: async () => {
      return await this.makeRequest<{ unread_count: number }>('/admin/contacts/unread-count');
    }
  };

  // Admin resources methods
  adminResources = {
    list: async (params: { category?: string; limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.category) qs.set('category', params.category);
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Resource[]>(`/admin/resources${suffix}`);
    },
    create: async (data: ResourceInsert) => {
      return await this.makeRequest<Resource>('/admin/resources', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: ResourceUpdate) => {
      return await this.makeRequest<Resource>(`/admin/resources/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/admin/resources/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Admin articles methods
  adminArticles = {
    list: async (params: { q?: string; category?: string; status?: string; limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.q) qs.set('q', params.q);
      if (params.category) qs.set('category', params.category);
      if (params.status) qs.set('status', params.status);
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<ArticleSummary[]>(`/admin/articles${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<Article>(`/admin/articles/${id}`);
    },
    create: async (data: ArticleInsert) => {
      return await this.makeRequest<Article>('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: ArticleUpdate) => {
      return await this.makeRequest<Article>(`/admin/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/admin/articles/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Notification methods (authenticated)
  notifications = {
    list: async (params: NotificationListParams = {}) => {
      const qs = new URLSearchParams();
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      if (params.type) qs.set('type', params.type);
      if (params.read !== undefined) qs.set('read', String(params.read));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Notification[]>(`/notifications${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<Notification>(`/notifications/${id}`);
    },
    getStats: async () => {
      return await this.makeRequest<NotificationStats>('/notifications/stats');
    },
    getUnreadCount: async () => {
      return await this.makeRequest<{ unread_count: number }>('/notifications/unread-count');
    },
    markAsRead: async (id: string) => {
      return await this.makeRequest<void>(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
    },
    markAllAsRead: async () => {
      return await this.makeRequest<void>('/notifications/mark-all-read', {
        method: 'POST',
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/notifications/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Admin notifications methods
  adminNotifications = {
    list: async (params: { user_id?: string; type?: string; limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.user_id) qs.set('user_id', params.user_id);
      if (params.type) qs.set('type', params.type);
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Notification[]>(`/admin/notifications${suffix}`);
    },
    create: async (data: NotificationCreate) => {
      return await this.makeRequest<Notification>('/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/admin/notifications/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // User methods
  users = {
    get: async (id: string) => {
      return await this.makeRequest<User>(`/users/${id}`);
    },

    getCurrent: async () => {
      return await this.makeRequest<User>('/user');
    },

    update: async (id: string, data: ProfileUpdate) => {
      return await this.makeRequest<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await this.makeRequest<void>(`/users/${id}`, {
        method: 'DELETE',
      });
    },

    list: async () => {
      return await this.makeRequest<User[]>('/users');
    }
  };

  // Appointment methods
  appointments = {
    get: async (id: string) => {
      return await this.makeRequest<Appointment>(`/appointments/${id}`);
    },

    list: async () => {
      return await this.makeRequest<Appointment[]>('/appointments');
    },

    create: async (data: AppointmentInsert) => {
      return await this.makeRequest<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: AppointmentUpdate) => {
      return await this.makeRequest<Appointment>(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await this.makeRequest<void>(`/appointments/${id}`, {
        method: 'DELETE',
      });
    },

    getUserAppointments: async (userId: string) => {
      return await this.makeRequest<Appointment[]>(`/users/${userId}/appointments`);
    },

    getTherapistAppointments: async (therapistId: string) => {
      return await this.makeRequest<Appointment[]>(`/therapists/${therapistId}/appointments`);
    }
  };

  // Forum methods
  forum = {
    listThreads: async () => {
      return await this.makeRequest<ForumThread[]>(`/public/forum/threads`);
    },
    getThread: async (id: string) => {
      return await this.makeRequest<ForumThread & { comments: ForumComment[] }>(`/public/forum/threads/${id}`);
    },
    createThread: async (data: { user_id: string; title: string; body: string }) => {
      return await this.makeRequest<ForumThread>(`/forum/threads`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    addComment: async (threadId: string, data: { user_id: string; body: string }) => {
      return await this.makeRequest<ForumComment>(`/forum/threads/${threadId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  };

  // Events methods
  events = {
    list: async (params: { limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Event[]>(`/events${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<Event>(`/events/${id}`);
    },
    create: async (data: EventCreate) => {
      return await this.makeRequest<Event>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    rsvp: async (id: string, status: RSVPStatus) => {
      return await this.makeRequest<EventParticipant>(`/events/${id}/rsvp`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
    }
  };

  // Admin events methods
  adminEvents = {
    list: async (params: { limit?: number; offset?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.limit) qs.set('limit', String(params.limit));
      if (params.offset) qs.set('offset', String(params.offset));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Event[]>(`/admin/events${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<Event>(`/admin/events/${id}`);
    },
    create: async (data: EventCreate) => {
      return await this.makeRequest<Event>('/admin/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: EventUpdate) => {
      return await this.makeRequest<Event>(`/admin/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await this.makeRequest<void>(`/admin/events/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Communities methods
  communities = {
    list: async (params: CommunityListParams = {}) => {
      const qs = new URLSearchParams();
      if (params.q) qs.set('q', params.q);
      if (params.page) qs.set('page', String(params.page));
      if (params.per_page) qs.set('per_page', String(params.per_page));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return await this.makeRequest<Community[]>(`/communities${suffix}`);
    },
    get: async (id: string) => {
      return await this.makeRequest<Community>(`/communities/${id}`);
    },
    create: async (data: CommunityCreate) => {
      return await this.makeRequest<Community>('/communities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  };

  // Shortcuts for backward compatibility
  get publicArticles() {
    return {
      list: this.public.articles.list,
      get: this.public.articles.get,
      categories: this.public.articles.getCategories
    };
  }

  get publicResources() {
    return {
      list: this.public.resources.list,
      get: this.public.resources.get,
      categories: this.public.resources.getCategories
    };
  }

  get publicTherapists() {
    return this.public.therapists;
  }

  get publicTherapyLocations() {
    return this.public.therapyLocations;
  }

  // Database-like methods (kept for backward compatibility)
  from = (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => this.makeRequest(`/${table}?${column}=${encodeURIComponent(value)}&select=${columns || '*'}`),
      execute: () => this.makeRequest(`/${table}?select=${columns || '*'}`)
    }),
    insert: (data: any) => this.makeRequest(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => this.makeRequest(`/${table}/${encodeURIComponent(value)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => this.makeRequest(`/${table}/${encodeURIComponent(value)}`, {
        method: 'DELETE',
      })
    })
  });

  private setAuthToken(token: string) {
    this.authToken = token;
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    localStorage.setItem(tokenKey, token);
  }

  private removeAuthToken() {
    this.authToken = null;
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    localStorage.removeItem(tokenKey);
  }

  private clearAllTokens() {
    this.authToken = null;
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';

    // Remove all possible auth-related keys
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('session');
  }
}

export const apiClient = new ApiClient();

// Export everything from types for convenience
export * from './types';
