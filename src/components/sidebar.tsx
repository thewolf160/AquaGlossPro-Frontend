import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItem {
  label: string;
  path: string;
  icon: string; 
}

const menuItems: SidebarItem[] = [
  { path: "/home", label: "Inicio", icon: "bi bi-house-door" },
  { path: "/vehicles", label: "Vehículos", icon: "bi bi-car-front" },
  { path: "/inventory", label: "Inventario", icon: "bi bi-box-seam" },
  { path: "/employees", label: "Empleados", icon: "bi bi-people" },
  { path: "/users", label: "Usuarios", icon: "bi bi-person-circle" },
  { path: "/services", label: "Servicios", icon: "bi bi-card-checklist" }, 
  { path: "/sales", label: "Ventas", icon: "bi bi-currency-dollar" },
  { path: "/roles", label: "Roles y Acceso", icon: "bi bi-key" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg md:hidden"
        >
          {/* Usamos el icono de menú de Bootstrap */}
          <i className="bi bi-list text-2xl leading-none"></i>
        </button>
      )}

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          bg-gray-900 text-white flex flex-col transition-all duration-300
          fixed inset-y-0 left-0 z-50 h-screen shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:shadow-none
          ${!isMobile && (isOpen ? "md:w-64" : "md:w-20")}
          ${!isMobile && "translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-800">
          <h2 className={`font-bold text-xl ${!isOpen && !isMobile ? "hidden" : "block"}`}>
            Panel
          </h2>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
          >
            {/* Icono de cerrar (X) o de menú según el estado */}
            <i className={`text-2xl leading-none ${isMobile ? 'bi bi-x-lg' : 'bi bi-list'}`}></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-lg transition-colors
                ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                ${!isOpen && !isMobile ? "justify-center" : "justify-start gap-3"}
              `}
            >
              <i className={`${item.icon} text-xl leading-none`}></i>
              
              <span className={`whitespace-nowrap font-medium ${!isOpen && !isMobile ? "hidden" : "block"}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}