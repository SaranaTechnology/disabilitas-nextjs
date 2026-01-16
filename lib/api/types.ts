// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  message?: string;
  status?: number;
  meta?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  date_of_birth?: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  expires_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = 'user_disabilitas' | 'orang_tua' | 'therapy' | 'therapist_independent' | 'admin';

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  parent_name?: string;
  phone?: string;
  role?: UserRole;
}

// Profile Types
export interface Profile {
  id: string;
  address?: string;
  city?: string;
  created_at: string;
  date_of_birth?: string;
  email?: string;
  full_name?: string;
  gender?: string;
  phone?: string;
  updated_at: string;
}

export interface ProfileInsert {
  address?: string;
  city?: string;
  date_of_birth?: string;
  email?: string;
  full_name?: string;
  gender?: string;
  phone?: string;
}

export interface ProfileUpdate extends Partial<ProfileInsert> {}

// Therapist Types
export interface Therapist {
  id: string;
  available?: boolean;
  bio?: string;
  created_at: string;
  experience_years?: number;
  expertise?: string[];
  image_url?: string;
  languages?: string[];
  location: string;
  name: string;
  price_per_session?: number;
  rating?: number;
  specialization: string;
  updated_at: string;
  user_id?: string;
}

export interface TherapistInsert {
  available?: boolean;
  bio?: string;
  experience_years?: number;
  expertise?: string[];
  image_url?: string;
  languages?: string[];
  location: string;
  name: string;
  price_per_session?: number;
  rating?: number;
  specialization: string;
  user_id?: string;
}

export interface TherapistUpdate extends Partial<TherapistInsert> {}

// Appointment Types
export interface Appointment {
  id: string;
  user_id: string;
  therapist_id: string;
  appointment_date: string;
  method: 'zoom' | 'meet' | 'call';
  meeting_link?: string | null;
  phone_number?: string | null;
  notes?: string;
  status?: string;
  is_free?: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  therapist?: Therapist;
}

export interface AppointmentInsert {
  user_id: string;
  therapist_id: string;
  appointment_date: string;
  method: 'zoom' | 'meet' | 'call';
  meeting_link?: string | null;
  phone_number?: string | null;
  notes?: string;
  status?: string;
  is_free?: boolean;
}

export interface AppointmentUpdate extends Partial<AppointmentInsert> {}

// Forum Types
export interface ForumThread {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ForumComment {
  id: string;
  thread_id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Location Types
export interface Country {
  code: string;
  name: string;
}

export interface State {
  code: string;
  country_code: string;
  name: string;
}

export interface City {
  code: string;
  state_code: string;
  name: string;
  type: string;
}

// Location Type constants
export const LOCATION_TYPES = [
  { value: 'yayasan', label: 'Yayasan' },
  { value: 'klinik', label: 'Klinik' },
  { value: 'rumah_sakit', label: 'Rumah Sakit' },
  { value: 'praktek_mandiri', label: 'Praktek Mandiri' },
  { value: 'puskesmas', label: 'Puskesmas' },
  { value: 'lainnya', label: 'Lainnya' },
] as const;

export type LocationType = typeof LOCATION_TYPES[number]['value'];

// Therapy Location Types
export interface TherapyLocation {
  id: string;
  provider_user_id: string;
  name: string;
  type?: string;
  address: string;
  city_code?: string;
  city_name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  is_verified: boolean;
  verified_at?: string;
  registrant_name?: string;
  registrant_email?: string;
  registrant_phone?: string;
  services?: string[];
  open_hours?: LocationHour[];
  created_at: string;
  updated_at: string;
}

export interface LocationHour {
  id?: string;
  location_id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
}

export interface LocationService {
  id?: string;
  location_id?: string;
  name: string;
}

export interface TherapyLocationInsert {
  name: string;
  type?: string;
  address: string;
  city_code?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  services?: string[];
  open_hours?: LocationHour[];
}

export interface TherapyLocationUpdate extends Partial<TherapyLocationInsert> {
  is_verified?: boolean;
}

export interface TherapyLocationRegister {
  name: string;
  type?: string; // yayasan, klinik, rumah_sakit, praktek_mandiri, puskesmas, lainnya
  address: string;
  city_code?: string;
  description?: string;
  phone: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  contact_person?: string;
  provider_name: string;
  provider_email: string;
  provider_phone: string;
}

// Contact Message Types
export type ContactType = 'contact' | 'feedback' | 'bug' | 'aduan';
export type ContactCategory = 'general' | 'feature' | 'complaint' | 'praise';

export interface ContactMessage {
  id: string;
  type: ContactType;
  category: ContactCategory;
  rating?: number; // 1-5, optional for feedback
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  read_at?: string;
  replied_at?: string;
  reply_note?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageInsert {
  type?: ContactType;
  category?: ContactCategory;
  rating?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageUpdate {
  status?: string;
  reply_note?: string;
}

// Article Types (CMS)
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  author_id: string;
  author_name?: string;
  category: string;
  tags?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  view_count: number;
  created_at: string;
}

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  author_id: string;
  author_name?: string;
  category: string;
  tags?: string;
  status: string;
  published_at?: string;
  view_count: number;
  created_at: string;
}

export interface ArticleInsert {
  title: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  category?: string;
  tags?: string;
  status?: string;
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  category?: string;
  tags?: string;
  status?: string;
}

// Learning Resource Types
export type ResourceType = 'article' | 'video' | 'pdf' | 'ebook' | 'infographic' | 'guide' | 'template';
export type ResourceCategory = 'panduan' | 'tutorial' | 'aksesibilitas' | 'komunitas' | 'hukum' | 'kesehatan' | 'pendidikan' | 'pekerjaan';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  content_url?: string;
  file_url?: string;
  file_size?: number; // in bytes
  file_type?: string; // pdf, docx, etc
  read_time: string;
  image_url?: string;
  is_published: boolean;
  is_downloadable: boolean;
  download_count?: number;
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceInsert {
  title: string;
  description?: string;
  category: string;
  type?: string;
  content_url?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  read_time?: string;
  image_url?: string;
  is_published?: boolean;
  is_downloadable?: boolean;
}

export interface ResourceUpdate extends Partial<ResourceInsert> {}

// Notification Types
export type NotificationType =
  | 'appointment'
  | 'community'
  | 'event'
  | 'therapy'
  | 'system'
  | 'chat';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: string;
  priority: NotificationPriority;
  read: boolean;
  read_at?: string;
  community_id?: string;
  event_id?: string;
  appointment_id?: string;
  created_at: string;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
}

export interface NotificationListParams {
  limit?: number;
  offset?: number;
  type?: NotificationType;
  read?: boolean;
}

export interface NotificationCreate {
  user_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  data?: string;
}

// Event Types
export type EventMode = 'online' | 'offline' | 'hybrid' | 'zoom' | 'gmeet';
export type EventStatus = 'draft' | 'published';
export type RSVPStatus = 'going' | 'maybe' | 'not_going';

export interface Event {
  id: string;
  title: string;
  mode: EventMode;
  start_at: string;
  end_at: string;
  host_user_id?: string;
  community_id?: string;
  capacity?: number;
  location?: string;
  join_url?: string;
  host_url?: string;
  status: EventStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: RSVPStatus;
  created_at: string;
}

export interface EventCreate {
  title: string;
  mode: EventMode;
  start_at: string;
  end_at: string;
  community_id?: string;
  capacity?: number;
  location?: string;
}

export interface EventUpdate {
  title?: string;
  mode?: EventMode;
  start_at?: string;
  end_at?: string;
  capacity?: number;
  location?: string;
  status?: EventStatus;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  is_private: boolean;
  created_by?: string;
  created_at: string;
}

export interface CommunityCreate {
  name: string;
  description?: string;
  tags?: string[];
}

export interface CommunityListParams {
  q?: string;
  page?: number;
  per_page?: number;
}

// Password Reset Types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetValidate {
  token: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
}

// Database-like Types for compatibility
export type Tables<T> = T extends 'profiles' 
  ? Profile
  : T extends 'therapists'
  ? Therapist
  : T extends 'appointments'
  ? Appointment
  : never;

export type TablesInsert<T> = T extends 'profiles'
  ? ProfileInsert
  : T extends 'therapists'
  ? TherapistInsert
  : T extends 'appointments'
  ? AppointmentInsert
  : never;

export type TablesUpdate<T> = T extends 'profiles'
  ? ProfileUpdate
  : T extends 'therapists'
  ? TherapistUpdate
  : T extends 'appointments'
  ? AppointmentUpdate
  : never;

// Legacy Database type for compatibility
export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: Appointment;
        Insert: AppointmentInsert;
        Update: AppointmentUpdate;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      therapists: {
        Row: Therapist;
        Insert: TherapistInsert;
        Update: TherapistUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
