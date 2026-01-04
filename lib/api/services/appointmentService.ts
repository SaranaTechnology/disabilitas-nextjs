import { apiClient, type Appointment, type AppointmentInsert, type AppointmentUpdate } from '@/lib/api/client';

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
