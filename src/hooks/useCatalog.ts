import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CatalogServiceApi } from "../services/catalog.services";
import type {
  CatalogService,
  ComboApi,
  CategoryApi,
  TypeVehicleApi,
  ServicePriceApi,
  CatalogServicePrice,
  ServiceFormState,
  CreateServicePayload,
  ServiceApi,
  ComboFormState,
  CreateComboPayload,
} from "../types/catalog.types";

export const useCatalog = () => {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [combos, setCombos] = useState<ComboApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [rawPricesRelations, setRawPricesRelations] = useState<ServicePriceApi[]>([]);
  const [allTypes, setAllTypes] = useState<TypeVehicleApi[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isActiveServices, setIsActiveServices] = useState<boolean>(true);
  const [isActiveCombos, setIsActiveCombos] = useState<boolean>(true);

  const [newServiceForm, setNewServiceForm] = useState<ServiceFormState>({
    name: "",
    categoryId: "",
    comissionPercentage: "",
  });
  const [newComboForm, setNewComboForm] = useState<ComboFormState>({
    name: "",
    discountPercentage: "",
    isPromotion: false,
    selectedServiceIds: [],
  });

  // --- Carga de datos estáticos (solo una vez al montar) ---
  const fetchStaticData = useCallback(async () => {
    const safeFetch = async <T>(
      apiCall: Promise<{ data: { data: T[]; meta?: unknown } }>,
    ) => {
      try {
        return await apiCall;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404)
          return { data: { data: [] as T[], meta: { totalPages: 1 } } };
        throw error;
      }
    };

    try {
      const [categoriesRes, typesRes, pricesRes] = await Promise.all([
        safeFetch<CategoryApi>(
          CatalogServiceApi.getCategories({ active: "true", limit: "100" }),
        ),
        safeFetch<TypeVehicleApi>(
          CatalogServiceApi.getTypesVehicles({ active: "true", limit: "100" }),
        ),
        safeFetch<ServicePriceApi>(
          CatalogServiceApi.getServicesPrices({ active: "true", limit: "100" }),
        ),
      ]);

      const serviceCategories = categoriesRes.data.data.filter(
        (c: CategoryApi) => c.type === "S",
      );
      setCategories(serviceCategories);
      setAllTypes(typesRes.data.data);
      setRawPricesRelations(pricesRes.data.data);
    } catch (error) {
      console.error("Error loading static data:", error);
    }
  }, []);

  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  // --- Carga de servicios paginados (reactiva a filtros) ---
  const fetchServices = useCallback(
    async (param: string = "", page: number = 1, active: boolean = true) => {
      setIsLoading(true);
      try {
        const safeFetch = async <T>(
          apiCall: Promise<{ data: { data: T[]; meta?: unknown } }>,
        ) => {
          try {
            return await apiCall;
          } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404)
              return { data: { data: [] as T[], meta: { totalPages: 1 } } };
            throw error;
          }
        };

        const [servicesRes, combosRes] = await Promise.all([
          safeFetch<ServiceApi>(
            CatalogServiceApi.getServices({
              active: active.toString(),
              limit: "5",
              page: page.toString(),
              param,
            }),
          ),
          safeFetch<ComboApi>(
            CatalogServiceApi.getCombos({
              active: isActiveCombos.toString(),
              limit: "50",
            }),
          ),
        ]);

        // Mapear servicios usando los datos estáticos del closure
        const formattedServices: CatalogService[] = servicesRes.data.data.map(
          (srv: ServiceApi) => {
            const servicePrices: CatalogServicePrice[] = allTypes.map(
              (tv: TypeVehicleApi) => {
                const existingPrice = rawPricesRelations.find(
                  (p: ServicePriceApi) =>
                    p.serviceId === srv.serviceId &&
                    p.typeVehicleId === tv.typeVehicleId,
                );
                return {
                  relationId: existingPrice
                    ? existingPrice.serviceTypeVehicleId
                    : null,
                  typeVehicleId: tv.typeVehicleId,
                  typeVehicleName: tv.name,
                  price: existingPrice ? Number(existingPrice.price) : null,
                };
              },
            );

            return {
              id: srv.serviceId,
              name: srv.name,
              category: srv.category?.name || "Sin Categoría",
              comissionPercentage: srv.comissionPercentage,
              prices: servicePrices,
            };
          },
        );

        setServices(formattedServices);

        setCombos(combosRes.data?.data || []);
        setTotalPages((servicesRes.data as { meta?: { totalPages?: number } })?.meta?.totalPages || 1);
      } catch (error: unknown) {
        console.error("Error in fetchServices:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [allTypes, rawPricesRelations, isActiveCombos],
  );

  // Refetch cuando cambian los datos estáticos también (para que el mapa de precios funcione)
  const fetchData = useCallback(
    async (param: string = "", page: number = 1, active: boolean = true) => {
      await fetchServices(param, page, active);
    },
    [fetchServices],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices(searchTerm, currentPage, isActiveServices);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, isActiveServices, fetchServices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const createService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.createService({
        name: newServiceForm.name,
        categoryId: Number(newServiceForm.categoryId),
        comissionPercentage: Number(newServiceForm.comissionPercentage),
      });
      setNewServiceForm({ name: "", categoryId: "", comissionPercentage: "" });
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al crear servicio:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (id: number) => {
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.deleteService(id);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al eliminar servicio:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreService = async (id: number) => {
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.restoreService(id);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al restaurar servicio:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (
    id: number,
    payload: Partial<CreateServicePayload>,
  ) => {
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.updateService(id, payload);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al actualizar servicio:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveServicePrices = async (
    serviceId: number,
    pricesToSave: CatalogServicePrice[],
  ) => {
    setIsSubmitting(true);
    try {
      const promises = pricesToSave
        .filter(
          (p) =>
            p.price !== null &&
            p.price !== undefined &&
            p.price.toString() !== "",
        )
        .map((p) => {
          if (p.relationId) {
            return CatalogServiceApi.updateServicePrice(p.relationId, {
              price: Number(p.price),
            });
          } else {
            return CatalogServiceApi.createServicePrice({
              serviceId,
              typeVehicleId: p.typeVehicleId,
              price: Number(p.price),
            });
          }
        });
      await Promise.all(promises);
      // Recargar también datos estáticos (precios actualizados)
      await fetchStaticData();
      return true;
    } catch (error: unknown) {
      console.error("Error al guardar tarifas:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComboChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewComboForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleServiceInCombo = (serviceId: number) => {
    setNewComboForm((prev) => {
      const isSelected = prev.selectedServiceIds.includes(serviceId);
      return {
        ...prev,
        selectedServiceIds: isSelected
          ? prev.selectedServiceIds.filter((id) => id !== serviceId)
          : [...prev.selectedServiceIds, serviceId],
      };
    });
  };

  const createCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const relatedTypeIds = rawPricesRelations
        .filter((rel) =>
          newComboForm.selectedServiceIds.includes(rel.serviceId),
        )
        .map((rel) => rel.serviceTypeVehicleId);

      const payload: CreateComboPayload = {
        name: newComboForm.name,
        discountPercentage: Number(newComboForm.discountPercentage),
        isPromotion: newComboForm.isPromotion,
        servicesTypeVehicleIds: relatedTypeIds,
      };

      await CatalogServiceApi.createCombo(payload);
      setNewComboForm({
        name: "",
        discountPercentage: "",
        isPromotion: false,
        selectedServiceIds: [],
      });
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear combo:", error.response?.data?.message);
      } else {
        console.error("Error desconocido al crear combo:", error);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCombo = async (id: number, formData: ComboFormState) => {
    setIsSubmitting(true);
    try {
      const relatedTypeIds = rawPricesRelations
        .filter((rel) => formData.selectedServiceIds.includes(rel.serviceId))
        .map((rel) => rel.serviceTypeVehicleId);

      const payload: Partial<CreateComboPayload> = {
        name: formData.name,
        discountPercentage: Number(formData.discountPercentage),
        isPromotion: formData.isPromotion,
        servicesTypeVehicleIds: relatedTypeIds,
      };

      await CatalogServiceApi.updateCombo(id, payload);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al actualizar combo:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCombo = async (id: number) => {
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.deleteCombo(id);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al eliminar combo:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreCombo = async (id: number) => {
    setIsSubmitting(true);
    try {
      await CatalogServiceApi.restoreCombo(id);
      await fetchData(searchTerm, currentPage, isActiveServices);
      return true;
    } catch (error: unknown) {
      console.error("Error al restaurar combo:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    services,
    combos,
    categories,
    isLoading,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    fetchData,
    newServiceForm,
    handleChange,
    createService,
    deleteService,
    restoreService,
    updateService,
    saveServicePrices,
    isActiveServices,
    setIsActiveServices,
    isActiveCombos,
    setIsActiveCombos,
    newComboForm,
    handleComboChange,
    toggleServiceInCombo,
    createCombo,
    deleteCombo,
    editCombo,
    restoreCombo,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
