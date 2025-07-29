export interface Product {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  lab_id: number;
  lab_name?: string;
  type_id: number;
  type_name?: string;
  presentation_id: number;
  presentation_name?: string;
  stock: number;
  price: number;
  image?: string;
  code: string;
  pharmaceutical_form: string;
  created_at?: string;
  updated_at?: string;
}
