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

  const [dateFilter, setDateFilter] = useState<{startDate: string, endDate: string}>({ startDate: "", endDate: "" });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchParameter);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchParameter]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    setIsLoadingData(true);
    try {
    const [suppliersRes, paymentsRes, productsRes] = await Promise.all([
        SupplierService.getAll({ limit: "100", active: "true" }), 
        PayMethodService.getAll({ limit: "100", active: "true" }),
        ProductService.getAll({ limit: "100", active: "true" }),
      ]);
      
      setSuppliers(
        suppliersRes.data.data.map((s: any) => ({
          id: s.supplierId,
          name: s.companyName,
        }))
      );
      
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

  const fetchPurchaseHistory = useCallback(async (page: number = 1, param: string = "", dates?: {startDate: string, endDate: string}) => {
    setIsLoadingData(true);
    setError(null);
    try {
      const queryParams: any = { page, limit: 5, param };
      if (dates?.startDate && dates?.endDate) {
        queryParams.startDate = dates.startDate;
        queryParams.endDate = dates.endDate;
      }
      
      const response = await PurchaseService.getAll(queryParams);
      const rawData: PurchaseApi[] = response.result?.data || [];
      
      setPurchasesHistory(rawData);
      setTotalPages(response.result?.meta?.totalPages || 1);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
         
          setPurchasesHistory([]);
          setTotalPages(1);
        } else {
          console.error("Error cargando historial de compras:", err);
          setError(err.response?.data?.message || "Ocurrió un error.");
        }
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseHistory(currentPage, debouncedSearch, dateFilter);
  }, [fetchPurchaseHistory, currentPage, debouncedSearch, dateFilter]);

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
    fetchDependencies,
      setDateFilter
  };
};