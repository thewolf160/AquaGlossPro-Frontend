import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Services from "./pages/Services";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";
import Roles from "./pages/Roles";
import ClientDisplay from "./pages/ClientHome";
import ClientHeader from "./components/ClientHeader";
import Clients from "./pages/Client";
import ProtectedRoute from "./routes/ProtectedRoutes";


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
          <Route path="services" element={<Services />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
