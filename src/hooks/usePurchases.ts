import { useState, useEffect } from "react";
import axios from "axios";
import { PurchaseService } from "../services/purchases.services";
import { SupplierService } from "../services/supliers.services";
import { PayMethodService } from "../services/pays.services";
import { ProductService } from "../services/inventory.services";

import type { CreatePurchasePayload } from "../types/purchases.types";
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

  useEffect(() => {
    fetchDependencies();
  }, []);

  const registerPurchase = async (payload: CreatePurchasePayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await PurchaseService.create(payload);
      setSuccessMessage("Compra registrada exitosamente.");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Error al registrar la compra.",
        );
      } else {
        setError("Ocurrió un error inesperado.");
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
    setSuccessMessage,
    setError,
    registerPurchase,
  };
};
