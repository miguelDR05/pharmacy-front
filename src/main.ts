// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify, Loading, Dialog } from 'quasar';
import { createRouter, createWebHistory } from 'vue-router';
import HighchartsVue from 'highcharts-vue';

// Importar Quasar CSS
import 'quasar/src/css/index.sass';

// Importar iconos de Material Design
import '@quasar/extras/material-icons/material-icons.css';

// Importar fuentes Roboto
import '@quasar/extras/roboto-font/roboto-font.css';

// Importar la app principal
import App from './App.vue';

// Importar stores
import { useAuthStore } from '@stores/login/auth';
import { usePermissionsStore } from '@stores/login/permissions';
import { useMenuStore } from '@stores/login/menu';

// Importar directiva de permisos
import permissionDirective from './directives/permission';

// Importar rutas
import { routes } from './router/routes';

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para verificar permisos
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const permissionsStore = usePermissionsStore();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/forgot-password', '/register'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // Si no está autenticado y trata de acceder a una ruta protegida
  if (!authStore.user && !isPublicRoute) {
    return next('/login');
  }

  // Si está autenticado y trata de acceder al login, redirigir al dashboard
  if (authStore.user && to.path === '/login') {
    return next('/');
  }

  // Verificar permisos de ruta
  if (to.meta?.permission && authStore.user) {
    const hasPermission = permissionsStore.canAccessRoute(to.meta.permission as string);

    if (!hasPermission) {
      Notify.create({
        type: 'negative',
        message: 'No tienes permisos para acceder a esta página',
        position: 'top-right',
        timeout: 3000,
      });
      return next('/');
    }
  }

  next();
});

// Crear la aplicación
const app = createApp(App);

// Configurar Pinia
const pinia = createPinia();
app.use(pinia);

// Configurar Quasar
app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    Dialog,
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
    },
    loading: {
      delay: 200,
      message: 'Cargando...',
      spinnerColor: 'primary',
      messageColor: 'primary',
    },
  },
});

// Configurar Highcharts
app.use(HighchartsVue);

// Configurar router
app.use(router);

// Registrar directiva de permisos
app.directive('permission', permissionDirective);

// Inicializar la aplicación
const initApp = async () => {
  try {
    Loading.show();

    const authStore = useAuthStore();
    const permissionsStore = usePermissionsStore();
    const menuStore = useMenuStore();

    // Verificar estado de autenticación
    await authStore.fetchUser();

    // Si está autenticado, cargar permisos y menús
    if (authStore.user) {
      await Promise.all([
        permissionsStore.loadPermissions(),
        permissionsStore.initializeUserPermissions(),
        menuStore.loadMenus(),
      ]);
    }
  } catch (error) {
    console.error('Error inicializando la aplicación:', error);

    Notify.create({
      type: 'negative',
      message: 'Error al inicializar la aplicación',
      position: 'top-right',
    });
  } finally {
    Loading.hide();

    // Montar la aplicación
    app.mount('#app');
  }
};

// Inicializar
void initApp();
