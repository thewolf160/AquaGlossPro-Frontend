import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          
          <Route index element={<Navigate to="/home" replace />} />
          
          <Route path="home" element={<Home />} />
          <Route path="employees" element={<Employees />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="sales" element={<Sales />} />
          <Route path="services" element={<Services />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
           
        </Route>
      </Routes>
    </BrowserRouter>
  );
}