import React, { useState, useMemo } from "react";
import HeaderSearch from "../components/HeaderSearch";
import HeaderPortal from "../components/HeaderPortal";
import Modal from "../components/Modal/Modal";

const columns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Rol" },
  { key: "access", header: "Permisos de Módulos" },
];

const ALL_ACCESSES = [
  "Vehículos",
  "Inventario",
  "Empleados",
  "Usuarios",
  "Servicios",
  "Ventas",
  "Reportes",
  "Compras",
];

const mockRoles = [
  {
    id: "ROL-001",
    name: "Administrador",
    access: [...ALL_ACCESSES],
  },
  {
    id: "ROL-002",
    name: "Cajero",
    access: ["Ventas", "Servicios"],
  },
  {
    id: "ROL-003",
    name: "Supervisor de Pista",
    access: ["Vehículos", "Empleados", "Servicios", "Reportes"],
  },
];

export default function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleAccess, setNewRoleAccess] = useState<string[]>([]);

  const [nameError, setNameError] = useState(false);

  const displayRoles = useMemo(() => {
    return roles.filter((r) =>
      `${r.id} ${r.name} ${r.access.join(" ")}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, roles]);

  const handleRowClick = (id: string) => {
    setExpandedRole(expandedRole === id ? null : id);
  };

  const handleSelectRole = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === displayRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(displayRoles.map((r) => r.id));
    }
  };

  // NUEVA LÓGICA: Valida que exista el nombre antes de permitir seleccionar accesos
  const toggleNewRoleAccess = (mod: string) => {
    if (!newRoleName.trim()) {
      setNameError(true);
      return;
    }
    setNewRoleAccess((prev) =>
      prev.includes(mod) ? prev.filter((a) => a !== mod) : [...prev, mod],
    );
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      setNameError(true);
      return;
    }
    const newId = `ROL-00${roles.length + 1}`;
    setRoles([
      ...roles,
      { id: newId, name: newRoleName, access: newRoleAccess },
    ]);

    setIsAddModalOpen(false);
    setNewRoleName("");
    setNewRoleAccess([]);
    setNameError(false);
  };

  // Función para manejar el cambio en el input y limpiar el error automáticamente
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(e.target.value);
    if (e.target.value.trim()) {
      setNameError(false);
    }
  };

  const handleConfirmDelete = () => {
    setRoles(roles.filter((r) => !selectedRoles.includes(r.id)));
    setSelectedRoles([]);
    setIsDeleteModalOpen(false);
  };

  const handleAccessToggle = (id: string, mod: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const hasAccess = r.access.includes(mod);
          return {
            ...r,
            access: hasAccess
              ? r.access.filter((a) => a !== mod)
              : [...r.access, mod],
          };
        }
        return r;
      }),
    );
  };

  return (
    <section className="p-2 sm:p-4 animate-fade-in max-w-6xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* HEADER DE ACCIÓN */}
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
                Gestiona permisos y accesos al sistema
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedRoles.length === 0}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              selectedRoles.length === 0
                ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm"
            }`}
          >
            <i className="bi bi-trash3"></i>
            Eliminar {selectedRoles.length > 0 && `(${selectedRoles.length})`}
          </button>
        </div>

        <HeaderPortal>
          <HeaderSearch
            searchPlaceholder="Filtrar roles..."
            buttonText="Crear Nuevo Rol"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => {
              setIsAddModalOpen(true);
              setNameError(false);
            }}
          />
        </HeaderPortal>

        <div className="overflow-x-auto w-full">
          <table className="min-w-[700px] w-full table-auto">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left w-12 sm:w-14">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={
                      displayRoles.length > 0 &&
                      selectedRoles.length === displayRoles.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 text-left text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Nombre del Rol
                </th>
                <th className="px-3 py-3 text-left text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Módulos Activos
                </th>
                <th className="w-8 sm:w-10"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {displayRoles.map((role) => (
                <React.Fragment key={role.id}>
                  <tr
                    className={`group hover:bg-blue-50/30 cursor-pointer transition-colors ${
                      expandedRole === role.id ? "bg-blue-50/20" : ""
                    }`}
                    onClick={() => handleRowClick(role.id)}
                  >
                    <td
                      className="px-4 sm:px-6 py-3"
                      onClick={(e) => handleSelectRole(e, role.id)}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedRoles.includes(role.id)}
                        readOnly
                      />
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-[10px] sm:text-[11px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                        {role.id}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {role.access.length === ALL_ACCESSES.length ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                          <span className="text-[10px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap">
                            Acceso Total
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                          {role.access.join(" • ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <i
                        className={`bi bi-chevron-right text-slate-300 transition-transform duration-300 flex justify-end ${
                          expandedRole === role.id
                            ? "rotate-90 text-blue-500"
                            : ""
                        }`}
                      ></i>
                    </td>
                  </tr>

                  {/* PANEL EXPANDIBLE: CORRECCIÓN DEL GLITCH DE ANIMACIÓN */}
                  <tr>
                    <td colSpan={5} className="p-0 border-none bg-slate-50/30">
                      <div
                        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                          expandedRole === role.id
                            ? "max-h-[800px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {/* Se eliminó animate-slide-down para evitar conflictos con max-h */}
                        <div className="px-4 sm:px-12 py-4 sm:py-6">
                          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 gap-3">
                              <div>
                                <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
                                  Configuración de Permisos
                                </h3>
                                <p className="text-[11px] sm:text-xs text-slate-400">
                                  Activa o desactiva los módulos disponibles
                                  para {role.name}
                                </p>
                              </div>
                              <button
                                onClick={() => setExpandedRole(null)}
                                className="w-full sm:w-auto text-[11px] font-bold text-white sm:text-blue-600 bg-blue-600 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg sm:rounded-none hover:text-blue-800 uppercase tracking-widest transition-colors"
                              >
                                Guardar y Cerrar
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                              {ALL_ACCESSES.map((mod) => {
                                const active = role.access.includes(mod);
                                return (
                                  <button
                                    key={mod}
                                    onClick={() =>
                                      handleAccessToggle(role.id, mod)
                                    }
                                    className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all ${
                                      active
                                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                                    }`}
                                  >
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-tight truncate mr-2">
                                      {mod}
                                    </span>
                                    <i
                                      className={`bi ${active ? "bi-check-circle-fill" : "bi-circle"} text-base sm:text-lg shrink-0`}
                                    ></i>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AGREGAR ROL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Definir Nuevo Rol"
        actions={
          <button
            onClick={handleCreateRole}
            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Crear Rol
          </button>
        }
      >
        <div className="space-y-5 py-2">
          <div>
            <label
              className={`block text-[11px] font-black uppercase tracking-widest mb-2 transition-colors ${nameError ? "text-red-500" : "text-slate-400"}`}
            >
              Identificador del Rol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Gerente Operativo"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-medium text-sm ${
                nameError
                  ? "border-red-400 focus:ring-4 focus:ring-red-100 text-red-900 placeholder:text-red-300 bg-red-50/50"
                  : "border-slate-200 focus:ring-4 focus:ring-blue-100 text-slate-700 placeholder:text-slate-300"
              }`}
              value={newRoleName}
              onChange={handleNameChange}
            />
            {/* MENSAJE DE ERROR DINÁMICO */}
            {nameError && (
              <p className="text-red-500 text-[11px] font-bold mt-2 flex items-center gap-1.5 animate-pulse">
                <i className="bi bi-exclamation-circle-fill"></i>
                Debes colocar un nombre al rol obligatoriamente
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Asignar Módulos Iniciales
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ACCESSES.map((mod) => {
                const isSel = newRoleAccess.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleNewRoleAccess(mod)}
                    className={`px-2 sm:px-3 py-2.5 rounded-lg border-2 text-[10px] font-black uppercase transition-all truncate ${
                      isSel
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL: ELIMINAR ROL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        actions={
          <button
            onClick={handleConfirmDelete}
            className="w-full sm:w-auto px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
          >
            <i className="bi bi-exclamation-triangle-fill"></i>
            Sí, Eliminar
          </button>
        }
      >
        <div className="py-4 text-center sm:text-left">
          <p className="text-slate-500 font-medium leading-relaxed text-sm">
            Estás a punto de eliminar{" "}
            <span className="text-slate-800 font-bold">
              {selectedRoles.length} roles
            </span>{" "}
            del sistema. Esta acción revocará automáticamente el acceso a todos
            los usuarios vinculados.
          </p>
          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-[10px] sm:text-[11px] text-red-600 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
              <i className="bi bi-info-circle-fill"></i>
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
