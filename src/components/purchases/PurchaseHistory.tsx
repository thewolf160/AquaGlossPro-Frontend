import { useState } from "react";

interface PurchaseHistoryItem {
  id: number;
  date: string;
  supplier: string;
  invoice: string;
  method: string;
  total: number;
  status: "PENDIENTE" | "PAGADO" | "ANULADO";
}

export default function PurchaseHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockHistory: PurchaseHistoryItem[] = [
    { id: 1, date: "17-04-2026 08:30", supplier: "Distribuidora de Químicos C.A.", invoice: "FAC-00120", method: "Transferencia Bancaria", total: 150.00, status: "PAGADO" },
    { id: 2, date: "15-04-2026 14:15", supplier: "AutoRepuestos El Freno", invoice: "FAC-9921", method: "Efectivo USD", total: 45.50, status: "PENDIENTE" },
    { id: 3, date: "10-04-2026 11:00", supplier: "Lubricantes Express", invoice: "FAC-1100", method: "Pago Móvil", total: 80.00, status: "ANULADO" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAGADO": return "bg-green-100 text-green-700 border-green-200";
      case "PENDIENTE": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ANULADO": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="relative w-full max-w-md">
          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Buscar por factura o proveedor..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
          <i className="bi bi-funnel"></i> Filtrar
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Factura</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4">Método de Pago</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockHistory.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{purchase.date}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{purchase.invoice}</td>
                <td className="px-6 py-4 text-gray-800">{purchase.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{purchase.method}</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-right">${purchase.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors cursor-pointer" title="Ver detalles">
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
            {mockHistory.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron compras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">Mostrando 1 a 3 de 3 resultados</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Siguiente</button>
        </div>
      </div>
    </div>
  );
}