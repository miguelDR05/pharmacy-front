<template>
  <q-layout view="hHh Lpr lff">
    <!-- view="hHh lpR fFf" -->
    <!-- Header / AppBar -->
    <q-header elevated class="modern-header" :class="{ 'dark-header': $q.dark.isActive }">
      <q-toolbar class="toolbar-content">
        <!-- Menu Toggle -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menu-btn"
        />

        <!-- Logo y Título -->
        <div class="header-brand">
          <div class="brand-logo">
            <q-icon name="local_pharmacy" size="28px" color="white" />
          </div>
          <q-toolbar-title class="brand-title">
            PharmaCare
            <span class="brand-subtitle">Pro</span>
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Search Bar -->
        <div class="search-container" v-permission="'search'">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar productos, clientes..."
            dense
            borderless
            class="search-input"
            bg-color="rgba(255,255,255,0.1)"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white" />
            </template>
            <template v-slot:append v-if="searchQuery">
              <q-icon name="close" @click="searchQuery = ''" class="cursor-pointer" color="white" />
            </template>
          </q-input>
        </div>

        <q-space />

        <!-- Notifications -->
        <q-btn
          flat
          dense
          round
          icon="notifications"
          class="header-btn"
          v-permission="'notifications'"
        >
          <q-badge color="red" floating rounded>{{ notificationCount }}</q-badge>
          <q-menu>
            <div class="notifications-panel">
              <div class="notifications-header">
                <h6>Notificaciones</h6>
                <q-btn flat dense icon="mark_email_read" size="sm" @click="markAllAsRead" />
              </div>
              <q-list>
                <q-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  clickable
                  :class="{ unread: !notification.read }"
                >
                  <q-item-section avatar>
                    <q-icon :name="notification.icon" :color="notification.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ notification.title }}</q-item-label>
                    <q-item-label caption>{{ notification.message }}</q-item-label>
                    <q-item-label caption class="text-grey">
                      {{ notification.time }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-menu>
        </q-btn>

        <!-- Theme Toggle -->
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          class="header-btn"
          @click="toggleTheme"
        >
          <q-tooltip>Cambiar tema</q-tooltip>
        </q-btn>

        <!-- Settings -->
        <q-btn flat dense round icon="settings" class="header-btn" v-permission="'settings'">
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable @click="openSettings">
                <q-item-section avatar>
                  <q-icon name="tune" />
                </q-item-section>
                <q-item-section>Configuración</q-item-section>
              </q-item>
              <q-item clickable @click="openProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Mi Perfil</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="showHelp">
                <q-item-section avatar>
                  <q-icon name="help" />
                </q-item-section>
                <q-item-section>Ayuda</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- User Menu -->
        <q-btn-dropdown flat dense no-caps class="user-dropdown">
          <template v-slot:label>
            <div class="user-info">
              <q-avatar size="32px" class="user-avatar">
                <img :src="currentUser.avatar" />
              </q-avatar>
              <div class="user-details">
                <div class="user-name">{{ currentUser.name }}</div>
                <div class="user-role">{{ currentUser.role }}</div>
              </div>
            </div>
          </template>

          <q-list style="min-width: 200px">
            <q-item-label header>{{ currentUser.email }}</q-item-label>
            <q-separator />
            <q-item clickable @click="openProfile">
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>
              <q-item-section>Mi Perfil</q-item-section>
            </q-item>
            <q-item clickable @click="changePassword">
              <q-item-section avatar>
                <q-icon name="lock" />
              </q-item-section>
              <q-item-section>Cambiar Contraseña</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="logout" class="logout-item">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-negative">Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer / Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="modern-drawer"
      :class="{ 'dark-drawer': $q.dark.isActive }"
      :width="280"
      :mini="miniState"
    >
      <!--
          @mouseover="miniState = false"
      @mouseout="miniState = true"
    -->
      <!-- User Profile in Sidebar -->
      <div class="absolute-top drawer-header">
        <div class="user-profile" :class="{ mini: miniState }">
          <q-avatar size="48px" class="profile-avatar">
            <img :src="currentUser.avatar" />
          </q-avatar>
          <div v-if="!miniState" class="profile-info">
            <div class="profile-name">{{ currentUser.name }}</div>
            <div class="profile-role">{{ currentUser.role }}</div>
            <div class="profile-status">
              <q-icon name="circle" size="8px" color="positive" />
              En línea
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <q-scroll-area style="height: calc(100% - 180px); margin-top: 110px">
        <!-- style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd" -->
        <q-list class="menu-list">
          <template v-for="item in menuItems" :key="item.id">
            <!-- Menu Item with Children -->
            <q-expansion-item
              v-if="item.children && item.children.length > 0"
              v-permission="item.permission"
              :icon="item.icon"
              :label="item.label"
              :default-opened="item.defaultOpen"
              class="menu-expansion"
              :class="{ active: isActiveParent(item) }"
              header-class="expansion-header"
            >
              <q-item
                v-for="child in item.children"
                :key="child.id"
                v-permission="child.permission"
                clickable
                :to="child.route"
                class="menu-child"
                :class="{ active: $route.path === child.route }"
                @click="navigateTo(child.route)"
              >
                <q-item-section avatar>
                  <q-icon :name="child.icon" size="20px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ child.label }}</q-item-label>
                  <q-item-label caption v-if="child.description">
                    {{ child.description }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="child.badge">
                  <q-badge :color="child.badgeColor || 'primary'" rounded>
                    {{ child.badge }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <!-- Single Menu Item -->
            <q-item
              v-else
              v-permission="item.permission"
              clickable
              :to="item.route"
              class="menu-item"
              :class="{ active: $route.path === item.route }"
              @click="navigateTo(item.route)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label caption v-if="item.description">
                  {{ item.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="item.badge">
                <q-badge :color="item.badgeColor || 'primary'" rounded>
                  {{ item.badge }}
                </q-badge>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

      <!-- Mini Toggle Button -->
      <div class="absolute-bottom drawer-footer">
        <q-btn
          flat
          dense
          round
          :icon="miniState ? 'keyboard_arrow_right' : 'keyboard_arrow_left'"
          @click="miniState = !miniState"
          class="mini-toggle"
        />
      </div>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container class="page-container">
      <!-- Breadcrumbs -->
      <div class="breadcrumb-container" v-if="breadcrumbs.length > 0">
        <q-breadcrumbs class="breadcrumbs">
          <template v-slot:separator>
            <q-icon size="1.2em" name="chevron_right" />
          </template>
          <q-breadcrumbs-el
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            :label="crumb.label"
            :icon="crumb.icon"
            :to="crumb.to"
            :class="{ 'breadcrumb-active': index === breadcrumbs.length - 1 }"
          />
        </q-breadcrumbs>
      </div>

      <!-- Router View -->
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutLeft"
          mode="out-in"
        >
          <q-page class="route-page q-pa-md" style="min-height: calc(100vh - 105px)">
            <component :is="Component" />
          </q-page>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar, Notify } from 'quasar';
import { useAuthStore } from '@stores/login/auth';
import { useMenuStore } from '@stores/login/menu';
import { usePermissionsStore } from '@stores/login/permissions';
import { useLoading } from '@composables/useLoading';

// Interfaces
interface MenuItem {
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
}

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  color: string;
  time: string;
  read: boolean;
}

interface Breadcrumb {
  label: string;
  icon?: string;
  to?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// Composables
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const menuStore = useMenuStore();
const permissionsStore = usePermissionsStore();
const { show, hide } = useLoading();

// Reactive data
const leftDrawerOpen = ref(false);
const miniState = ref(false);
const searchQuery = ref('');

// Current user (simulado)
const currentUser = ref<User>({
  id: '1',
  name: 'Dr. María González',
  email: 'maria.gonzalez@pharmacare.com',
  role: 'Administrador',
  avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
});

// Notifications (simuladas)
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Stock Bajo',
    message: 'Paracetamol 500mg tiene solo 5 unidades',
    icon: 'warning',
    color: 'warning',
    time: 'Hace 5 min',
    read: false,
  },
  {
    id: '2',
    title: 'Nueva Venta',
    message: 'Venta completada por S/ 125.50',
    icon: 'point_of_sale',
    color: 'positive',
    time: 'Hace 15 min',
    read: false,
  },
  {
    id: '3',
    title: 'Producto Vencido',
    message: 'Revisar lote ABC123 de Amoxicilina',
    icon: 'event_busy',
    color: 'negative',
    time: 'Hace 1 hora',
    read: true,
  },
]);

// Menu items (simulado desde API)
const menuItems = ref<MenuItem[]>([
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/',
    permission: 'dashboard.view',
    description: 'Panel principal',
  },
  {
    id: 'sales',
    label: 'Ventas',
    icon: 'point_of_sale',
    permission: 'sales.view',
    defaultOpen: true,
    children: [
      {
        id: 'new-sale',
        label: 'Nueva Venta',
        icon: 'add_shopping_cart',
        route: '/sales/new',
        permission: 'sales.create',
      },
      {
        id: 'sales-list',
        label: 'Lista de Ventas',
        icon: 'receipt_long',
        route: '/sales',
        permission: 'sales.list',
      },
      {
        id: 'sales-reports',
        label: 'Reportes',
        icon: 'analytics',
        route: '/sales/reports',
        permission: 'sales.reports',
      },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventario',
    icon: 'inventory',
    permission: 'inventory.view',
    children: [
      {
        id: 'products',
        label: 'Productos',
        icon: 'medication',
        route: '/inventory/products',
        permission: 'products.view',
        badge: 1234,
      },
      {
        id: 'categories',
        label: 'Categorías',
        icon: 'category',
        route: '/inventory/categories',
        permission: 'categories.view',
      },
      {
        id: 'stock-alerts',
        label: 'Alertas de Stock',
        icon: 'warning',
        route: '/inventory/alerts',
        permission: 'inventory.alerts',
        badge: 23,
        badgeColor: 'warning',
      },
      {
        id: 'expiry-alerts',
        label: 'Productos por Vencer',
        icon: 'event_busy',
        route: '/inventory/expiry',
        permission: 'inventory.expiry',
        badge: 8,
        badgeColor: 'negative',
      },
    ],
  },
  {
    id: 'purchases',
    label: 'Compras',
    icon: 'shopping_cart',
    permission: 'purchases.view',
    children: [
      {
        id: 'new-purchase',
        label: 'Nueva Compra',
        icon: 'add_circle',
        route: '/purchases/new',
        permission: 'purchases.create',
      },
      {
        id: 'purchases-list',
        label: 'Lista de Compras',
        icon: 'list_alt',
        route: '/purchases',
        permission: 'purchases.list',
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        icon: 'business',
        route: '/purchases/suppliers',
        permission: 'suppliers.view',
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
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: 'assessment',
    permission: 'reports.view',
    children: [
      {
        id: 'sales-report',
        label: 'Reporte de Ventas',
        icon: 'trending_up',
        route: '/reports/sales',
        permission: 'reports.sales',
      },
      {
        id: 'inventory-report',
        label: 'Reporte de Inventario',
        icon: 'inventory_2',
        route: '/reports/inventory',
        permission: 'reports.inventory',
      },
      {
        id: 'financial-report',
        label: 'Reporte Financiero',
        icon: 'account_balance',
        route: '/reports/financial',
        permission: 'reports.financial',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'settings',
    permission: 'settings.view',
    children: [
      {
        id: 'general-settings',
        label: 'General',
        icon: 'tune',
        route: '/settings/general',
        permission: 'settings.general',
      },
      {
        id: 'users',
        label: 'Usuarios',
        icon: 'manage_accounts',
        route: '/settings/users',
        permission: 'users.view',
      },
      {
        id: 'permissions',
        label: 'Permisos',
        icon: 'security',
        route: '/settings/permissions',
        permission: 'permissions.view',
      },
      {
        id: 'backup',
        label: 'Respaldo',
        icon: 'backup',
        route: '/settings/backup',
        permission: 'backup.view',
      },
    ],
  },
]);

// Computed
const notificationCount = computed(() => notifications.value.filter((n) => !n.read).length);

const breadcrumbs = computed<Breadcrumb[]>(() => {
  // Generar breadcrumbs basado en la ruta actual
  const path = route.path;
  const crumbs: Breadcrumb[] = [{ label: 'Inicio', icon: 'home', to: '/' }];

  if (path !== '/') {
    const segments = path.split('/').filter(Boolean);
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const menuItem = findMenuItemByRoute(currentPath);

      if (menuItem) {
        crumbs.push({
          label: menuItem.label,
          icon: menuItem.icon,
          to: index === segments.length - 1 ? undefined : currentPath,
        });
      }
    });
  }

  return crumbs;
});

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleTheme = () => {
  $q.dark.toggle();
  const theme = $q.dark.isActive ? 'dark' : 'light';
  localStorage.setItem('theme', theme);

  Notify.create({
    message: `Tema ${theme === 'dark' ? 'oscuro' : 'claro'} activado`,
    icon: theme === 'dark' ? 'dark_mode' : 'light_mode',
    position: 'top-right',
    timeout: 2000,
  });
};

const navigateTo = (route: string) => {
  return router.push(route);
};

const findMenuItemByRoute = (route: string): MenuItem | undefined => {
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

const isActiveParent = (item: MenuItem): boolean => {
  if (!item.children) return false;
  return item.children.some((child) => child.route === route.path);
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true));
  Notify.create({
    message: 'Todas las notificaciones marcadas como leídas',
    type: 'positive',
    position: 'top-right',
  });
};

const openProfile = () => {
  return router.push('/profile');
};

const openSettings = () => {
  return router.push('/settings');
};

const showHelp = () => {
  return router.push('/help');
};

const changePassword = () => {
  return router.push('/change-password');
};

const logout = async () => {
  try {
    show();
    await authStore.logout();

    Notify.create({
      message: 'Sesión cerrada correctamente',
      type: 'positive',
      position: 'top-right',
    });

    return router.push('/login');
  } catch (error) {
    Notify.create({
      message: 'Error al cerrar sesión',
      type: 'negative',
      position: 'top-right',
    });
  } finally {
    hide();
  }
};

// Lifecycle
onMounted(async () => {
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    $q.dark.set(savedTheme === 'dark');
  }

  // Simular carga de menús desde API
  try {
    show();
    await menuStore.loadMenus();
    await permissionsStore.loadPermissions();

    // Simulación de delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error loading menu data:', error);
  } finally {
    hide();
  }
});
</script>

<style lang="scss" scoped>
// Header Styles
.modern-header {
  background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &.dark-header {
    background: linear-gradient(135deg, $dark-surface 0%, darken($dark-surface, 5%) 100%);
  }
}

.toolbar-content {
  padding: 0 16px;
  min-height: 64px;
}

.menu-btn {
  margin-right: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 24px;

  .brand-logo {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .brand-title {
    font-size: 22px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: baseline;
    gap: 4px;

    .brand-subtitle {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 500;
    }
  }
}

.search-container {
  max-width: 400px;
  width: 100%;

  .search-input {
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:focus-within {
      background: rgba(255, 255, 255, 0.2) !important;
    }

    :deep(.q-field__control) {
      border-radius: 12px;
    }

    :deep(.q-field__native) {
      color: white;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.header-btn {
  margin: 0 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
}

.user-dropdown {
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: white;
        line-height: 1;
      }

      .user-role {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1;
      }
    }
  }
}

.notifications-panel {
  width: 320px;
  max-height: 400px;

  .notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;

    h6 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .unread {
    background: rgba(0, 180, 166, 0.05);
    border-left: 3px solid $primary;
  }
}

.logout-item {
  &:hover {
    background: rgba(255, 77, 79, 0.1);
  }
}

// Drawer Styles
.modern-drawer {
  background: $white;
  border-right: 1px solid #e9ecef;

  &.dark-drawer {
    background: $dark-surface;
    border-right-color: #3d3d3d;
  }
}

.drawer-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, $secondary 0%, lighten($secondary, 3%) 100%);

  .dark-drawer & {
    background: linear-gradient(135deg, $dark 0%, lighten($dark, 5%) 100%);
    border-bottom-color: #3d3d3d;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;

    &.mini {
      justify-content: center;

      .profile-info {
        display: none;
      }
    }

    .profile-avatar {
      border: 3px solid $primary;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .profile-info {
      flex: 1;

      .profile-name {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 2px;

        .dark-drawer & {
          color: white;
        }
      }

      .profile-role {
        font-size: 13px;
        color: $text-secondary;
        margin-bottom: 4px;

        .dark-drawer & {
          color: #b0b0b0;
        }
      }

      .profile-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #52c41a;
        font-weight: 500;
      }
    }
  }
}

.menu-list {
  padding: 8px 0;

  .menu-item,
  .menu-child {
    margin: 2px 5px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: $primary;
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      background: rgba(0, 180, 166, 0.08);
      transform: translateX(4px);

      &::before {
        transform: scaleY(1);
      }
    }

    &.active {
      background: linear-gradient(135deg, rgba(0, 180, 166, 0.15) 0%, rgba(0, 180, 166, 0.08) 100%);
      color: $primary;
      font-weight: 600;

      &::before {
        transform: scaleY(1);
      }

      :deep(.q-item__section--avatar .q-icon) {
        color: $primary;
      }
    }

    :deep(.q-item__section--avatar) {
      // min-width: 48px;

      .q-icon {
        transition: all 0.3s ease;
      }
    }

    :deep(.q-item__label) {
      font-size: 14px;
      font-weight: 500;
    }

    :deep(.q-item__label--caption) {
      font-size: 12px;
      opacity: 0.7;
    }
  }

  .menu-child {
    margin: 2px 12px 2px 24px;

    :deep(.q-item__section--avatar) {
      min-width: 40px;
    }
  }

  .menu-expansion {
    margin: 2px 12px;
    border-radius: 12px;
    overflow: hidden;

    &.active {
      background: rgba(0, 180, 166, 0.05);

      :deep(.expansion-header) {
        color: $primary;
        font-weight: 600;

        .q-icon {
          color: $primary;
        }
      }
    }

    :deep(.q-expansion-item__header) {
      padding: 12px 16px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 180, 166, 0.08);
      }
    }

    :deep(.q-expansion-item__content) {
      padding: 0;
    }
  }
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #e9ecef;

  .dark-drawer & {
    border-top-color: #3d3d3d;
  }

  .mini-toggle {
    background: rgba(0, 180, 166, 0.1);
    color: $primary;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 180, 166, 0.2);
      transform: scale(1.1);
    }
  }
}

// Page Container
.page-container {
  background: #f8fffe;

  .dark-drawer & {
    background: $dark;
  }
}

.breadcrumb-container {
  padding: 16px 24px 0;
  background: transparent;

  .breadcrumbs {
    :deep(.q-breadcrumbs__el) {
      color: $text-secondary;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: $primary;
      }

      &.breadcrumb-active {
        color: $primary;
        font-weight: 600;
      }
    }

    :deep(.q-breadcrumbs__separator) {
      color: $text-secondary;
      opacity: 0.5;
    }
  }
}
// Page
.route-page {
  min-height: 600px;
}

// Loading Overlay
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .loading-text {
    color: $primary;
    font-size: 16px;
    font-weight: 600;
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .search-container {
    display: none;
  }

  .user-details {
    display: none;
  }

  .brand-title {
    font-size: 18px;

    .brand-subtitle {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .toolbar-content {
    padding: 0 8px;
  }

  .header-brand {
    margin-right: 8px;

    .brand-logo {
      width: 32px;
      height: 32px;
    }

    .brand-title {
      font-size: 16px;
    }
  }

  .header-btn {
    margin: 0 2px;
  }

  .breadcrumb-container {
    padding: 12px 16px 0;
  }
}

// Dark Mode Adjustments
.body--dark {
  .modern-header {
    background: linear-gradient(135deg, $dark-surface 0%, darken($dark-surface, 5%) 100%);
  }

  .modern-drawer {
    background: $dark-surface;
    border-right-color: #3d3d3d;
  }

  .page-container {
    background: $dark;
  }

  .menu-item,
  .menu-child {
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.active {
      background: linear-gradient(135deg, rgba(0, 180, 166, 0.2) 0%, rgba(0, 180, 166, 0.1) 100%);
    }
  }

  .notifications-panel {
    background: $dark-surface;
    color: white;

    .notifications-header {
      border-bottom-color: #3d3d3d;
    }

    .unread {
      background: rgba(0, 180, 166, 0.1);
    }
  }
}

// Animations
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fadeInRight {
  animation-name: fadeInRight;
}

.fadeOutLeft {
  animation-name: fadeOutLeft;
}
</style>
