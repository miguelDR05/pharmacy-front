export interface IComboItem {
  label: string;
  value: any; // El valor puede ser number, string, etc., dependiendo del ID
  [key: string]: any; // Permite propiedades adicionales de forma opcional
}
