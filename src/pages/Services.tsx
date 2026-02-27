import { useState } from "react";
import ServiceCatalog from "../components/ServiceCatalog";


export default function Services() {
  
  const [activeTab, setActiveTab] = useState<"kanban" | "catalog">("kanban");

  return (
    <div className="flex flex-col h-full">
      
      <div className="flex gap-4 border-b border-gray-200 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("kanban")}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === "kanban" 
              ? "border-blue-600 text-blue-600 font-bold" // Estilo Activo
              : "border-transparent text-gray-500 hover:text-gray-700" // Estilo Inactivo
          }`}
        >
          Lavados en Proceso
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === "catalog" 
              ? "border-blue-600 text-blue-600 font-bold" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Catálogo de Precios
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow p-4">
        {activeTab === "kanban" ? (
          <div>Aqui ira el tablero kanban</div>
        ) : (
          <ServiceCatalog />
        )}
      </div>

    </div>
  );
}