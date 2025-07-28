// src/composables/useLoading.ts
import { QSpinnerHourglass, QLoadingShowOptions, Loading } from 'quasar';
// import { QLoadingShowOptions } from 'quasar';

export function useLoading() {
  const defaultOptions: QLoadingShowOptions = {
    spinner: QSpinnerHourglass,
    spinnerColor: 'primary-color',
    spinnerSize: 140,
    backgroundColor: '',
    message: 'Cargando...',
    messageColor: 'primary-color',
  };

  function show(options: QLoadingShowOptions = {}) {
    const finalOptions: QLoadingShowOptions = {
      ...defaultOptions,
      ...options,
    };
    Loading.show(finalOptions);
  }

  function hide() {
    Loading.hide();
  }

  return {
    show,
    hide,
  };
}
