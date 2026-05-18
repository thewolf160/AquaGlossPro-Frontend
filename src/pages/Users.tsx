import { useState, useMemo } from "react";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Table from "../components/Table/Table";
import Input from "../components/Modal/Input";
import Modal from "../components/Modal/Modal";
import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { hasPermission } from "../utils/checkPermissions.utils";

function Users() {
  const {
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
  } = useUsers();

  const { rolesData } = useRoles();
  const availableRoles = rolesData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");

  const [formData, setFormData] = useState({
    userId: 0,
    name: "",
    email: "",
    password: "",
    roleId: 0,
  });

  // BUSCADOR LOCAL EN LA PÁGINA ACTUAL

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const currentList = usersData.data || [];
    if (!term) return currentList;

    return currentList.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        String(user.userId).includes(term),
    );
  }, [usersData.data, searchTerm]);

  // Manejadores de Modal de Borrado / Restauración
  const handleOpenDeleteModal = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteRestore = async () => {
    if (!selectedUser) return;
    let success = false;

    if (isActiveTab) {
      success = await deleteUser(selectedUser.userId);
    } else {
      success = await restoreUser(selectedUser.userId);
    }

    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const deleteButton = (
    <button
      onClick={handleConfirmDeleteRestore}
      disabled={isLoading}
      className={`btn text-white ${isActiveTab ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
    >
      {isLoading ? "Procesando..." : isActiveTab ? "Eliminar" : "Restaurar"}
    </button>
  );

  // MODAL VACÍO AGREGAR

  const handleOpenAdd = () => {
    setModalMode("add");
    setError(null);
    setFormData({
      userId: 0,
      name: "",
      email: "",
      password: "",
      roleId: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setModalMode("edit");
    setError(null);
    setFormData({
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role?.roleId || 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (user: any) => {
    setModalMode("view");
    setError(null);
    setFormData({
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role?.roleId || 0,
    });
    setIsModalOpen(true);
  };

  // Guardar (POST / PATCH)
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.roleId) {
      setError(
        "Por favor completa los campos obligatorios (Nombre, Correo y Rol).",
      );
      return;
    }

    let success = false;
    if (modalMode === "add") {
      if (!formData.password) {
        setError("La contraseña es obligatoria para crear un usuario.");
        return;
      }
      success = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: Number(formData.roleId),
      });
    } else if (modalMode === "edit") {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        roleId: Number(formData.roleId),
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }
      success = await updateUser(formData.userId, payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const modalTitle =
    modalMode === "add"
      ? "Agregar Usuario"
      : modalMode === "edit"
        ? "Editar Usuario"
        : "Detalles del Usuario";

  // COLUMNAS DINÁMICAS: BYPASS DE BOTÓN EN LA PAPELERA

  const columns = [
    { key: "userId", header: "ID" },
    { key: "name", header: "Nombre" },
    { key: "email", header: "Correo" },
    {
      key: "rol",
      header: "Rol",
      render: (item: any) => (
        <span className="font-bold text-slate-700">
          {item.role?.name || "N/A"}
        </span>
      ),
    },

    // Evaluamos la pestaña actual
    isActiveTab
      ? { key: "actions", header: "Acciones" } // Pestaña Activos (Tu tabla ya maneja los botones con {...actionProps})
      : {
          // Pestaña Inactivos: Solo agregamos la columna si tiene permiso 'U' en USERS
          ...(hasPermission("USERS", "U")
            ? {
                key: "customRestore",
                header: "Acciones",
                render: (item: any) => (
                  <button
                    onClick={() => handleOpenDeleteModal(item)} // Nota: Asegúrate de si es el modal de restaurar o eliminar
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    title="Restaurar Usuario"
                  >
                    Restaurar
                  </button>
                ),
              }
            : {
                // Si no tiene permisos, devolvemos un objeto vacío que React ignorará al desestructurar con ...
              }),
        },
  ].filter(Boolean); // El .filter(Boolean) asegura limpiar cualquier espacio vacío si la condición no se cumple

  return (
    <section className="flex flex-col gap-6 p-4 animate-fade-in max-w-7xl mx-auto w-full">
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold text-sm text-center shadow-sm animate-slide-down">
          {successMsg}
        </div>
      )}
      {error && !isModalOpen && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold text-sm text-center shadow-sm animate-slide-down">
          {error}
        </div>
      )}

      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar por nombre, ID o correo..."
          buttonText={
            hasPermission("USERS", "C") ? "Agregar Usuario" : undefined
          }
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAddClick={handleOpenAdd}
        />
      </HeaderPortal>

      {/* Tarjetas de Contadores Conectadas al Backend */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-rose-800"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                />
                <path d="M22 17.28a2.28 2.28 0 0 1-.662 1.606c-.976.984-1.923 2.01-2.936 2.958a.597.597 0 0 1-.823-.017l-2.918-2.94a2.28 2.28 0 0 1 0-3.214a2.277 2.277 0 0 1 3.233 0l.106.107l.106-.107A2.277 2.277 0 0 1 22 17.28Z" />
                <path strokeLinecap="round" d="M5 20v-1a7 7 0 0 1 10-6.326" />
              </g>
            </svg>
          </div>
          <div className="pr-12">
            <p className="font-medium text-sm text-rose-700">Total Usuarios</p>
            <p className="text-2xl font-bold text-rose-900">
              {usersData.totals.general}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-purple-800"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
                <path d="M5 20v-1a7 7 0 0 1 10-6.326M21 22l1-6l-3.5 1.8L17 16l-1.5 1.8L12 16l1 6z" />
              </g>
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-purple-500">Admins</p>
            <p className="text-2xl font-bold text-purple-900">
              {
                usersData.data.filter(
                  (u) => u.role?.name?.toUpperCase() === "ADMIN",
                ).length
              }
            </p>
          </div>
        </div>

        {/* ICONO DE SOL */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-emerald-800"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M15 2h2v4.96h-2zm6.687 6.89l3.507-3.506l1.414 1.414l-3.507 3.507zM25.04 15H30v2h-4.96zm-3.347 8.104l1.414-1.414l3.507 3.507L25.2 26.61zM15 25.04h2V30h-2zm-9.604.162l3.508-3.507l1.414 1.414l-3.507 3.507zM2 15h4.96v2H2zm3.39-8.197l1.415-1.414l3.507 3.507l-1.414 1.414zM16 12a4 4 0 1 1-4 4a4 4 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6"
              />
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-emerald-500">Activos</p>
            <p className="text-2xl font-bold text-emerald-900">
              {usersData.totals.active}
            </p>
          </div>
        </div>

        {/* ICONO DE LUNA */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-amber-800"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M13.503 5.414a15.076 15.076 0 0 0 11.593 18.194a11.1 11.1 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1 1 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.07 13.07 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3"
              />
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-amber-500">Inactivos</p>
            <p className="text-2xl font-bold text-amber-900">
              {usersData.totals.inactive}
            </p>
          </div>
        </div>
      </section>

      {/* Pestañas de Filtro Activos / Inactivos */}
      <div className="px-2 flex gap-2">
        <button
          onClick={() => {
            setIsActiveTab(true);
            setCurrentPage(1);
          }}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isActiveTab
              ? "bg-white text-blue-600 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Usuarios Activos
        </button>
        <button
          onClick={() => {
            setIsActiveTab(false);
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

      {/* Tabla Gestionada */}
      <section className="shadow-md rounded-xl overflow-hidden border border-slate-300 bg-white">
        <div className="bg-white px-6 py-3 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-xl tracking-tight">
            Gestión de Usuarios{" "}
            {isLoading && (
              <span className="loading loading-spinner loading-xs ml-2 text-blue-600 animate-spin"></span>
            )}
          </h2>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          onEdit={hasPermission("USERS", "U") ? handleOpenEdit : undefined}
          onDelete={
            hasPermission("USERS", "D") ? handleOpenDeleteModal : undefined
          }
          onView={hasPermission("USERS", "R") ? handleOpenView : undefined}
          emptyMessage={
            isLoading
              ? "Cargando usuarios desde el servidor..."
              : "No se encontraron usuarios registrados"
          }
        />

        {/* FOOTER */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500">
            Página{" "}
            <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
            de{" "}
            <span className="font-semibold text-slate-900">
              {usersData.totalPages || 1}
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
                setCurrentPage((prev) =>
                  Math.min(prev + 1, usersData.totalPages),
                )
              }
              disabled={
                currentPage >= usersData.totalPages ||
                usersData.totalPages === 0 ||
                isLoading
              }
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      {/* MODAL CONECTADO AL BACKEND*/}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        actions={
          modalMode !== "view" ? (
            <div className="flex justify-end gap-3">
              <button
                disabled={isLoading}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
                onClick={handleSubmit}
              >
                {isLoading
                  ? "Guardando..."
                  : modalMode === "add"
                    ? "Registrar Usuario"
                    : "Guardar Cambios"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-300 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar Detalles
              </button>
            </div>
          )
        }
      >
        <form
          className="grid grid-cols-2 gap-5 py-2 outline-none"
          onSubmit={(e) => e.preventDefault()}
        >
          {error && isModalOpen && (
            <div className="col-span-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold text-xs">
              {error}
            </div>
          )}

          <div className="col-span-2">
            <Input
              label="Nombre del Usuario: *"
              placeholder="Ingresa el nombre completo"
              name="name"
              type="text"
              value={formData.name}
              readOnly={modalMode === "view"}
              onChange={(e: any) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <Input
              label="Correo Electrónico: *"
              placeholder="usuario@correo.com"
              name="email"
              type="email"
              value={formData.email}
              readOnly={modalMode === "view"}
              onChange={(e: any) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="flex flex-col gap-1 text-[13px] font-bold text-slate-700">
              <span>Rol Asignado: *</span>
              <select
                className={`border border-gray-300 rounded-xl px-3 py-3 outline-none text-sm shadow-sm ${
                  modalMode === "view"
                    ? "bg-slate-100 cursor-not-allowed text-slate-500"
                    : "bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                }`}
                value={formData.roleId}
                disabled={modalMode === "view"}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: Number(e.target.value) })
                }
              >
                <option value={0} disabled>
                  Selecciona un Rol
                </option>
                {availableRoles.map((r: any) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {modalMode !== "view" && (
            <div className="col-span-2">
              <Input
                label={
                  modalMode === "add"
                    ? "Contraseña: *"
                    : "Nueva Contraseña (Opcional):"
                }
                placeholder="Mínimo 8 caracteres"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e: any) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                {modalMode === "add"
                  ? "Requerida por el sistema para el acceso."
                  : "Déjala en blanco si no deseas cambiar la contraseña actual."}
              </span>
            </div>
          )}
        </form>
      </Modal>

      {/* Modal de Confirmación de Borrado / Restauración */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          isActiveTab ? "Confirmar Desactivación" : "Confirmar Restauración"
        }
        actions={deleteButton}
      >
        <div className="py-4 text-center text-sm text-slate-700">
          {isActiveTab ? (
            <>
              ¿Estás seguro de que deseas mover a la papelera al usuario{" "}
              <span className="font-bold text-slate-900">
                {selectedUser?.name}
              </span>
              ?
            </>
          ) : (
            <>
              ¿Deseas reactivar en el sistema al usuario{" "}
              <span className="font-bold text-slate-900">
                {selectedUser?.name}
              </span>
              ?
            </>
          )}
        </div>
      </Modal>
    </section>
  );
}

export default Users;
