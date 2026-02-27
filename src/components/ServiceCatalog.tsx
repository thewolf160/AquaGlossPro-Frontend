import { useState } from "react";

// 1. DEFINICIÓN DE TIPOS SEPARADOS
// Estructura para un servicio individual
interface CatalogService {
  id: string;
  name: string;
  category: string;
  price: number;
}

// Estructura para un Combo (Agrupa servicios)
interface ComboPackage {
  id: string;
  name: string;
  includedServices: string[]; // Array con los nombres de los servicios
  comboPrice: number;         // El precio con descuento
  originalPrice: number;      // Lo que costaría por separado
}

// 2. DATOS SIMULADOS
const initialServices: CatalogService[] = [
  { id: "s1", name: "Lavado Sencillo", category: "Exterior", price: 5 },
  { id: "s2", name: "Encerado", category: "Acabado", price: 10 },
  { id: "s3", name: "Aspirado Profundo", category: "Interior", price: 7 },
  { id: "s4", name: "Pulitura de Faros", category: "Exterior", price: 15 },
];

const initialCombos: ComboPackage[] = [
  { 
    id: "c1", 
    name: "Combo Express", 
    includedServices: [initialServices[0].name, initialServices[2].name], // Lavado Sencillo + Aspirado Profundo
    comboPrice: initialServices[0].price + initialServices[2].price - 2, // Precio con descuento
    originalPrice: initialServices[0].price + initialServices[2].price // Precio sin descuento
  },
  { 
    id: "c2", 
    name: "Combo VIP Brillante", 
    includedServices: [initialServices[0].name, initialServices[1].name, initialServices[3].name], // Lavado Sencillo + Encerado + Pulitura de Faros
    comboPrice: initialServices[0].price + initialServices[1].price + initialServices[3].price - 5, // Precio con descuento
    originalPrice: initialServices[0].price + initialServices[1].price + initialServices[3].price // Precio sin descuento
  },
];

export default function ServiceCatalog() {
  const [services] = useState<CatalogService[]>(initialServices);
  const [combos] = useState<ComboPackage[]>(initialCombos);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECCIÓN 1: SERVICIOS INDIVIDUALES */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Servicios Individuales</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            + Nuevo Servicio
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-4 font-semibold">Servicio</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-200">
                  <td className="p-4 font-medium text-gray-800">{service.name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">${service.price.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-2"><i className="bi bi-pencil-square"></i></button>
                    <button className="text-red-500 hover:text-red-700 p-2"><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN 2: COMBOS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Paquetes y Combos</h2>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
            + Crear Combo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-xl shadow-sm border border-yellow-300 p-6 flex flex-col">
              
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">{combo.name}</h3>
              
              {/* Lista de servicios incluidos */}
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
              
              {/* Precios: Original vs Combo */}
              <div className="flex justify-between items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 line-through">Normal: ${combo.originalPrice.toFixed(2)}</div>
                  <div className="text-2xl font-black text-gray-900">${combo.comboPrice.toFixed(2)}</div>
                </div>
                
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-blue-600"><i className="bi bi-pencil-square"></i></button>
                  <button className="text-gray-400 hover:text-red-600"><i className="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}