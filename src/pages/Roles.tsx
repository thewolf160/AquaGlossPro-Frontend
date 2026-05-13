import React, { useState, useMemo } from "react";
import HeaderSearch from "../components/HeaderSearch";
import HeaderPortal from "../components/HeaderPortal";
import Modal from "../components/Modal/Modal";
import Alert from "../components/Alert";
import { useRoles } from "../hooks/useRoles";
import { usePermissions } from "../hooks/usePermissions";

export default function Roles() {
  const {
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
    handleCreateComplete,
    removeRoles,
    restoreRole,
  } = useRoles();

  const { permissions, isLoading: permissionsLoading } = usePermissions();

  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // ESTADOS DE PAGINACIÓN CALCULADA

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cantidad de roles visibles por página

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [roleToRestore, setRoleToRestore] = useState<number | null>(null);

  const [newRoleName, setNewRoleName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // LÓGICA DE RECORTES PARA PAGINACIÓN

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage]);

  const handleRowClick = (id: number) =>
    setExpandedRole(expandedRole === id ? null : id);

  const handleSelectRole = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === filteredRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(filteredRoles.map((role) => role.roleId));
    }
  };

  const handleConfirmCreate = async () => {
    if (!newRoleName.trim()) {
      setNameError(true);
      return;
    }

    const success = await handleCreateComplete(
      newRoleName,
      selectedPermissions,
    );

    if (success) {
      setIsAddModalOpen(false);
      setNewRoleName("");
      setNameError(false);
      setSelectedPermissions([]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(e.target.value);
    if (e.target.value.trim()) {
      setNameError(false);
      setError(null);
    }
  };

  const handleConfirmDelete = async () => {
    const success = await removeRoles(selectedRoles);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedRoles([]);
    }
  };

  const handleConfirmRestore = async () => {
    if (!roleToRestore) return;
    const success = await restoreRole(roleToRestore);
    if (success) {
      setIsRestoreModalOpen(false);
      setRoleToRestore(null);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId),
    );
  };

  // AGRUPACIÓN

  const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
    if (!perm || !perm.modul) return acc;

    const moduleId = perm.modul.moduleId;

    if (moduleId === 3 || moduleId === 6) return acc;

    let moduleName = perm.modul.name;

    if (!acc[moduleId]) {
      acc[moduleId] = {
        module: { ...perm.modul, name: moduleName },
        permissions: [],
      };
    }

    const exists = acc[moduleId].permissions.some(
      (p: any) => p.permissionId === perm.permissionId,
    );

    if (!exists) {
      acc[moduleId].permissions.push(perm);
    }

    return acc;
  }, {});

  const handleSelectAllModule = (moduleId: number, checked: boolean) => {
    const moduleData = groupedPermissions[moduleId];
    if (!moduleData) return;

    const modulePermissionIds = moduleData.permissions.map(
      (p: any) => p.permissionId,
    );

    setSelectedPermissions((prev) =>
      checked
        ? [...new Set([...prev, ...modulePermissionIds])]
        : prev.filter((id) => !modulePermissionIds.includes(id)),
    );
  };

  return (
    <section className="p-2 sm:p-4 animate-fade-in max-w-6xl mx-auto w-full space-y-4">
      {successMsg && <Alert message={successMsg} type="success" />}
      {error && !isAddModalOpen && <Alert message={error} type="error" />}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <i className="bi bi-shield-lock-fill text-xl"></i>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base sm:text-lg">
                Jerarquía de Roles
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Gestiona los accesos del sistema
              </p>
            </div>
          </div>

          {isActiveTab && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={selectedRoles.length === 0 || isLoading}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                selectedRoles.length === 0
                  ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm"
              }`}
            >
              <i className="bi bi-trash3"></i>
              Eliminar {selectedRoles.length > 0 && `(${selectedRoles.length})`}
            </button>
          )}
        </div>

        <HeaderPortal>
          <HeaderSearch
            searchPlaceholder="Filtrar roles..."
            buttonText="Crear Nuevo Rol"
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            onAddClick={() => {
              setIsAddModalOpen(true);
              setNameError(false);
              setError(null);
            }}
          />
        </HeaderPortal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Total roles
            </p>
            <p className="mt-1 text-3xl font-black text-slate-900">
              {rolesData.totals.general}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Activos
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-600">
              {rolesData.totals.active}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Inactivos
            </p>
            <p className="mt-1 text-3xl font-black text-rose-600">
              {rolesData.totals.inactive}
            </p>
          </div>
        </div>

        <div className="px-6 py-2 border-y border-slate-100 bg-slate-50/50 flex gap-2">
          <button
            onClick={() => {
              setIsActiveTab(true);
              setSelectedRoles([]);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActiveTab
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Roles Activos
          </button>
          <button
            onClick={() => {
              setIsActiveTab(false);
              setSelectedRoles([]);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isActiveTab
                ? "bg-white text-rose-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Papelera (Inactivos)
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-[700px] w-full table-auto">
            <thead className="bg-slate-50/80">
              <tr>
                {isActiveTab && (
                  <th className="px-4 sm:px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-blue-600"
                      checked={
                        filteredRoles.length > 0 &&
                        selectedRoles.length === filteredRoles.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th
                  className={`px-3 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest ${!isActiveTab ? "pl-6" : ""}`}
                >
                  ID
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Nombre del Rol
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Módulos Asignados
                </th>
                <th className="w-24 pr-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isActiveTab ? 5 : 4}
                    className="p-12 text-center"
                  >
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan={isActiveTab ? 5 : 4}
                    className="p-12 text-center text-slate-400 font-medium"
                  >
                    No se encontraron roles.
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => (
                  <React.Fragment key={role.roleId}>
                    <tr
                      className="group hover:bg-blue-50/30 cursor-pointer"
                      onClick={() => handleRowClick(role.roleId)}
                    >
                      {isActiveTab && (
                        <td
                          className="px-4 sm:px-6 py-3"
                          onClick={(e) => handleSelectRole(e, role.roleId)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.roleId)}
                            readOnly
                            className="w-4 h-4"
                          />
                        </td>
                      )}
                      <td className={`px-3 py-3 ${!isActiveTab ? "pl-6" : ""}`}>
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded border">
                          {role.roleId}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm font-bold text-slate-800">
                          {role.name}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-slate-500 truncate block max-w-xs">
                          {role.modules?.map((m) => m.moduleName).join(" • ") ||
                            "Sin módulos"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        {isActiveTab ? (
                          <i
                            className={`bi bi-chevron-right transition-transform ${expandedRole === role.roleId ? "rotate-90 text-blue-500" : "text-slate-300"}`}
                          ></i>
                        ) : (
                          <button
                            onClick={() => {
                              setRoleToRestore(role.roleId);
                              setIsRestoreModalOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200"
                          >
                            Restaurar
                          </button>
                        )}
                      </td>
                    </tr>
                    {isActiveTab && expandedRole === role.roleId && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-0 bg-slate-50/30 border-none"
                        >
                          <div className="px-12 py-6 animate-slide-down">
                            <div className="bg-white rounded-2xl p-6 border shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {role.modules?.map((mod) => (
                                <div
                                  key={mod.moduleId}
                                  className="p-3 bg-slate-50 rounded-xl border"
                                >
                                  <span className="text-xs font-bold text-slate-700 block mb-2">
                                    {mod.moduleName}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {mod.permissions.map((p) => (
                                      <span
                                        key={p.permissionId}
                                        className="px-2 py-0.5 bg-blue-50 text-blue-700 font-black text-[10px] rounded border border-blue-100"
                                      >
                                        {p.type}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500">
            Página{" "}
            <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
            de{" "}
            <span className="font-semibold text-slate-900">
              {totalPages || 1}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={
                currentPage >= totalPages || totalPages === 0 || isLoading
              }
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Crear Nuevo Rol"
        actions={
          <button
            onClick={handleConfirmCreate}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg"
          >
            Guardar Rol
          </button>
        }
      >
        <div className="space-y-5 py-2">
          {error && isAddModalOpen && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-bold">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
              Nombre del rol *
            </label>
            <input
              type="text"
              placeholder="Ej: VENDEDOR"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl uppercase text-sm outline-none focus:ring-4 ${nameError ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"}`}
              value={newRoleName}
              onChange={handleNameChange}
            />
            {nameError && (
              <p className="text-red-500 text-[11px] font-bold mt-2">
                Nombre obligatorio
              </p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">
              Permisos
            </label>
            {permissionsLoading ? (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner text-blue-600"></span>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {Object.values(groupedPermissions).map(
                  ({ module, permissions: perms }: any) => (
                    <div
                      key={module.moduleId}
                      className="border rounded-xl p-3 bg-white"
                    >
                      <div className="flex items-center gap-2 mb-2 border-b pb-2">
                        <input
                          type="checkbox"
                          checked={perms.every((p: any) =>
                            selectedPermissions.includes(p.permissionId),
                          )}
                          onChange={(e) =>
                            handleSelectAllModule(
                              module.moduleId,
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          {module.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {perms.map((perm: any) => (
                          <label
                            key={perm.permissionId}
                            className="flex items-center gap-2 text-[10px] font-medium text-slate-600 cursor-pointer p-1.5 bg-slate-50 rounded border border-slate-100"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(
                                perm.permissionId,
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  perm.permissionId,
                                  e.target.checked,
                                )
                              }
                              className="w-3 h-3"
                            />
                            <span>
                              {perm.typePermission === "C"
                                ? "Crear"
                                : perm.typePermission === "R"
                                  ? "Leer"
                                  : perm.typePermission === "U"
                                    ? "Editar"
                                    : "Eliminar"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Desactivación"
        actions={
          <button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg"
          >
            Sí, Desactivar
          </button>
        }
      >
        <div className="py-4 text-sm text-slate-600">
          ¿Estás seguro de que deseas desactivar {selectedRoles.length} roles?
          Se moverán a la papelera.
        </div>
      </Modal>

      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restaurar Rol"
        actions={
          <button
            onClick={handleConfirmRestore}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg"
          >
            Sí, Restaurar
          </button>
        }
      >
        <div className="py-4 text-sm text-slate-600">
          ¿Deseas reactivar este rol? Volverá a estar operativo con sus permisos
          originales.
        </div>
      </Modal>
    </section>
  );
}
