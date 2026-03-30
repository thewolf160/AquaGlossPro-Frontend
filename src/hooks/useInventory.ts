import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ProductService } from "../services/inventory.services";
import {
  type Product,
  type ProductsData,
  type NewProductForm,
  InitialNewProductForm,
  InitialProduct,
  InitialProductsData,
} from "../types/inventory.types";
import { mapProductsFromApi } from "../utils/inventory.utils";

export const useInventory = () => {
  const [productsData, setProductsData] = useState<ProductsData>(InitialProductsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [currentProduct, setCurrentProduct] = useState<Product>(InitialProduct);
  const [editProductState, setEditProductState] = useState<Product & { error?: boolean; errorMsg?: string }>(InitialProduct);
  const [changedFields, setChangedFields] = useState<Partial<Product>>({});
  const [newProductForm, setNewProductForm] = useState<NewProductForm>(InitialNewProductForm);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const getProducts = async (page: number = 1, currentSearch: string = "") => {
    setIsLoading(true);
    try {
      const response = await ProductService.getAll({
        page: page.toString(),
        param: currentSearch,
      });

      const data = mapProductsFromApi(response.data.data);

      setProductsData((prev) => ({
        ...prev,
        data: data,
        totalProducts: response.data.meta.totalItems,
      }));

      if (response.data.meta.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      }

      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchParameter);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchParameter]);

  useEffect(() => {
    if (isFirstRender.current) {
      getProducts(currentPage, debouncedSearch);
      isFirstRender.current = false;
      return;
    }
    getProducts(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);


  const deleteProduct = async (id: string | number) => {
    setIsSubmitting(true);
    try {
      await ProductService.delete(id);
      await getProducts(currentPage, debouncedSearch);
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerProduct = async () => {
    setIsSubmitting(true);
    
    if (
      !newProductForm.form.name || 
      !newProductForm.form.categoryId || 
      !newProductForm.form.unitType || 
      newProductForm.form.unitCostLiter === "" || 
      newProductForm.form.minStock === ""
    ) {
      setNewProductForm((prev) => ({ ...prev, error: true, errorMsg: "Todos los campos obligatorios deben estar llenos" }));
      setIsSubmitting(false);
      return;
    }

    try {
      await ProductService.new({
        name: newProductForm.form.name,
        categoryId: Number(newProductForm.form.categoryId),
        unitType: newProductForm.form.unitType,
        unitCostLiter: Number(newProductForm.form.unitCostLiter),
        currentStock: Number(newProductForm.form.currentStock) || 0,
        minStock: Number(newProductForm.form.minStock),
        active: true 
      });
      getProducts(currentPage, debouncedSearch);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNewProductForm((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const editProduct = async () => {
    setIsSubmitting(true);
    
    if (Object.keys(changedFields).length === 0) {
      setEditProductState((prev) => ({ ...prev, error: true, errorMsg: "No se han detectado cambios" }));
      setIsSubmitting(false);
      return false;
    }

    try {
      const formattedChanges = { ...changedFields };
      if (formattedChanges.categoryId) formattedChanges.categoryId = Number(formattedChanges.categoryId);
      if (formattedChanges.unitCostLiter) formattedChanges.unitCostLiter = Number(formattedChanges.unitCostLiter);
      if (formattedChanges.currentStock) formattedChanges.currentStock = Number(formattedChanges.currentStock);
      if (formattedChanges.minStock) formattedChanges.minStock = Number(formattedChanges.minStock);

      await ProductService.edit(String(editProductState.id), formattedChanges);
      getProducts(currentPage, debouncedSearch);
      
      setChangedFields({});
      setEditProductState((prev) => ({ ...prev, error: false, errorMsg: "" }));
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEditProductState((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditProductState((prev) => ({ ...prev, [name]: value, error: false, errorMsg: "" }));
    setChangedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProductForm((prev) => ({ ...prev, form: { ...prev.form, [name]: value }, error: false, errorMsg: "" }));
  };

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1); 
  };

  return {
    productsData,
    isLoading,
    isSubmitting,
    currentProduct,
    setCurrentProduct,
    editProductState,
    setEditProductState,
    handleEditChange,
    deleteProduct,
    changedFields,
    newProductForm,
    setNewProductForm,
    handleChange,
    registerProduct,
    successMessage,
    setSuccessMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    editProduct,
    handleSearchChange,
    searchParameter,
  };
};