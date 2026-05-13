import { useServiceHistory } from "../hooks/useServiceHistory";
import Table from "../components/Table/Table";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import type { Item } from "../types/models";
import type { SaleItem } from "../types/kanban.types";

export default function ServiceHistory() {
  const {
    sales,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParam,
    setSearchParam,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
  } = useServiceHistory();

  const columns = [
    {
      header: "ID",
      key: "id",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="font-bold">#{sale.sale.saleId}</span>;
      },
    },
    {
      header: "Cliente / Vehículo",
      key: "client",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return (
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{sale.client.names} {sale.client.lastnames}</p>
            <p className="text-xs text-slate-500">{sale.vehicle.plate} - {sale.vehicle.typeVehicle}</p>
          </div>
        );
      },
    },
    {
      header: "Fecha",
      key: "date",
      mobile: false,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="text-sm text-slate-600">{sale.sale.saleDate}</span>;
      },
    },
    {
      header: "Total",
      key: "total",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        return <span className="font-bold text-green-700">${sale.details.totalAmount}</span>;
      },
    },
    {
      header: "Estado",
      key: "status",
      mobile: true,
      render: (item: Item) => {
        const sale = item as unknown as SaleItem;
        const statusMap = {
          W: { label: "En Espera", color: "bg-orange-100 text-orange-700" },
          I: { label: "En Proceso", color: "bg-blue-100 text-blue-700" },
          D: { label: "Finalizado", color: "bg-green-100 text-green-700" },
          C: { label: "Cancelado", color: "bg-red-100 text-red-700" },
        };
        const config = statusMap[sale.sale.statusWashing] || statusMap.W;
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    { header: "Acciones", key: "actions", mobile: true },
  ];

  return (
    <>
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar por placa o cliente..."
          searchTerm={searchParam}
          onSearchChange={setSearchParam}
        />
      </HeaderPortal>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
          
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap bg-gray-100 p-1 rounded-lg gap-1">
              <button onClick={() => setStatusFilter("")} className={`px-4 py-1.5 rounded-md text-sm font-medium ${statusFilter === "" ? "bg-white shadow-sm text-slate-800" : "text-gray-500"}`}>Todos</button>
              <button onClick={() => setStatusFilter("D")} className={`px-4 py-1.5 rounded-md text-sm font-medium ${statusFilter === "D" ? "bg-white shadow-sm text-green-700" : "text-gray-500"}`}>Finalizados</button>
              <button onClick={() => setStatusFilter("C")} className={`px-4 py-1.5 rounded-md text-sm font-medium ${statusFilter === "C" ? "bg-white shadow-sm text-red-700" : "text-gray-500"}`}>Cancelados</button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Fecha:</span>
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input input-sm input-bordered focus:outline-none"
              />
            </div>
          </div>

          <section className="shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-white px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-xl tracking-tight">Historial de Servicios</h2>
            </div>
            
           {isLoading ? (
              <div className="p-8 text-center text-slate-500 bg-white">
                Cargando historial...
              </div>
            ) : (
              <Table
                columns={columns}
                data={sales as unknown as Item[]}
                onView={(item) => console.log("Ver detalle:", item)}
              />
            )}

            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">Página {currentPage} de {totalPages}</p>
              <div className="join gap-2">
                <button 
                  className="btn btn-sm" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >Anterior</button>
                <button 
                  className="btn btn-sm" 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >Siguiente</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}