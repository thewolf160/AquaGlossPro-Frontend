import { useEffect, useState } from "react";
import { PermissionService } from "../services/permissions.services";
import type { Permission, PermissionFilters } from "../types/permissions.types";

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPermissions = async (filters?: PermissionFilters) => {
    setIsLoading(true);
    try {
      const response = await PermissionService.getAll({
        ...filters,
        limit: "100",
      });

      const rawData = response.data?.data || response.data || [];
      setPermissions(rawData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los permisos:", err);
      setError("No se pudieron cargar los permisos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getPermissions({ active: "true" });
  }, []);

  return {
    permissions,
    isLoading,
    error,
    getPermissions,
  };
}
