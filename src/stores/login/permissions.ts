// src/stores/permissions.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  roles: string[];
  permissions: string[];
}

export const usePermissionsStore = defineStore('permissions', () => {
  // State
  const permissions = ref<Permission[]>([]);
  const roles = ref<Role[]>([]);
  const userPermissions = ref<string[]>([]);
  const userRoles = ref<string[]>([]);
  const loading = ref(false);

  // Getters
  const allPermissions = computed(() => permissions.value);
  const userHasRole = computed(() => (roleName: string) => userRoles.value.includes(roleName));

  // Actions
  const loadPermissions = async () => {
    loading.value = true;
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500));

      permissions.value = [
        // Dashboard
        {
          id: 'dashboard.view',
          name: 'Ver Dashboard',
          description: 'Acceso al panel principal',
          module: 'dashboard',
        },

        // Ventas
        {
          id: 'sales.view',
          name: 'Ver Ventas',
          description: 'Ver lista de ventas',
          module: 'sales',
        },
        {
          id: 'sales.create',
          name: 'Crear Ventas',
          description: 'Crear nuevas ventas',
          module: 'sales',
        },
        {
          id: 'sales.edit',
          name: 'Editar Ventas',
          description: 'Modificar ventas existentes',
          module: 'sales',
        },
        {
          id: 'sales.delete',
          name: 'Eliminar Ventas',
          description: 'Eliminar ventas',
          module: 'sales',
        },
        {
          id: 'sales.list',
          name: 'Listar Ventas',
          description: 'Acceder a la lista completa',
          module: 'sales',
        },
        {
          id: 'sales.reports',
          name: 'Reportes de Ventas',
          description: 'Ver reportes de ventas',
          module: 'sales',
        },

        // Inventario
        {
          id: 'inventory.view',
          name: 'Ver Inventario',
          description: 'Acceso al inventario',
          module: 'inventory',
        },
        {
          id: 'products.view',
          name: 'Ver Productos',
          description: 'Ver lista de productos',
          module: 'inventory',
        },
        {
          id: 'products.create',
          name: 'Crear Productos',
          description: 'Agregar nuevos productos',
          module: 'inventory',
        },
        {
          id: 'products.edit',
          name: 'Editar Productos',
          description: 'Modificar productos',
          module: 'inventory',
        },
        {
          id: 'products.delete',
          name: 'Eliminar Productos',
          description: 'Eliminar productos',
          module: 'inventory',
        },
        {
          id: 'categories.view',
          name: 'Ver Categorías',
          description: 'Ver categorías de productos',
          module: 'inventory',
        },
        {
          id: 'categories.manage',
          name: 'Gestionar Categorías',
          description: 'Crear y editar categorías',
          module: 'inventory',
        },
        {
          id: 'inventory.alerts',
          name: 'Alertas de Inventario',
          description: 'Ver alertas de stock',
          module: 'inventory',
        },
        {
          id: 'inventory.expiry',
          name: 'Productos por Vencer',
          description: 'Ver productos próximos a vencer',
          module: 'inventory',
        },

        // Compras
        {
          id: 'purchases.view',
          name: 'Ver Compras',
          description: 'Acceso a compras',
          module: 'purchases',
        },
        {
          id: 'purchases.create',
          name: 'Crear Compras',
          description: 'Realizar nuevas compras',
          module: 'purchases',
        },
        {
          id: 'purchases.list',
          name: 'Listar Compras',
          description: 'Ver historial de compras',
          module: 'purchases',
        },
        {
          id: 'suppliers.view',
          name: 'Ver Proveedores',
          description: 'Ver lista de proveedores',
          module: 'purchases',
        },
        {
          id: 'suppliers.manage',
          name: 'Gestionar Proveedores',
          description: 'Crear y editar proveedores',
          module: 'purchases',
        },

        // Clientes
        {
          id: 'customers.view',
          name: 'Ver Clientes',
          description: 'Acceso a la gestión de clientes',
          module: 'customers',
        },
        {
          id: 'customers.create',
          name: 'Crear Clientes',
          description: 'Agregar nuevos clientes',
          module: 'customers',
        },
        {
          id: 'customers.edit',
          name: 'Editar Clientes',
          description: 'Modificar datos de clientes',
          module: 'customers',
        },
        {
          id: 'customers.delete',
          name: 'Eliminar Clientes',
          description: 'Eliminar clientes',
          module: 'customers',
        },

        // Reportes
        {
          id: 'reports.view',
          name: 'Ver Reportes',
          description: 'Acceso a reportes',
          module: 'reports',
        },
        {
          id: 'reports.sales',
          name: 'Reportes de Ventas',
          description: 'Generar reportes de ventas',
          module: 'reports',
        },
        {
          id: 'reports.inventory',
          name: 'Reportes de Inventario',
          description: 'Generar reportes de inventario',
          module: 'reports',
        },
        {
          id: 'reports.financial',
          name: 'Reportes Financieros',
          description: 'Ver reportes financieros',
          module: 'reports',
        },
        {
          id: 'reports.export',
          name: 'Exportar Reportes',
          description: 'Exportar reportes a PDF/Excel',
          module: 'reports',
        },

        // Configuración
        {
          id: 'settings.view',
          name: 'Ver Configuración',
          description: 'Acceso a configuración',
          module: 'settings',
        },
        {
          id: 'settings.general',
          name: 'Configuración General',
          description: 'Modificar configuración general',
          module: 'settings',
        },
        {
          id: 'users.view',
          name: 'Ver Usuarios',
          description: 'Ver lista de usuarios',
          module: 'settings',
        },
        {
          id: 'users.create',
          name: 'Crear Usuarios',
          description: 'Agregar nuevos usuarios',
          module: 'settings',
        },
        {
          id: 'users.edit',
          name: 'Editar Usuarios',
          description: 'Modificar usuarios',
          module: 'settings',
        },
        {
          id: 'users.delete',
          name: 'Eliminar Usuarios',
          description: 'Eliminar usuarios',
          module: 'settings',
        },
        {
          id: 'permissions.view',
          name: 'Ver Permisos',
          description: 'Ver sistema de permisos',
          module: 'settings',
        },
        {
          id: 'permissions.manage',
          name: 'Gestionar Permisos',
          description: 'Modificar permisos y roles',
          module: 'settings',
        },
        {
          id: 'backup.view',
          name: 'Ver Respaldos',
          description: 'Acceso a respaldos',
          module: 'settings',
        },
        {
          id: 'backup.create',
          name: 'Crear Respaldos',
          description: 'Generar respaldos',
          module: 'settings',
        },
        {
          id: 'backup.restore',
          name: 'Restaurar Respaldos',
          description: 'Restaurar desde respaldo',
          module: 'settings',
        },

        // Generales
        {
          id: 'search',
          name: 'Buscar',
          description: 'Acceso a la búsqueda global',
          module: 'general',
        },
        {
          id: 'notifications',
          name: 'Notificaciones',
          description: 'Ver notificaciones del sistema',
          module: 'general',
        },
      ];

      roles.value = [
        {
          id: 'admin',
          name: 'Administrador',
          permissions: permissions.value.map((p) => p.id), // Todos los permisos
        },
        {
          id: 'manager',
          name: 'Gerente',
          permissions: [
            'dashboard.view',
            'sales.view',
            'sales.create',
            'sales.edit',
            'sales.list',
            'sales.reports',
            'inventory.view',
            'products.view',
            'products.create',
            'products.edit',
            'categories.view',
            'inventory.alerts',
            'inventory.expiry',
            'purchases.view',
            'purchases.create',
            'purchases.list',
            'suppliers.view',
            'suppliers.manage',
            'customers.view',
            'customers.create',
            'customers.edit',
            'reports.view',
            'reports.sales',
            'reports.inventory',
            'reports.financial',
            'search',
            'notifications',
          ],
        },
        {
          id: 'pharmacist',
          name: 'Farmacéutico',
          permissions: [
            'dashboard.view',
            'sales.view',
            'sales.create',
            'sales.list',
            'inventory.view',
            'products.view',
            'categories.view',
            'inventory.alerts',
            'inventory.expiry',
            'customers.view',
            'customers.create',
            'customers.edit',
            'search',
            'notifications',
          ],
        },
        {
          id: 'cashier',
          name: 'Cajero',
          permissions: [
            'dashboard.view',
            'sales.view',
            'sales.create',
            'products.view',
            'customers.view',
            'customers.create',
            'search',
            'notifications',
          ],
        },
        {
          id: 'inventory_clerk',
          name: 'Encargado de Inventario',
          permissions: [
            'dashboard.view',
            'inventory.view',
            'products.view',
            'products.create',
            'products.edit',
            'categories.view',
            'categories.manage',
            'inventory.alerts',
            'inventory.expiry',
            'purchases.view',
            'purchases.create',
            'purchases.list',
            'suppliers.view',
            'reports.inventory',
            'search',
            'notifications',
          ],
        },
      ];
    } catch (error) {
      console.error('Error loading permissions:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const setUserPermissions = (user: User) => {
    userRoles.value = user.roles;

    // Combinar permisos directos del usuario con permisos de sus roles
    const rolePermissions = user.roles.flatMap((roleId) => {
      const role = roles.value.find((r) => r.id === roleId);
      return role ? role.permissions : [];
    });

    userPermissions.value = [...new Set([...user.permissions, ...rolePermissions])];
  };

  const hasPermission = (permission: string): boolean => {
    // Si es admin, tiene todos los permisos
    if (userRoles.value.includes('admin')) {
      return true;
    }

    return userPermissions.value.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every((permission) => hasPermission(permission));
  };

  const getPermissionsByModule = (module: string): Permission[] => {
    return permissions.value.filter((p) => p.module === module);
  };

  const canAccessRoute = (routePermission: string): boolean => {
    if (!routePermission) return true;
    return hasPermission(routePermission);
  };

  // Simulación de usuario actual (en producción vendría del AuthStore)
  const initializeUserPermissions = async () => {
    // Simular usuario con rol de administrador
    const currentUser: User = {
      id: '1',
      roles: ['admin'], // Cambiar por: ['pharmacist'], ['cashier'], etc. para probar
      permissions: [],
    };

    setUserPermissions(currentUser);
  };

  return {
    // State
    permissions,
    roles,
    userPermissions: computed(() => userPermissions.value),
    userRoles: computed(() => userRoles.value),
    loading: computed(() => loading.value),

    // Getters
    allPermissions,
    userHasRole,

    // Actions
    loadPermissions,
    setUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionsByModule,
    canAccessRoute,
    initializeUserPermissions,
  };
});
