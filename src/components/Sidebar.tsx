import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; 

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface SidebarItem {
  label: string;
  path?: string;
  icon: string;
  subItems?: SubMenuItem[];
}

const menuItems: SidebarItem[] = [
  { path: "/home", label: "Inicio", icon: "bi bi-house-door" },
  { path: "/vehicles", label: "Vehículos", icon: "bi bi-car-front" },
  {
    label: "Gestión de Inventario",
    icon: "bi bi-box-seam",
    subItems: [
      { label: "Inventario", path: "/inventory" },
      { label: "Compras", path: "/purchases" },
      { label: "Proveedores", path: "/suppliers" }
    ],
  },
  {
    label: "Gestión de Personal",
    icon: "bi bi-people",
    subItems: [
      { label: "Empleados", path: "/employees" },
      { label: "Usuarios", path: "/users" },
      { label: "Roles y Acceso", path: "/roles" },
    ],
  },
  { path: "/clients", label: "Clientes", icon: "bi bi-person" },
  { label: "Lavado", icon: "bi bi-stars", subItems: [
    { label: "Catálogo de Servicios", path: "/servicesCatalog" },
    { label: "Lavados del dia", path: "/washes" },
  ] },
  { path: "/sales", label: "Servicios", icon: "bi bi-currency-dollar" },
  { path: "/reports", label: "Reportes", icon: "bi bi-graph-up" },
    { path: "/settings", label: "Ajustes", icon: "bi bi-gear" },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation(); 
  const handleLogout = () => {
    localStorage.removeItem("token");
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
        <div
          className={`flex items-center h-16 border-b border-gray-800 transition-all ${
            isOpen ? "justify-between px-4" : "justify-center"
          }`}
        >
          <div
            className={`font-bold text-xl tracking-wide flex items-center gap-2 overflow-hidden whitespace-nowrap ${
              !isOpen && !isMobile ? "hidden" : "block"
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
              <i
                className={`bi ${isOpen ? "bi-chevron-left" : "bi-list"} text-xl`}
              ></i>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2 custom-scrollbar">
          {menuItems.map((item) => {
            const isMainActive = item.path ? location.pathname === item.path : false;

            const isParentOfActiveSubitem = item.subItems?.some(
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
                        ${
                          isParentOfActiveSubitem
                            ? "text-blue-400" 
                            : "text-gray-400"
                        }
                        ${!isOpen && !isMobile ? "justify-center px-0" : "justify-between px-3"}
                      `}
                      title={!isOpen && !isMobile ? item.label : ""}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`${item.icon} text-xl leading-none shrink-0`}></i>
                        <span
                          className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <i
                        className={`bi bi-chevron-down text-sm transition-transform duration-300 ${
                          !isOpen && !isMobile ? "hidden" : "block"
                        } ${openMenus[item.label] ? "rotate-180" : ""}`}
                      ></i>
                    </button>

                    <div
                      className={`
                        flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out
                        ${openMenus[item.label] && isOpen ? "max-h-40 mt-1" : "max-h-0"}
                      `}
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;

                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => isMobile && toggleSidebar()}
                            className={`
                              flex items-center py-2 pl-11 pr-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap text-sm
                              ${
                                isSubActive
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
                    <span
                      className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                )}
              </div>
            );
          })}

          <button
            onClick={handleLogout}
            className={`flex items-center py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap mt-auto text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer
              ${!isOpen && !isMobile ? "justify-center px-0" : "justify-start px-3 gap-3"}
            `}
            title={!isOpen && !isMobile ? "Cerrar Sesión" : ""}
          >
            <i className="bi bi-box-arrow-in-left"></i>
            <span
              className={`${!isOpen && !isMobile ? "hidden" : "block"} transition-opacity duration-300`}
            >
              Cerrar Sesión
            </span>
          </button>
        </nav>
      </aside>
    </>
  );
}