// src/stores/Auth/auth.ts

// import { defineStore } from 'pinia';
// import { api, sanctumApi } from '@/boot/axios'; // Importa ambas instancias
// import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // useRouter solo es válido dentro de setup() o setup de un componente/composable.
// // Para Pinia stores, se inyecta desde el bootfile o se importa globalmente.
// // Si estás en Quasar, 'useRouter' suele funcionar bien aquí.

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref(null);
//   const router = useRouter(); // Asegúrate de que esto funciona en tu setup de Pinia.
//   // Si no, puedes pasarlo como argumento al store desde el bootfile.

//   async function login(email: string, password: string) {
//     // 1. Obtener CSRF cookie usando la instancia 'sanctumApi' (sin /api/v1)
//     await sanctumApi.get('/sanctum/csrf-cookie');

//     // 2. Realizar el login usando la instancia 'api' (con /api/v1)
//     const { data } = await api.post('/login', { email, password });
//     user.value = data.user;
//   }

//   async function fetchUser() {
//     // Para obtener la información del usuario logueado, usar 'api' (con /api/v1)
//     try {
//       const { data } = await api.get('/user');
//       user.value = data;
//     } catch {
//       user.value = null;
//     }
//   }

//   async function logout() {
//     user.value = null;
//     try {
//       // Para cerrar sesión, usar la instancia 'sanctumApi' (sin /api/v1)
//       await sanctumApi.post('/logout');
//     } catch (error) {
//       console.error('Error al cerrar sesión:', error);
//     }
//   }

//   return {
//     user,
//     login,
//     logout,
//     fetchUser,
//   };
// });

// src/stores/menu.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { api, sanctumApi } from '@/boot/axios'; // Importa ambas instancias
// import { useRouter } from 'vue-router'; // useRouter solo es válido dentro de setup() o setup de un componente/composable.

import { usePermissionsStore } from './permissions';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  permission: string;
  description?: string;
  badge?: string | number | undefined;
  badgeColor?: string;
  defaultOpen?: boolean;
  children?: MenuItem[] | undefined;
  order?: number;
  module?: string;
}
// /*
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  // const router = useRouter(); // Asegúrate de que esto funciona en tu setup de Pinia.
  // Si no, puedes pasarlo como argumento al store desde el bootfile.

  async function login(email: string, password: string) {
    // 1. Obtener CSRF cookie usando la instancia 'sanctumApi' (sin /api/v1)
    await sanctumApi.get('/sanctum/csrf-cookie');

    // 2. Realizar el login usando la instancia 'api' (con /api/v1)
    const { data } = await api.post('/login', { email, password });
    user.value = data.user;
  }

  async function fetchUser() {
    // Para obtener la información del usuario logueado, usar 'api' (con /api/v1)
    try {
      const { data } = await api.get('/user');
      user.value = data;
    } catch {
      user.value = null;
    }
  }

  async function logout() {
    user.value = null;
    try {
      // Para cerrar sesión, usar la instancia 'sanctumApi' (sin /api/v1)
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  return {
    user,
    login,
    logout,
    fetchUser,
  };
});
// */
/*
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const router = useRouter(); // Obtiene la instancia del router aquí

  async function login(email: string, password: string) {
    try {
      // 1. Obtener CSRF cookie usando la instancia 'sanctumApi' (sin /api/v1)
      // Esta petición es crucial para que Laravel establezca la cookie XSRF-TOKEN
      await sanctumApi.get('/sanctum/csrf-cookie');

      // 2. Realizar el login usando la instancia 'api' (con /api/v1 para tu ruta /api/v1/login)
      // Laravel, al usar Auth::attempt(), establecerá la cookie de sesión.
      const { data } = await api.post('/login', { email, password });

      // 3. Después de un login exitoso, obtener los datos del usuario
      // Esto actualizará el estado 'user.value' en tu store.
      // Es importante llamar a fetchUser() para que el store tenga la información completa del usuario.
      await fetchUser(); // Llama a fetchUser para poblar user.value

      // 4. Redirigir al usuario a la página principal o al dashboard
      // Solo redirige si el usuario existe (lo que indica un login exitoso).
      if (user.value) {
        return router.push('/'); // O '/dashboard' si esa es tu ruta principal protegida
      }

      return data; // Puedes retornar los datos si tu componente de login los necesita
    } catch (error) {
      // Si hay un error en el login (ej. credenciales incorrectas),
      // asegúrate de que el usuario no esté establecido.
      user.value = null;
      // El interceptor de Axios ya manejará los 401s y las redirecciones
      // para otras rutas. Para el login, puedes lanzar el error para que
      // el componente de login lo maneje (ej. mostrar un mensaje de error).
      throw error;
    }
  }

  async function fetchUser() {
    try {
      // Para obtener la información del usuario logueado, usar 'api' (con /api/v1/user)
      const { data } = await api.get('/user');
      user.value = data.user; // Asumiendo que tu API devuelve { user: {...} }
    } catch (error) {
      // Si fetchUser falla (ej. 401 Unauthorized), significa que no hay sesión válida.
      // El interceptor de Axios ya redirigirá a /login.
      user.value = null;
      // No lances el error aquí para evitar que el router guard intente otra redirección
      // si el interceptor ya está actuando.
    }
  }

  async function logout() {
    // Limpia el estado local del usuario inmediatamente
    user.value = null;
    try {
      // Para cerrar sesión en el backend, usar la instancia 'api' (con /api/v1/logout)
      // O 'sanctumApi' si tu ruta de logout no está bajo /api/v1
      await api.post('/logout');
      // Después de un logout exitoso en el backend, redirige al login.
      // Asegúrate de que esta redirección no entre en conflicto con el interceptor de Axios
      // si este ya está redirigiendo por un 401.
      if (router.currentRoute.value.path !== '/login') {
        return router.push('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
      // Si el logout falla en el backend, aún así redirige al login para asegurar el estado del frontend.
      if (router.currentRoute.value.path !== '/login') {
        return router.push('/login');
      }
    }
  }

  return {
    user,
    login,
    logout,
    fetchUser,
  };
});
*/
export const useMenuStore = defineStore('menu', () => {
  const permissionsStore = usePermissionsStore();

  // State
  const menuItems = ref<MenuItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const filteredMenuItems = computed(() => {
    return filterMenuByPermissions(menuItems.value);
  });

  const getMenuByModule = computed(() => (module: string) => {
    return menuItems.value.filter((item) => item.module === module);
  });

  // Actions
  const loadMenus = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 800));

      menuItems.value = [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/',
          permission: 'dashboard.view',
          description: 'Panel principal con métricas',
          order: 1,
          module: 'dashboard',
        },
        {
          id: 'sales',
          label: 'Ventas',
          icon: 'point_of_sale',
          permission: 'sales.view',
          defaultOpen: false,
          order: 2,
          module: 'sales',
          children: [
            {
              id: 'new-sale',
              label: 'Nueva Venta',
              icon: 'add_shopping_cart',
              route: '/sales/new',
              permission: 'sales.create',
              description: 'Crear una nueva venta',
              order: 1,
              module: 'sales',
            },
            {
              id: 'sales-list',
              label: 'Lista de Ventas',
              icon: 'receipt_long',
              route: '/sales',
              permission: 'sales.list',
              description: 'Ver todas las ventas',
              order: 2,
              module: 'sales',
            },
            {
              id: 'sales-reports',
              label: 'Reportes de Ventas',
              icon: 'analytics',
              route: '/sales/reports',
              permission: 'sales.reports',
              description: 'Análisis y reportes',
              order: 3,
              module: 'sales',
            },
          ],
        },
        {
          id: 'inventory',
          label: 'Inventario',
          icon: 'inventory',
          permission: 'inventory.view',
          defaultOpen: false,
          order: 3,
          module: 'inventory',
          children: [
            {
              id: 'products',
              label: 'Productos',
              icon: 'medication',
              route: '/inventory/products',
              permission: 'products.view',
              description: 'Gestión de productos',
              badge: 1234,
              badgeColor: 'primary',
              order: 1,
              module: 'inventory',
            },
            {
              id: 'categories',
              label: 'Categorías',
              icon: 'category',
              route: '/inventory/categories',
              permission: 'categories.view',
              description: 'Categorías de productos',
              order: 2,
              module: 'inventory',
            },
            {
              id: 'stock-alerts',
              label: 'Alertas de Stock',
              icon: 'warning',
              route: '/inventory/alerts',
              permission: 'inventory.alerts',
              description: 'Productos con stock bajo',
              badge: 23,
              badgeColor: 'warning',
              order: 3,
              module: 'inventory',
            },
            {
              id: 'expiry-alerts',
              label: 'Productos por Vencer',
              icon: 'event_busy',
              route: '/inventory/expiry',
              permission: 'inventory.expiry',
              description: 'Próximos a vencer',
              badge: 8,
              badgeColor: 'negative',
              order: 4,
              module: 'inventory',
            },
          ],
        },
        {
          id: 'purchases',
          label: 'Compras',
          icon: 'shopping_cart',
          permission: 'purchases.view',
          defaultOpen: false,
          order: 4,
          module: 'purchases',
          children: [
            {
              id: 'new-purchase',
              label: 'Nueva Compra',
              icon: 'add_circle',
              route: '/purchases/new',
              permission: 'purchases.create',
              description: 'Registrar nueva compra',
              order: 1,
              module: 'purchases',
            },
            {
              id: 'purchases-list',
              label: 'Lista de Compras',
              icon: 'list_alt',
              route: '/purchases',
              permission: 'purchases.list',
              description: 'Historial de compras',
              order: 2,
              module: 'purchases',
            },
            {
              id: 'suppliers',
              label: 'Proveedores',
              icon: 'business',
              route: '/purchases/suppliers',
              permission: 'suppliers.view',
              description: 'Gestión de proveedores',
              order: 3,
              module: 'purchases',
            },
          ],
        },
        {
          id: 'customers',
          label: 'Clientes',
          icon: 'people',
          route: '/customers',
          permission: 'customers.view',
          description: 'Gestión de clientes',
          order: 5,
          module: 'customers',
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: 'assessment',
          permission: 'reports.view',
          defaultOpen: false,
          order: 6,
          module: 'reports',
          children: [
            {
              id: 'sales-report',
              label: 'Reporte de Ventas',
              icon: 'trending_up',
              route: '/reports/sales',
              permission: 'reports.sales',
              description: 'Análisis de ventas',
              order: 1,
              module: 'reports',
            },
            {
              id: 'inventory-report',
              label: 'Reporte de Inventario',
              icon: 'inventory_2',
              route: '/reports/inventory',
              permission: 'reports.inventory',
              description: 'Estado del inventario',
              order: 2,
              module: 'reports',
            },
            {
              id: 'financial-report',
              label: 'Reporte Financiero',
              icon: 'account_balance',
              route: '/reports/financial',
              permission: 'reports.financial',
              description: 'Análisis financiero',
              order: 3,
              module: 'reports',
            },
          ],
        },
        {
          id: 'settings',
          label: 'Configuración',
          icon: 'settings',
          permission: 'settings.view',
          defaultOpen: false,
          order: 7,
          module: 'settings',
          children: [
            {
              id: 'general-settings',
              label: 'General',
              icon: 'tune',
              route: '/settings/general',
              permission: 'settings.general',
              description: 'Configuración general',
              order: 1,
              module: 'settings',
            },
            {
              id: 'users',
              label: 'Usuarios',
              icon: 'manage_accounts',
              route: '/settings/users',
              permission: 'users.view',
              description: 'Gestión de usuarios',
              order: 2,
              module: 'settings',
            },
            {
              id: 'permissions',
              label: 'Permisos',
              icon: 'security',
              route: '/settings/permissions',
              permission: 'permissions.view',
              description: 'Sistema de permisos',
              order: 3,
              module: 'settings',
            },
            {
              id: 'backup',
              label: 'Respaldo',
              icon: 'backup',
              route: '/settings/backup',
              permission: 'backup.view',
              description: 'Copias de seguridad',
              order: 4,
              module: 'settings',
            },
          ],
        },
      ].sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      error.value = 'Error al cargar los menús';
      console.error('Error loading menus:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const filterMenuByPermissions = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => permissionsStore.hasPermission(item.permission))
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterMenuByPermissions(item.children);
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return item;
      })
      .filter((item) => {
        // Remover items que no tienen children después del filtrado
        if (
          item.children !== undefined &&
          (!item.children || item.children.length === 0) &&
          !item.route
        ) {
          return false;
        }
        return true;
      });
  };

  const getMenuItemById = (id: string): MenuItem | undefined => {
    const findInItems = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findInItems(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInItems(menuItems.value);
  };

  const getMenuItemByRoute = (route: string): MenuItem | undefined => {
    const findInItems = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.route === route) return item;
        if (item.children) {
          const found = findInItems(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInItems(menuItems.value);
  };

  const updateMenuBadge = (
    itemId: string,
    badge: string | number | undefined,
    badgeColor?: string,
  ) => {
    const updateInItems = (items: MenuItem[]): boolean => {
      for (const item of items) {
        if (item.id === itemId) {
          item.badge = badge;
          if (badgeColor) item.badgeColor = badgeColor;
          return true;
        }
        if (item.children && updateInItems(item.children)) {
          return true;
        }
      }
      return false;
    };
    updateInItems(menuItems.value);
  };

  const getMenuBreadcrumbs = (
    currentRoute: string,
  ): { label: string; icon?: string; to?: string | undefined }[] => {
    const breadcrumbs: { label: string; icon?: string; to?: string | undefined }[] = [
      { label: 'Inicio', icon: 'home', to: '/' },
    ];

    if (currentRoute === '/') {
      return breadcrumbs;
    }

    const menuItem = getMenuItemByRoute(currentRoute);
    if (menuItem) {
      // Buscar el padre si existe
      const findParent = (items: MenuItem[], target: MenuItem): MenuItem | undefined => {
        for (const item of items) {
          if (item.children?.some((child) => child.id === target.id)) {
            return item;
          }
          if (item.children) {
            const found = findParent(item.children, target);
            if (found) return found;
          }
        }
        return undefined;
      };

      const parent = findParent(menuItems.value, menuItem);

      if (parent) {
        breadcrumbs.push({
          label: parent.label,
          icon: parent.icon,
          to: parent.route,
        });
      }

      breadcrumbs.push({
        label: menuItem.label,
        icon: menuItem.icon,
      });
    }

    return breadcrumbs;
  };

  const refreshMenuData = async () => {
    await loadMenus();
  };

  return {
    // State
    menuItems: computed(() => menuItems.value),
    filteredMenuItems,
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Getters
    getMenuByModule,

    // Actions
    loadMenus,
    getMenuItemById,
    getMenuItemByRoute,
    updateMenuBadge,
    getMenuBreadcrumbs,
    refreshMenuData,
  };
});
