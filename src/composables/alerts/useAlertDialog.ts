import { useQuasar } from 'quasar';

type AlertType = 'success' | 'error' | 'question' | 'information' | 'warning';

interface TypeAlert {
  type: AlertType;
}

// Íconos asociados a cada tipo de alerta
// C:\dev_projects\quasar_projects\pharmacy-front\src\assets\images\alerts\question.png
const alertIcons: Record<AlertType, string> = {
  success: '/src/assets/images/alerts/success.png',
  error: '/src/assets/images/alerts/error.png',
  question: '/src/assets/images/alerts/question.png',
  information: '/src/assets/images/alerts/information.png',
  warning: '/src/assets/images/alerts/warning.png',
};

function buildDialogMessage(title: string, imageSrc: string, message: string): string {
  return `
    <div class="row">
      <div class="col-12 text-center">
        <h5 style="margin:5px;">${title}</h5>
      </div>
      <div class="col-12 text-center">
        <img width="100" style="margin:5px;" src="${imageSrc}">
      </div>
      <div class="col-12 text-center">
        <p style="margin:5px;">${message}</p>
      </div>
    </div>`;
}

export function useAlert() {
  const $q = useQuasar();

  // Alerta informativa con botón "Aceptar"
  const singleAlert = async (
    { type }: TypeAlert,
    title: string,
    message: string,
  ): Promise<boolean> => {
    const imageSrc = alertIcons[type];

    return new Promise((resolve) => {
      $q.dialog({
        title: '',
        message: buildDialogMessage(title, imageSrc, message),
        html: true,
        ok: {
          label: 'Aceptar',
          color: 'primary',
          flat: true,
        },
        persistent: true,
      }).onOk(() => resolve(true));
    });
  };

  // Diálogo de confirmación con botones "Aceptar" y "Cancelar"
  const confirmAlert = async (
    { type }: TypeAlert,
    title: string,
    message: string,
    okLabel = 'Aceptar',
    cancelLabel = 'Cancelar',
  ): Promise<boolean> => {
    const imageSrc = alertIcons[type];

    return new Promise((resolve) => {
      $q.dialog({
        title: '',
        message: buildDialogMessage(title, imageSrc, message),
        html: true,
        ok: {
          label: okLabel,
          color: 'primary',
          flat: true,
        },
        cancel: {
          label: cancelLabel,
          color: 'negative',
          flat: true,
        },
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false));
    });
  };

  // Prompt con campo de entrada, devuelve valor ingresado
  const promptAlert = async (
    { type }: TypeAlert,
    title: string,
    message: string,
    defaultValue: string,
  ): Promise<string | null> => {
    const imageSrc = alertIcons[type];

    return new Promise((resolve) => {
      $q.dialog({
        title: '',
        message: buildDialogMessage(title, imageSrc, message),
        html: true,
        prompt: {
          model: defaultValue,
          isValid: (val: string) => val.trim().length > 0,
          type: 'text',
        },
        ok: {
          label: 'Aceptar',
          color: 'primary',
          flat: true,
        },
        cancel: {
          label: 'Cancelar',
          color: 'negative',
          flat: true,
        },
        persistent: true,
      })
        .onOk((data) => resolve(data))
        .onCancel(() => resolve(null));
    });
  };

  return { singleAlert, confirmAlert, promptAlert };
}
