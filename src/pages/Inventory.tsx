import { useState, useMemo } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
}

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Champú Meguiar's Gold",
    category: "Químicos",
    stock: 12,
    minStock: 5,
    unit: "Galones",
    price: 25.0,
  },
  {
    id: 2,
    name: "Cera Líquida Rápida",
    category: "Químicos",
    stock: 3,
    minStock: 4,
    unit: "Litros",
    price: 15.0,
  },
  {
    id: 3,
    name: "Ambientador Pino",
    category: "Venta",
    stock: 50,
    minStock: 20,
    unit: "Unidades",
    price: 2.5,
  },
  {
    id: 4,
    name: "Paños de Microfibra",
    category: "Herramientas",
    stock: 8,
    minStock: 15,
    unit: "Paquetes",
    price: 10.0,
  },
  {
    id: 5,
    name: "Desengrasante Motor",
    category: "Químicos",
    stock: 0,
    minStock: 3,
    unit: "Galones",
    price: 18.0,
  },
  {
    id: 6,
    name: "Silicona para Tableros",
    category: "Químicos",
    stock: 7,
    minStock: 5,
    unit: "Litros",
    price: 12.0,
  },
  {
    id: 7,
    name: "Abrillantador de Llantas",
    category: "Químicos",
    stock: 2,
    minStock: 4,
    unit: "Galones",
    price: 22.0,
  },
];

export default function Inventory() {
  const [items] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "TODOS" | "CRITICOS" | "AGOTADOS"
  >("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const totalValue = items.reduce(
      (acc, item) => acc + item.stock * item.price,
      0,
    );
    const lowStock = items.filter(
      (i) => i.stock > 0 && i.stock <= i.minStock,
    ).length;
    const outOfStock = items.filter((i) => i.stock === 0).length;
    return { totalValue, lowStock, outOfStock, totalItems: items.length };
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items.filter(
      (i) =>
        i.name.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );

    if (activeFilter === "CRITICOS") {
      result = result.filter((i) => i.stock > 0 && i.stock <= i.minStock);
    } else if (activeFilter === "AGOTADOS") {
      result = result.filter((i) => i.stock === 0);
    }

    return result;
  }, [items, searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns = [
    {
      header: "Producto",
      key: "name",
      render: (item: Item) => {
        const inItem = item as unknown as InventoryItem;
        return (
          <div className="text-left">
            <div className="font-bold text-gray-800">{inItem.name}</div>
            <div className="text-xs text-gray-500">{inItem.category}</div>
          </div>
        );
      },
    },
    {
      header: "Stock",
      key: "stock",
      render: (item: Item) => {
        const inItem = item as unknown as InventoryItem;
        const isOutOfStock = inItem.stock === 0;
        const isLow = inItem.stock > 0 && inItem.stock <= inItem.minStock;

        let colorClass = "bg-green-600";
        if (isOutOfStock) colorClass = "bg-red-500";
        else if (isLow) colorClass = "bg-yellow-500";

        const fillPercentage = isOutOfStock
          ? 0
          : Math.min(100, (inItem.stock / (inItem.minStock * 2)) * 100);

        return (
          <div className="w-full max-w-35 mx-auto flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <span
                className={`font-black mr-2 text-lg leading-none text-gray-800`}
              >
                {inItem.stock}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {inItem.unit}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
            {isLow && (
              <span className="text-[10px] font-bold text-yellow-600 text-left uppercase">
                Reordenar Pronto
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] font-bold text-red-600 text-left uppercase">
                Agotado
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Minimo",
      key: "minStock",
      render: (item: Item) => {
        const inItem = item as unknown as InventoryItem;
        return (
          <span className="text-sm font-bold text-slate-800">
            {inItem.minStock}
          </span>
        );
      },
    },
    {
      header: "Valor total",
      key: "totalValue",
      render: (item: Item) => {
        const inItem = item as unknown as InventoryItem;
        const totalValue = inItem.stock * inItem.price;
        return (
          <span className="font-bold text-gray-900">
            ${totalValue.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      key: "actions",
      render: () => {
        return (
          <div className="flex justify-center gap-2">
            <button
              className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 border-none min-h-0 h-9 px-3"
              title="Registrar Entrada/Salida"
            >
              <i className="bi bi-arrow-left-right font-bold"></i>
            </button>
            <button className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0">
              <i className="bi bi-pencil-square"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeaderPortal>
        <HeaderSearch
         searchPlaceholder="Buscar producto..."
          buttonText="Agregar Producto"
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onAddClick={() => alert("Agregar nuevo producto")}></HeaderSearch>  
      </HeaderPortal>
      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center  gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="bi bi-box-seam"></i>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Productos</p>
            <p className="text-2xl font-black text-blue-800">
              {stats.totalItems}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">
              Capital invertido
            </p>
            <p className="text-2xl font-black text-green-900">
              ${stats.totalValue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div>
            <p className="text-sm text-yellow-700 font-medium">Stock Bajo</p>
            <p className="text-2xl font-black text-yellow-700">
              {stats.lowStock}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
            <i className="bi bi-x-circle"></i>
          </div>
          <div>
            <p className="text-sm text-red-700 font-medium">Agotados</p>
            <p className="text-2xl font-black text-red-700">
              {stats.outOfStock}
            </p>
          </div>
        </div>
      </div>

      {/* Controles y filtros */}

      {/* SECCIÓN 2: Controles y Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveFilter("TODOS");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === "TODOS" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Todos
            </button>
            <button
              onClick={() => {
                setActiveFilter("CRITICOS");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === "CRITICOS" ? "bg-white text-yellow-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Críticos
            </button>
            <button
              onClick={() => {
                setActiveFilter("AGOTADOS");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === "AGOTADOS" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Agotados
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <Table
            columns={columns as any}
            data={paginatedItems as unknown as Item[]}
            emptyMessage="No hay productos que coincidan con los filtros."
          />

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
