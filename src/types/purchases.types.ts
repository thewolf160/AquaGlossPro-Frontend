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
export type PurchaseStatus = 'C' | 'W' | 'P';

export interface PurchaseApi {
  purchaseId: number;
  invoiceNumber: string;
  totalAmount: string | number;
  purchaseStatus: PurchaseStatus;
  purchaseDate: string;
  supplier?: { companyName: string; rif?: string } | string;
  paymentMethod?: { name: string } | string;
  items?: any[]; 
}