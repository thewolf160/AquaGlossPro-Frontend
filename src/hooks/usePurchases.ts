import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PurchaseService } from "../services/purchases.services";
import { SupplierService } from "../services/supliers.services";
import { PayMethodService } from "../services/pays.services";
import { ProductService } from "../services/inventory.services";

import type { CreatePurchasePayload, PurchaseApi, PurchaseStatus } from "../types/purchases.types";
import type { Supplier, PaymentMethod } from "../types/purchases.types";
import type { Product } from "../types/inventory.types";

export const usePurchases = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [purchasesHistory, setPurchasesHistory] = useState<PurchaseApi[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchParameter);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchParameter]);

  const fetchDependencies = async () => {
    setIsLoadingData(true);
    try {
      const [suppliersRes, paymentsRes, productsRes] = await Promise.all([
        SupplierService.getAll(),
        PayMethodService.getAll({ limit: "100", active: "true" }),
        ProductService.getAll({ limit: "100", active: "true" }),
      ]);
      
      setSuppliers(suppliersRes);
      
      setPaymentMethods(
        paymentsRes.data.data.map((pm: { paymentMethodId: number; name: string }) => ({
          id: pm.paymentMethodId,
          name: pm.name,
        }))
      );
      
      setProducts(
        productsRes.products.data.map((p: Omit<Product, "id"> & { productId: number }) => ({
          ...p,
          id: p.productId,
        }))
      );
    } catch (err) {
      console.error("Error cargando dependencias:", err);
      setError("No se pudieron cargar las listas de dependencias.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchPurchaseHistory = useCallback(async (page: number = 1, param: string = "") => {
    setIsLoadingData(true);
    try {
      const response = await PurchaseService.getAll({ page, limit: 5, param });
      
      const rawData: PurchaseApi[] = response.result?.data || [];
      const sortedData = rawData.sort((a: PurchaseApi, b: PurchaseApi) => b.purchaseId - a.purchaseId);
      
      setPurchasesHistory(sortedData);
      setTotalPages(response.result?.meta?.totalPages || 1);
    } catch (err) {
      console.error("Error cargando historial de compras:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchPurchaseHistory(currentPage, debouncedSearch);
  }, [fetchPurchaseHistory, currentPage, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1); 
  };

  const registerPurchase = async (payload: CreatePurchasePayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await PurchaseService.create(payload);
      setSuccessMessage("Compra registrada exitosamente.");
      await fetchPurchaseHistory(currentPage, debouncedSearch);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al registrar la compra.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeStatus = async (id: number, newStatus: PurchaseStatus) => {
    setIsSubmitting(true);
    try {
      await PurchaseService.updateStatus(id, newStatus);
      setSuccessMessage(`Operación realizada con éxito.`);
      await fetchPurchaseHistory(currentPage, debouncedSearch);
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al actualizar estado.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isLoadingData,
    error,
    successMessage,
    suppliers,
    paymentMethods,
    products,
    purchasesHistory,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    handleSearchChange,
    setSuccessMessage,
    setError,
    registerPurchase,
    changeStatus,
  };
};