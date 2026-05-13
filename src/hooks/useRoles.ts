import { useEffect, useMemo, useState } from "react";
import { RoleService } from "../services/roles.services";
import type { Role, RoleFilters } from "../types/roles.types";

export function useRoles() {
  const [rolesData, setRolesData] = useState<{
    data: Role[];
    totals: { general: number; active: number; inactive: number };
  }>({
    data: [],
    totals: { general: 0, active: 0, inactive: 0 },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isActiveTab, setIsActiveTab] = useState(true);

  const fetchRoles = async (activeStatus?: boolean) => {
    setIsLoading(true);
    const currentStatus =
      activeStatus !== undefined ? activeStatus : isActiveTab;

    try {
      const response = await RoleService.getAll({
        active: String(currentStatus),

        limit: "100",
      });
      setRolesData(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error al obtener el listado de roles:", err);
      setError("No se pudieron cargar los roles desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoles(isActiveTab);
  }, [isActiveTab]);

  // FILTRO

  const filteredRoles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rolesData.data;

    return rolesData.data.filter(
      (role) =>
        String(role.roleId).includes(term) ||
        role.name.toLowerCase().includes(term),
    );
  }, [rolesData.data, searchTerm]);

  const handleCreateComplete = async (
    name: string,
    permissionIds: number[],
  ) => {
    setIsLoading(true);
    setError(null);
    let createdRoleId: number | null = null;

    try {
      console.log("Ejecutando Paso 1: Creando rol básico...");
      const created = await RoleService.create({ name: name.trim() });
      createdRoleId = created.roleId;

      console.log(`Paso 1 exitoso. ID asignado: ${createdRoleId}`);

      if (permissionIds.length > 0) {
        const sanitizedPermissions = [...new Set(permissionIds)].map(Number);

        const payload = {
          roleId: Number(createdRoleId),
          permissions: sanitizedPermissions,
        };

        console.log(
          "Ejecutando Paso 2: Enviando Payload a /role/permissions:",
          payload,
        );

        await RoleService.assignPermissions(payload);
        console.log("Paso 2 exitoso: Permisos asignados correctamente.");
      }

      setSuccessMsg("Rol creado y configurado exitosamente");
      setTimeout(() => setSuccessMsg(null), 3000);

      await fetchRoles(isActiveTab);
      return true;
    } catch (err: any) {
      console.error(
        "Fallo en la petición. Respuesta del servidor:",
        err.response?.data || err.message,
      );

      await fetchRoles(isActiveTab);

      if (err.response?.status === 409) {
        setError("Ya existe un rol con ese nombre en el sistema.");
      } else if (createdRoleId) {
        const backError =
          err.response?.data?.message || "formato de permisos incompatible";
        setError(
          `El rol se creó, pero falló la asignación de permisos: ${backError}`,
        );
      } else {
        setError("Ocurrió un error inesperado al intentar registrar el rol.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeRoles = async (roleIds: number[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all(roleIds.map((id) => RoleService.delete(id)));

      setSuccessMsg("Roles enviados a la papelera correctamente");
      setTimeout(() => setSuccessMsg(null), 3000);

      await fetchRoles(isActiveTab);
      return true;
    } catch (err) {
      console.error("Error en la eliminación masiva:", err);
      setError(
        "Ocurrió un error al intentar desactivar los roles seleccionados.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreRole = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await RoleService.restore(id);

      setSuccessMsg("Rol reactivado con éxito");
      setTimeout(() => setSuccessMsg(null), 3000);

      await fetchRoles(isActiveTab);
      return true;
    } catch (err) {
      console.error("Error al restaurar el rol:", err);
      setError("No se pudo restaurar el rol seleccionado.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rolesData,
    isLoading,
    error,
    setError,
    successMsg,
    filteredRoles,
    searchTerm,
    setSearchTerm,
    isActiveTab,
    setIsActiveTab,
    fetchRoles,
    handleCreateComplete,
    removeRoles,
    restoreRole,
  };
}
