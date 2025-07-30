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
    method: HttpMethods.Post,
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
