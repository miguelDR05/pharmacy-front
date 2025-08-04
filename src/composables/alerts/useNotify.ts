import { useQuasar } from 'quasar';

type NotifyType = 'positive' | 'negative' | 'warning' | 'info';

interface NotifyOptions {
  type?: NotifyType;
  message: string;
  caption?: string;
  icon?: string;
  timeout?: number; // por defecto 3000ms
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export function useNotify() {
  const $q = useQuasar();

  const notify = ({
    type = 'info',
    message,
    caption = '',
    icon,
    timeout = 3000,
    position = 'top-right',
  }: NotifyOptions) => {
    $q.notify({
      type,
      message,
      caption,
      icon,
      timeout,
      position,
    });
  };

  return { notify };
}
