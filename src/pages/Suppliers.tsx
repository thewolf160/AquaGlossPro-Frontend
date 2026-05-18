import React from "react";
import Table from "../components/Table/Table";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Alert from "../components/Alert";
import AddSupplierModal from "../components/suppliers/AddSupplierModal";
import EditSupplierModal from "../components/suppliers/EditSupplierModal";
import ViewSupplierModal from "../components/suppliers/ViewSupplierModal";
import DeleteSupplierModal from "../components/suppliers/DeleteSupplierModal";
import RestoreSupplierModal from "../components/suppliers/RestoreSupplierModal";

import type { Supplier } from "../types/suppliers.types";
import type { Item } from "../types/models";
import type { ColumnsProps } from "../components/Table/Table.types";
import { useSuppliers } from "../hooks/useSuppliers";
import { useModals } from "../hooks/useModals";
import { InitialNewSupplierForm } from "../types/suppliers.types";
import { hasPermission } from "../utils/checkPermissions.utils";

export default function Suppliers() {
  const {
    suppliersData,
    isLoading,
    isSubmitting,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    handleSearchChange,
    isActiveView,
    toggleActiveView,
    successMessage,
    setSuccessMessage,
    currentSupplier,
    setCurrentSupplier,
    editSupplierState,
    setEditSupplierState,
    handleEditChange,
    newSupplierForm,
    setNewSupplierForm,
    handleChange,
    registerSupplier,
    editSupplier,
    restoreSupplier,
    deleteSupplier,
  } = useSuppliers();

  const { modals, toggleModal } = useModals();

  const stats = {
    total: suppliersData.totals?.general || 0,
    active: suppliersData.totals?.active || 0,
    inactive: suppliersData.totals?.inactive || 0,
  };

  const handleOpenDetails = (item: Item) => {
    setCurrentSupplier(item as unknown as Supplier);
    toggleModal("details", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewSupplierForm(InitialNewSupplierForm);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerSupplier();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Proveedor registrado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenEdit = (item: Item) => {
    setEditSupplierState({
      ...(item as unknown as Supplier),
      error: false,
      errorMsg: "",
    });
    toggleModal("edit", true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editSupplier();
    if (success) {
      toggleModal("edit", false);
      setSuccessMessage("Proveedor editado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenDelete = (item: Item) => {
    setCurrentSupplier(item as unknown as Supplier);
    toggleModal("delete", true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteSupplier(String(currentSupplier.id));
    if (success) {
      toggleModal("delete", false);
      setSuccessMessage("Proveedor eliminado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenRestore = (item: Item) => {
    setCurrentSupplier(item as unknown as Supplier);
    toggleModal("restore", true);
  };

  const handleConfirmRestore = async () => {
    const success = await restoreSupplier(String(currentSupplier.id));
    if (success) {
      toggleModal("restore", false);
      setSuccessMessage("Proveedor restaurado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const columns: ColumnsProps[] = [
    {
      header: "Empresa",
      key: "companyName",
      mobile: true,
      render: (item: Item) => (
        <div className="font-bold text-gray-800 text-left">
          {(item as Supplier).companyName}
        </div>
      ),
    },
    {
      header: "RIF",
      key: "rif",
      mobile: true,
      render: (item: Item) => (
        <span className="font-medium text-slate-700">
          {(item as Supplier).rif}
        </span>
      ),
    },
    {
      header: "Teléfono",
      key: "numberPhone",
      mobile: true,
      render: (item: Item) => (
        <span className="text-slate-600">{(item as Supplier).numberPhone}</span>
      ),
    },
    {
      header: "Email",
      key: "email",
      mobile: false,
      render: (item: Item) => (
        <span className="text-sm text-slate-600">
          {(item as Supplier).email}
        </span>
      ),
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
    },
  ];

  const actionProps = isActiveView
    ? {
        ...(hasPermission("SUPPLIERS", "R") && { onView: handleOpenDetails }),
        ...(hasPermission("SUPPLIERS", "U") && { onEdit: handleOpenEdit }),
        ...(hasPermission("SUPPLIERS", "D") && { onDelete: handleOpenDelete }),
      }
    : {
        ...(hasPermission("SUPPLIERS", "R") && { onView: handleOpenDetails }),
        ...(hasPermission("SUPPLIERS", "U") && {
          onRestore: handleOpenRestore,
        }),
      };

  return (
    <div className="space-y-6 animate-fade-in">
      {successMessage && <Alert message={successMessage} />}

      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar por empresa, RIF, email o teléfono..."
          buttonText={
            hasPermission("SUPPLIERS", "C") ? "Agregar Proveedor" : undefined
          }
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={() => toggleModal("register", true)}
        />
      </HeaderPortal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <div
          className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 ${!isActiveView ? "border-slate-300" : "border-blue-200"}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${!isActiveView ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-600"}`}
          >
            <i className={`bi ${!isActiveView ? "bi-trash3" : "bi-truck"}`}></i>
          </div>
          <div>
            <p
              className={`text-sm font-medium ${!isActiveView ? "text-slate-600" : "text-blue-700"}`}
            >
              {!isActiveView
                ? "Total Inactivos"
                : "Total Proveedores Registrados"}
            </p>
            <p
              className={`text-2xl font-black ${!isActiveView ? "text-slate-800" : "text-blue-800"}`}
            >
              {!isActiveView ? stats.inactive : stats.total}
            </p>
          </div>
        </div>

        {isActiveView && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
              <i className="bi bi-check-circle"></i>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">
                Proveedores Activos
              </p>
              <p className="text-2xl font-black text-green-900">
                {stats.active}
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => toggleActiveView(true)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${isActiveView ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Activos
          </button>
          <button
            onClick={() => toggleActiveView(false)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${!isActiveView ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Inactivos
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-10">
              <span className="loading loading-spinner loading-xl text-blue-600"></span>
            </div>
          ) : (
            <Table
              columns={columns}
              data={suppliersData.data as Item[]}
              emptyMessage={
                searchParameter
                  ? "No se encontraron proveedores que coincidan con la búsqueda."
                  : "No hay proveedores registrados."
              }
              {...actionProps}
            />
          )}

          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold">{currentPage}</span> de{" "}
              <span className="font-bold">{totalPages || 1}</span>
            </p>
            <div className="join gap-2">
              <button
                className="join-item py-1.5 px-3 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <i className="bi bi-arrow-left-short text-xl" /> Anterior
              </button>
              <button
                className="join-item py-1.5 px-3 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage === totalPages || totalPages === 0 || isLoading
                }
              >
                Siguiente <i className="bi bi-arrow-right-short text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <AddSupplierModal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        formState={newSupplierForm}
        onChange={handleChange}
        onSubmit={handleRegisterSubmit}
        isLoading={isSubmitting}
      />

      <EditSupplierModal
        isOpen={modals.edit}
        onClose={() => toggleModal("edit", false)}
        editingSupplier={editSupplierState}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        isLoading={isSubmitting}
      />

      <ViewSupplierModal
        isOpen={modals.details}
        onClose={() => toggleModal("details", false)}
        supplier={currentSupplier}
      />

      <DeleteSupplierModal
        isOpen={modals.delete}
        onClose={() => toggleModal("delete", false)}
        deletingSupplier={currentSupplier}
        onDelete={handleConfirmDelete}
        isLoading={isSubmitting}
      />

      <RestoreSupplierModal
        isOpen={modals.restore}
        onClose={() => toggleModal("restore", false)}
        restoringSupplier={currentSupplier}
        onRestore={handleConfirmRestore}
        isLoading={isSubmitting}
      />
    </div>
  );
}
