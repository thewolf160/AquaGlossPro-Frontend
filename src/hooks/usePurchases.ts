import { useState, useEffect } from "react";
import axios from "axios";
import { PurchaseService } from "../services/purchases.services";
import { SupplierService } from "../services/supliers.services";
import { PaymentMethodService } from "../services/payment-methods.services";
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
        PaymentMethodService.getAll(),
        ProductService.getAll({ limit: "100", active: "true" }) 
      ]);

      setSuppliers(suppliersRes);
      setPaymentMethods(paymentsRes);
setProducts(productsRes.products.data.map((p: any) => ({
           ...p,           
         id: p.productId 
})));    } catch (err) {
      console.error("Error cargando dependencias:", err);
      setError("No se pudieron cargar las listas de proveedores o productos.");
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
        setError(err.response?.data?.message || "Error al registrar la compra.");
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