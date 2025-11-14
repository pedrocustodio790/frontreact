import axios from 'axios';

// 1. Lê a URL da variável de ambiente (definida no Render)
//    Se não achar (quando você rodar local), usa o localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL, // 2. Usa a variável
});

// Seu interceptor de requisição (perfeito, sem alterações)
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

// Seu interceptor de resposta (perfeito, sem alterações)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o token expirar ou for inválido (Erro 401 ou 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user-data'); // Limpa tudo!
      
      // Redireciona para o login
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;