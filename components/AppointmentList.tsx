import { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';

export const AppointmentList = () => {
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAppointments 
  } = useAppointments();

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appointment: any) => (
            <li key={appointment.id}>
              <strong>{appointment.appointment_date}</strong> - 
              User: {appointment.user?.name || 'Unknown'} - 
              Therapist: {appointment.therapist?.name || 'Unknown'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};