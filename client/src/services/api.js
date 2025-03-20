import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (userData) => api.post('/users', userData),
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
};

// Organization services
export const organizationService = {
  getOrganization: (id) => api.get(`/organizations/${id}`),
  updateOrganization: (id, data) => api.put(`/organizations/${id}`, data),
  getAllOrganizations: () => api.get('/organizations'),
  createOrganization: (data) => api.post('/organizations', data),
};

// Metrics services
export const metricService = {
  getAllMetrics: (filters = {}) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }
    return api.get(`/metrics?${params}`);
  },
  getMetricById: (id) => api.get(`/metrics/${id}`),
  createMetric: (data) => api.post('/metrics', data),
  updateMetric: (id, data) => api.put(`/metrics/${id}`, data),
  deleteMetric: (id) => api.delete(`/metrics/${id}`),
  getMetricsByFramework: (framework) => api.get(`/metrics/framework/${framework}`),
};

// Metric data services
export const metricDataService = {
  getAllMetricData: (filters = {}) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }
    return api.get(`/metric-data?${params}`);
  },
  getMetricDataById: (id) => api.get(`/metric-data/${id}`),
  createMetricData: (data) => api.post('/metric-data', data),
  updateMetricData: (id, data) => api.put(`/metric-data/${id}`, data),
  deleteMetricData: (id) => api.delete(`/metric-data/${id}`),
  verifyMetricData: (id, data) => api.put(`/metric-data/${id}/verify`, data),
};

// Report services
export const reportService = {
  getAllReports: (filters = {}) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }
    return api.get(`/reports?${params}`);
  },
  getReportById: (id) => api.get(`/reports/${id}`),
  createReport: (data) => api.post('/reports', data),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  addReportExport: (id, data) => api.post(`/reports/${id}/export`, data),
  getReportData: (id) => api.get(`/reports/${id}/data`),
};

// User management services (admin)
export const userService = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;