import { useState } from "react";
import Table from "../Table/Table";
import type { Item } from "../../types/models";

interface CatalogService {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface ComboPackage {
  id: string;
  name: string;
  includedServices: string[];
  comboPrice: number;
  originalPrice: number;
}

// --- Datos Iniciales ---
const initialServices: CatalogService[] = [
  { id: 1, name: "Lavado Sencillo", category: "Exterior", price: 5 },
  { id: 2, name: "Encerado", category: "Acabado", price: 10 },
  { id: 3, name: "Aspirado Profundo", category: "Interior", price: 7 },
  { id: 4, name: "Pulitura de Faros", category: "Exterior", price: 15 },
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
  const [services, setServices] = useState<CatalogService[]>(initialServices);
  const [combos] = useState<ComboPackage[]>(initialCombos);

  const handleEdit = (item: Item) => {
    const servicio = item as unknown as CatalogService;
    console.log("Abrir modal para editar:", servicio.name);
  };

  const handleDelete = (item: Item) => {
    const servicio = item as unknown as CatalogService;
    const confirmacion = window.confirm(`¿Seguro que deseas borrar ${servicio.name}?`);
    if (confirmacion) {
      setServices(services.filter(s => s.id !== servicio.id));
    }
  };

  // --- Configuración de Columnas ---
  const columns = [
    { 
      header: "Servicio", 
      key: "name",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        if (servicio.id === 999999) {
          return <span className="text-gray-400 italic text-sm">Crear nuevo registro...</span>;
        }
        return <span className="font-medium text-gray-800">{servicio.name}</span>;
      }
    },
    { 
      header: "Categoría", 
      key: "category",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        if (servicio.id === 999999) return <span className="text-gray-300">-</span>; 
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {servicio.category}
          </span>
        );
      }
    },
    { 
      header: "Precio", 
      key: "price",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        if (servicio.id === 999999) return <span className="text-gray-300">-</span>; 
        return <span className="font-bold text-gray-900">${servicio.price.toFixed(2)}</span>;
      }
    },
    { 
      header: "Acciones", 
   
      key: "acciones_mixtas",
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        
        if (servicio.id === 999999) {
          return (
            <div className="flex justify-center">
              <button 
                onClick={() => console.log("Abrir modal de nuevo servicio")} 
                className="btn bg-green-500 hover:bg-green-600 text-white min-h-0 h-9 px-4 border-none"
              >
                <i className="bi bi-plus-lg font-bold"></i> Agregar
              </button>
            </div>
          );
        }
        
        return (
          <div className="flex justify-center gap-4">
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
              </svg>
            </button>

            <button
              className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              onClick={() => handleDelete(item)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </button>
          </div>
        );
      }
    }
  ];

  const dataParaTabla = [
    ...services, 
    { id: 999999, name: "", category: "", price: 0 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECCIÓN 1: TABLA DE SERVICIOS */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Servicios Individuales</h2>
        </div>

        <Table 
          columns={columns as any} 
          data={dataParaTabla as unknown as Item[]} 
          emptyMessage="No hay servicios registrados aún."
        />
      </section>

      {/* SECCIÓN 2: PAQUETES Y COMBOS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Paquetes y Combos</h2>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors border-none flex items-center gap-2 cursor-pointer">
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
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <i className="bi bi-pencil-square text-lg"></i>
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <i className="bi bi-trash text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}