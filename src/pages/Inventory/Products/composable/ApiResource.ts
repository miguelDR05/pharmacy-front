// src/api-resource/ApplicantObservationsApiResources.ts
// No necesita cambios, ya que aquí solo defines las opciones, no las consumes.
// Solo asegurarte de que tus 'paths' estén correctos con respecto a la baseURL de `api`.
// Por ejemplo, si api.baseURL es `https://your-api.com/api/v1`,
// entonces path: '/yocontrato/web/aplicant-observations' resultará en
// `https://your-api.com/api/v1/yocontrato/web/aplicant-observations`
import { HttpMethods, IHttpResourceOption } from '@composables/useFetchHttp';

type KeyResource =
  | 'createProduct'
  | 'updateProduct'
  | 'deleteProduct'
  | 'showProduct'
  | 'allProduct';

const resources: Record<KeyResource, IHttpResourceOption> = {
  createProduct: <IHttpResourceOption>{
    path: '/product',
    method: HttpMethods.Post,
  },
  updateProduct: <IHttpResourceOption>{
    path: '/product',
    method: HttpMethods.Put,
  },
  deleteProduct: <IHttpResourceOption>{
    path: '/product',
    method: HttpMethods.Patch,
  },
  showProduct: <IHttpResourceOption>{
    path: '/product',
    method: HttpMethods.Get,
  },
  allProduct: <IHttpResourceOption>{
    path: '/product',
    method: HttpMethods.Get,
  },
};

export { resources };
