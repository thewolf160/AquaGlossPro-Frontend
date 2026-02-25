import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/home": "Inicio",
  "/vehicles": "Vehículos",
  "/inventory": "Inventario",
  "/employees": "Empleados",
  "/users": "Usuarios",
  "/services": "Servicios y Lavados",
  "/sales": "Ventas",
  "/roles": "Roles y Acceso",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "Panel";

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-30">
      {/* Contenedor flexible para alinear botón y texto */}
      <div className="flex items-center px-6 py-4 gap-4">
        
        <button
          onClick={onMenuClick}
          className="md:hidden p-1 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Abrir menú"
        >
          <i className="bi bi-list text-2xl leading-none"></i>
        </button>

        {/* 3. TÍTULO */}
        <h1 className="text-lg font-bold tracking-wide">
          {currentTitle}
        </h1>
        
      </div>
    </header>
  );
}