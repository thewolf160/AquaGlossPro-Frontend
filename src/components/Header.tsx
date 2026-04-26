import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/home": "Inicio",
  "/vehicles": "Vehículos",
  "/inventory": "Inventario",
  "/employees": "Empleados",
  "/users": "Usuarios",
  "/services": "Servicios y Lavados",
  "/sales": "Servicios",
  "/roles": "Roles y Acceso",
  "/reports": "Reportes",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "Panel";

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-30">
      <div className="flex items-center px-6 py-4 gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Abrir menú"
        >
          <i className="bi bi-list text-2xl leading-none"></i>
        </button>

        <div className="flex-1 flex items-center w-full">
          <div
            id="custom-header-portal"
            className="peer empty:hidden w-full flex justify-end"
          ></div>

          <h1 className="text-lg font-bold tracking-wide peer-empty:block hidden">
            {currentTitle}
          </h1>
        </div>
      </div>
    </header>
  );
}
