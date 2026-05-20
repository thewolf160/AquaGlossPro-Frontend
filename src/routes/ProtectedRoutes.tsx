import DashboardLayout from "../components/DashboardLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasPermission, type ModuleName } from "../utils/checkPermissions.utils";

/**
 * Mapa de ruta → módulo del backend.
 * Rutas sin módulo son accesibles para cualquier usuario autenticado.
 */
const ROUTE_MODULE_MAP: Record<string, ModuleName> = {
  "/vehicles": "VEHICLES",
  "/inventory": "PRODUCTS",
  "/purchases": "PURCHASES",
  "/suppliers": "SUPPLIERS",
  "/employees": "EMPLOYEES",
  "/users": "USERS",
  "/roles": "USERS",
  "/clients": "CLIENTS",
  "/servicesCatalog": "SERVICES",
  "/washes": "SALES",
  "/sales": "SALES",
  "/serviceHistory": "SALES",
  "/reports": "COMISSIONS",
};

function ProtectedRoute() {
  const location = useLocation();
  const isAuth = localStorage.getItem("token");

  // 1. Sin token → login
  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Verificar permiso para la ruta actual
  const requiredModule = ROUTE_MODULE_MAP[location.pathname];
  if (requiredModule && !hasPermission(requiredModule, "ANY")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default ProtectedRoute;