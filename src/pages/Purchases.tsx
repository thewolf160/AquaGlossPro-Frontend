import { useState, useEffect } from "react";
import RegisterPurchase from "../components/purchases/RegisterPurchase";
import PurchaseHistory from "../components/purchases/PurchaseHistory";
import { hasPermission } from "../utils/checkPermissions.utils";

export default function Purchases() {
  const canCreate = hasPermission("PURCHASES", "C");
  const canRead = hasPermission("PURCHASES", "R");

  // Si puede crear, abrimos en "register"; si solo puede leer, en "history"
  const [activeTab, setActiveTab] = useState<"register" | "history">(
    canCreate ? "register" : "history"
  );

  // Si pierde permiso de la tab activa, redirigir a la disponible
  useEffect(() => {
    if (activeTab === "register" && !canCreate && canRead) {
      setActiveTab("history");
    }
  }, [activeTab, canCreate, canRead]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      
      <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 mb-4 sm:mb-6 justify-center px-2">
        {canCreate && (
          <button
            onClick={() => setActiveTab("register")}
            className={`py-2 px-3 sm:px-4 border-b-2 transition-colors cursor-pointer text-sm sm:text-base ${
              activeTab === "register" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Registrar Compra
          </button>
        )}

        {canRead && (
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-3 sm:px-4 border-b-2 transition-colors cursor-pointer text-sm sm:text-base ${
              activeTab === "history" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Historial de Compras
          </button>
        )}
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 xl:p-8">
        {activeTab === "register" && canCreate ? <RegisterPurchase /> : canRead ? <PurchaseHistory /> : null}
      </div>
      
    </div>
  );
}