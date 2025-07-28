// src/directives/permission.ts
import { Directive, DirectiveBinding } from 'vue';
import { usePermissionsStore } from '@/stores/login/permissions';

export interface PermissionDirectiveBinding extends DirectiveBinding {
  value: string | string[];
}

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: PermissionDirectiveBinding) {
    checkPermission(el, binding);
  },

  updated(el: HTMLElement, binding: PermissionDirectiveBinding) {
    checkPermission(el, binding);
  },
};

function checkPermission(el: HTMLElement, binding: PermissionDirectiveBinding) {
  const { value } = binding;
  const permissionsStore = usePermissionsStore();

  if (!value) {
    console.warn('v-permission directive requires a permission value');
    return;
  }

  const permissions = Array.isArray(value) ? value : [value];
  const hasPermission = permissions.some((permission) =>
    permissionsStore.hasPermission(permission),
  );

  if (!hasPermission) {
    // Ocultar el elemento si no tiene permisos
    el.style.display = 'none';
    el.setAttribute('data-permission-hidden', 'true');
  } else {
    // Mostrar el elemento si tiene permisos
    el.style.display = '';
    el.removeAttribute('data-permission-hidden');
  }
}

export default permissionDirective;
