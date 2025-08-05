import { useQuasar, QNotifyCreateOptions } from 'quasar'; // Importa QNotifyCreateOptions para un tipado más preciso

// Define los tipos de notificación permitidos.
type NotifyType = 'positive' | 'negative' | 'warning' | 'info';

// Interfaz para las opciones de notificación.
interface NotifyOptions {
  type?: NotifyType; // Tipo de notificación (determina el color y el icono por defecto)
  message: string; // Mensaje principal de la notificación
  caption?: string; // Subtítulo opcional
  icon?: string; // Icono personalizado (opcional, anula el icono por defecto)
  timeout?: number; // Duración de la notificación en ms (por defecto 3000ms)
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'; // Posición de la notificación
}

export function useNotify() {
  const $q = useQuasar();

  /**
   * Muestra una notificación de Quasar con opciones personalizables.
   * Los iconos se asignan dinámicamente según el tipo, a menos que se proporcione uno personalizado.
   * @param options Las opciones para la notificación.
   */
  const notify = ({
    type = 'info', // Valor por defecto 'info'
    message,
    caption = '', // Valor por defecto cadena vacía
    icon, // Icono proporcionado por el usuario (puede ser undefined)
    timeout = 1000, // Valor por defecto 3000ms
    position = 'bottom', // Valor por defecto 'top-right'
  }: NotifyOptions) => {
    // 1. Determinar el icono por defecto basado en el tipo de notificación.
    let defaultIcon: string | undefined;
    switch (type) {
      case 'positive':
        defaultIcon = 'check_circle'; // Icono para éxito
        break;
      case 'negative':
        defaultIcon = 'error'; // Icono para error
        break;
      case 'warning':
        defaultIcon = 'warning'; // Icono para advertencia
        break;
      case 'info':
        defaultIcon = 'info'; // Icono para información
        break;
      default:
        // En caso de un tipo no reconocido (aunque el tipo NotifyType lo previene), no asignamos icono por defecto.
        defaultIcon = undefined;
    }

    // 2. Seleccionar el icono final: si el usuario proporcionó un icono, úsalo; de lo contrario, usa el por defecto.
    // Usamos 'icon !== undefined' para verificar si el usuario realmente pasó el prop 'icon',
    // incluso si el valor es una cadena vacía, lo cual es válido para Quasar.
    const finalIcon = icon !== undefined ? icon : defaultIcon;

    // 3. Construir el objeto de opciones para $q.notify.
    // Es crucial no pasar 'undefined' directamente al 'icon' de QNotifyCreateOptions si no es un string.
    const notifyOptions: QNotifyCreateOptions = {
      type,
      message,
      caption,
      timeout,
      position,
    };

    // 4. Añadir la propiedad 'icon' al objeto de opciones solo si 'finalIcon' es un string válido.
    if (typeof finalIcon === 'string' && finalIcon !== '') {
      notifyOptions.icon = finalIcon;
    }
    // Si finalIcon es undefined o una cadena vacía, la propiedad 'icon' simplemente no se añade,
    // lo cual es lo que espera Quasar si no quieres un icono.

    // 5. Mostrar la notificación.
    $q.notify(notifyOptions);
  };

  return { notify };
}
