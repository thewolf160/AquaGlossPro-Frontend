import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";
import Roles from "./pages/Roles";
import ClientDisplay from "./pages/ClientHome";
import ClientHeader from "./components/ClientHeader";
import Clients from "./pages/Client";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Reports from "./pages/Reports";import SettingsMenu from "./pages/Settings/SettingsMenu";
import Jobs from "./pages/Settings/Jobs";
import TypesVehicles from "./pages/Settings/TypesVehicles";
import Pays from "./pages/Settings/Pays";
import Suppliers from "./pages/Suppliers";
import ServiceCatalog from "./pages/ServiceCatalog";
import KanbanBoard from "./pages/KanbanBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/clientHome"
          element={
            <div className="min-h-screen bg-gray-50">
              <ClientHeader />
              <ClientDisplay />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<ProtectedRoute />}>
          {/* Rutas protegidas para usuarios autenticados */}
          <Route path="home" element={<Home />} />
          <Route path="employees" element={<Employees />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="clients" element={<Clients />} />
          <Route path="sales" element={<Sales />} />
          <Route path="servicesCatalog" element={<ServiceCatalog />} />
          <Route path="washes" element={<KanbanBoard />} />
          <Route path="users" element={<Users />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="roles" element={<Roles />} />
          <Route path="settings">
            <Route index element={<SettingsMenu/>}/>
            <Route path="jobs" element={<Jobs/>}/>
            <Route path="typesVehicles" element={<TypesVehicles/>}/>
            <Route path="pays" element={<Pays/>}/>
          </Route>
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
