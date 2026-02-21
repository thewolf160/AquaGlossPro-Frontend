import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const menuItems = [
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
  // Estado para abrir/cerrar sidebar
  const [isOpen, setIsOpen] = useState(true);
  // Estado para detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);

  // Efecto para detectar el tamaño de la pantalla al cargar y al redimensionar
  useEffect(() => {
    const handleResize = () => {
      // Si el ancho es menor a 768px (medida estándar de tablets/móviles), es móvil
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Si es móvil, iniciamos con el menú cerrado. Si es PC, abierto.
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
          <Menu size={24} />
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
          
          /* COMPORTAMIENTO MÓVIL (Fixed = flota sobre todo) */
          fixed inset-y-0 left-0 z-50 h-screen shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* COMPORTAMIENTO DESKTOP (md:...) */
          /* md:relative = empuja el contenido */
          /* md:translate-x-0 = siempre visible (si isOpen es true) */
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
            {isMobile ? <X size={24} /> : (isOpen ? <Menu size={20} /> : <Menu size={20} />)}
          </button>
        </div>

        {/* Navegación */}
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
              <span className="text-xl">{item.label.split(" ")[0]}</span>
              
              <span className={`whitespace-nowrap ${!isOpen && !isMobile ? "hidden" : "block"}`}>
                {item.label.replace(/^[^\s]+\s/, "")}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}