import { useTypesVehicles } from "../../hooks/useTypesVehicles";
import type { Item } from "../../types/models";
import { useModals } from "../../hooks/useModals";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import {
  InitialNewTypeVehicleForm,
  InitialTypeVehicle,
} from "../../types/typesVehicles.type";
import Input from "../../components/Modal/Input";
import ActionButton from "../../components/Modal/ActionButton";
import Alert from "../../components/Alert";
import NavBar from "./ui/NavBar";
import { hasPermission } from "../../utils/checkPermissions.utils";

const columns = [
  { key: "name", header: "Nombre", mobile: true },
  { key: "actions", header: "Acciones", mobile: true },
];

function TypesVehicles() {
  const {
    typesVehiclesData,
    isLoading,
    isSubmitting,
    handleChange,
    registerTypeVehicle,
    setNewTypeVehicleForm,
    newTypeVehicleForm,
    successMessage,
    setSuccessMessage,
    error,
    setError,
    deleteTypeVehicle,
    currentTypeVehicle,
    setCurrentTypeVehicle,
    setChangedFields,
    editTypeVehicle,
    changedFields,
    handleEditChange,
    inactiveTypesVehicleData,
    restoreTypeVehicle,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useTypesVehicles();

  const { modals, toggleModal } = useModals();

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewTypeVehicleForm(InitialNewTypeVehicleForm);
    setError({ active: false, msg: "" });
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerTypeVehicle();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Registrado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDelete = (item: Item) => {
    toggleModal("delete", true);
    setCurrentTypeVehicle({
      id: item.id,
      name: item.name,
    });
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentTypeVehicle(InitialTypeVehicle);
  };

  const handleDelete = async () => {
    const success = await deleteTypeVehicle();
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
    setCurrentTypeVehicle({ id: item.id, name: item.name });
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setCurrentTypeVehicle(InitialTypeVehicle);
    setChangedFields({});
    setError({ active: false, msg: "" });
  };

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editTypeVehicle();
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
    setCurrentTypeVehicle({ id: item.id, name: item.name });
  };

  const handleCloseRestore = () => {
    toggleModal("restore", false);
    setCurrentTypeVehicle(InitialTypeVehicle);
  };

  const handleRestore = async () => {
    const success = await restoreTypeVehicle();
    if (success) {
      handleCloseRestore();
      setCurrentTypeVehicle(InitialTypeVehicle);
      setSuccessMessage("Restaurado con  Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      <div className="space-y-6">
        <NavBar
          title="Tipos de Vehículos"
          onRegister={
            hasPermission("TYPE_VEHICLES", "C") ? handleOpenRegister : undefined
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="p-10 col-span-full flex items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {typesVehiclesData.data.length > 0 ? (
                typesVehiclesData.data.map((typeVehicle: Item) => (
                  <div
                    key={typeVehicle.id}
                    className="card bg-white border border-slate-200 border-t-5 border-t-blue-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ease-out duration-200"
                  >
                    <div className="card-body gap-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-blue-100 px-2 py-1 rounded-lg">
                          <i className="bi bi-car-front-fill text-2xl text-blue-500" />
                        </div>
                        <div className="flex gap-2">
                          {hasPermission("TYPE_VEHICLES", "U") && (
                            <button
                              className="cursor-pointer text-xl text-sky-500 hover:text-sky-600 transition-all ease-in hover:bg-sky-100 rounded-md p-1.5"
                              onClick={() => handleOpenEdit(typeVehicle)}
                            >
                              <i className="bi bi-pencil-square " />
                            </button>
                          )}
                          {hasPermission("TYPE_VEHICLES", "D") && (
                            <button
                              className="cursor-pointer text-xl text-red-500 hover:text-red-600 transition-all ease-in hover:bg-red-100 rounded-md p-1.5 "
                              onClick={() => handleOpenDelete(typeVehicle)}
                            >
                              <i className="bi bi-trash " />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="card-title text-xl">
                          {typeVehicle.name}
                        </h3>
                        <p>Categoría de Vehiculo</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-5">
                  <p className="text-slate-500  text-center">
                    No se encontraron tipos de vehículos registrados
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <section className="space-y-5 pt-5">
          <div className="border-l-6 border-l-red-500 rounded-l-md pl-3">
            <h2 className="text-xl font-bold text-slate-800 ">
              Historial de Eliminados
            </h2>
            <p className="text-sm text-slate-500">
              Registros inactivos que pueden ser restaurados
            </p>
          </div>
          <div className="overflow-hidden rounded-xl shadow-md border border-slate-200">
            {isLoading ? (
              <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <Table
                columns={columns}
                data={inactiveTypesVehicleData.data}
                onRestore={
                  hasPermission("TYPE_VEHICLES", "U")
                    ? handleOpenRestore
                    : undefined
                }
              />
            )}

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
          </div>
        </section>
      </div>
      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registro de Nuevo Tipo de Vehículo"
        actions={
          <ActionButton
            type="register"
            isLoading={isSubmitting}
            form="RegisterForm"
          />
        }
      >
        <form
          id="RegisterForm"
          className="flex flex-col gap-3"
          onSubmit={handleRegister}
        >
          <Input
            type="text"
            name="name"
            label="Nombre:"
            value={newTypeVehicleForm.name}
            onChange={handleChange}
          />
          <div className="flex justify-center items-center h-6">
            {error.active && (
              <p className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {error.msg}
              </p>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Tipo de Vehículo"
        actions={
          <ActionButton type="edit" isLoading={isSubmitting} form="EditForm" />
        }
      >
        <form
          id="EditForm"
          className="flex flex-col gap-3"
          onSubmit={handleEdit}
        >
          <Input
            type="text"
            name="name"
            label="Nombre:"
            value={changedFields.name ?? currentTypeVehicle.name}
            onChange={handleEditChange}
          />
          <div className="flex justify-center items-center h-6">
            {error.active && (
              <p className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {error.msg}
              </p>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deleteText="Eliminar Trabajo"
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
            ¿Estás seguro de que deseas eliminar{" "}
            <span className="font-semibold text-slate-800">
              {currentTypeVehicle.name}
            </span>
            ?
          </p>
        </div>
      </Modal>
      <Modal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        restoreText="Restaurar Trabajo"
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
            ¿Estás seguro de que deseas restaurar{" "}
            <span className="font-semibold text-slate-800">
              {currentTypeVehicle.name}
            </span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default TypesVehicles;
