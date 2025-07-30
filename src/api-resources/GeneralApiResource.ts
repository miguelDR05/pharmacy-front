import { HttpMethods, IHttpResourceOption } from '@composables/useFetchHttp';

// Define un tipo de unión para todas las claves de recursos disponibles.
type KeyResource =
  // Categorías (ya existentes, solo para referencia)
  | 'createCategory'
  | 'updateCategory'
  | 'deleteCategory'
  | 'showCategory'
  | 'allCategories'
  | 'categoriesCombo'
  // Productos (ya existentes, solo para referencia)
  | 'createProduct'
  | 'updateProduct'
  | 'deleteProduct'
  | 'showProduct'
  | 'allProducts'
  | 'productsCombo' // <--- AÑADIDO AL TIPO
  // Laboratorios (ya existentes, solo para referencia)
  | 'createLab'
  | 'updateLab'
  | 'deleteLab'
  | 'showLab'
  | 'allLabs'
  | 'labsCombo'
  // Tipos de Producto (ya existentes, solo para referencia)
  | 'createProductType'
  | 'updateProductType'
  | 'deleteProductType'
  | 'showProductType'
  | 'allProductTypes'
  | 'productTypesCombo'
  // Presentaciones de Producto (ya existentes, solo para referencia)
  | 'createProductPresentation'
  | 'updateProductPresentation'
  | 'deleteProductPresentation'
  | 'showProductPresentation'
  | 'allProductPresentations'
  | 'productPresentationsCombo'
  // Tipos de Documento (Nuevos)
  | 'createDocumentType'
  | 'updateDocumentType'
  | 'deleteDocumentType'
  | 'showDocumentType'
  | 'allDocumentTypes'
  | 'documentTypesCombo'
  // Clientes (Nuevos)
  | 'createClient'
  | 'updateClient'
  | 'deleteClient'
  | 'showClient'
  | 'allClients'
  | 'clientsCombo'
  // Proveedores (Nuevos)
  | 'createSupplier'
  | 'updateSupplier'
  | 'deleteSupplier'
  | 'showSupplier'
  | 'allSuppliers'
  | 'suppliersCombo'
  // Tipos de Documento de Compra (Nuevos)
  | 'createPurchaseDocumentType'
  | 'updatePurchaseDocumentType'
  | 'deletePurchaseDocumentType'
  | 'showPurchaseDocumentType'
  | 'allPurchaseDocumentTypes'
  | 'purchaseDocumentTypesCombo'
  // Compras (Nuevos)
  | 'createPurchase'
  | 'updatePurchase'
  | 'deletePurchase'
  | 'showPurchase'
  | 'allPurchases'
  // Ventas (Nuevos)
  | 'createSale'
  | 'updateSale'
  | 'deleteSale'
  | 'showSale'
  | 'allSales'
  | 'createStorageCondition'
  | 'updateStorageCondition'
  | 'deleteStorageCondition'
  | 'showStorageCondition'
  | 'allStorageConditions'
  | 'storageConditionsCombo'; // Esta ya estaba, pero la incluyo para completitud
// Define el objeto `resources` que mapea las claves a las opciones de recursos HTTP.
const resources: Record<KeyResource, IHttpResourceOption> = {
  // --- Categorías ---
  createCategory: {
    path: '/category',
    method: HttpMethods.Post,
  },
  updateCategory: {
    path: '/category', // El ID se añade vía paramsRoute
    method: HttpMethods.Put, // Laravel usa PUT/PATCH para update en apiResource
  },
  deleteCategory: {
    path: '/category', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showCategory: {
    path: '/category', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allCategories: {
    path: '/category',
    method: HttpMethods.Get,
  },
  categoriesCombo: {
    path: '/categories-combo',
    method: HttpMethods.Get,
  },

  // --- Productos ---
  createProduct: {
    path: '/product',
    method: HttpMethods.Post,
  },
  updateProduct: {
    path: '/product', // El ID se añade vía paramsRoute
    method: HttpMethods.Post, // Usas POST con _method=PUT para FormData
  },
  deleteProduct: {
    path: '/product', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showProduct: {
    path: '/product', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allProducts: {
    path: '/product',
    method: HttpMethods.Get,
  },
  // --- CORRECCIÓN AQUÍ: Añadir productsCombo ---
  productsCombo: {
    path: '/products-combo', // Ruta hipotética para el combo de productos
    method: HttpMethods.Get,
  },

  // --- Laboratorios ---
  createLab: {
    path: '/lab',
    method: HttpMethods.Post,
  },
  updateLab: {
    path: '/lab', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteLab: {
    path: '/lab', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showLab: {
    path: '/lab', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allLabs: {
    path: '/lab',
    method: HttpMethods.Get,
  },
  labsCombo: {
    path: '/labs-combo',
    method: HttpMethods.Get,
  },

  // --- Tipos de Producto ---
  createProductType: {
    path: '/product-type',
    method: HttpMethods.Post,
  },
  updateProductType: {
    path: '/product-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteProductType: {
    path: '/product-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showProductType: {
    path: '/product-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allProductTypes: {
    path: '/product-type',
    method: HttpMethods.Get,
  },
  productTypesCombo: {
    path: '/product-types-combo',
    method: HttpMethods.Get,
  },

  // --- Presentaciones de Producto ---
  createProductPresentation: {
    path: '/product-presentation',
    method: HttpMethods.Post,
  },
  updateProductPresentation: {
    path: '/product-presentation', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteProductPresentation: {
    path: '/product-presentation', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showProductPresentation: {
    path: '/product-presentation', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allProductPresentations: {
    path: '/product-presentation',
    method: HttpMethods.Get,
  },
  productPresentationsCombo: {
    path: '/product-presentations-combo',
    method: HttpMethods.Get,
  },

  // --- Tipos de Documento ---
  createDocumentType: {
    path: '/document-type',
    method: HttpMethods.Post,
  },
  updateDocumentType: {
    path: '/document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteDocumentType: {
    path: '/document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showDocumentType: {
    path: '/document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allDocumentTypes: {
    path: '/document-type',
    method: HttpMethods.Get,
  },
  documentTypesCombo: {
    path: '/document-types-combo',
    method: HttpMethods.Get,
  },

  // --- Clientes ---
  createClient: {
    path: '/client',
    method: HttpMethods.Post,
  },
  updateClient: {
    path: '/client', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteClient: {
    path: '/client', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showClient: {
    path: '/client', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allClients: {
    path: '/client',
    method: HttpMethods.Get,
  },
  clientsCombo: {
    path: '/clients-combo',
    method: HttpMethods.Get,
  },

  // --- Proveedores ---
  createSupplier: {
    path: '/supplier',
    method: HttpMethods.Post,
  },
  updateSupplier: {
    path: '/supplier', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteSupplier: {
    path: '/supplier', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showSupplier: {
    path: '/supplier', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allSuppliers: {
    path: '/supplier',
    method: HttpMethods.Get,
  },
  suppliersCombo: {
    path: '/suppliers-combo',
    method: HttpMethods.Get,
  },

  // --- Tipos de Documento de Compra ---
  createPurchaseDocumentType: {
    path: '/purchase-document-type',
    method: HttpMethods.Post,
  },
  updatePurchaseDocumentType: {
    path: '/purchase-document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deletePurchaseDocumentType: {
    path: '/purchase-document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showPurchaseDocumentType: {
    path: '/purchase-document-type', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allPurchaseDocumentTypes: {
    path: '/purchase-document-type',
    method: HttpMethods.Get,
  },
  purchaseDocumentTypesCombo: {
    path: '/purchase-document-types-combo',
    method: HttpMethods.Get,
  },

  // --- Compras ---
  createPurchase: {
    path: '/purchase',
    method: HttpMethods.Post,
  },
  updatePurchase: {
    path: '/purchase', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deletePurchase: {
    path: '/purchase', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showPurchase: {
    path: '/purchase', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allPurchases: {
    path: '/purchase',
    method: HttpMethods.Get,
  },

  // --- Ventas ---
  createSale: {
    path: '/sale',
    method: HttpMethods.Post,
  },
  updateSale: {
    path: '/sale', // El ID se añade vía paramsRoute
    method: HttpMethods.Put,
  },
  deleteSale: {
    path: '/sale', // El ID se añade vía paramsRoute
    method: HttpMethods.Delete,
  },
  showSale: {
    path: '/sale', // El ID se añade vía paramsRoute
    method: HttpMethods.Get,
  },
  allSales: {
    path: '/sale',
    method: HttpMethods.Get,
  },
  // --- Condiciones de Almacenamiento ---
  createStorageCondition: {
    path: '/storage-condition',
    method: HttpMethods.Post,
  },
  updateStorageCondition: {
    path: '/storage-condition',
    method: HttpMethods.Put,
  },
  deleteStorageCondition: {
    path: '/storage-condition',
    method: HttpMethods.Delete,
  },
  showStorageCondition: {
    path: '/storage-condition',
    method: HttpMethods.Get,
  },
  allStorageConditions: {
    path: '/storage-condition',
    method: HttpMethods.Get,
  },
  storageConditionsCombo: {
    path: '/storage-conditions-combo',
    method: HttpMethods.Get,
  },
};

export { resources };
