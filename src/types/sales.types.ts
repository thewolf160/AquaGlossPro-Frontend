export interface NewSale {
  clientId: number | "";
  vehicleId: number | "";
  paymentMethodId: number | "";
  initialState: string;
  discount?: number | "";
  services: {
    employeeId: number | "";
    serviceId: number;
    comboOriginId?: number;
    discount?: number;
    notes?: string;
  }[];
}

export const InitialNewSale: NewSale = {
  clientId: "",
  vehicleId: "",
  paymentMethodId: "",
  initialState: "",
  discount: "",
  services: [],
};
