import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Params:', config.params);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, 'Data type:', Array.isArray(response.data) ? 'Array' : 'Object', 'Length/Keys:', Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length);
    console.log('Full Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const jobsAPI = {
  // Get all active jobs with optional filters
  getJobs: (params = {}) => {
    return api.get('/jobs/', { params });
  },

  // Get single job by ID
  getJob: (id) => {
    return api.get(`/jobs/${id}/`);
  },

  // Create new job
  createJob: (jobData) => {
    return api.post('/jobs/', jobData);
  },

  // Update job
  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}/update/`, jobData);
  },

  // Soft delete job (deactivate)
  deactivateJob: (id) => {
    return api.patch(`/jobs/${id}/deactivate/`);
  },

  // Activate job
  activateJob: (id) => {
    return api.patch(`/jobs/${id}/activate/`);
  },

  // Get job statistics
  getStats: () => {
    return api.get('/jobs/stats/');
  }
};

export default api;