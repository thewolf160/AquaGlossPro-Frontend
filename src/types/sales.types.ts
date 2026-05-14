export interface NewSale {
  clientId: number | "";
  vehicleId: number | "";
  paymentMethodId: number | "";
  initialState: string;
  services: {
    employeeId: number | "";
    serviceTypeVehicleId: number;
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
  services: [],
};
