import React, {  useMemo } from "react";
import type { Client, ClientVehicle } from "../types/clients.types";
import Table from "../components/Table/Table";
import { type Item } from "../types/models";
import { InitialClient, InitialNewClientForm } from "../types/clients.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import ActionButton from "../components/Modal/ActionButton";
import Alert from "../components/Alert";

import ClientCards from "../components/client/ClientCards";
import ClientVehiclesModal from "../components/client/ClientVehiclesModal";

import { useClients } from "../hooks/useClients";
import { useModals } from "../hooks/useModals";

function Clients() {
  const {
    clientsData,
    isLoading,
    currentClient,
    setCurrentClient,
    editClientState,
    setEditClientState,
    handleEditChange,
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
    editClient,
    handleSearchChange,
    searchParameter,
    isSubmitting,
  } = useClients();

  const { modals, toggleModal } = useModals();

const globalStats = useMemo(() => {
  if (!clientsData.data || clientsData.data.length === 0) {
    return { totalClients: 0, totalVehicles: 0, avgVehicles: "0", fleets: 0 };
  } 
  const clients = clientsData.data as Client[]; 
  const totalClients = clientsData.totalClients || 0;
  const totalVehicles = clients.reduce((acc, client) => acc + (client.vehicles?.length || 0), 0);
  const avgVehicles = clients.length > 0 ? (totalVehicles / clients.length).toFixed(1) : "0";
  const fleets = clients.filter((client) => (client.vehicles?.length || 0) >= 3).length;

  return { totalClients, totalVehicles, avgVehicles, fleets };
}, [clientsData]); 

  
 

  const handleDeleteVehicle = (plateToDelete: string) => {
    if (currentClient && currentClient.vehicles) {
      const updatedVehicles = currentClient.vehicles.filter(
        (vehicle: ClientVehicle) => vehicle.plate !== plateToDelete
      );
      setCurrentClient({ ...currentClient, vehicles: updatedVehicles });
    }
  };


  const handleOpenDelete = (item: Item) => {
    setCurrentClient((prev) => ({ ...prev, ...item }));
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentClient(InitialClient);
  };

  const handleDelete = async () => {
    const success = await deleteClient(String(currentClient.id));
    if (success) handleCloseDelete();
  };

  const handleOpenRegister = () => toggleModal("register", true);

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewClientForm(InitialNewClientForm);
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerClient();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Cliente registrado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true);
    setEditClientState((prev) => ({ ...prev, ...item }));
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setEditClientState(InitialClient);
  };

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editClient();
    if (success) {
      handleCloseEdit();
      setSuccessMessage("Cliente editado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
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
        const client = item as any;
        const vehicleCount = client.vehicles?.length || 0;
        return (
          <button
            onClick={() => {
              setCurrentClient(client);
              toggleModal("vehicles", true);
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <i className="bi bi-car-front-fill text-blue-500"></i>
            {vehicleCount} Registrados
          </button>
        );
      }
    },
    { key: "actions", header: "Acciones", mobile: true },
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
          <div className="bg-white px-6 py-3 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Directorio de Clientes
            </h2>
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
              onDelete={handleOpenDelete}
              onEdit={handleOpenEdit}
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

      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registro de Nuevo Cliente"
        actions={<ActionButton type="register" isLoading={isSubmitting} form="RegisterForm" />}
      >
        <form className="flex flex-col gap-3" onSubmit={handleRegister} id="RegisterForm">
          <div className="grid grid-cols-2 gap-4">
            <Input name="names" label="Nombres:" type="text" placeholder="Ej: Juan" onChange={handleChange} value={newClientForm.form.names} />
            <Input name="lastnames" label="Apellidos:" type="text" placeholder="Ej: Pérez" onChange={handleChange} value={newClientForm.form.lastnames} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="ci" label="Cédula / RIF:" type="text" placeholder="V12345678" onChange={handleChange} value={newClientForm.form.ci} icon={<i className="bi bi-person-vcard text-xl" />} />
            <Input name="numberPhone" label="Teléfono:" type="tel" placeholder="+58-4121234567" onChange={handleChange} value={newClientForm.form.numberPhone} icon={<i className="bi bi-telephone text-xl" />} />
          </div>
          <div className="flex justify-center items-center h-8">
            {newClientForm.error && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {newClientForm.errorMsg}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deleteText="Eliminar Cliente"
        actions={<ActionButton type="delete" isLoading={isSubmitting} onClick={handleDelete} />}
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold text-slate-800">
              {currentClient.names} {currentClient.lastnames}
            </span>?
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Cliente"
        actions={<ActionButton type="edit" isLoading={isSubmitting} form="EditForm" />}
      >
        <form className="flex flex-col gap-3" onSubmit={handleEdit} id="EditForm">
          <div className="grid grid-cols-2 gap-4">
            <Input name="names" label="Nombres:" type="text" onChange={handleEditChange} value={editClientState.names} />
            <Input name="lastnames" label="Apellidos:" type="text" onChange={handleEditChange} value={editClientState.lastnames} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="ci" label="Cédula / RIF:" type="text" onChange={handleEditChange} value={editClientState.ci} icon={<i className="bi bi-person-vcard text-xl" />} />
            <Input name="numberPhone" label="Teléfono:" type="text" onChange={handleEditChange} value={editClientState.numberPhone} icon={<i className="bi bi-telephone text-xl" />} />
          </div>
          <div className="flex justify-center items-center h-8">
            {editClientState.error && (
              <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                {editClientState.errorMsg}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <ClientVehiclesModal 
        isOpen={modals.vehicles || false} 
        onClose={() => toggleModal("vehicles", false)} 
        client={{
          ...currentClient, 
          name: currentClient.names, 
          lastname: currentClient.lastnames,
          vehicles: currentClient.vehicles || []
        }} 
        onDeleteVehicle={handleDeleteVehicle}
      />
    </>
  );
}

export default Clients;