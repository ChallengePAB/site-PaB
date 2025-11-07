import axios from 'axios';

const NODE_URL = import.meta.env.VITE_API_NODE_URL || 'http://localhost:3001';
const PYTHON_URL = import.meta.env.VITE_API_PYTHON_URL || 'http://localhost:8000';


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


const apiPythonClient = axios.create({
  baseURL: PYTHON_URL, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export { apiNodeClient, apiPythonClient };