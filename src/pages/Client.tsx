import { useState, useEffect } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import AddClientModal from "../components/client/AddClientModal";
import DeleteClientModal from "../components/client/DeleteClientModal";
import ClientVehiclesModal from "../components/client/ClientVehiclesModal";
import EditClientModal from "../components/client/EditClientModal";
import ClientCards from "../components/client/ClientCards";

import { useClients } from "../hooks/useClients";
import type { ClientMapped } from "../types/clients.types";

export default function Clients() {
  const { 
    clientsData, 
    isLoading, 
    newClientForm, 
    handleChange, 
    registerClient, 
    editClient,
    deleteClient,
    getClients 
  } = useClients();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<ClientMapped | null>(null);

  const [prevClientsData, setPrevClientsData] = useState(clientsData);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [globalStats, setGlobalStats] = useState({
    totalClients: 0,
    totalVehicles: 0,
    avgVehicles: "0",
    fleets: 0
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getClients(currentPage, searchTerm);
    }, 150); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, getClients]);

  
  if (clientsData !== prevClientsData) {
    setPrevClientsData(clientsData); 
    
    if (searchTerm === "" && currentPage === 1 && clientsData.data.length > 0) {
      const clients = clientsData.data;
      const totalClients = clientsData.meta?.totalItems || 0; 
      
      const totalVehicles = clients.reduce((acc, client) => acc + (client.vehicles?.length || 0), 0);
      const avgVehicles = clients.length > 0 ? (totalVehicles / clients.length).toFixed(1) : "0";
      const fleets = clients.filter(client => (client.vehicles?.length || 0) >= 3).length;

      setGlobalStats({ totalClients, totalVehicles, avgVehicles, fleets });
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const handleDeleteVehicle = (plateToDelete: string) => {
    if (selectedClient && selectedClient.vehicles) {
      const updatedVehicles = selectedClient.vehicles.filter(
        (vehicle) => vehicle.plate !== plateToDelete
      );
      setSelectedClient({ ...selectedClient, vehicles: updatedVehicles });
    }
  };

  const columns = [
    { key: "ci", header: "CI / RIF" },
    { 
      key: "fullname", 
      header: "Nombre Completo",
      render: (item: Item) => {
        const client = item as unknown as ClientMapped;
        return <span className="font-medium text-slate-800">{client.name} {client.lastname}</span>;
      }
    },
    { key: "numberPhone", header: "Teléfono" },
    { 
      key: "vehicles", 
      header: "Vehículos",
      render: (item: Item) => {
        const client = item as unknown as ClientMapped;
        const vehicleCount = client.vehicles?.length || 0;
        return (
          <button 
            onClick={() => {
              setSelectedClient(client);
              setIsVehiclesModalOpen(true);
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <i className="bi bi-car-front-fill text-blue-500"></i>
            {vehicleCount} Registrados
          </button>
        );
      }
    },
    { 
      key: "actions", 
      header: "Acciones",
      render: (item: Item) => {
        const client = item as unknown as ClientMapped;
        return (
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => {
                setSelectedClient(client);
                setIsEditModalOpen(true);
              }}
              className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer"
              title="Editar Cliente"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button 
              onClick={() => {
                setSelectedClient(client);
                setIsDeleteModalOpen(true);
              }} 
              className="btn bg-red-50 text-red-600 hover:bg-red-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer" 
              title="Eliminar Cliente"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 animate-fade-in">
        <HeaderPortal>
          <HeaderSearch
            searchPlaceholder="Buscar por nombre o CI..."
            buttonText="Agregar Cliente"
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onAddClick={() => setIsRegisterModalOpen(true)}
          />
        </HeaderPortal>
         
        <ClientCards stats={globalStats} />

        <section className="shadow-md rounded-xl overflow-hidden border border-slate-300 bg-white">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Directorio de Clientes</h2>
          </div>
          
          <Table
            columns={columns as any}
            data={clientsData.data as unknown as Item[]}
            emptyMessage={isLoading ? "Cargando clientes..." : "No hay clientes registrados."}
          />

          {clientsData.meta && clientsData.meta.totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-slate-50">
              <span className="text-sm text-slate-500 font-medium">
                Página {clientsData.meta.currentPage} de {clientsData.meta.totalPages} 
                <span className="ml-2 hidden sm:inline">(Total: {clientsData.meta.totalItems} clientes)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={clientsData.meta.currentPage === 1 || isLoading}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-slate-700 transition-colors"
                >
                  <i className="bi bi-chevron-left mr-1"></i> Anterior
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(clientsData.meta!.totalPages, p + 1))}
                  disabled={clientsData.meta.currentPage === clientsData.meta.totalPages || isLoading}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-slate-700 transition-colors"
                >
                  Siguiente <i className="bi bi-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <AddClientModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        formState={newClientForm}
        onChange={handleChange}
        onSubmit={registerClient}
        isLoading={isLoading}
      />

      {selectedClient && (
        <>
          <EditClientModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            editingClient={selectedClient}
            onEdit={editClient}     
            isLoading={isLoading}    
          />

          <DeleteClientModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            deletingClient={selectedClient} 
            onDelete={deleteClient}  
            isLoading={isLoading}    
          />

          <ClientVehiclesModal 
            isOpen={isVehiclesModalOpen} 
            onClose={() => setIsVehiclesModalOpen(false)} 
            client={{...selectedClient, vehicles: selectedClient.vehicles || []}} 
            onDeleteVehicle={handleDeleteVehicle}
          />
        </>
      )}
    </>
  );
}