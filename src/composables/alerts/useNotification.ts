import { ref, Ref } from 'vue';
import { Notify, QSpinnerHourglass } from 'quasar';

export function useNotification() {
    const notifications: Ref<(() => void)[]> = ref([]);

    const showSpinnerNotification: any = (message = 'Actualizando...') => {
        const spinnerNotification = Notify.create({
            spinner: QSpinnerHourglass,
            type: 'ongoing',
            color: 'primary',
            position: 'bottom-right',
            timeout: 0,
            spinnerSize: '0.6em',
            message,
        });
        notifications.value.push(spinnerNotification);

        return spinnerNotification;
    };
    const updateNotificationMessage: any = (
        spinnerNotification: any,
        message: string
    ) => {
        if (spinnerNotification) {
            spinnerNotification({
                spinner: QSpinnerHourglass,
                type: 'ongoing',
                color: 'primary',
                position: 'bottom-right',
                timeout: 0,
                spinnerSize: '0.6em',
                message,
            });
        }
    };
    const showSuccessNotification: any = (
        spinnerNotification: any,
        message = 'Actualización completa!',
        icon = 'mdi-check-circle'
    ) => {
        if (spinnerNotification) {
            spinnerNotification({
                icon,
                spinner: false,
                message,
                color: 'primary',
                position: 'bottom-right',
                timeout: 2500,
            });
        }
    };
    const showErrorNotification: any = (
        spinnerNotification: any,
        message = 'Ocurrió un error',
        icon: 'mdi-close-circle'
    ) => {
        if (spinnerNotification) {
            spinnerNotification({
                icon,
                spinner: false,
                message,
                removable: true,
                color: 'negative',
                position: 'bottom-right',
                timeout: 2500,
            });
        }
    };

    return {
        notifications,
        updateNotificationMessage,
        showSpinnerNotification,
        showSuccessNotification,
        showErrorNotification,
    };
}
