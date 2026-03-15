import { useState, useMemo } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import AddClientModal from "../components/client/AddClientModal";
import DeleteClientModal from "../components/client/DeleteClientModal";
import ClientVehiclesModal from "../components/client/ClientVehiclesModal";
import EditClientModal from "../components/client/EditClientModal";
import ClientCards from "../components/client/ClientCards";

interface Vehicle {
  plate: string;
  model: string;
}

export interface ClientData {
  clientId: number;
  name: string;
  lastname: string;
  ci: string;
  numberPhone: string;
  vehicles: Vehicle[];
}

const mockClients: ClientData[] = [
  {
    clientId: 1,
    name: "Fabián Dacal",
    lastname: "Dacal",
    ci: "29654464",
    numberPhone: "04120000000",
    vehicles: [{ plate: "ABC-123", model: "Toyota Corolla" }],
  },
  {
    clientId: 2,
    name: "María López",
    lastname: "López",
    ci: "18543987",
    numberPhone: "04149876543",
    vehicles: [
      { plate: "XYZ-987", model: "Ford Explorer" },
      { plate: "LMN-456", model: "Honda Civic" },
    ],
  },
  {
    clientId: 3,
    name: "Carlos Mendoza",
    lastname: "Mendoza",  
    ci: "15432198",
    numberPhone: "04241234567",
    vehicles: [{ plate: "QWE-321", model: "Chevrolet Spark" }],
  },
  {
    clientId: 4,
    name: "Empresa Delivery Express",
    lastname: "Delivery Express",
    ci: "J-40123456",
    numberPhone: "04165554433",
    vehicles: [
      { plate: "MOTO-1", model: "Bera Empire" },
      { plate: "MOTO-2", model: "Bera Empire" },
      { plate: "MOTO-3", model: "Bera Empire" },
      { plate: "MOTO-4", model: "Bera Empire" },
    ],
  },
];


export default function Clients() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => {
    const totalClients = mockClients.length;
    const totalVehicles = mockClients.reduce((acc, client) => acc + client.vehicles.length, 0);
    const avgVehicles = totalClients > 0 ? (totalVehicles / totalClients).toFixed(1) : "0";
    const fleets = mockClients.filter(client => client.vehicles.length >= 3).length;

    return { totalClients, totalVehicles, avgVehicles, fleets };
  }, []);

  const handleDeleteVehicle = (plateToDelete: string) => {
    if (selectedClient) {
      const updatedVehicles = selectedClient.vehicles.filter(
        (vehicle) => vehicle.plate !== plateToDelete
      );
      
      setSelectedClient({
        ...selectedClient,
        vehicles: updatedVehicles
      });
      
    }
  };

  const columns = [
    { key: "ci", header: "CI / RIF" },
    { 
      key: "fullname", 
      header: "Nombre Completo",
      render: (item: Item) => {
        const client = item as unknown as ClientData;
        return <span className="font-medium text-slate-800">{client.name} {client.lastname}</span>;
      }
    },
    { key: "numberPhone", header: "Teléfono" },
    { 
      key: "vehicles", 
      header: "Vehículos",
      render: (item: Item) => {
        const client = item as unknown as ClientData;
        return (
          <button 
            onClick={() => {
              setSelectedClient(client);
              setIsVehiclesModalOpen(true);
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
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
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsRegisterModalOpen(true)}
          />
        </HeaderPortal>
         
          {/* Tarjetas KPIS*/}
          <ClientCards stats={stats} />

          {/*Tabla de clientes registrados */}

        <section className="shadow-md rounded-xl overflow-hidden border border-slate-300 bg-white">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Directorio de Clientes</h2>
          </div>
          <Table
            columns={columns as any}
            data={mockClients as unknown as Item[]}
            emptyMessage="No hay clientes registrados."
          />
        </section>
      </div>

      <AddClientModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingClient={selectedClient}
      />

      <DeleteClientModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        deletingClient={selectedClient} 
      />

      <ClientVehiclesModal 
        isOpen={isVehiclesModalOpen} 
        onClose={() => setIsVehiclesModalOpen(false)} 
        client={selectedClient} 
        onDeleteVehicle={handleDeleteVehicle}
      />
    </>
  );
}