import axios from 'axios';

// rota para pegar a chave do backend e || para rodar no ambiente de desenvolvimento também 
const NODE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiNodeClient = axios.create({
  baseURL: NODE_URL, 
  headers: {
    'Content-Type': 'application/json',
  }
});


apiNodeClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export { apiNodeClient };