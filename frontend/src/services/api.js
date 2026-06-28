import axios from 'axios';

// Access the API base URL from the environment or default to local server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  // Get all employees with search, sort, and pagination parameters
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get a single employee details by ID
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create a new employee record
  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update employee details by ID
  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee record by ID
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get HR dashboard statistics
  getStats: async () => {
    const response = await api.get('/employees/dashboard/stats');
    return response.data;
  },
};

export default api;
