import type { Item } from "./models";

export type UnitType = 'L' | 'G' | 'U';
export type CategoryType = 'P' | 'S';

export interface InventoryCategory {
  id: number;
  name: string;
  type: CategoryType;
}

export interface Product extends Item {
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unitType: UnitType;
  price: number;
}