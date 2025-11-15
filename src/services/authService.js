import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Requisição (Está 100% correto)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (A CORREÇÃO ESTÁ AQUI)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o token expirar ou for inválido (Erro 401 ou 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-data');
        
        // Redireciona para o login
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;