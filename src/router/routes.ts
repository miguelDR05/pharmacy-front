// import type { RouteRecordRaw } from 'vue-router';

// const routes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     component: () => import('@layouts/MainLayout.vue'),
//     meta: { requiresAuth: true },
//     children: [{ path: '', component: () => import('@pages/Dashboard/Dashboard.vue') }],
//   },
//   {
//     path: '/login',
//     component: () => import('@pages/Login/Login.vue'),
//   },
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('@pages/ErrorNotFound.vue'),
//   },
// ];

// export default routes;
// src/router/routes.ts
import { RouteRecordRaw } from 'vue-router';

// Importar el layout principal
import MainLayout from '@layouts/MainLayout.vue';

// Importar páginas
import Dashboard from '@pages/Dashboard/Dashboard.vue';
import Login from '@pages/Login/Login.vue';

// Páginas de Ventas
import SalesIndex from '@pages/Sales/Index.vue';
import NewSale from '@pages/Sales/New.vue';
import SalesReports from '@pages/Sales/Reports.vue';

// Páginas de Inventario
import ProductsIndex from '@pages/Inventory/Products/Index.vue';
import CategoriesIndex from '@pages/Inventory/Categories/Index.vue';
import StockAlerts from '@pages/Inventory/StockAlerts.vue';
import ExpiryAlerts from '@pages/Inventory/ExpiryAlerts.vue';

// Páginas de Compras
import PurchasesIndex from '@pages/Purchases/Index.vue';
import NewPurchase from '@pages/Purchases/New.vue';
import SuppliersIndex from '@pages/Purchases/Suppliers/Index.vue';

// Páginas de Clientes
import CustomersIndex from '@pages/Customers/Index.vue';

// Páginas de Reportes
import SalesReport from '@pages/Reports/Sales.vue';
import InventoryReport from '@pages/Reports/Inventory.vue';
import FinancialReport from '@pages/Reports/Financial.vue';

// Páginas de Configuración
import GeneralSettings from '@pages/Settings/General.vue';
import UsersIndex from '@pages/Settings/Users/Index.vue';
import PermissionsIndex from '@pages/Settings/Permissions/Index.vue';
import BackupIndex from '@pages/Settings/Backup/Index.vue';

// Páginas adicionales
import ProfilePage from '@pages/Profile.vue';
import ChangePassword from '@pages/ChangePassword.vue';
import HelpPage from '@pages/Help.vue';
import NotFound from '@pages/ErrorNotFound.vue';

export const routes: RouteRecordRaw[] = [
  // Ruta de login (sin layout)
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión',
    },
  },

  // Rutas principales (con layout)
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      // Dashboard
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          permission: 'dashboard.view',
          title: 'Dashboard',
          breadcrumb: 'Dashboard',
        },
      },

      // Ventas
      {
        path: '/sales',
        name: 'sales',
        component: SalesIndex,
        meta: {
          permission: 'sales.list',
          title: 'Lista de Ventas',
          breadcrumb: 'Ventas',
        },
      },
      {
        path: '/sales/new',
        name: 'new-sale',
        component: NewSale,
        meta: {
          permission: 'sales.create',
          title: 'Nueva Venta',
          breadcrumb: 'Nueva Venta',
        },
      },
      {
        path: '/sales/reports',
        name: 'sales-reports',
        component: SalesReports,
        meta: {
          permission: 'sales.reports',
          title: 'Reportes de Ventas',
          breadcrumb: 'Reportes',
        },
      },

      // Inventario
      {
        path: '/inventory/products',
        name: 'products',
        component: ProductsIndex,
        meta: {
          permission: 'products.view',
          title: 'Productos',
          breadcrumb: 'Productos',
        },
      },
      {
        path: '/inventory/categories',
        name: 'categories',
        component: CategoriesIndex,
        meta: {
          permission: 'categories.view',
          title: 'Categorías',
          breadcrumb: 'Categorías',
        },
      },
      {
        path: '/inventory/alerts',
        name: 'stock-alerts',
        component: StockAlerts,
        meta: {
          permission: 'inventory.alerts',
          title: 'Alertas de Stock',
          breadcrumb: 'Alertas de Stock',
        },
      },
      {
        path: '/inventory/expiry',
        name: 'expiry-alerts',
        component: ExpiryAlerts,
        meta: {
          permission: 'inventory.expiry',
          title: 'Productos por Vencer',
          breadcrumb: 'Por Vencer',
        },
      },

      // Compras
      {
        path: '/purchases',
        name: 'purchases',
        component: PurchasesIndex,
        meta: {
          permission: 'purchases.list',
          title: 'Lista de Compras',
          breadcrumb: 'Compras',
        },
      },
      {
        path: '/purchases/new',
        name: 'new-purchase',
        component: NewPurchase,
        meta: {
          permission: 'purchases.create',
          title: 'Nueva Compra',
          breadcrumb: 'Nueva Compra',
        },
      },
      {
        path: '/purchases/suppliers',
        name: 'suppliers',
        component: SuppliersIndex,
        meta: {
          permission: 'suppliers.view',
          title: 'Proveedores',
          breadcrumb: 'Proveedores',
        },
      },

      // Clientes
      {
        path: '/customers',
        name: 'customers',
        component: CustomersIndex,
        meta: {
          permission: 'customers.view',
          title: 'Clientes',
          breadcrumb: 'Clientes',
        },
      },

      // Reportes
      {
        path: '/reports/sales',
        name: 'sales-report',
        component: SalesReport,
        meta: {
          permission: 'reports.sales',
          title: 'Reporte de Ventas',
          breadcrumb: 'Reporte de Ventas',
        },
      },
      {
        path: '/reports/inventory',
        name: 'inventory-report',
        component: InventoryReport,
        meta: {
          permission: 'reports.inventory',
          title: 'Reporte de Inventario',
          breadcrumb: 'Reporte de Inventario',
        },
      },
      {
        path: '/reports/financial',
        name: 'financial-report',
        component: FinancialReport,
        meta: {
          permission: 'reports.financial',
          title: 'Reporte Financiero',
          breadcrumb: 'Reporte Financiero',
        },
      },

      // Configuración
      {
        path: '/settings/general',
        name: 'general-settings',
        component: GeneralSettings,
        meta: {
          permission: 'settings.general',
          title: 'Configuración General',
          breadcrumb: 'General',
        },
      },
      {
        path: '/settings/users',
        name: 'users',
        component: UsersIndex,
        meta: {
          permission: 'users.view',
          title: 'Usuarios',
          breadcrumb: 'Usuarios',
        },
      },
      {
        path: '/settings/permissions',
        name: 'permissions',
        component: PermissionsIndex,
        meta: {
          permission: 'permissions.view',
          title: 'Permisos',
          breadcrumb: 'Permisos',
        },
      },
      {
        path: '/settings/backup',
        name: 'backup',
        component: BackupIndex,
        meta: {
          permission: 'backup.view',
          title: 'Respaldo',
          breadcrumb: 'Respaldo',
        },
      },

      // Páginas de perfil y utilidades
      {
        path: '/profile',
        name: 'profile',
        component: ProfilePage,
        meta: {
          title: 'Mi Perfil',
          breadcrumb: 'Perfil',
        },
      },
      {
        path: '/change-password',
        name: 'change-password',
        component: ChangePassword,
        meta: {
          title: 'Cambiar Contraseña',
          breadcrumb: 'Cambiar Contraseña',
        },
      },
      {
        path: '/help',
        name: 'help',
        component: HelpPage,
        meta: {
          title: 'Ayuda',
          breadcrumb: 'Ayuda',
        },
      },
    ],
  },

  // Ruta 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Página no encontrada',
    },
  },
];

// Función para obtener el título de la página
export const getPageTitle = (routeName: string): string => {
  const route = routes
    .flatMap((r) => (r.children ? [r, ...r.children] : [r]))
    .find((r) => r.name === routeName);

  return (route?.meta?.title as string) || 'PharmaCare';
};
