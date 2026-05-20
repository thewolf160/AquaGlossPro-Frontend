import type { Item } from "./models";

export interface CategoryApi {
  categoryId: number;
  name: string;
  type: string;
  description: string | null;
  active: boolean;
}

export interface ServiceApi {
  serviceId: number;
  name: string;
  comissionPercentage: number;
  active: boolean;
  category: CategoryApi;
}

export interface TypeVehicleApi {
  typeVehicleId: number;
  name: string;
}

export interface ServicePriceApi {
  serviceTypeVehicleId: number;
  serviceId: number;
  typeVehicleId: number;
  price: string | number;
  active: boolean;
}

export interface CreateServicePayload {
  name: string;
  categoryId: number;
  comissionPercentage: number;
}

export interface CreateServicePricePayload {
  serviceId: number;
  typeVehicleId: number;
  price: number;
}

export interface UpdateServicePricePayload {
  price: number;
}

export interface CatalogServicePrice {
  relationId: number | null;
  typeVehicleId: number;
  typeVehicleName: string;
  price: number | null;
}

export interface CatalogService extends Item {
  id: number;
  name: string;
  category: string;
  comissionPercentage: number;
  prices: CatalogServicePrice[];
}

export interface ServiceFormState {
  name: string;
  categoryId: number | string;
  comissionPercentage: number | string;
}

// export interface ComboServiceRelationApi {
//   servicesTypeVehicle: {
//     service: { serviceId: number; name: string; };
//     typeVehicle: { typeVehicleId: number; name: string; };
//   };
// }

export interface ComboServiceRelationApi {
  comboServiceId: number;
  comboId: number;
  serviceId: number;
  active?: boolean;
  service: {
    serviceId: number;
    name: string;
  };
}

export interface ComboApi {
  comboId: number;
  name: string;
  discountPercentage: string | number;
  isPromotion: boolean;
  expirationDate: string | null;
  active: boolean;
  combosServices?: ComboServiceRelationApi[];
}

export interface CreateComboPayload {
  name: string;
  discountPercentage: number;
  isPromotion: boolean;
  expirationDate?: string | null;
  serviceIds: number[];
}

export interface ComboFormState {
  name: string;
  discountPercentage: string;
  isPromotion: boolean;
  expirationDate: string;
  selectedServiceIds: number[];
}
