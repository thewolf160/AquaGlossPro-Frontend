import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
// 1. IMPORTA TU FUNCIÓN DE PERMISOS
import { hasPermission, type ModuleName } from "../utils/checkPermissions.utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
  module: ModuleName; // <--- Agregado para los subItems
}

interface SidebarItem {
  label: string;
  path?: string;
  icon: string;
  module?: ModuleName; // <--- Agregado para items directos (opcional)
  subItems?: SubMenuItem[];
}

// 2. CORRESPONDENCIA CON TUS 16 MÓDULOS DE BACKEND
const menuItems: SidebarItem[] = [
  { path: "/home", label: "Inicio", icon: "bi bi-house-door" }, // Sin módulo = Libre acceso
  { path: "/vehicles", label: "Vehículos", icon: "bi bi-car-front", module: "VEHICLES" },
  {
    label: "Gestión de Inventario",
    icon: "bi bi-box-seam",
    subItems: [
      { label: "Inventario", path: "/inventory", module: "PRODUCTS" },
      { label: "Compras", path: "/purchases", module: "PURCHASES" },
      { label: "Proveedores", path: "/suppliers", module: "SUPPLIERS" }
    ],
  },
  {
    label: "Gestión de Usuarios",
    icon: "bi bi-people",
    subItems: [
      
      { label: "Usuarios", path: "/users", module: "USERS" },
      { label: "Roles y Acceso", path: "/roles", module: "USERS" }, // Usa USERS o el asignado
    ],
  },
  {
    label: "Gestión de Empleados",
    icon: "bi bi-people",
    subItems: [
      { label: "Empleados", path: "/employees", module: "EMPLOYEES" },
      {label: "Comisiones", path: "/commissions", module: "COMISSIONS"}
    ],
  },
  { path: "/clients", label: "Clientes", icon: "bi bi-person", module: "CLIENTS" },
  {
    label: "Lavado",
    icon: "bi bi-stars",
    subItems: [
      { label: "Catálogo de Servicios", path: "/servicesCatalog", module: "SERVICES" },
      { label: "Lavados del dia", path: "/washes", module: "SALES" },
    ]
  },
  { path: "/sales", label: "Servicios", icon: "bi bi-currency-dollar", module: "SALES" },
  { path: "/reports", label: "Reportes", icon: "bi bi-graph-up", module: "SALES" }, // Ajusta según convenga
  { path: "/settings", label: "Ajustes", icon: "bi bi-gear" }, // Sin módulo = Libre acceso
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_permissions"); // Limpia los permisos al salir
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));

    if (!isOpen && !isMobile) {
      toggleSidebar();
    }
  };

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
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}
          md:relative md:translate-x-0 md:shadow-none
          ${!isMobile ? (isOpen ? "md:w-64" : "md:w-20") : "w-64"}
        `}
      >
        {/* Cabecera del Sidebar */}
        <div
          className={`flex items-center h-16 border-b border-gray-800 transition-all ${isOpen ? "justify-between px-4" : "justify-center"
            }`}
        >
          <div
            className={`font-bold text-xl tracking-wide flex items-center gap-2 overflow-hidden whitespace-nowrap ${!isOpen && !isMobile ? "hidden" : "block"
              }`}
          >
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

        {/* Navegación Dinámica */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2 custom-scrollbar">
          {menuItems.map((item) => {
            // 3. LÓGICA FILTRADO DE PERMISOS

            // Caso A: Si es un item directo y tiene módulo configurado, verificamos acceso
            if (item.path && item.module && !hasPermission(item.module, "ANY")) {
              return null; // Oculta el enlace completo
            }

            // Caso B: Si tiene subItems, filtramos el arreglo interno
            let allowedSubItems = item.subItems || [];
            if (item.subItems) {
              allowedSubItems = item.subItems.filter(sub => hasPermission(sub.module, "ANY"));

              // Si no tiene acceso a ningún subItem, ocultamos toda la categoría principal
              if (allowedSubItems.length === 0) {
                return null;
              }
            }

            const isMainActive = item.path ? location.pathname === item.path : false;
            const isParentOfActiveSubitem = allowedSubItems.some(
              (subItem) => location.pathname === subItem.path
            );

            return (
              <div key={item.label} className="flex flex-col">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`
                        flex items-center w-full py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap cursor-pointer
                        hover:bg-gray-800 hover:text-white
                        ${isParentOfActiveSubitem ? "text-blue-400" : "text-gray-400"}
                        ${!isOpen && !isMobile ? "justify-center px-0" : "justify-between px-3"}
                      `}
                      title={!isOpen && !isMobile ? item.label : ""}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`${item.icon} text-xl leading-none shrink-0`}></i>
                        <span className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}>
                          {item.label}
                        </span>
                      </div>
                      <i
                        className={`bi bi-chevron-down text-sm transition-transform duration-300 ${!isOpen && !isMobile ? "hidden" : "block"
                          } ${openMenus[item.label] ? "rotate-180" : ""}`}
                      ></i>
                    </button>

                    <div
                      className={`
                        flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out
                        ${openMenus[item.label] && isOpen ? "max-h-40 mt-1" : "max-h-0"}
                      `}
                    >
                      {/* 4. RENDERIZAMOS SOLO LOS SUBITEMS PERMITIDOS */}
                      {allowedSubItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;

                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => isMobile && toggleSidebar()}
                            className={`
                              flex items-center py-2 pl-11 pr-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap text-sm
                              ${isSubActive
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                              }
                            `}
                          >
                            {subItem.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.path!}
                    onClick={() => isMobile && toggleSidebar()}
                    className={`
                      flex items-center py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap
                      ${isMainActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                      ${!isOpen && !isMobile ? "justify-center px-0" : "justify-start px-3 gap-3"}
                    `}
                    title={!isOpen && !isMobile ? item.label : ""}
                  >
                    <i className={`${item.icon} text-xl leading-none shrink-0`}></i>
                    <span className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}>
                      {item.label}
                    </span>
                  </NavLink>
                )}
              </div>
            );
          })}

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className={`flex items-center py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap mt-auto text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer
              ${!isOpen && !isMobile ? "justify-center px-0" : "justify-start px-3 gap-3"}
            `}
            title={!isOpen && !isMobile ? "Cerrar Sesión" : ""}
          >
            <i className="bi bi-box-arrow-in-left"></i>
            <span className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}>
              Cerrar Sesión
            </span>
          </button>
        </nav>
      </aside>
    </>
  );
}