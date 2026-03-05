import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import { useState, useMemo } from "react";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";

interface Vehicle {
  plate: string;
  model: string;
}

interface ClientData {
  id: number;
  name: string;
  ci: string;
  phone_number: string;
  email: string;
  vehicles: Vehicle[];
}

const mockClients: ClientData[] = [
  {
    id: 1,
    name: "Fabián Dacal",
    ci: "29654464",
    phone_number: "04120000000",
    email: "fabian@email.com",
    vehicles: [{ plate: "ABC-123", model: "Toyota Corolla" }],
  },
  {
    id: 2,
    name: "María López",
    ci: "18543987",
    phone_number: "04149876543",
    email: "maria.l@email.com",
    vehicles: [
      { plate: "XYZ-987", model: "Ford Explorer" },
      { plate: "LMN-456", model: "Honda Civic" },
    ],
  },
  {
    id: 3,
    name: "Carlos Mendoza",
    ci: "15432198",
    phone_number: "04241234567",
    email: "carlos.m@email.com",
    vehicles: [{ plate: "QWE-321", model: "Chevrolet Spark" }],
  },
  {
    id: 4,
    name: "Empresa Delivery Express",
    ci: "J-40123456",
    phone_number: "04165554433",
    email: "flota@delivery.com",
    vehicles: [
      { plate: "MOTO-1", model: "Bera Empire" },
      { plate: "MOTO-2", model: "Bera Empire" },
      { plate: "MOTO-3", model: "Bera Empire" },
      { plate: "MOTO-4", model: "Bera Empire" },
    ],
  },
];

function Clients() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const stats = useMemo(() => {
    const totalClients = mockClients.length;
    const totalVehicles = mockClients.reduce((acc, client) => acc + client.vehicles.length, 0);
    const avgVehicles = totalClients > 0 ? (totalVehicles / totalClients).toFixed(1) : "0";
    const fleets = mockClients.filter(client => client.vehicles.length >= 3).length;

    return { totalClients, totalVehicles, avgVehicles, fleets };
  }, []);

  const columns = [
    { key: "ci", header: "CI / RIF" },
    { key: "name", header: "Nombre del Cliente" },
    { key: "phone_number", header: "Teléfono" },
    { 
      key: "vehicles", 
      header: "Vehículos",
      render: (item: Item) => {
        const client = item as unknown as ClientData;
        return (
          <button 
            onClick={() => handleOpenVehiclesModal(client)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="bi bi-car-front-fill text-blue-500"></i>
            {client.vehicles.length} Registrados
          </button>
        );
      }
    },
    { 
      key: "actions", 
      header: "Acciones",
      render: (item: Item) => {
        const client = item as unknown as ClientData;
        return (
          <div className="flex justify-center gap-2">
            <button className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0">
              <i className="bi bi-pencil-square"></i>
            </button>
            <button onClick={() => handleOpenDeleteModal(client)} className="btn bg-red-50 text-red-600 hover:bg-red-100 border-none min-h-0 h-9 w-9 p-0" title="Eliminar Cliente">
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      }
    },
  ];

  const handleOpenVehiclesModal = (client: ClientData) => {
    setSelectedClient(client);
    setIsVehiclesModalOpen(true);
  };

  const handleOpenRegisterModal = () => setIsRegisterModalOpen(true);
  const handleOpenDeleteModal = (client: ClientData) => {
    setSelectedClient(client as unknown as ClientData);
    setIsDeleteModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

  };

  return (
    <>
      <div className="flex flex-col gap-6 animate-fade-in">
        <HeaderPortal>
          <HeaderSearch
            searchPlaceholder="Buscar por nombre o CI..."
            buttonText="Agregar Cliente"
            searchTerm= {searchTerm}
            onSearchChange={handleSearch}
            onAddClick={handleOpenRegisterModal}
          />
        </HeaderPortal>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center  gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="bi bi-people-fill"></i>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Clientes</p>
            <p className="text-2xl font-black text-blue-800">
              {stats.totalClients}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
            <i className="bi bi-car-front-fill"></i>
          </div>
          <div>
            <p className="text-sm text-red-700 font-medium">
              Vehículos Registrados
            </p>
            <p className="text-2xl font-black text-red-700">
              {stats.totalVehicles}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
            <i className="bi bi-bar-chart-fill"></i>
          </div>
          <div>
            <p className="text-sm text-yellow-700 font-medium">Promedio por cliente</p>
            <p className="text-2xl font-black text-yellow-700">
              {stats.avgVehicles}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
            <i className="bi bi-building"></i>
          </div>
          <div>
            <p className="text-sm text-indigo-700 font-medium">Flotas (3+ Autos)</p>
            <p className="text-2xl font-black text-indigo-700">
              {stats.fleets}
            </p>
          </div>
        </div>
      </div>

        {/*TABLA DE CLIENTES*/}
        <section className="shadow-md rounded-xl overflow-hidden border border-slate-300 bg-white">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Directorio de Clientes
            </h2>
          </div>
          <Table
            columns={columns as any}
            data={mockClients as unknown as Item[]}
            emptyMessage="No hay clientes registrados."
          />
        </section>
      </div>

      {/*MODALEs*/}
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Nuevo Cliente" actions={<button className="btn bg-blue-600 text-white hover:bg-blue-700">Guardar</button>}>
        <form className="flex flex-col gap-4">
           <Input name="name" label="Nombre Completo:" type="text" />
           <Input name="ci" label="Cédula / RIF:" type="text" />
           <Input name="phone" label="Teléfono:" type="number" placeholder="04120000000" />
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} deleteText="Eliminar Cliente" actions={<button className="btn bg-red-600 text-white hover:bg-red-700">Eliminar</button>}>
        <p className="text-center text-slate-700 py-4">
          ¿Estás seguro de que deseas eliminar a <span className="font-bold">{selectedClient?.name}</span>?
        </p>
      </Modal>

      <Modal 
        isOpen={isVehiclesModalOpen} 
        onClose={() => setIsVehiclesModalOpen(false)} 
        title={`Vehículos de ${selectedClient?.name}`}
        actions={
          <button className="btn bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2">
            <i className="bi bi-plus-lg"></i> Añadir Vehículo
          </button>
        }
      >
        <div className="flex flex-col gap-3 pt-2 max-h-100 overflow-y-auto">
          {selectedClient?.vehicles.map((vehiculo, index) => (
            <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-sm">
                  <i className="bi bi-car-front"></i>
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg leading-none">{vehiculo.plate}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">{vehiculo.model}</p>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-600 p-2 transition-colors" title="Eliminar vehículo">
                <i className="bi bi-trash text-lg"></i>
              </button>
            </div>
          ))}

          {selectedClient?.vehicles.length === 0 && (
            <p className="text-center text-slate-500 py-4 italic">Este cliente no tiene vehículos registrados.</p>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Clients;