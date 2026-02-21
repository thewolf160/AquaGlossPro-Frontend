import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Services from "./pages/Services";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";

function App () {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/employees" element={<Employees/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/purchases" element={<Purchases/>}/>
        <Route path="/sales" element={<Sales/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/vehicles" element={<Vehicles/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
