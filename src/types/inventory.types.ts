import type { Item } from "./models";

export type UnitType = 'L' | 'G' | 'U';
export type CategoryType = 'P' | 'S';

export interface InventoryCategory {
  categoryId: number;
  name: string;
  type: CategoryType;
  active?: boolean;
}

export interface Product extends Item {
  categoryId: number | null;
  categoryName?: string;
  name: string;
  unitType: UnitType | "";
  unitCostLiter: number | string; 
  currentStock: number | string;
  minStock: number | string;
}

export const InitialProduct: Product = {
  id: null,
  categoryId: null,
  categoryName: "",
  name: "",
  unitType: "",
  unitCostLiter: "",
  currentStock: "",
  minStock: "",
};

export interface NewProductForm {
  form: {
    categoryId: number | null;
    name: string;
    unitType: UnitType | "";
    minStock: number | string;
  };
  error: boolean;
  errorMsg: string;
}

export const InitialNewProductForm: NewProductForm = {
  form: {
    categoryId: null,
    name: "",
    unitType: "",
    minStock: "",
  },
  error: false,
  errorMsg: "",
};

export interface ProductsData {
  data: Item[];
  totalProducts: number | null;
  error: boolean;
  errorMsg: string;
}

export const InitialProductsData: ProductsData = {
  data: [] as Item[],
  totalProducts: null,
  error: false,
  errorMsg: "",
};

export interface ProductApi {
  productId: number;
  name: string;
  unitCostLiter: string | number;
  currentStock: string | number;
  minStock: string | number;
  unitType: UnitType | "";
  active: boolean;
  category?: {
    categoryId: number;
    name: string;
    type: CategoryType;
  } | null;
  stockStatus?: string;
}