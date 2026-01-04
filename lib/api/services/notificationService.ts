import { apiClient } from '@/lib/api/client';
import type { Notification, NotificationStats, NotificationListParams, NotificationCreate } from '../types';

export const notificationService = {
  // User notification methods
  listNotifications: async (params?: NotificationListParams) => {
    return apiClient.notifications.list(params);
  },

  getNotification: async (id: string) => {
    return apiClient.notifications.get(id);
  },

  getStats: async () => {
    return apiClient.notifications.getStats();
  },

  getUnreadCount: async () => {
    return apiClient.notifications.getUnreadCount();
  },

  markAsRead: async (id: string) => {
    return apiClient.notifications.markAsRead(id);
  },

  markAllAsRead: async () => {
    return apiClient.notifications.markAllAsRead();
  },

  deleteNotification: async (id: string) => {
    return apiClient.notifications.delete(id);
  },

  // Admin methods
  adminListNotifications: async (params?: { user_id?: string; type?: string; limit?: number; offset?: number }) => {
    return apiClient.adminNotifications.list(params);
  },

  adminCreateNotification: async (data: NotificationCreate) => {
    return apiClient.adminNotifications.create(data);
  },

  adminDeleteNotification: async (id: string) => {
    return apiClient.adminNotifications.delete(id);
  },
};
