import axios from "axios";
import { useState } from "react";
import type { Client } from "../types/clients.types";
import Table from "../components/Table/Table";
import { type Item } from "../types/models";
import { InitialClient, InitialNewClientForm } from "../types/clients.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Alert from "../components/Alert";

import ClientCards from "../components/client/ClientCards";
import ClientVehiclesModal from "../components/client/ClientVehiclesModal";
import RestoreClientModal from "../components/client/RestoreClientModal";

import AddClientModal from "../components/client/AddClientModal";
import EditClientModal from "../components/client/EditClientModal";
import DeleteClientModal from "../components/client/DeleteClientModal";
import ViewClientModal from "../components/client/ViewClientModal";
import DeleteVehicleConfirmModal from "../components/client/DeleteVehiculeConfirmModal";
import { useClients } from "../hooks/useClients";
import { useModals } from "../hooks/useModals";
import { ClientService } from "../services/clients.services";
import { VehicleService } from "../services/vehicles.services";
import { hasPermission } from "../utils/checkPermissions.utils";

function Clients() {
  const {
    clientsData,
    isLoading,
    currentClient,
    setCurrentClient,
    deleteClient,
    newClientForm,
    setNewClientForm,
    handleChange,
    registerClient,
    successMessage,
    setSuccessMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    handleSearchChange,
    searchParameter,
    isSubmitting,
    isActiveView,
    toggleActiveView,
    restoreClient,
    setClientsData,
  } = useClients();

  const { modals, toggleModal } = useModals();
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [clientToRestore, setClientToRestore] = useState<Client | null>(null);

  const [isConfirmDeleteVehicleOpen, setIsConfirmDeleteVehicleOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<{ id: string; plate: string } | null>(null);

  const globalStats = {
    totalClients: clientsData.totals?.general || 0,
    totalVehicles: clientsData.totals?.totalVehicles || 0,
    avgVehicles: clientsData.totals?.vehicleAverage || "0",
    fleets: clientsData.totals?.clientsWith3PlusVehicles || 0,
  };

  const handleDeleteVehicleRequest = (id: string, plate: string) => {
    setVehicleToDelete({ id, plate });
    setIsConfirmDeleteVehicleOpen(true);
  };

  const handleOpenVehiclesModal = async (client: Client) => {
    setCurrentClient(client);
    toggleModal("vehicles", true);
    setIsLoadingVehicles(true);

    try {
      const fetchedVehicles = await ClientService.getClientVehicles(client.ci);
      setCurrentClient((prev) => ({
        ...prev,
        vehicles: fetchedVehicles,
      }));
    } catch (error) {
      console.error("Ocurrió un error general:", error);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleConfirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      await VehicleService.delete(vehicleToDelete.id);

      setCurrentClient((prev) => {
        if (!prev || !prev.vehicles) return prev;
        const updatedVehicles = prev.vehicles.filter((v) => String(v.id) !== vehicleToDelete.id);
        return {
          ...prev,
          vehicles: updatedVehicles,
          countVehicles: updatedVehicles.length,
        };
      });

      setClientsData((prevData) => {
        const updatedClientsList = prevData.data.map((clientItem) => {
          if (clientItem.ci === currentClient.ci) {
            return {
              ...clientItem,
              countVehicles: Math.max(0, (clientItem.countVehicles || 0) - 1),
            };
          }
          return clientItem;
        });
        return {
          ...prevData,
          data: updatedClientsList,
        };
      });

      setSuccessMessage(`Vehículo ${vehicleToDelete.plate} eliminado con éxito`);
      setIsConfirmDeleteVehicleOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewClientForm(InitialNewClientForm);
  };

  const handleRegisterSubmit = async () => {
    const success = await registerClient();
    if (success) {
      setSuccessMessage("Cliente registrado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
  };

  const handleOpenDelete = (item: Item) => {
    setCurrentClient((prev) => ({ ...prev, ...item }));
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentClient(InitialClient);
  };

  const handleDeleteSubmit = async (id: number) => {
    const success = await deleteClient(String(id));
    if (success) {
      setSuccessMessage("Cliente eliminado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
  };

  const handleOpenEdit = (item: Item) => {
    setCurrentClient((prev) => ({ ...prev, ...item }));
    toggleModal("edit", true);
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setCurrentClient(InitialClient);
  };

  const handleEditSubmit = async (id: number, data: Partial<Client>) => {
    try {
      await ClientService.edit(String(id), data);
      setSuccessMessage("Cliente editado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      toggleActiveView(isActiveView);
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          msg: error.response?.data?.message || "Error al editar el cliente",
        };
      }
      return { success: false, msg: "Ocurrió un error inesperado al editar" };
    }
  };

  const handleOpenRestore = (item: Item) => {
    const client = item as Client;
    setClientToRestore(client);
    toggleModal("restore", true);
  };

  const handleCloseRestore = () => {
    toggleModal("restore", false);
    setClientToRestore(null);
  };

  const handleRestoreConfirm = async (id: string) => {
    const success = await restoreClient(id);
    if (success) {
      handleCloseRestore();
      setSuccessMessage("Cliente restaurado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
  };

  const handleOpenDetails = (item: Item) => {
    setCurrentClient((prev) => ({ ...prev, ...item }));
    toggleModal("details", true);
  };

  const handleCloseDetails = () => {
    toggleModal("details", false);
    setCurrentClient(InitialClient);
  };

  const columns = [
    { key: "ci", header: "CI / RIF", mobile: false }, 
    {
      key: "names",
      header: "Cliente",
      mobile: true,
      render: (item: Item) => {
        const client = item as Client;
        return (
          <div className="text-left flex flex-col min-w-30">
            <span className="font-bold text-gray-800 leading-tight">
              {client.names} {client.lastnames}
            </span>
            <span className="text-[10px] text-gray-500 sm:hidden">
              CI: {client.ci}
            </span>
            <span className="text-[10px] text-blue-500 sm:hidden">
              {client.numberPhone}
            </span>
          </div>
        );
      },
    },
    { key: "numberPhone", header: "Teléfono", mobile: false }, 
    {
      key: "vehicles",
      header: "Vehículos",
      mobile: false, 
      render: (item: Item) => {
        const client = item as Client;
        const vehicleCount = client.countVehicles || 0;
        return (
          <button
            onClick={() => handleOpenVehiclesModal(client)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer whitespace-nowrap"
          >
            <i className="bi bi-car-front-fill text-blue-500 text-base"></i>
            <span>{vehicleCount} Registrados</span>
          </button>
        );
      },
    },
    { key: "actions", header: "Acciones", mobile: true },
  ];

  const actionProps = isActiveView
    ? {
        ...(hasPermission("CLIENTS", "R") && {onView: handleOpenDetails}),
        ...(hasPermission("CLIENTS", "U") && {onEdit: handleOpenEdit}),
        ...(hasPermission("CLIENTS", "D") &&{ onDelete: handleOpenDelete}),
      }
    : {
        ...(hasPermission("CLIENTS", "R") && {onView: handleOpenDetails}),
        ...(hasPermission("CLIENTS", "U") &&{onRestore: handleOpenRestore}),
      };

  return (
    <div className="w-full">
      {successMessage && <Alert message={successMessage} />}
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar cliente por nombre o cédula..."
          buttonText={hasPermission("CLIENTS", "C") ? "Agregar Cliente" : undefined}
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>

      <div className="flex flex-col gap-6 w-full">
        <ClientCards stats={globalStats} isActiveView={isActiveView} />

        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 w-full overflow-hidden">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center bg-gray-100 p-1 rounded-lg gap-1 w-full sm:w-auto">
              <button
                onClick={() => toggleActiveView(true)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActiveView
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => toggleActiveView(false)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  !isActiveView
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>

          <section className="shadow-sm rounded-xl overflow-hidden border border-slate-200 w-full">
            <div className="bg-white px-4 md:px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">
                Directorio de Clientes
              </h2>
            </div>

            <div className="w-full">
              {isLoading ? (
                <div className="flex items-center justify-center p-10">
                  <span className="loading loading-spinner loading-xl text-blue-600"></span>
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={clientsData.data}
                  {...actionProps}
                />
              )}
            </div>

            <div className="bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-3 w-full">
              <p className="text-xs md:text-sm text-slate-500 text-center sm:text-left">
                Página <span className="font-bold text-slate-900">{currentPage}</span> de{" "}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </p>
              <div className="join gap-2 w-full sm:w-auto flex justify-center">
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50 flex-1 sm:flex-none"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <i className="bi bi-arrow-left-short text-lg md:text-xl" /> Anterior
                </button>
                <button
                  className="join-item py-1.5 px-3 text-xs md:text-sm cursor-pointer border border-slate-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50 flex-1 sm:flex-none"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Siguiente <i className="bi bi-arrow-right-short text-lg md:text-xl" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ViewClientModal
        isOpen={modals.details || false}
        onClose={handleCloseDetails}
        client={currentClient}
      />

      <AddClientModal
        isOpen={modals.register || false}
        onClose={handleCloseRegister}
        formState={newClientForm}
        onChange={handleChange}
        onSubmit={handleRegisterSubmit}
        isLoading={isSubmitting}
      />

      <EditClientModal
        isOpen={modals.edit || false}
        onClose={handleCloseEdit}
        editingClient={currentClient}
        onEdit={handleEditSubmit}
        isLoading={isSubmitting}
      />

      <DeleteClientModal
        isOpen={modals.delete || false}
        onClose={handleCloseDelete}
        deletingClient={currentClient}
        onDelete={handleDeleteSubmit}
        isLoading={isSubmitting}
      />

      <ClientVehiclesModal
        isOpen={modals.vehicles || false}
        onClose={() => toggleModal("vehicles", false)}
        client={currentClient}
        onDeleteVehicle={handleDeleteVehicleRequest}
        isLoading={isLoadingVehicles}
      />

      <DeleteVehicleConfirmModal
        isOpen={isConfirmDeleteVehicleOpen}
        onClose={() => setIsConfirmDeleteVehicleOpen(false)}
        onConfirm={handleConfirmDeleteVehicle}
        plate={vehicleToDelete?.plate || ""}
        isLoading={isSubmitting}
      />

      <RestoreClientModal
        isOpen={modals.restore || false}
        onClose={handleCloseRestore}
        restoringClient={clientToRestore}
        onRestore={handleRestoreConfirm}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default Clients;