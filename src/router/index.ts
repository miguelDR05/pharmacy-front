import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router/routes';
import { useAuthStore } from '@stores/login/auth';

const Router = route(() => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    try {
      if (!auth.user && to.meta.requiresAuth) {
        await auth.fetchUser();
      }

      if (to.meta.requiresAuth && !auth.user) {
        next('/login');
      } else if (to.path === '/login' && auth.user) {
        next('/');
      } else {
        next();
      }
    } catch (error) {
      console.error('Error en router guard:', error);
      next('/login');
    }
  });

  return router;
});

export default Router;

/*
import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router/routes';
import { useAuthStore } from '@stores/login/auth';

const Router = route(() => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // Flag para asegurar que la verificación inicial de autenticación se haga una sola vez
  let initialAuthCheckDone = false;

  router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    // 1. Realizar la verificación inicial de autenticación desde el backend.
    // Esto se hace solo una vez al cargar la aplicación o al refrescar la página.
    // También, evita intentar fetchUser si ya estamos yendo a la página de login
    // ya que el interceptor de axios ya estará manejando esa redirección.
    if (!initialAuthCheckDone && to.path !== '/login') {
      initialAuthCheckDone = true; // Marca que la verificación inicial ha comenzado
      try {
        await auth.fetchUser(); // Esto intentará obtener el usuario y actualizará `auth.user`
        // Si hay un 401, el interceptor de axios lo capturará.
      } catch (error) {
        // Si fetchUser falla por alguna razón (ej. error de red, no 401),
        // asegúrate de que el usuario se establezca como null localmente.
        // El interceptor de axios se encarga de la redirección a /login para 401.
        auth.user = null;
        console.error('Error en la verificación inicial del usuario:', error);
      }
    }

    // 2. Evaluar la navegación basándose en el estado de autenticación.

    // Si la ruta requiere autenticación Y el usuario NO está autenticado
    if (to.meta.requiresAuth && !auth.user) {
      // Redirige a /login, pero solo si no estamos ya en /login para evitar bucles.
      if (to.path !== '/login') {
        next('/login');
      } else {
        // Si ya estamos en /login y no autenticados, simplemente permite el acceso.
        next();
      }
    }
    // Si el usuario SÍ está autenticado Y está intentando acceder a la página de login
    else if (to.path === '/login' && auth.user) {
      // Redirige a la página principal si ya está logueado.
      next('/');
    }
    // En cualquier otro caso, permite la navegación.
    else {
      next();
    }
  });

  return router;
});

export default Router;
*/
