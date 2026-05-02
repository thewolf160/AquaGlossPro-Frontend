import { useEffect, useRef, useState } from "react";
import {
  InitialNewCategorie,
  InitialCategoriesData,
  type CategoriesData,
  type NewCategorie,
  type CategoriesApi,
  type Categorie,
  InitialCategorie,
  type InactiveCategoriesData,
  InitialInactiveCategoriesData,
} from "../types/categories.types";
import { CategorieService } from "../services/categories.services";
import axios from "axios";

export const useCategories = () => {
  const [categoriesData, setCategoriesData] = useState<CategoriesData>(
    InitialCategoriesData,
  );

  const [inactiveCategoriesData, setInactiveCategoriesData] =
    useState<InactiveCategoriesData>(InitialInactiveCategoriesData);

  const [newCategorieForm, setNewCategorieForm] =
    useState<NewCategorie>(InitialNewCategorie);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentCategorie, setCurrentCategorie] =
    useState<Categorie>(InitialCategorie);
  const [changedFields, setChangedFields] = useState<Partial<Categorie>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await CategorieService.getAll({
        active: "true",
        page: "1",
      });
      const data = response.data.data;

      const formattedData = data.map((categorie: CategoriesApi | any) => ({
        id: categorie.categoryId || categorie.id,
        name: categorie.name,
        description: categorie.description,
        type: typeof categorie.type === 'string' ? categorie.type.toLowerCase() : categorie.type,
      }));

      setCategoriesData((prev) => ({
        ...prev,
        data: formattedData,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInactiveCategories = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await CategorieService.getAll({
        active: "false",
        page: page.toString(),
        limit: "3",
      });

      const data = response.data.data;

      const formattedData = data.map((categorie: CategoriesApi | any) => ({
        id: categorie.categoryId || categorie.id,
        name: categorie.name,
        description: categorie.description,
        type: typeof categorie.type === 'string' ? categorie.type.toLowerCase() : categorie.type,
      }));

      console.log(formattedData);

      setInactiveCategoriesData((prev) => ({
        ...prev,
        data: formattedData,
      }));

      if (response.data.meta?.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      }
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getInactiveCategories(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getInactiveCategories(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  const registerCategorie = async () => {
    setIsSubmitting(true);
    setError({ active: false, msg: "" });

    if (
      !newCategorieForm.name ||
      !newCategorieForm.description ||
      !newCategorieForm.type
    ) {
      setError({ active: true, msg: "Todos los campos son obligatorios" });
      setIsSubmitting(false);
      return false;
    }

    try {
      await CategorieService.new({
        name: newCategorieForm.name,
        description: newCategorieForm.description,
        type: newCategorieForm.type,
      });
      getCategories();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({
          active: true,
          msg: error.response?.data.message || "Algo salió mal",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategorie = async () => {
    setIsSubmitting(true);
    try {
      await CategorieService.delete(String(currentCategorie.id));
      getCategories();
      getInactiveCategories();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCategorie = async () => {
    setError({ active: false, msg: "" });

    if (Object.keys(changedFields).length === 0) {
      setError({ active: true, msg: "No se han detectado cambios" });
      return false;
    }

    setIsSubmitting(true);

    try {
      await CategorieService.edit(String(currentCategorie.id), changedFields);
      await getCategories();
      setChangedFields({});
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({
          active: true,
          msg: error.response?.data.message || "Error al editar",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreCategorie = async () => {
    setIsSubmitting(true);
    try {
      await CategorieService.restore(String(currentCategorie.id));
      getCategories();
      getInactiveCategories();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setNewCategorieForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setChangedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    categoriesData,
    handleChange,
    registerCategorie,
    isSubmitting,
    isLoading,
    setNewCategorieForm,
    newCategorieForm,
    successMessage,
    setSuccessMessage,
    error,
    setError,
    deleteCategorie,
    currentCategorie,
    setCurrentCategorie,
    handleEditChange,
    changedFields,
    editCategorie,
    setChangedFields,
    inactiveCategoriesData,
    restoreCategorie,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
