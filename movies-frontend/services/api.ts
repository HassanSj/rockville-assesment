import axios from 'axios';

const api = axios.create({
  baseURL: process.env.APP_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

const microserviceApi = axios.create({
  baseURL: process.env.MICROSERVICES_PUBLIC_API_URL || 'http://localhost:5001',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'token=; path=/dashboard; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.replace('/login');
        }, 0);
      }
    }

    return Promise.reject(error);
  }
);

export { api, microserviceApi };
