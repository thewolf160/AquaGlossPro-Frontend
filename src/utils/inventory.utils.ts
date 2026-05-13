import type { Product, ProductApi, NewProductForm } from "../types/inventory.types";

export const mapProductsFromApi = (apiData: ProductApi[]): Product[] => {
  return apiData.map((item) => ({
    id: item.productId, 
    categoryId: item.category?.categoryId || null,
    categoryName: item.category?.name || "Sin categoría",
    name: item.name,
    unitType: item.unitType || "",
    unitCostLiter: item.unitCostLiter !== null ? Number(item.unitCostLiter) : "",
    currentStock: item.currentStock !== null ? Number(item.currentStock) : "",
    minStock: item.minStock !== null ? Number(item.minStock) : "",
    active: item.active,
  }));
};

export const isProductFormDirty = (
  currentForm: NewProductForm["form"],
  initialForm: NewProductForm["form"]
): boolean => {
  return (
    currentForm.name !== initialForm.name ||
    currentForm.categoryId !== initialForm.categoryId ||
    currentForm.unitType !== initialForm.unitType ||
    currentForm.minStock !== initialForm.minStock
  );
};