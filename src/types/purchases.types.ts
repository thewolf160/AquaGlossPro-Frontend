export interface PurchaseItemPayload {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchasePayload {
  supplierId: number;
  paymentMethodId: number;
  invoiceNumber: string;
  items: PurchaseItemPayload[];
}

export interface Supplier {
  id: number;
  name: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
}