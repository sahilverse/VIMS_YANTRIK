import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7045/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
