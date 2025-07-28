// src/stores/menu.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePermissionsStore } from './permissions';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  permission: string;
  description?: string;
  badge?: string | number;
  badgeColor?: string;
  defaultOpen?: boolean;
  children?: MenuItem[];
  order?: number;
  module?: string;
}

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
  ): { label: string; icon?: string; to?: string }[] => {
    const breadcrumbs: { label: string; icon?: string; to?: string }[] = [
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
