import type { Item } from "./models";

export interface Categorie extends Item {
  name: string;
  description: string;
  type: "s" | "p" | "";
}

export const InitialCategorie: Categorie = {
  id: null,
  name: "",
  description: "",
  type: "",
};

export interface NewCategorie {
  name: string;
  description: string;
  type: "s" | "p" | "";
}

export const InitialNewCategorie: NewCategorie = {
  name: "",
  description: "",
  type: "",
};

export interface CategoriesApi {
  categoryId: number; // o id, usaré categoryId basándome en PaysMethodsApi
  name: string;
  description: string;
  type: "s" | "p";
}

export interface CategoriesData {
  data: Categorie[];
}

export const InitialCategoriesData: CategoriesData = {
  data: [] as Categorie[],
};

export interface InactiveCategoriesData {
  data: Categorie[];
}

export const InitialInactiveCategoriesData: InactiveCategoriesData = {
  data: [] as Categorie[],
};
