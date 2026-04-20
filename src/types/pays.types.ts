import type { Item } from "./models";

export interface PayMethod extends Item {
  name: string;
}

export const InitialPayMethod: PayMethod = {
  id: null,
  name: "",
};

export interface NewPayMethod {
  name: string;
}

export const InitialNewPayMethod: NewPayMethod = {
  name: "",
};

export interface PaysMethodsApi {
  paymentMethodId: number;
  name: string;
}

export interface PaysMethodsData {
  data: Item[];
}

export const InitialPaysMethodsData: PaysMethodsData = {
  data: [] as Item[],
};

export interface InactivePaysMethodsData {
  data: Item[];
}

export const InitialInactivePaysMethodsData: InactivePaysMethodsData = {
  data: [] as Item[],
};
