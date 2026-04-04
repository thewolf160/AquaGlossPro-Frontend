import axios from "axios";
import  { useMemo, useState } from "react";
import type { Client, ClientVehicle, BackendGroupedClient } from "../types/clients.types";
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

import { useClients } from "../hooks/useClients";
import { useModals } from "../hooks/useModals";
import { ClientService } from "../services/clients.services"; 

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
    restoreClient
  } = useClients();

  const { modals, toggleModal } = useModals();
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [clientToRestore, setClientToRestore] = useState<Client | null>(null);

  const globalStats = useMemo(() => {
    const totalClients = clientsData.totalClients || 0;

    if (!clientsData.data || clientsData.data.length === 0) {
      return { totalClients: totalClients, totalVehicles: 0, avgVehicles: "0", fleets: 0 };
    } 
    
    const clients = clientsData.data as Client[]; 
    const totalVehicles = clients.reduce((acc, client) => acc + (client.countVehicles || 0), 0);
    const avgVehicles = clients.length > 0 ? (totalVehicles / clients.length).toFixed(1) : "0";
    const fleets = clients.filter((client) => (client.countVehicles || 0) >= 3).length;

    return { totalClients, totalVehicles, avgVehicles, fleets };
  }, [clientsData]); 

  
  const handleOpenVehiclesModal = async (client: Client) => {
    setCurrentClient(client);
    toggleModal("vehicles", true);
    setIsLoadingVehicles(true);

    try {
      const response = await ClientService.getClientVehicles(client.names);
            const groupedClientsList: BackendGroupedClient[] = Array.isArray(response.data?.data) 
        ? response.data.data 
        : Array.isArray(response.data) ? response.data : [];
     
      const exactClient = groupedClientsList.find((c) => c.ci === client.ci);
      
      let fetchedVehicles: ClientVehicle[] = [];

      if (exactClient && exactClient.vehicles) {
        fetchedVehicles = exactClient.vehicles.map((v) => ({
          id: v.vehicleId, 
          plate: v.plate,
          model: { name: v.typeVehicle?.name || "Desconocido" },
        }));
      }
      setCurrentClient((prev) => ({ ...prev, vehicles: fetchedVehicles }));
    } catch (error) {
      console.error("Error al cargar los vehículos", error);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number, plateToDelete: string) => {
    try {
      await ClientService.deleteVehicle(vehicleId);
      if (currentClient && currentClient.vehicles) {
        const updatedVehicles = currentClient.vehicles.filter((vehicle: ClientVehicle) => vehicle.id !== vehicleId);
        setCurrentClient({ ...currentClient, vehicles: updatedVehicles });
        setSuccessMessage(`Vehículo con placa ${plateToDelete} eliminado`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error al eliminar el vehículo", error);
    }
  };

  const handleOpenRegister = () => toggleModal("register", true);
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
          msg: error.response?.data?.message || "Error al editar el cliente" 
        };
      }
            return { success: false, msg: "Ocurrió un error inesperado al editar" };
    }
  };
  // --- RESTAURAR ---
  const handleOpenRestore = (client: Client) => {
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

 
  const columns = [
    { key: "ci", header: "CI / RIF", mobile: true },
    { key: "names", header: "Nombres", mobile: true },
    { key: "lastnames", header: "Apellidos", mobile: true },
    { key: "numberPhone", header: "Teléfono", mobile: false },
    {
      key: "vehicles",
      header: "Vehículos",
      mobile: true,
      render: (item: Item) => {
        const client = item as Client;
        const vehicleCount = client.countVehicles || 0; 
        return (
          <button
            onClick={() => handleOpenVehiclesModal(client)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <i className="bi bi-car-front-fill text-blue-500"></i>
            {vehicleCount} Registrados
          </button>
        );
      }
    },
    ...(!isActiveView ? [{ 
      key: "restore", 
      header: "Acciones", 
      mobile: true,
      render: (item: Item) => {
        const client = item as Client;
        return (
          <button
            onClick={() => handleOpenRestore(client)}
            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold transition-colors mx-auto flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-arrow-clockwise"></i> Restaurar
          </button>
        );
      }
    }] : [
      { key: "actions", header: "Acciones", mobile: true } 
    ]),
  ];

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar cliente por nombre o cédula..."
          buttonText="Agregar Cliente"
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>
      
      <div className="flex flex-col gap-6">
        <ClientCards stats={globalStats} />

        <section className="shadow-md rounded-xl overflow-hidden border border-slate-200">
          <div className="bg-white px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Directorio de Clientes
            </h2>
            <div className="join border border-slate-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleActiveView(true)}
                className={`join-item px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${isActiveView ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                Activos
              </button>
              <button
                onClick={() => toggleActiveView(false)}
                className={`join-item px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${!isActiveView ? 'bg-red-50 text-red-700' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                Inactivos
              </button>
            </div>
          </div>

          <div className="relative min-h-75">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-b-xl">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
              </div>
            )}
            
            <Table
              columns={columns}
              data={clientsData.data}
              onDelete={isActiveView ? handleOpenDelete : undefined}
              onEdit={isActiveView ? handleOpenEdit : undefined}
            />
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
                <i className="bi bi-arrow-left-short text-xl" /> Anterior
              </button>
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Siguiente <i className="bi bi-arrow-right-short text-xl" />
              </button>
            </div>
          </div>
        </section>
      </div>

      
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
        onDeleteVehicle={handleDeleteVehicle}
        isLoading={isLoadingVehicles}
      />

      <RestoreClientModal 
        isOpen={modals.restore || false}
        onClose={handleCloseRestore}
        restoringClient={clientToRestore}
        onRestore={handleRestoreConfirm}
        isLoading={isSubmitting}
      />
    </>
  );
}

export default Clients;