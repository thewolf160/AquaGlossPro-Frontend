import { useState, useMemo } from "react";
import Table from "../Table/Table";
import type { Item } from "../../types/models";
import HeaderPortal from "../HeaderPortal";
import HeaderSearch from "../HeaderSearch";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import ServicePricesModal from "./ServicePricesModal";
export interface CatalogService {
  id: number;
  name: string;
  category: string;
  comissionPercentage: number;
  prices: {
    moto: number | null;
    carro: number | null;
    camion: number | null;
  };
}

interface ComboPackage {
  id: string;
  name: string;
  includedServices: string[];
  comboPrice: number;
  originalPrice: number;
}

const initialServices: CatalogService[] = [
  { 
    id: 1, name: "Lavado Sencillo", category: "Exterior", comissionPercentage: 10,
    prices: { moto: 3, carro: 5, camion: 8 } 
  },
  { 
    id: 2, name: "Encerado", category: "Acabado", comissionPercentage: 15,
    prices: { moto: 5, carro: 10, camion: 15 } 
  },
  { 
    id: 3, name: "Aspirado Profundo", category: "Interior", comissionPercentage: 20,
    prices: { moto: null, carro: 7, camion: 10 } 
  },
];

const initialCombos: ComboPackage[] = [
  { 
    id: "c1", 
    name: "Combo Express", 
    includedServices: ["Lavado Sencillo", "Aspirado Profundo"], 
    comboPrice: 10, 
    originalPrice: 12
  },
  { 
    id: "c2", 
    name: "Combo VIP Brillante", 
    includedServices: ["Lavado Sencillo", "Encerado", "Aspirado Profundo"], 
    comboPrice: 18, 
    originalPrice: 22
  },
];

export default function ServiceCatalog() {
  const [services] = useState<CatalogService[]>(initialServices);
  const [combos] = useState<ComboPackage[]>(initialCombos);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const columns = [
    { 
      header: "Servicio", 
      key: "name",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div>
            <div className="font-bold text-gray-800">{servicio.name}</div>
            <div className="text-xs font-medium text-blue-600">Comisión: {servicio.comissionPercentage}%</div>
          </div>
        );
      }
    },
    { 
      header: "Categoría", 
      key: "category",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {servicio.category}
          </span>
        );
      }
    },
    { 
      header: "Tarifas por Vehículo", 
      key: "prices",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div className="flex flex-col gap-1 text-xs mx-auto w-fit">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 w-16 text-left"><i className="bi bi-bicycle mr-1"></i> Moto:</span>
              <span className="font-bold text-slate-800 w-12 text-right">{servicio.prices.moto ? `$${servicio.prices.moto.toFixed(2)}` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 w-16 text-left"><i className="bi bi-car-front mr-1"></i> Carro:</span>
              <span className="font-bold text-slate-800 w-12 text-right">{servicio.prices.carro ? `$${servicio.prices.carro.toFixed(2)}` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 w-16 text-left"><i className="bi bi-truck mr-1"></i> Camión:</span>
              <span className="font-bold text-slate-800 w-12 text-right">{servicio.prices.camion ? `$${servicio.prices.camion.toFixed(2)}` : 'N/A'}</span>
            </div>
          </div>
        );
      }
    },
    { 
      header: "Acciones", 
      key: "actions",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => {
                setSelectedService(servicio);
                setIsPricesModalOpen(true);
              }}
              className="btn bg-green-50 text-green-600 hover:bg-green-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer"
              title="Configurar Tarifas"
            >
              <i className="bi bi-tags-fill"></i>
            </button>
            <button 
              onClick={() => {
                setSelectedService(servicio);
                setIsEditModalOpen(true);
              }}
              className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer"
              title="Editar Servicio"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button 
              onClick={() => {
                setSelectedService(servicio);
                setIsDeleteModalOpen(true);
              }}
              className="btn bg-red-50 text-red-600 hover:bg-red-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer"
              title="Eliminar Servicio"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar Servicio o Categoría..."
          buttonText="Agregar Servicio"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </HeaderPortal>
      
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Servicios Individuales</h2>
        </div>

        <Table 
          columns={columns as any} 
          data={filteredServices as unknown as Item[]} 
          emptyMessage="No hay servicios que coincidan con la búsqueda."
        />
      </section>

       <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Paquetes y Combos</h2>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors border-none flex items-center gap-2 cursor-pointer shadow-sm">
            <i className="bi bi-plus-lg"></i> Crear Combo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-xl shadow-sm border border-yellow-300 p-6 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">{combo.name}</h3>
              
              <div className="flex-1 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Incluye:</p>
                <ul className="space-y-1">
                  {combo.includedServices.map((itemName, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <i className="bi bi-check2 text-green-500 font-bold"></i> {itemName}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 line-through">Normal: ${combo.originalPrice.toFixed(2)}</div>
                  <div className="text-2xl font-black text-gray-900">${combo.comboPrice.toFixed(2)}</div>
                </div>
                
                <div className="flex gap-2">
                  <button className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn bg-red-50 text-red-600 hover:bg-red-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modales */}
      <AddServiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      <ServicePricesModal 
        isOpen={isPricesModalOpen} 
        onClose={() => setIsPricesModalOpen(false)} 
        service={selectedService} 
      />

      <EditServiceModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} editingService={selectedService} />
      <DeleteServiceModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} deletingService={selectedService} />
    </div>
  );
}