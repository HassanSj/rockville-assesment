import axios from 'axios';

const api = axios.create({
  baseURL: process.env.APP_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

const microserviceApi = axios.create({
  baseURL: process.env.MICROSERVICES_PUBLIC_API_URL || 'http://localhost:5001',
  withCredentials: true,
});
export  {api, microserviceApi};
