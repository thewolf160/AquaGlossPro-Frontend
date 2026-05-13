import { useState, useEffect, useCallback } from "react";
import { UserService } from "../services/users.services";
import type { User, UserFilters, UserPayload } from "../types/users.types";

export function useUsers() {
  const [usersData, setUsersData] = useState<{
    data: User[];
    totals: { general: number; active: number; inactive: number };
    totalPages: number;
  }>({
    data: [],
    totals: { general: 0, active: 0, inactive: 0 },
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isActiveTab, setIsActiveTab] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = "10";

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: UserFilters = {
        active: String(isActiveTab),
        page: String(currentPage),
        limit: itemsPerPage,
      };

      const response = await UserService.getAll(filters);
      const resData = response.data;

      setUsersData({
        data: resData.data || [],
        totals: resData.meta?.totals || { general: 0, active: 0, inactive: 0 },
        totalPages: resData.meta?.totalPages || 1,
      });
    } catch (err: any) {
      console.error("Error al cargar usuarios:", err);
      setError(
        err.response?.data?.message || "No se pudieron cargar los usuarios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isActiveTab, currentPage]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const createUser = async (payload: UserPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await UserService.create(payload);
      showSuccess("Usuario creado exitosamente");
      await fetchUsers();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear el usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: number, payload: Partial<UserPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      await UserService.update(id, payload);
      showSuccess("Usuario actualizado correctamente");
      await fetchUsers();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar el usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await UserService.delete(id);
      showSuccess("Usuario desactivado correctamente");
      await fetchUsers();
      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "No se puede eliminar este usuario",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await UserService.restore(id);
      showSuccess("Usuario restaurado con éxito");
      await fetchUsers();
      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "No se puede restaurar este usuario",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    usersData,
    isLoading,
    error,
    setError,
    successMsg,
    isActiveTab,
    setIsActiveTab,
    currentPage,
    setCurrentPage,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
  };
}
