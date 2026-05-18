import { useCategories } from "../../hooks/useCategories";
import type { Item } from "../../types/models";
import type { Categorie } from "../../types/categories.types";
import { useModals } from "../../hooks/useModals";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import {
  InitialNewCategorie,
  InitialCategorie,
} from "../../types/categories.types";
import Input from "../../components/Modal/Input";
import ActionButton from "../../components/Modal/ActionButton";
import Alert from "../../components/Alert";
import NavBar from "./ui/NavBar";
import { hasPermission } from "../../utils/checkPermissions.utils";

const columns = [
  { key: "name", header: "Nombre", mobile: true },
  { key: "type", header: "Tipo", mobile: true },
  { key: "actions", header: "Acciones", mobile: true },
];

function Categories() {
  const {
    categoriesData,
    isLoading,
    isSubmitting,
    handleChange,
    registerCategorie,
    setNewCategorieForm,
    newCategorieForm,
    successMessage,
    setSuccessMessage,
    error,
    setError,
    deleteCategorie,
    currentCategorie,
    setCurrentCategorie,
    setChangedFields,
    editCategorie,
    changedFields,
    handleEditChange,
    inactiveCategoriesData,
    restoreCategorie,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useCategories();

  const { modals, toggleModal } = useModals();

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewCategorieForm(InitialNewCategorie);
    setError({ active: false, msg: "" });
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerCategorie();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Registrado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDelete = (item: Item | Categorie) => {
    toggleModal("delete", true);
    setCurrentCategorie(item as Categorie);
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentCategorie(InitialCategorie);
  };

  const handleDelete = async () => {
    const success = await deleteCategorie();
    if (success) {
      handleCloseDelete();
      setSuccessMessage("Eliminado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenEdit = (item: Item | Categorie) => {
    toggleModal("edit", true);
    setCurrentCategorie(item as Categorie);
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setCurrentCategorie(InitialCategorie);
    setChangedFields({});
    setError({ active: false, msg: "" });
  };

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editCategorie();
    if (success) {
      handleCloseEdit();
      setSuccessMessage("Editado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenRestore = (item: Item | Categorie) => {
    toggleModal("restore", true);
    setCurrentCategorie(item as Categorie);
  };

  const handleCloseRestore = () => {
    toggleModal("restore", false);
    setCurrentCategorie(InitialCategorie);
  };

  const handleRestore = async () => {
    const success = await restoreCategorie();
    if (success) {
      handleCloseRestore();
      setCurrentCategorie(InitialCategorie);
      setSuccessMessage("Restaurado con Éxito");
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
          title="Categorías"
          onRegister={
            hasPermission("CATEGORIES", "C") ? handleOpenRegister : undefined
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="p-10 col-span-full flex items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {categoriesData.data.length > 0 ? (
                categoriesData.data.map((categorie: Categorie) => (
                  <div
                    key={categorie.id}
                    className="card bg-white border border-slate-200 border-t-5 border-t-blue-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ease-out duration-200"
                  >
                    <div className="card-body gap-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-blue-100 px-2 py-1 rounded-lg">
                          <i className="bi bi-tags text-2xl text-blue-500" />
                        </div>
                        <div className="flex gap-2">
                          {hasPermission("CATEGORIES", "U") && (
                            <button
                              className="cursor-pointer text-xl text-sky-500 hover:text-sky-600 transition-all ease-in hover:bg-sky-100 rounded-md p-1.5"
                              onClick={() => handleOpenEdit(categorie)}
                            >
                              <i className="bi bi-pencil-square " />
                            </button>
                          )}
                          {hasPermission("CATEGORIES", "D") && (
                            <button
                              className="cursor-pointer text-xl text-red-500 hover:text-red-600 transition-all ease-in hover:bg-red-100 rounded-md p-1.5 "
                              onClick={() => handleOpenDelete(categorie)}
                            >
                              <i className="bi bi-trash " />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="card-title text-xl">{categorie.name}</h3>
                        <p className="mt-1 font-medium text-blue-600">
                          {categorie.type === "s"
                            ? "Servicio"
                            : categorie.type === "p"
                              ? "Producto"
                              : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {categorie.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-5">
                  <p className="text-slate-500  text-center">
                    No se encontraron categorías registradas
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
                data={inactiveCategoriesData.data.map((cat) => ({
                  ...cat,
                  type:
                    cat.type === "s"
                      ? "Servicio"
                      : cat.type === "p"
                        ? "Producto"
                        : cat.type,
                }))}
                onRestore={
                  hasPermission("CATEGORIES", "U")
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
        title="Registro de Nueva Categoría"
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
            value={newCategorieForm.name}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="description"
            label="Descripción:"
            value={newCategorieForm.description}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1 w-full relative">
            <label className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              name="type"
              value={newCategorieForm.type}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
            >
              <option value="">Selecciona un tipo</option>
              <option value="s">Servicio</option>
              <option value="p">Producto</option>
            </select>
          </div>
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
        title="Edición de Categoría"
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
            value={changedFields.name ?? currentCategorie.name}
            onChange={handleEditChange}
          />
          <Input
            type="text"
            name="description"
            label="Descripción:"
            value={changedFields.description ?? currentCategorie.description}
            onChange={handleEditChange}
          />
          <div className="flex flex-col gap-1 w-full relative">
            <label className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              name="type"
              value={
                changedFields.type !== undefined
                  ? changedFields.type
                  : currentCategorie.type || ""
              }
              onChange={handleEditChange}
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
            >
              <option value="">Selecciona un tipo</option>
              <option value="s">Servicio</option>
              <option value="p">Producto</option>
            </select>
          </div>
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
        deleteText="Eliminar Categoría"
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
              {currentCategorie.name}
            </span>
            ?
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        restoreText="Restaurar Categoría"
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
              {currentCategorie.name}
            </span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Categories;
