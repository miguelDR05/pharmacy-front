// src/types/ComboDataKeys.ts
// Define un tipo de unión para las claves de los combos almacenados en el store.
// Esto proporciona seguridad de tipos y autocompletado al acceder a los combos.

export type ComboDataKey =
  | 'categories'
  | 'labs'
  | 'productTypes'
  | 'productPresentations'
  | 'storageConditions'
  | 'documentTypes'
  | 'clients'
  | 'suppliers'
  | 'purchaseDocumentTypes'
  | 'products';
// Puedes añadir más claves aquí a medida que agregues nuevos combos al store.
