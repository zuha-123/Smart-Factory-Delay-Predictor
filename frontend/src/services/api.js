import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-factory-delay-predictor-api.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const orderService = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export const machineService = {
  getMachines: () => api.get('/machines'),
  createMachine: (data) => api.post('/machines', data),
  updateMachine: (id, data) => api.put(`/machines/${id}`, data),
  deleteMachine: (id) => api.delete(`/machines/${id}`),
};

export const materialService = {
  getMaterials: () => api.get('/materials'),
  createMaterial: (data) => api.post('/materials', data),
};

export const workforceService = {
  getWorkforce: () => api.get('/workforce'),
  createWorkforce: (data) => api.post('/workforce', data),
};

export const predictionService = {
  predictOrder: (orderId) => api.post(`/prediction/${orderId}`),
  getPrediction: (orderId) => api.get(`/prediction/${orderId}`),
  simulatePrediction: (data) => api.post('/prediction/simulate', data),
  getRisk: (orderId) => api.get(`/risk/${orderId}`),
  getRootCause: (orderId) => api.get(`/root-cause/${orderId}`),
  getRecommendations: (orderId) => api.get(`/recommendations/${orderId}`),
};

export const modelService = {
  getModelPerformance: () => api.get('/model-performance'),
  retrainModels: () => api.post('/model-performance/retrain'),
};

export const datasetService = {
  uploadDataset: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/dataset/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
