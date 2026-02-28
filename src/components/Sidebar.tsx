import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

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
  { path: "/services", label: "Servicios", icon: "bi bi-stars" },
  { path: "/sales", label: "Ventas", icon: "bi bi-currency-dollar" },
  { path: "/roles", label: "Roles y Acceso", icon: "bi bi-key" },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Ejecutar al inicio
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out
          fixed inset-y-0 left-0 z-50 h-screen shadow-2xl
          
          /* LÓGICA MÓVIL (< 768px) */
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}

          /* LÓGICA ESCRITORIO (>= 768px) */
          /* Si no es móvil, siempre es relativo (ocupa espacio) */
          md:relative md:translate-x-0 md:shadow-none
          /* Aquí definimos el ancho: Grande (64) o Mini (20) */
          ${!isMobile ? (isOpen ? "md:w-64" : "md:w-20") : "w-64"}
        `}
      >
        <div className={`flex items-center h-16 border-b border-gray-800 transition-all ${isOpen ? "justify-between px-4" : "justify-center"}`}>
          
          <div className={`font-bold text-xl tracking-wide flex items-center gap-2 overflow-hidden whitespace-nowrap ${!isOpen && !isMobile ? "hidden" : "block"}`}>
            <i className="bi bi-droplet-fill text-blue-500"></i>
            <span>AutoLavado</span>
          </div>

          <button 
            onClick={toggleSidebar} 
            className="p-1 text-slate-400 hover:text-white rounded focus:outline-none cursor-pointer"
          >
           
            {isMobile ? (
              <i className="bi bi-x-lg text-xl"></i>
            ) : (
              <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-list"} text-xl`}></i>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && toggleSidebar()} 
              className={({ isActive }) => `
                flex items-center py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap
                ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                
                /* Alineación: Si está cerrado (y no es móvil), centramos el icono. Si no, alineamos a la izquierda */
                ${!isOpen && !isMobile ? "justify-center px-0" : "justify-start px-3 gap-3"}
              `}
              title={!isOpen && !isMobile ? item.label : ""} 
            >
              <i className={`${item.icon} text-xl leading-none shrink-0`}></i>
              
              <span className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}