import { useState } from "react";
import Home from "./modules/home/Home";
import Vehicles from "./modules/vehicles/Vehicles";
import Inventory from "./modules/inventory/Inventory";
import Employees from "./modules/employees/Employees";
import Users from "./modules/users/Users";
import Services from "./modules/services/Services";
import Sales from "./modules/sales/Sales";
import Roles from "./modules/roles/Roles";
import Purchases from "./modules/purchases/Purchases";

function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const moduleTitles: Record<string, string> = {
    home: "Inicio",
    vehicles: "Vehículos",
    inventory: "Inventario",
    employees: "Empleados",
    users: "Usuarios",
    services: "Servicios y Lavados",
    sales: "Ventas",
    roles: "Roles y Acceso",
    purchases: "Compras",
  };

  return (
    <div className="flex h-screen font-sans">
      <aside
        className={`bg-gray-900 text-white p-5 transition-all duration-300 
    ${sidebarOpen ? "w-60" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center mb-5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-blue-500 focus:outline-none mr-2"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          <h2
            className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}
          >
            Panel
          </h2>
        </div>

        <nav className="flex flex-col gap-3">
          {renderButton(
            "home",
            "🏠 Inicio",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "vehicles",
            "🚗 Vehículos",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "inventory",
            "📦 Inventario",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "employees",
            "👥 Empleados",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "users",
            "🙍 Usuarios",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "services",
            "🧼 Servicios",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "sales",
            "💵 Ventas",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "purchases",
            "🛒 Compras",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
          {renderButton(
            "roles",
            "🔑 Roles y Acceso",
            activeModule,
            setActiveModule,
            sidebarOpen,
          )}
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 flex flex-col">
        <header className="bg-blue-600 text-white px-6 py-4 text-lg font-bold flex items-center">
          {moduleTitles[activeModule]}
        </header>

        <div className="flex-1 p-6">
          {activeModule === "home" && <Home />}
          {activeModule === "vehicles" && <Vehicles />}
          {activeModule === "inventory" && <Inventory />}
          {activeModule === "employees" && <Employees />}
          {activeModule === "users" && <Users />}
          {activeModule === "services" && <Services />}
          {activeModule === "sales" && <Sales />}
          {activeModule === "roles" && <Roles />}
          {activeModule === "purchases" && <Purchases />}{" "}
        </div>
      </main>
    </div>
  );
}

function renderButton(
  module: string,
  label: string,
  activeModule: string,
  setActiveModule: (m: string) => void,
  sidebarOpen: boolean,
) {
  const isActive = activeModule === module;
  return (
    <button
      onClick={() => setActiveModule(module)}
      className={`flex items-center rounded-lg transition-colors px-4 py-2
        ${isActive ? "bg-blue-600" : "hover:bg-blue-500 hover:text-white"}
        ${sidebarOpen ? "justify-start gap-2" : "justify-center"}`}
    >
      <span>{label.split(" ")[0]}</span>

      <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
        {label.replace(/^[^\s]+\s/, "")}
      </span>
    </button>
  );
}

export default App;
