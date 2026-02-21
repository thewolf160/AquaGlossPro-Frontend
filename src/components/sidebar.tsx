import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems: { path: string; label: string }[] = [
  { path: "/home", label: "🏠 Inicio" },
  { path: "/vehicles", label: "🚗 Vehículos" },
  { path: "/inventory", label: "📦 Inventario" },
  { path: "/employees", label: "👥 Empleados" },
  { path: "/users", label: "🙍 Usuarios" },
  { path: "/services", label: "🧼 Servicios" },
  { path: "/sales", label: "💵 Ventas" },
  { path: "/roles", label: "🔑 Roles y Acceso" },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside
      className={`bg-gray-900 text-white p-5 transition-all duration-300 flex flex-col 
      ${sidebarOpen ? "w-60" : "w-16"}`}
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
        <h2 className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>
          Panel
        </h2>
      </div>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center rounded-lg transition-colors px-4 py-2
              ${isActive ? "bg-blue-600" : "hover:bg-blue-500 hover:text-white"}
              ${sidebarOpen ? "justify-start gap-2" : "justify-center"}
            `}
          >
            {/* Emoji */}
            <span>{item.label.split(" ")[0]}</span>
            
            {/* Texto ocultable */}
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
               {item.label.replace(/^[^\s]+\s/, "")}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
