import { Ref, ref } from 'vue';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  AxiosInstance,
} from 'axios';
import { SessionStorage, Notify, QSpinnerHourglass } from 'quasar';
import { api, sanctumApi } from '@/boot/axios'; // Ajusta la ruta si es necesario

// Se usa para gestionar las notificaciones de descarga,
// si prefieres una sola cola, esto está bien.
const activeDownloadNotifications: Map<string, any> = new Map();

export enum HttpMethods {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete',
}

export interface IHttpResourceOption {
  path: string;
  method: HttpMethods;
  slug?: string;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  paramsRoute?: Record<string, any>;
  data?: Record<string, any>;
  timeout?: number;
  responseType?: any;
  download?: boolean;
  nameDocument?: string;
  downloadJson?: boolean;
  useSanctumApi?: boolean; // Para decidir entre 'api' y 'sanctumApi'
  // Puedes añadir un flag para indicar si requiere token Bearer si no es Sanctum
  requiresBearerToken?: boolean;
}

// Tipo genérico para la propiedad 'data'
export interface IHttpResponse<TData = any> {
  responseCode: string;
  code?: number;
  responseAction: string;
  success: boolean;
  data: TData; // Ahora puede ser tipada
  title?: string;
  message: string;
  otherMessage: string;
  otherData?: any[]; // Cambiado a opcional, ya que puede que no siempre esté presente
}

export function useFetchHttp() {
  const loading: Ref<boolean> = ref(false);
  // `cancelTokenSource` es para cancelar peticiones, pero la API de Axios
  // para esto ha cambiado a `AbortController`. Lo mantendré si es lo que usas,
  // pero `AbortController` es la forma moderna.
  let cancelTokenSource: CancelTokenSource | null = null;

  const showLoad = () => (loading.value = true);
  const hideLoad = () => (loading.value = false);

  const cancelRequest = (message = 'Solicitud cancelada por el usuario.') => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel(message);
      cancelTokenSource = null;
    }
  };

  // Esta función puede usarse para añadir un token Bearer manualmente si tu API lo requiere
  // y no es manejado por cookies (como en Sanctum SPA).
  // Para Sanctum (con withCredentials: true, withXSRFToken: true), esto NO es necesario.
  const getBearerAuthorizationHeader = () => {
    // SessionStorage.getItem() siempre devuelve `string | null`.
    // Si devuelve `null`, la condición `token ? ... : {}` lo manejará.
    const token = SessionStorage.getItem('access_token');

    // Aseguramos que 'token' sea un string válido antes de usarlo
    // en el template literal.
    // La condición 'typeof token === "string"' es una "type guard"
    // que le dice a TypeScript que, dentro de este 'if', 'token' es definitivamente un string.
    if (typeof token === 'string' && token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      // Si token es null, undefined, o no es una cadena (aunque getItem debería dar string|null)
      // retornamos un objeto vacío.
      return {};
    }
  };

  const fetchHttpResource = async <TData = any>( // Añadido genérico para la respuesta
    options: IHttpResourceOption,
    showLoading = true,
  ): Promise<IHttpResponse<TData>> => {
    const paramsRoute = options.paramsRoute ?? [];

    const axiosInstance = options.useSanctumApi ? sanctumApi : api;

    // Construye la URL relativa a la baseURL de la instancia seleccionada
    let url = `${options.path}${options.slug ?? ''}`;
    if (paramsRoute.length > 0) {
      // Asegúrate de que no haya doble barra si options.path ya termina en /
      url += `/${paramsRoute.join('/')}`;
    }

    const method = options.method;
    const headers = { ...options.headers };
    // Añade el token Bearer si la opción lo indica, para APIs que no son Sanctum SPA
    if (options.requiresBearerToken) {
      Object.assign(headers, getBearerAuthorizationHeader());
    }

    const params = options.params ?? {};
    const data = options.data ?? {};
    const timeout = options.timeout ?? 0;
    const responseType = options.download ? 'blob' : (options.responseType ?? 'json');

    // Manejo de company_id:
    // Esta lógica es un poco repetitiva y podría ser un interceptor de Axios
    // si company_id es siempre fijo para todas las peticiones a estas APIs.
    // Si company_id puede variar o depende del contexto del usuario logueado,
    // es mejor pasarlo explícitamente en options.params o options.data.
    switch (method) {
      case HttpMethods.Get:
        // params['company_id'] = 1;
        break;
      case HttpMethods.Post:
      case HttpMethods.Patch:
      case HttpMethods.Put:
      case HttpMethods.Delete:
        // if (options.data instanceof FormData) {
        //   options.data.append('company_id', '1');
        // } else {
        //   // Asegúrate de que 'data' sea un objeto para asignarle propiedades
        //   if (typeof data === 'object' && data !== null) {
        //     data['company_id'] = 1;
        //   }
        // }
        break;
      default:
        // Caso por defecto: Asume GET/POST si no se especifica
        // if (options.data instanceof FormData) {
        //   options.data.append('company_id', '1');
        // } else {
        //   if (typeof data === 'object' && data !== null) {
        //     data['company_id'] = 1;
        //   } else {
        //     params['company_id'] = 1; // Si data no es un objeto, usa params
        //   }
        // }
        break;
    }

    const axiosConfig: AxiosRequestConfig = {
      url,
      method,
      headers,
      params,
      data,
      timeout,
      responseType,
      // `cancelToken` se considera legacy. `signal` con `AbortController` es lo moderno.
      // Si usas AbortController:
      // signal: abortController.signal,
    };

    if (options.download) {
      const notificationId = `download-${Date.now()}`; // ID único para la notificación
      const updatingNotification = Notify.create({
        group: false, // Asegura que esta notificación sea independiente
        spinner: QSpinnerHourglass,
        type: 'ongoing',
        color: 'primary',
        position: 'bottom-right',
        timeout: 0,
        spinnerSize: '0.6em',
        message: 'Descargando archivo...',
      });
      activeDownloadNotifications.set(notificationId, updatingNotification); // Guardar referencia

      try {
        const axiosResponse = await axiosInstance(axiosConfig);
        return downloadResource(
          axiosResponse,
          axiosResponse.headers['file-name'] ?? options.nameDocument ?? 'download',
          options.downloadJson ?? false,
          notificationId, // Pasar el ID para actualizar la notificación correcta
        );
      } catch (err: unknown) {
        // Captura 'unknown' para un mejor tipado
        // Manejar errores de descarga, limpiar notificación
        const finalNotification = activeDownloadNotifications.get(notificationId);
        if (finalNotification) {
          finalNotification({
            icon: 'mdi-download-off',
            color: 'red',
            message: 'Error al descargar el archivo.',
            position: 'bottom-right',
            timeout: 2500,
          });
          activeDownloadNotifications.delete(notificationId);
        }
        // Re-lanza el error para que catchAxiosError lo maneje
        throw err;
      }
    }

    return handleRequest(axiosInstance, axiosConfig, showLoading);
  };

  const handleRequest = async <TData = any>( // Añadido genérico para la respuesta
    axiosInstance: AxiosInstance, // Corregido el tipo
    axiosConfig: AxiosRequestConfig,
    showLoading: boolean,
  ): Promise<IHttpResponse<TData>> => {
    if (showLoading) showLoad();
    try {
      const response = await axiosInstance(axiosConfig);
      // Asume que la respuesta exitosa ya tiene la estructura IHttpResponse
      return response.data as IHttpResponse<TData>;
    } catch (err: unknown) {
      // Captura 'unknown' para un mejor tipado
      return await catchAxiosError(err);
    } finally {
      if (showLoading) hideLoad();
    }
  };

  // Manejador de errores
  const catchAxiosError = (err: unknown): Promise<IHttpResponse<any>> => {
    const defaultResponse: IHttpResponse<any> = {
      responseCode: 'IKERR',
      responseAction: '',
      success: false,
      data: [],
      message: 'Ha sucedido un inconveniente en la solicitud HTTP',
      otherMessage: '',
      otherData: [],
    };

    // axios.isAxiosError es un type guard
    if (axios.isAxiosError(err)) {
      const errorResponse = (err.response?.data as IHttpResponse<any>) ?? defaultResponse;

      // AxiosError tiene una propiedad `code` para errores de red o de cancelación
      if (err.code === AxiosError.ERR_NETWORK) {
        // Si onNetworkError() devuelve una Promesa, no necesitas Promise.resolve() aquí
        // Pero si devuelve directamente IHttpResponse, ¡sí lo necesitas!
        return onNetworkError(); // Asumiendo que onNetworkError() ya devuelve Promise<IHttpResponse<any>>
      }

      // Los 401s son manejados por el interceptor global en boot/axios.ts,
      // así que aquí solo devolvemos el error de la API si no es un 401.
      // Si el interceptor redirige, esta parte del código no se ejecutará.
      if (err.response?.status === 404) {
        // Similar a onNetworkError(), si onNotFound() devuelve Promise, está bien.
        // Si devuelve IHttpResponse, ¡necesitas Promise.resolve() aquí!
        return onNotFound(err.response); // Asumiendo que onNotFound() ya devuelve Promise<IHttpResponse<any>>
      }

      // Si hay una respuesta, pero no es 401/404 y es un error de API
      if (err.response) {
        return Promise.resolve(errorResponse); // ¡Aquí la corrección!
      }

      // Otros errores de Axios (ej. cancelación si no se maneja con AbortController.signal)
      if (err.message === 'Solicitud cancelada.') {
        return Promise.resolve({
          // ¡Aquí la corrección!
          ...defaultResponse,
          message: err.message,
          responseCode: 'IKCANC',
        });
      }

      // Para errores no manejados por status específicos o network error
      return Promise.resolve({
        // ¡Aquí la corrección!
        ...defaultResponse,
        message: err.message || defaultResponse.message,
      });
    }

    // Si no es un AxiosError, devuelve la defaultResponse envuelta en una Promesa
    return Promise.resolve(defaultResponse); // ¡Aquí la corrección!
  };

  // Modificado: ahora devuelve una Promesa que resuelve a IHttpResponse<any>
  const onNetworkError = (): Promise<IHttpResponse<any>> =>
    Promise.resolve({
      responseCode: 'IKERR',
      responseAction: '',
      success: false,
      data: [],
      message: 'Error de red, verifique su conexión a internet.',
      otherMessage: '',
      otherData: [],
    });

  // onUnauthorized se mantiene para consistencia, pero su lógica de redirección
  // está en el interceptor global. Aquí solo formatea la respuesta de error.
  const onUnauthorized = (response: AxiosResponse<any>): IHttpResponse<any> => ({
    responseCode: 'IKERR',
    responseAction: '',
    success: false,
    data: [],
    message: response.data?.message ?? 'Recurso no autorizado',
    otherMessage: '',
    otherData: [],
  });

  // Modificado: ahora devuelve una Promesa que resuelve a IHttpResponse<any>
  const onNotFound = (response: AxiosResponse<any>): Promise<IHttpResponse<any>> =>
    Promise.resolve({
      responseCode: 'IKERR',
      responseAction: '',
      success: false,
      data: [],
      message: response.data?.message ?? 'Recurso no encontrado',
      otherMessage: '',
      otherData: [],
    });
  const downloadResource = async (
    response: AxiosResponse,
    filename: string,
    downloadJson: boolean,
    notificationId: string, // Recibe el ID de la notificación a actualizar
  ): Promise<IHttpResponse<any>> => {
    const contentType = response.headers['content-type'];
    const finalNotification = activeDownloadNotifications.get(notificationId);

    // Si la respuesta no es válida o el status no es 2xx
    if (!response || response.status < 200 || response.status >= 300) {
      if (finalNotification) {
        finalNotification({
          icon: 'mdi-download-off',
          color: 'red',
          message: 'No se pudo descargar el recurso específico',
          position: 'bottom-right',
          timeout: 2500,
        });
        activeDownloadNotifications.delete(notificationId);
      }
      return {
        responseCode: 'IKERR',
        responseAction: '',
        success: false,
        data: [],
        message: 'No se pudo descargar el recurso específico',
        otherMessage: '',
        otherData: [],
      };
    }

    if (contentType?.includes('application/json') && !downloadJson) {
      // Intenta leer el blob como texto para ver si es un JSON de error
      try {
        const text = await new Blob([response.data]).text();
        const parsed: IHttpResponse<any> = JSON.parse(text);

        if (!parsed.success) {
          // Si el JSON indica un error
          if (finalNotification) {
            finalNotification({
              icon: 'mdi-download-off',
              color: 'red',
              message: parsed.message || 'Fallo en la descarga (error de API)',
              position: 'bottom-right',
              timeout: 2500,
            });
            activeDownloadNotifications.delete(notificationId);
          }
          return parsed; // Retorna la respuesta de error de la API
        }
      } catch (jsonError) {
        // No era un JSON de error, o el JSON es inválido, procede como binario
        console.warn(
          'Expected JSON response for download was not a valid error object, proceeding with binary download.',
          jsonError,
        );
      }
    }

    // Procede con la descarga binaria
    const blob = new Blob([response.data], { type: contentType ?? 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    if (finalNotification) {
      finalNotification({
        icon: 'mdi-check-circle',
        spinner: false,
        message: '¡Descarga completa!',
        color: 'primary',
        position: 'bottom-right',
        timeout: 2500,
      });
      activeDownloadNotifications.delete(notificationId);
    }

    return {
      responseCode: 'IKSUC',
      responseAction: '',
      success: true,
      data: [], // No hay datos de respuesta en una descarga binaria exitosa
      message: 'Descarga realizada',
      otherMessage: '',
      otherData: [],
    };
  };

  return {
    loading,
    fetchHttpResource,
    cancelRequest,
  };
}
