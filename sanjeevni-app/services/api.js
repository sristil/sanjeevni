// IMPORTANT: Change this to your computer's IP if testing on physical device
// Find IP: Windows (ipconfig) | Mac (ifconfig)
// 
const API_BASE_URL = 'http://192.168.1.108:3000/api';
// For physical device: 'http://192.168.x.x:3000/api'

export const api = {
  // Doctors
  getDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return { success: false, error: error.message };
    }
  },

  // Appointments
  getAppointments: async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments?patientId=${patientId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  bookAppointment: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  cancelAppointment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Medical Records
  getRecords: async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records?patientId=${patientId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  addRecord: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reminders
  getReminders: async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders?patientId=${patientId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createReminder: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  toggleReminder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${id}/toggle`, {
        method: 'PATCH',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteReminder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Lab Tests
  getTestsCatalog: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/catalog`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  bookTest: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Chatbot
  sendMessage: async (message, patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, patientId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getHealthTip: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/tips`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};