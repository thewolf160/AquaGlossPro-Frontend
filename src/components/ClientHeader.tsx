import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal/Modal";
import type { ClientVehicle } from "../types/clients.types";

interface ClientHeaderProps {
  vehicles: ClientVehicle[];
  isLoadingVehicles: boolean;
}

export default function ClientHeader({ vehicles, isLoadingVehicles }: ClientHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_permissions");
    navigate("/login", { replace: true });
  };

  const userName = localStorage.getItem("user_name") || "Cliente";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <>
      <header className="bg-blue-600 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-sm">
              <i className="bi bi-car-front-fill text-xl"></i>
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">
              Aqua<span className="text-white">Gloss</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-20 text-sm font-medium text-gray-500">
            <button 
              onClick={() => setIsVehiclesModalOpen(true)}
              className="text-white hover:text-gray-200 transition-colors py-5 cursor-pointer bg-transparent border-none font-medium text-sm"
            >
              Mis Vehículos
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 border-l border-gray-300 pl-4 cursor-pointer bg-blue-700 hover:bg-blue-800 p-1 pr-3 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm border border-slate-200">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left text-white">
                  <p className="text-sm font-bold leading-none">{userName}</p>
                  <p className="text-xs text-blue-200 mt-0.5">Cliente</p>
                </div>
                <i className={`bi bi-chevron-down text-white text-xs hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </header>

      <Modal 
        isOpen={isVehiclesModalOpen} 
        onClose={() => setIsVehiclesModalOpen(false)} 
        title="Mis Vehículos"
      >
        <div className="flex flex-col gap-3 pt-2 max-h-100 overflow-y-auto">
          {isLoadingVehicles ? (
            <div className="flex justify-center items-center py-10">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          ) : (
            <>
              {vehicles.map((vehiculo, index) => (
                <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-sm">
                      <i className="bi bi-car-front"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-800 text-lg leading-none">{vehiculo.plate}</p>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {vehiculo.typeVehicle?.name || "Vehículo"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {vehicles.length === 0 && (
                <p className="text-center text-slate-500 py-4 italic">No tienes vehículos registrados.</p>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}