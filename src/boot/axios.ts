// src/boot/axios.ts
/*
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
*/

// src/boot/axios.ts

import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios'; // Importa AxiosError desde 'axios'
import { useAuthStore } from '@/stores/login/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $sanctumApi: AxiosInstance;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const sanctumApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default boot(({ app, router }) => {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Solo manejamos 401 NO AUTHENTICATED aquí para el interceptor
      if (error.response?.status === 401) {
        try {
          const authStore = useAuthStore();
          // Asegúrate de que logout() no cause un bucle de redirección si ya estás en /login
          await authStore.logout();
          // Solo redirige si no estás ya en la página de login
          if (router.currentRoute.value.path !== '/login') {
            return router.push('/login');
          }
        } catch (e) {
          console.error('Error en redirección al login desde interceptor:', e);
        }
      }
      // Para otros errores (404, 500, etc.), simplemente rechazamos la promesa
      // para que el `catchAxiosError` del composable los maneje.
      return Promise.reject(error); // Rechaza el error original
    },
  );

  sanctumApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // El interceptor de Sanctum (para CSRF, login/logout iniciales) puede no necesitar
      // redirigir en 401s aquí si esos endpoints no retornan 401 en caso de fallo de sesión
      // o si ya se maneja directamente en el composable para esas peticiones específicas.
      // Si estas rutas también pueden devolver un 401 por sesión, puedes añadir la misma lógica
      // que en el interceptor de 'api' si lo deseas, pero ten cuidado con duplicidad de redirecciones.
      // Por ahora, solo rechazamos la promesa.
      return Promise.reject(error);
    },
  );

  app.config.globalProperties.$axios = axios; // La instancia global de Axios
  app.config.globalProperties.$api = api; // Tu instancia con /api/v1
  app.config.globalProperties.$sanctumApi = sanctumApi; // Tu instancia sin /api/v1
});

export { api, sanctumApi };
