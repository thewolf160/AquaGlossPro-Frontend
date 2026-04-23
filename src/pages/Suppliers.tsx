import { useState, useMemo } from "react";
import Table from "../components/Table/Table";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import type { Supplier } from "../types/suppliers.types";
import type { Item } from "../types/models";
import type { ColumnsProps } from "../components/Table/Table.types";

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: "Distribuidora Chemical Wash", contactName: "Carlos Pérez", phone: "0414-1234567", email: "carlos@chemical.com", category: "Químicos", status: "ACTIVO" },
  { id: 2, name: "Repuestos AutoLara", contactName: "Ana Rodríguez", phone: "0412-9876543", email: "ventas@autolara.com", category: "Repuestos", status: "ACTIVO" },
  { id: 3, name: "Insumos Limpieza C.A.", contactName: "Luis García", phone: "0251-5551234", email: "contacto@insumos.com", category: "Consumibles", status: "INACTIVO" },
  { id: 4, name: "Lubricantes El Tunal", contactName: "Jose Vivas", phone: "0416-8889900", email: "jvivas@eltunal.com", category: "Aceites", status: "ACTIVO" },
];

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"ACTIVOS" | "INACTIVOS">("ACTIVOS");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    return MOCK_SUPPLIERS.filter((s) => {
      const mapStatus = activeFilter === "ACTIVOS" ? "ACTIVO" : "INACTIVO";
      const matchesStatus = s.status === mapStatus;
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const stats = {
    total: filteredData.length,
    active: MOCK_SUPPLIERS.filter(s => s.status === 'ACTIVO').length,
    inactive: MOCK_SUPPLIERS.filter(s => s.status === 'INACTIVO').length
  };

  const isInactiveView = activeFilter === "INACTIVOS";

  const columns: ColumnsProps[] = [
    {
      header: "Proveedor",
      key: "name",
      mobile: true,
      render: (item: Item) => {
        const s = item as unknown as Supplier;
        return (
          <div className="text-left">
            <div className="font-bold text-gray-800">{s.name}</div>
            <div className="text-xs text-gray-500">{s.category}</div>
          </div>
        );
      },
    },
    {
      header: "Contacto",
      key: "contactName",
      mobile: true,
      render: (item: Item) => {
        const s = item as unknown as Supplier;
        return (
          <div className="text-left">
            <div className="text-sm font-medium text-slate-700">{s.contactName}</div>
            <div className="text-xs text-slate-500">{s.phone}</div>
          </div>
        );
      },
    },
    {
      header: "Email",
      key: "email",
      mobile: false,
      render: (item: Item) => <span className="text-sm text-slate-600">{(item as unknown as Supplier).email}</span>,
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
      render: (item: Item) => (
        <div className="flex justify-center gap-2">
          {!isInactiveView ? (
            <>
              <button className="bg-sky-50 text-sky-600 h-9 w-9 flex items-center justify-center rounded-md hover:bg-sky-100 transition-all cursor-pointer">
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="bg-red-50 text-red-500 h-9 w-9 flex items-center justify-center rounded-md hover:bg-red-100 transition-all cursor-pointer">
                <i className="bi bi-trash"></i>
              </button>
            </>
          ) : (
            <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer">
              <i className="bi bi-arrow-clockwise"></i> Reactivar
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar proveedor..."
          buttonText="Agregar Proveedor"
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          onAddClick={() => alert("Nuevo proveedor")}
        />
      </HeaderPortal>

      <div className={`grid grid-cols-1 ${isInactiveView ? '' : 'md:grid-cols-3'} gap-4`}>
        <div className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 ${isInactiveView ? 'border-slate-300' : 'border-blue-200'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isInactiveView ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
            <i className={`bi ${isInactiveView ? 'bi-trash3' : 'bi-truck'}`}></i>
          </div>
          <div>
            <p className={`text-sm font-medium ${isInactiveView ? 'text-slate-600' : 'text-blue-700'}`}>
              {isInactiveView ? 'Total Inactivos' : 'Total Proveedores'}
            </p>
            <p className={`text-2xl font-black ${isInactiveView ? 'text-slate-800' : 'text-blue-800'}`}>
              {isInactiveView ? stats.inactive : stats.total}
            </p>
          </div>
        </div>

        {!isInactiveView && (
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                <i className="bi bi-check-circle"></i>
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Proveedores Activos</p>
                <p className="text-2xl font-black text-green-900">{stats.active}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
                <i className="bi bi-tag"></i>
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">Categorías</p>
                <p className="text-2xl font-black text-yellow-700">3</p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button 
            onClick={() => { setActiveFilter("ACTIVOS"); setCurrentPage(1); }} 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "ACTIVOS" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Activos
          </button>
          <button 
            onClick={() => { setActiveFilter("INACTIVOS"); setCurrentPage(1); }} 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "INACTIVOS" ? "bg-white text-slate-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Inactivos
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <Table
            columns={columns}
            data={paginatedData as unknown as Item[]}
            emptyMessage="No hay proveedores para mostrar."
          />

          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold text-slate-800">{currentPage}</span> de <span className="font-bold text-slate-800">{totalPages || 1}</span>
            </p>
            <div className="join gap-2">
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="bi bi-arrow-left-short text-xl" /> Anterior
              </button>
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente <i className="bi bi-arrow-right-short text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}