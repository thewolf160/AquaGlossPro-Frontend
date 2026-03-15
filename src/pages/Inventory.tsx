import { useState, useMemo } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import ActionButton from "../components/Modal/ActionButton";
import InventoryCards from "../components/inventory/InventoryCards";
import  AddProductModal from "../components/inventory/AddProductModal";

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
];

export default function Inventory() {
  const [items] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "TODOS" | "CRITICOS" | "AGOTADOS"
  >("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleOpenStockModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsStockModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
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
              <span className={`font-black mr-2 text-lg leading-none text-gray-800`}>
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
      render: (item: Item) => {
        const inItem = item as unknown as InventoryItem;
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleOpenStockModal(inItem)}
              className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 border-none min-h-0 h-9 px-3"
              title="Registrar Entrada/Salida"
            >
              <i className="bi bi-arrow-left-right font-bold"></i>
            </button>
            <button 
              onClick={() => handleOpenEditModal(inItem)}
              className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0"
              title="Editar Producto"
            >
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
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </HeaderPortal>
      
      {/* TARJETAS DE RESUMEN */}
      <InventoryCards stats={stats} />

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

      {/* MODAL 1: Agregar Producto */}
      <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />

      {/* MODAL 2: Entrada y Salida de Stock */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={handleCloseStockModal}
        title="Movimiento de Inventario"
        actions={<button className="btn bg-blue-600 text-white hover:bg-blue-700 border-none">Confirmar Operación</button>}
      >
        {selectedItem && (
          <form className="flex flex-col gap-5 pt-2">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Producto a modificar</p>
                <p className="font-black text-xl text-slate-800">{selectedItem.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Stock Actual</p>
                <p className="font-bold text-lg text-blue-600">{selectedItem.stock} <span className="text-sm font-medium">{selectedItem.unit}</span></p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="block text-sm font-medium text-slate-700">Tipo de movimiento:</label>
               <div className="flex gap-4">
                <label className="flex-1 border-2 flex items-center justify-between px-4 py-3 border-slate-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <i className="bi bi-box-arrow-in-right"></i>
                    </div>
                    <span className="text-green-700 font-bold">Entrada (+)</span>
                  </div>
                  <input type="radio" name="movementType" value="in" className="w-4 h-4 text-green-600 border-gray-300" defaultChecked />
                </label>

                <label className="flex-1 border-2 flex items-center justify-between px-4 py-3 border-slate-200 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <i className="bi bi-box-arrow-right"></i>
                    </div>
                    <span className="text-red-700 font-bold">Salida (-)</span>
                  </div>
                  <input type="radio" name="movementType" value="out" className="w-4 h-4 text-red-600 border-gray-300" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="quantity" label="Cantidad a mover:" type="number" placeholder={`Ej: 10`} />
              <Input name="reason" label="Motivo u observación:" type="text" placeholder="Ej: Compra a proveedor..." />
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: Editar Producto */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Producto"
        actions={<ActionButton type="edit" />}
      >
        {/* Usamos renderizado condicional. El form solo existe si hay un editingItem seleccionado */}
        {editingItem && (
          <form className="flex flex-col gap-3">
            <Input 
              name="name" 
              label="Nombre del Producto:" 
              type="text" 
              defaultValue={editingItem.name} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="edit_category" className="block text-sm font-medium text-slate-700">Categoría:</label>
                <select 
                  id="edit_category" 
                  name="category" 
                  defaultValue={editingItem.category} 
                  className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                >
                  <option value="" disabled>-- Selecciona una --</option>
                  <option value="Químicos">Químicos</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Venta">Artículos de Venta</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit_unit" className="block text-sm font-medium text-slate-700">Unidad de Medida:</label>
                <select 
                  id="edit_unit" 
                  name="unit" 
                  defaultValue={editingItem.unit} 
                  className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                >
                  <option value="" disabled>-- Selecciona una --</option>
                  <option value="Litros">Litros</option>
                  <option value="Galones">Galones</option>
                  <option value="Unidades">Unidades</option>
                  <option value="Paquetes">Paquetes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input 
                name="stock" 
                label="Stock Inicial:" 
                type="number" 
                defaultValue={editingItem.stock.toString()} 
              />
              <Input 
                name="minStock" 
                label="Stock Mínimo:" 
                type="number" 
                defaultValue={editingItem.minStock.toString()} 
              />
              <Input 
                name="price" 
                label="Precio Unitario:" 
                type="number" 
                defaultValue={editingItem.price.toString()} 
                icon={<i className="bi bi-currency-dollar"></i>} 
              />
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}