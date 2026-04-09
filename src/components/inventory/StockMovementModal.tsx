import { useState, useMemo } from "react";
import Modal from "../Modal/Modal";
import type { Product } from "../../types/inventory.types";
type StockMovementModalProps = {
  selectedItem: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

type Movement = {
  id: number;
  type: "IN" | "OUT";
  quantity: number;
  date: string;
  reason: string;
};

const mockMovements: Movement[] = [
  { id: 1, type: "IN", quantity: 50, date: "2026-03-16", reason: "Compra a proveedor principal" },
  { id: 2, type: "OUT", quantity: 2, date: "2026-03-16", reason: "Uso en lavado de flota" },
  { id: 3, type: "OUT", quantity: 1, date: "2026-03-15", reason: "Venta directa al cliente" },
  { id: 4, type: "IN", quantity: 10, date: "2026-03-10", reason: "Ajuste de inventario manual" },
];

export default function StockMovementModal({ isOpen, onClose, selectedItem }: StockMovementModalProps) {
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredMovements = useMemo(() => {
    return mockMovements.filter((movement) => {
      if (filterType !== "ALL" && movement.type !== filterType) return false;

      if (startDate && new Date(movement.date) < new Date(startDate)) return false;

      if (endDate && new Date(movement.date) > new Date(endDate)) return false;

      return true;
    });
  }, [filterType, startDate, endDate]);

  const clearFilters = () => {
    setFilterType("ALL");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Movimientos"
      
    >
      {selectedItem && (
        <div className="flex flex-col gap-5 pt-2">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-slate-500 font-medium">Producto consultado</p>
              <p className="font-black text-xl text-slate-800">{selectedItem.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Stock Actual</p>
              <p className="font-bold text-lg text-blue-600">
                {selectedItem.stock} <span className="text-sm font-medium">{selectedItem.unit}</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-3 rounded-lg space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-700">Filtros de búsqueda</h4>
              {(startDate || endDate || filterType !== "ALL") && (
                <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Mostrar:</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value as "ALL" | "IN" | "OUT")}
                  className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">Todos los movimientos</option>
                  <option value="IN">Solo Entradas (+)</option>
                  <option value="OUT">Solo Salidas (-)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Desde:</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Hasta:</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredMovements.length > 0 ? (
              filteredMovements.map((mov) => (
                <div key={mov.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 shadow-sm rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {mov.type === "IN" ? (
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <i className="bi bi-box-arrow-in-right text-lg"></i>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <i className="bi bi-box-arrow-right text-lg"></i>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-bold text-slate-800">{mov.reason}</p>
                      <p className="text-xs text-slate-500"><i className="bi bi-calendar3"></i> {mov.date}</p>
                    </div>
                  </div>
                  
                  <div className={`font-black text-lg ${mov.type === "IN" ? "text-green-600" : "text-red-600"}`}>
                    {mov.type === "IN" ? "+" : "-"}{mov.quantity}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <i className="bi bi-inbox text-3xl mb-2 block"></i>
                <p>No se encontraron movimientos para esta fecha o filtro.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}