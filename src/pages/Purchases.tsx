import { useState } from "react";
import RegisterPurchase from "../components/purchases/RegisterPurchase";
import PurchaseHistory from "../components/purchases/PurchaseHistory";


export default function Purchases() {
  const [activeTab, setActiveTab] = useState<"register" | "history">("register");

  return (
    <div className="flex flex-col h-full animate-fade-in">
      
      <div className="flex gap-4 border-b border-gray-200 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("register")}
          className={`py-2 px-4 border-b-2 transition-colors cursor-pointer ${
            activeTab === "register" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Registrar Compra
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`py-2 px-4 border-b-2 transition-colors cursor-pointer ${
            activeTab === "history" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Historial de Compras
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 xl:p-8">
        {activeTab === "register" ? <RegisterPurchase /> : <PurchaseHistory />}
      </div>
      
    </div>
  );
}