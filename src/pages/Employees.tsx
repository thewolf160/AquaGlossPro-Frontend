import Table from "../components/Table/Table";
import { type Item } from "../types/models";
import {
  InitialEmployee,
  InitialNewEmployeeForm,
} from "../types/employees.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import ActionButton from "../components/Modal/ActionButton";
import { useEmployees } from "../hooks/useEmployees";
import { useModals } from "../hooks/useModals";
import Alert from "../components/Alert";
import type React from "react";
import { useJobs } from "../hooks/useJobs";
import { hasPermission } from "../utils/checkPermissions.utils";

const columns = [
  { key: "ci", header: "CI", mobile: true },
  { key: "names", header: "Nombre", mobile: false },
  { key: "lastnames", header: "Apellido", mobile: true },
  { key: "email", header: "Email", mobile: false },
  { key: "numberPhone", header: "Número de Teléfono", mobile: false },
  { key: "actions", header: "Acciones", mobile: true },
];

function Employees() {
  const {
    employeesData,
    isLoading,
    currentEmployee,
    setCurrentEmployee,
    editEmployeeState,
    setEditEmployeeState,
    handleEditChange,
    deleteEmployee,
    newEmployeeForm,
    setNewEmployeeForm,
    handleChange,
    registerEmployee,
    successMessage,
    setSuccessMessage,
    handleSelectChange,
    currentPage,
    setCurrentPage,
    totalPages,
    editEmployee,
    handleSelectChangeEdit,
    handleSearchChange,
    searchParameter,
    isSubmitting,
    isActiveEmployees,
    setIsActiveEmployees,
    getEmployees,
    restoreEmployee,
  } = useEmployees();

  const { jobsData } = useJobs();

  const { modals, toggleModal } = useModals();

  const handleOpenDelete = (item: Item) => {
    setCurrentEmployee((prev) => ({
      ...prev,
      id: item.id,
      names: item.names,
      lastnames: item.lastnames,
    }));
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentEmployee(InitialEmployee);
  };

  const handleDelete = async () => {
    const success = await deleteEmployee(String(currentEmployee.id));
    if (success) {
      handleCloseDelete();
      setSuccessMessage("Eliminado con Éxito")
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    }
  };

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewEmployeeForm(InitialNewEmployeeForm);
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerEmployee();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Registrado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDetails = (item: Item) => {
    toggleModal("details", true);
    setCurrentEmployee((prev) => ({
      ...prev,
      ...item,
    }));
  };

  const handleCloseDetails = () => {
    toggleModal("details", false);
    setCurrentEmployee(InitialEmployee);
  };

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true);
    setEditEmployeeState((prev) => ({
      ...prev,
      ...item,
    }));
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setEditEmployeeState(InitialEmployee);
  };

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editEmployee();
    if (success) {
      handleCloseEdit();
      setSuccessMessage("Editado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenRestore = (item: Item) => {
    toggleModal("restore", true);
    setCurrentEmployee((prev) => ({
      ...prev,
      id: item.id,
      names: item.names,
      lastnames: item.lastnames,
    }));
  };

  const handleCloseRestore = () => {
    toggleModal("restore", false);
    setCurrentEmployee(InitialEmployee);
  };

  const handleRestore = async () => {
    const success = await restoreEmployee(String(currentEmployee.id));
    if (success) {
      handleCloseRestore();
      setSuccessMessage("Restaurado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleTab = async (active: boolean) => {
    const success = await getEmployees(1, active);

    if (success) {
      setIsActiveEmployees(active);
    }
  };

  const actionProps = isActiveEmployees
    ? {
      ...(hasPermission("EMPLOYEES", "D") && {onDelete: handleOpenDelete}),
       ...(hasPermission("EMPLOYEES", "U") && { onEdit: handleOpenEdit }),
       ...(hasPermission("EMPLOYEES", "R") && { onView: handleOpenDetails }),
      }
    : {
         ...(hasPermission("EMPLOYEES", "R") && { onView: handleOpenDetails }),
        ...(hasPermission("EMPLOYEES", "U") && { onRestore: handleOpenRestore }),
      };

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar empleado..."
          buttonText={hasPermission("EMPLOYEES", "C") ? "Agregar Empleado" : undefined}
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
                className="bi bi-people-fill text-blue-800"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-blue-700">
                Total Empleados
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {employeesData.totalEmployees}
              </p>
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
                {employeesData.totalInactiveEmployees}
              </p>
            </div>
          </div>
        </section>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleTab(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors  ${isActiveEmployees ? "bg-white text-green-600  shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
              >
                Activos
              </button>
              <button
                onClick={() => handleTab(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!isActiveEmployees ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}
              >
                Inactivos
              </button>
            </div>
          </div>
          <section className="shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <div className=" bg-white px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-xl tracking-tight">
                Gestión de Empleados
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
                  data={employeesData.data}
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
        title="Registro de Nuevo Empleado"
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
            <Input
              name="names"
              label="Nombre:"
              type="text"
              placeholder="Ej: Juan"
              onChange={handleChange}
              value={newEmployeeForm.form.names}
            />
            <Input
              name="lastnames"
              label="Apellido:"
              type="text"
              placeholder="Ej: Pérez"
              onChange={handleChange}
              value={newEmployeeForm.form.lastnames}
            />
          </div>
          <div>
            <Input
              name="ci"
              label="Cédula:"
              type="number"
              placeholder="0000000"
              onChange={handleChange}
              value={newEmployeeForm.form.ci}
              icon={<i className="bi bi-person-vcard text-xl" />}
            />
          </div>
          <div>
            <Input
              name="email"
              label="Correo Electrónico:"
              type="email"
              placeholder="juan.perez@gmail.com"
              onChange={handleChange}
              value={newEmployeeForm.form.email}
              icon={<i className="bi bi-envelope text-xl" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="numberPhone"
              label="Télefono:"
              type="text"
              placeholder="00000000000"
              onChange={handleChange}
              value={newEmployeeForm.form.numberPhone}
              icon={<i className="bi bi-telephone text-xl" />}
            />

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-700">
                Puesto de trabajo:
              </label>
              <select
                className="w-full border border-slate-300 p-3 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
                onChange={handleSelectChange}
                value={newEmployeeForm.form.jobId || ""}
              >
                <option value="" disabled>
                  -- Seleccione una opción --
                </option>
                {jobsData.data.map((job) => (
                  <option key={job.id} value={job.id || ""}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center h-8">
            {newEmployeeForm.error && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {newEmployeeForm.errorMsg}
              </span>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modals.delete}
        onClose={() => toggleModal("delete", false)}
        deleteText="Eliminar Empleado"
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
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold text-slate-800">
              {currentEmployee.names} {currentEmployee.lastnames}
            </span>
            ?
          </p>
        </div>
      </Modal>
      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Empleado"
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
            <Input
              name="names"
              label="Nombre:"
              type="text"
              placeholder="Ej. Juan"
              onChange={handleEditChange}
              value={editEmployeeState.names}
            />
            <Input
              name="lastnames"
              label="Apellido:"
              type="text"
              placeholder="Ej. Pérez"
              onChange={handleEditChange}
              value={editEmployeeState.lastnames}
            />
          </div>
          <div>
            <Input
              name="ci"
              label="Cédula:"
              type="number"
              placeholder="0000000"
              onChange={handleEditChange}
              value={editEmployeeState.ci}
              icon={<i className="bi bi-person-vcard text-xl" />}
            />
          </div>
          <div>
            <Input
              name="email"
              label="Correo Electrónico:"
              type="email"
              placeholder="juan.perez@gmail.com"
              onChange={handleEditChange}
              value={editEmployeeState.email}
              icon={<i className="bi bi-envelope text-xl" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="numberPhone"
              label="Télefono:"
              type="text"
              placeholder="00000000000"
              onChange={handleEditChange}
              value={editEmployeeState.numberPhone}
              icon={<i className="bi bi-telephone text-xl" />}
            />
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-700">
                Puesto de trabajo:
              </label>
              <select
                className="w-full border border-slate-300 p-3 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
                onChange={handleSelectChangeEdit}
                value={editEmployeeState.jobId || ""}
              >
                <option value="" disabled>
                  -- Seleccione una opción --
                </option>
                {jobsData.data.map((job) => (
                  <option key={job.id} value={job.id || ""}>
                    {job.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center h-8">
            {editEmployeeState.error && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {editEmployeeState.errorMsg}
              </span>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modals.details}
        onClose={handleCloseDetails}
        title="Detalles de Empleado"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nombre:"
              type="text"
              value={currentEmployee.names}
              readOnly
            />
            <Input
              name="lastname"
              label="Apellido:"
              type="text"
              value={currentEmployee.lastnames}
              readOnly
            />
          </div>
          <div>
            <Input
              name="ci"
              label="Cédula:"
              type="number"
              value={currentEmployee.ci}
              icon={<i className="bi bi-person-vcard text-xl"></i>}
              readOnly
            />
          </div>
          <div>
            <Input
              name="email"
              label="Correo Electrónico:"
              type="email"
              onChange={handleChange}
              value={currentEmployee.email}
              icon={<i className="bi bi-envelope text-xl" />}
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="phoneNumber"
              label="Télefono:"
              type="text"
              value={currentEmployee.numberPhone}
              icon={<i className="bi bi-telephone text-xl" />}
              readOnly
            />
            <Input
              name="job"
              label="Puesto de Trabajo:"
              type="text"
              value={`${currentEmployee.nameJob} (${currentEmployee.baseSalary})`}
              readOnly
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        restoreText="Restaurar Empleado"
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
            ¿Estás seguro de que deseas restaurar a{" "}
            <span className="font-semibold text-slate-800">
              {currentEmployee.names} {currentEmployee.lastnames}
            </span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Employees;
