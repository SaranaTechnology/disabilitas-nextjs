import { useState } from 'react';
import { useAppointment } from '../hooks/useAppointment';

export const AppointmentForm = () => {
  const { createAppointment, isLoading, error } = useAppointment();
  const [formData, setFormData] = useState({
    user_id: '',
    therapist_id: '',
    appointment_date: '',
    method: 'zoom' as 'zoom' | 'meet' | 'call',
    notes: '',
    status: 'scheduled'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="therapist_id">Therapist ID:</label>
          <input
            type="text"
            id="therapist_id"
            name="therapist_id"
            value={formData.therapist_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="appointment_date">Appointment Date:</label>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Appointment'}
        </button>
      </form>
    </div>
  );
};