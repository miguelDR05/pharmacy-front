// src/boot/axios.ts

import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/login/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $sanctumApi: AxiosInstance;
  }
}

// Obtener la URL base desde las variables de entorno del frontend
// Quasar/Vite las hace accesibles a través de import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Instancia para tus rutas API con prefijo /api/v1
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // Construye la URL base con el prefijo
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json', // Laravel a menudo responde con JSON
    'Content-Type': 'application/json',
  },
});

// Instancia específica para las rutas de Sanctum que van a la raíz
const sanctumApi = axios.create({
  baseURL: API_BASE_URL, // Sin /api/v1 aquí
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json', // Laravel a menudo responde con JSON
    'Content-Type': 'application/json',
  },
});

export default boot(({ app, router }) => {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        try {
          const authStore = useAuthStore();
          await authStore.logout();
          return router.push('/login');
        } catch (e) {
          console.error('Error en redirección al login:', e);
        }
      }
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error('Error desconocido en la respuesta del servidor (API)'),
      );
    },
  );

  sanctumApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error('Error desconocido en la respuesta del servidor (Sanctum)'),
      );
    },
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$sanctumApi = sanctumApi;
});

export { api, sanctumApi };
