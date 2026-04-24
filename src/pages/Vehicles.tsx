import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import type { Item } from "../types/models";
import Table from "../components/Table/Table";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import { Link } from "react-router-dom";
import ActionButton from "../components/Modal/ActionButton";
import { useTypesVehicles } from "../hooks/useTypesVehicles";
import { useModals } from "../hooks/useModals";
import { useClients } from "../hooks/useClients";
import type React from "react";
import { useVehicles } from "../hooks/useVehicles";
import Alert from "../components/Alert";
import { InitialVehicle, InitialNewVehicleForm } from "../types/vehicles.types";

const columns = [
  { key: "plate", header: "Placa", mobile: true },
  { key: "typeVehicleName", header: "Tipo", mobile: false },
  { key: "ownerName", header: "Cliente Propietario", mobile: false },
  { key: "actions", header: "Acciones", mobile: true },
];

function Vehicles() {
  const { clientsData } = useClients();
  const { toggleModal, modals } = useModals();
  const { typesVehiclesData } = useTypesVehicles();

  const {
    registerVehicle,
    successMessage,
    setSuccessMessage,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    newVehicleForm,
    vehiclesData,
    totalPages,
    setCurrentPage,
    currentVehicle,
    setCurrentVehicle,
    currentPage,
    deleteVehicle,
    editVehicle,
    restoreVehicle,
    editVehicleState,
    setEditVehicleState,
    handleEditChange,
    handleSelectChangeEdit,
    handleSearchChange,
    searchParameter,
    isActiveVehicles,
    setIsActiveVehicles,
    getVehicles,
    isLoading,
    setError,
    setNewVehicleForm
  } = useVehicles();

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setError({ active: false, msg: "" });
    setNewVehicleForm(InitialNewVehicleForm);
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerVehicle();
    if (success) {
      setSuccessMessage("Registrado con Éxito");
      handleCloseRegister();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDelete = (item: Item) => {
    setCurrentVehicle((prev) => ({
      ...prev,
      ...item
    }));
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentVehicle(InitialVehicle);
  };

  const handleDelete = async () => {
    const success = await deleteVehicle(String(currentVehicle.id));
    if (success) {
      handleCloseDelete();
      setSuccessMessage("Eliminado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true);
    setEditVehicleState((prev) => ({
      ...prev,
      ...item,
    }));
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setEditVehicleState(InitialVehicle);
  };

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editVehicle();
    if (success) {
      handleCloseEdit();
      setSuccessMessage("Editado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDetails = (item: Item) => {
    toggleModal("details", true);
    setCurrentVehicle((prev) => ({
      ...prev,
      ...item,
    }));
  };

  const handleCloseDetails = () => {
    toggleModal("details", false);
    setCurrentVehicle(InitialVehicle);
  };

  const handleOpenRestore = (item: Item) => {
    toggleModal("restore", true);
    setCurrentVehicle((prev) => ({
      ...prev,
      ...item,
    }));
  };

  const handleCloseRestore = () => {
    toggleModal("restore", false);
    setCurrentVehicle(InitialVehicle);
  };

  const handleRestore = async () => {
    const success = await restoreVehicle(String(currentVehicle.id));
    if (success) {
      handleCloseRestore();
      setSuccessMessage("Restaurado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleTab = async (active: boolean) => {
    const success = await getVehicles(1, active);
    if (success) {
      setIsActiveVehicles(active);
    }
  };

  const actionProps = isActiveVehicles
    ? {
      onDelete: handleOpenDelete,
      onEdit: handleOpenEdit,
      onView: handleOpenDetails,
    }
    : {
      onView: handleOpenDetails,
      onRestore: handleOpenRestore,
    };

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar Vehículo..."
          buttonText="Agregar Vehículo"
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>
      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200  hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-car-front-fill text-blue-800"
                viewBox="0 0 16 16"
              >
                <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-blue-700">
                Total Vehículos
              </p>
              <p className="text-2xl font-bold text-blue-900">{vehiclesData.totalVehicles}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-pause-circle text-yellow-800"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-yellow-500">Inactivos</p>
              <p className="text-2xl font-bold text-yellow-900">
                {vehiclesData.totalInactiveVehicles}
              </p>
            </div>
          </div>
        </section>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleTab(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors  ${isActiveVehicles ? "bg-white text-green-600  shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
              >
                Activos
              </button>
              <button
                onClick={() => handleTab(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!isActiveVehicles ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
              >
                Inactivos
              </button>
            </div>
          </div>
          <section className="shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-white px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-xl tracking-tight">
                Gestión de Vehículos
              </h2>
            </div>
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center p-10">
                  <span className="loading loading-spinner loading-xl"></span>
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={vehiclesData.data}
                  {...actionProps}
                />
              )}
            </div>
            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Página <span className="font-bold">{currentPage}</span> de{" "}
                <span className="font-bold">{totalPages}</span>
              </p>
              <div className="join gap-2">
                <button
                  className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <i className="bi bi-arrow-left-short text-xl" />
                  Anterior
                </button>
                <button
                  className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Siguiente
                  <i className="bi bi-arrow-right-short text-xl" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registro de Nuevo Vehículo"
        actions={
          <ActionButton
            type="register"
            isLoading={isSubmitting}
            form="RegisterForm"
          />
        }
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={handleRegister}
          id="RegisterForm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="typeVehicleId"
                className="block text-sm font-medium text-slate-700"
              >
                Tipo de Vehículo:
              </label>
              <select
                name="typeVehicleId"
                id="typeVehicleId"
                onChange={handleSelectChange}
                value={newVehicleForm.typeVehicleId || ""}
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled>
                  -- Selecciona una opción--
                </option>
                {typesVehiclesData.data.map((typeVehicle) => (
                  <option key={typeVehicle.id} value={typeVehicle.id || ""}>
                    {typeVehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="plate"
              label="Placa:"
              type="text"
              placeholder="Ej: ABC-123"
              onChange={handleChange}
              value={newVehicleForm.plate}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="ownerId"
                className="block text-sm font-medium text-slate-700"
              >
                Cliente Propietario:
              </label>
              <select
                name="ownerId"
                id="ownerId"
                onChange={handleSelectChange}
                value={newVehicleForm.ownerId || ""}
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled>
                  -- Selecciona una opción--
                </option>
                {clientsData.data.map((client) => (
                  <option key={client.id} value={client.id || ""}>
                    {client.names} {client.lastnames}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-slate-500 px-2">
              ¿No encuentras al Cliente?{" "}
              <Link to="/clients" className="text-blue-400 hover:text-blue-500">
                Crear Nuevo Cliente
              </Link>
            </p>
          </div>
          <div className="flex justify-center items-center h-6">
            {error.active && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {error.msg}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deleteText="Eliminar Vehículo"
        actions={
          <ActionButton
            type="delete"
            isLoading={isSubmitting}
            onClick={handleDelete}
          />
        }
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar el vehículo con placa{" "}
            <span className="font-semibold text-slate-800">{currentVehicle.plate}</span>?
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Vehículo"
        actions={
          <ActionButton type="edit" isLoading={isSubmitting} form="EditForm" />
        }
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={handleEdit}
          id="EditForm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                className="block text-sm font-medium text-slate-700"
              >
                Tipo de Vehículo:
              </label>
              <select
                name="typeVehicleId"
                value={editVehicleState.typeVehicleId || ""}
                onChange={handleSelectChangeEdit}
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled>
                  -- Selecciona uno--
                </option>
                {typesVehiclesData.data.map((typeVehicle) => (
                  <option key={typeVehicle.id} value={typeVehicle.id || ""}>
                    {typeVehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="plate"
              label="Placa:"
              type="text"
              placeholder="Ej: ABC-123"
              onChange={handleEditChange}
              value={editVehicleState.plate}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label
                className="block text-sm font-medium text-slate-700"
              >
                Cliente Propietario:
              </label>
              <select
                name="ownerId"
                onChange={handleSelectChangeEdit}
                value={editVehicleState.ownerId || ""}
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled>
                  -- Selecciona una opción--
                </option>
                {clientsData.data.map((client) => (
                  <option key={client.id} value={client.id || ""}>
                    {client.names} {client.lastnames}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-slate-500 px-2">
              ¿No encuentras al Cliente?{" "}
              <Link to="/clients" className="text-blue-400 hover:text-blue-500">
                Crear Nuevo Cliente
              </Link>
            </p>
          </div>
          <div className="flex justify-center items-center h-6">
            {editVehicleState.error && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {editVehicleState.errorMsg}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modals.details}
        onClose={handleCloseDetails}
        title="Detalles del Vehículo"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="plate"
              label="Placa:"
              type="text"
              value={currentVehicle.plate}
              readOnly
            />
            <Input
              name="typeVehicleName"
              label="Tipo de Vehículo:"
              type="text"
              value={currentVehicle.typeVehicleName || ""}
              readOnly
            />
          </div>
          <div>
            <h3 className="text-slate-800 mt-2 mb-2 border-b border-slate-200 pb-1">Datos del Propietario</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input
                name="ownerName"
                label="Nombres:"
                type="text"
                value={currentVehicle.ownerName || ""}
                readOnly
              />
              <Input
                name="ownerLastName"
                label="Apellidos:"
                type="text"
                value={currentVehicle.ownerLastName || ""}
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="ownerCi"
                label="Cédula:"
                type="text"
                value={currentVehicle.ownerCi || ""}
                icon={<i className="bi bi-person-vcard text-xl"></i>}
                readOnly
              />
              <Input
                name="ownerNumberPhone"
                label="Teléfono:"
                type="text"
                value={currentVehicle.ownerNumberPhone || ""}
                icon={<i className="bi bi-telephone text-xl" />}
                readOnly
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        restoreText="Restaurar Vehículo"
        actions={
          <ActionButton
            type="restore"
            isLoading={isSubmitting}
            onClick={handleRestore}
          />
        }
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas restaurar el vehículo con placa{" "}
            <span className="font-semibold text-slate-800">
              {currentVehicle.plate}
            </span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Vehicles;
