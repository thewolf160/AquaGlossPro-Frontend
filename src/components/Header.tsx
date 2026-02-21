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

export default function Header() {
  // hook para obtener la url actual
  const location = useLocation(); 
  
  // Buscamos el título en el diccionario. Si no existe, mostramos "Panel" por defecto.
  const currentTitle = routeTitles[location.pathname] || "Panel";

  return (
    <header className="bg-blue-600 text-white px-6 py-4 text-lg font-bold flex items-center shadow-md">
      {currentTitle}
    </header>
  );
}