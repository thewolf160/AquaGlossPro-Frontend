import React, { useState, useMemo, useEffect } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import type { Product } from "../types/inventory.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import InventoryCards from "../components/inventory/InventoryCards";
import StockMovementModal from "../components/inventory/StockMovementModal";

import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import ActionButton from "../components/Modal/ActionButton";
import Alert from "../components/Alert";

// Hooks
import { useInventory } from "../hooks/useInventory";
import { useModals } from "../hooks/useModals";
import { InitialProduct, InitialNewProductForm } from "../types/inventory.types";
import api from "../config/api";

export default function Inventory() {
  const {
    productsData,
    isLoading,
    currentProduct,
    setCurrentProduct,
    editProductState,
    setEditProductState,
    handleEditChange,
    deleteProduct,
    newProductForm,
    setNewProductForm,
    handleChange,
    registerProduct,
    successMessage,
    setSuccessMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    editProduct,
    handleSearchChange,
    searchParameter,
    isSubmitting,
  } = useInventory();

  const { modals, toggleModal } = useModals();

  const [activeFilter, setActiveFilter] = useState<"TODOS" | "CRITICOS" | "AGOTADOS">("TODOS");
  
  const [categories, setCategories] = useState<{categoryId: number, name: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', {
          params: { active: "true", limit: "100" } 
        });
        
        const categoriesArray = response.data.data.data; 
        
        const productCategories = categoriesArray.filter((c: any) => c.type === 'P');
        setCategories(productCategories);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  const stats = useMemo(() => {
    if (!productsData.data || productsData.data.length === 0) {
      return { totalValue: 0, lowStock: 0, outOfStock: 0, totalItems: 0 };
    }

    const products = productsData.data as unknown as Product[];
    const totalValue = products.reduce((acc, item) => acc + (Number(item.currentStock) * Number(item.unitCostLiter)), 0);
    const lowStock = products.filter((i) => Number(i.currentStock) > 0 && Number(i.currentStock) <= Number(i.minStock)).length;
    const outOfStock = products.filter((i) => Number(i.currentStock) === 0).length;
    
    return { totalValue, lowStock, outOfStock, totalItems: productsData.totalProducts || 0 };
  }, [productsData]);

  const filteredItems = useMemo(() => {
    let result = productsData.data as unknown as Product[];
    if (activeFilter === "CRITICOS") {
      result = result.filter((i) => Number(i.currentStock) > 0 && Number(i.currentStock) <= Number(i.minStock));
    } else if (activeFilter === "AGOTADOS") {
      result = result.filter((i) => Number(i.currentStock) === 0);
    }
    return result;
  }, [productsData.data, activeFilter]);

  // Manejadores de Modales
  const handleOpenRegister = () => toggleModal("register", true);
  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewProductForm(InitialNewProductForm);
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerProduct();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Producto registrado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true);
    setEditProductState((prev) => ({ ...prev, ...(item as unknown as Product) }));
  };
  const handleCloseEdit = () => {
    toggleModal("edit", false);
    setEditProductState(InitialProduct);
  };

  const handleEditSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await editProduct();
    if (success) {
      handleCloseEdit();
      setSuccessMessage("Producto actualizado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenDelete = (item: Item) => {
    setCurrentProduct((prev) => ({ ...prev, ...(item as unknown as Product) }));
    toggleModal("delete", true);
  };
  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentProduct(InitialProduct);
  };

  const handleDelete = async () => {
    const success = await deleteProduct(String(currentProduct.id));
    if (success) handleCloseDelete();
  };

  const unitNames: Record<string, string> = {
    L: "Litros",
    G: "Galones",
    U: "Unidades"
  };

  const columns = [
    {
      header: "Producto",
      key: "name",
      mobile: true,
      render: (item: Item) => {
        const product = item as unknown as Product;
        return (
          <div className="text-left">
            <div className="font-bold text-gray-800">{product.name}</div>
            <div className="text-xs text-gray-500">{product.categoryName}</div>
          </div>
        );
      },
    },
    {
      header: "Stock",
      key: "currentStock",
      mobile: true,
      render: (item: Item) => {
        const product = item as unknown as Product;
        const stock = Number(product.currentStock);
        const minStock = Number(product.minStock);
        const isOutOfStock = stock === 0;
        const isLow = stock > 0 && stock <= minStock;

        let colorClass = "bg-green-600";
        if (isOutOfStock) colorClass = "bg-red-500";
        else if (isLow) colorClass = "bg-yellow-500";

        const fillPercentage = isOutOfStock || minStock === 0 ? 0 : Math.min(100, (stock / (minStock * 2)) * 100);

        return (
          <div className="w-full max-w-35 mx-auto flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <span className="font-black mr-2 text-lg leading-none text-gray-800">{stock}</span>
              <span className="text-xs font-medium text-gray-500">
  {unitNames[product.unitType] || product.unitType}
</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${colorClass} transition-all duration-500 ease-out rounded-full`} style={{ width: `${fillPercentage}%` }}></div>
            </div>
            {isLow && <span className="text-[10px] font-bold text-yellow-600 text-left uppercase">Reordenar Pronto</span>}
            {isOutOfStock && <span className="text-[10px] font-bold text-red-600 text-left uppercase">Agotado</span>}
          </div>
        );
      },
    },
    {
      header: "Minimo",
      key: "minStock",
      mobile: true,
      render: (item: Item) => <span className="text-sm font-bold text-slate-800">{(item as unknown as Product).minStock}</span>,
    },
    {
      header: "Valor total",
      key: "totalValue",
      mobile: false,
      render: (item: Item) => {
        const product = item as unknown as Product;
        const totalValue = Number(product.currentStock) * Number(product.unitCostLiter);
        return <span className="font-bold text-gray-900">${totalValue.toFixed(2)}</span>;
      },
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
      render: (item: Item) => {
        const product = item as unknown as Product;
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setCurrentProduct(product);
                toggleModal("stockMovement", true);
              }}
              className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 border-none min-h-0 h-9 px-3 cursor-pointer"
              title="Registrar Entrada/Salida"
            >
              <i className="bi bi-arrow-left-right font-bold"></i>
            </button>
            <button onClick={() => handleOpenEdit(item)} className="btn bg-sky-50 text-sky-600 hover:bg-sky-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer" title="Editar Producto">
              <i className="bi bi-pencil-square"></i>
            </button>
            <button onClick={() => handleOpenDelete(item)} className="btn bg-red-50 text-red-600 hover:bg-red-100 border-none min-h-0 h-9 w-9 p-0 cursor-pointer" title="Eliminar Producto">
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {successMessage && <Alert message={successMessage} />}
      
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar producto o categoría..."
          buttonText="Agregar Producto"
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>
      
      <InventoryCards stats={stats} />

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        {/* Pestañas de Filtro Rápido */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => { setActiveFilter("TODOS"); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "TODOS" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Todos</button>
            <button onClick={() => { setActiveFilter("CRITICOS"); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "CRITICOS" ? "bg-white text-yellow-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Críticos</button>
            <button onClick={() => { setActiveFilter("AGOTADOS"); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "AGOTADOS" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Agotados</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 relative min-h-75">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-b-xl">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          )}
          
          <Table
            columns={columns}
            data={filteredItems as unknown as Item[]}
            emptyMessage="No hay productos que coincidan con los criterios."
          />

          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
            </p>
            <div className="join gap-2">
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <i className="bi bi-arrow-left-short text-xl" /> Anterior
              </button>
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Siguiente <i className="bi bi-arrow-right-short text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registro de Nuevo Producto"
        actions={<ActionButton type="register" isLoading={isSubmitting} form="RegisterForm" />}
      >
        <form className="flex flex-col gap-3" onSubmit={handleRegister} id="RegisterForm">
          <Input name="name" label="Nombre del Producto:" type="text" onChange={handleChange} value={newProductForm.form.name} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">Categoría:</label>
              <select name="categoryId" onChange={handleChange} value={newProductForm.form.categoryId || ""} className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione...</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">Tipo de Unidad:</label>
              <select name="unitType" onChange={handleChange} value={newProductForm.form.unitType} className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione...</option>
                <option value="L">Litros (L)</option>
                <option value="G">Galones (G)</option>
                <option value="U">Unidades (U)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input name="unitCostLiter" label="Costo/Precio:" type="number" onChange={handleChange} value={String(newProductForm.form.unitCostLiter)} />
            <Input name="currentStock" label="Stock Inicial:" type="number" onChange={handleChange} value={String(newProductForm.form.currentStock)} />
            <Input name="minStock" label="Stock Mínimo:" type="number" onChange={handleChange} value={String(newProductForm.form.minStock)} />
          </div>
          
          <div className="flex justify-center items-center h-8">
            {newProductForm.error && <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">{newProductForm.errorMsg}</span>}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Producto"
        actions={<ActionButton type="edit" isLoading={isSubmitting} form="EditForm" />}
      >
        <form className="flex flex-col gap-3" onSubmit={handleEditSubmit} id="EditForm">
          <Input name="name" label="Nombre del Producto:" type="text" onChange={handleEditChange} value={editProductState.name} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">Categoría:</label>
              <select name="categoryId" onChange={handleEditChange} value={editProductState.categoryId || ""} className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione...</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">Tipo de Unidad:</label>
              <select name="unitType" onChange={handleEditChange} value={editProductState.unitType} className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Seleccione...</option>
                <option value="L">Litros (L)</option>
                <option value="G">Galones (G)</option>
                <option value="U">Unidades (U)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input name="unitCostLiter" label="Costo/Precio:" type="number" onChange={handleEditChange} value={String(editProductState.unitCostLiter)} />
            <Input name="currentStock" label="Stock Actual:" type="number" onChange={handleEditChange} value={String(editProductState.currentStock)} />
            <Input name="minStock" label="Stock Mínimo:" type="number" onChange={handleEditChange} value={String(editProductState.minStock)} />
          </div>
          
          <div className="flex justify-center items-center h-8">
            {editProductState.error && <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">{editProductState.errorMsg}</span>}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deleteText="Eliminar Producto"
        actions={<ActionButton type="delete" isLoading={isSubmitting} onClick={handleDelete} />}
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar el producto <span className="font-semibold text-slate-800">{currentProduct.name}</span>?
          </p>
        </div>
      </Modal>

      <StockMovementModal 
        isOpen={modals.stockMovement || false} 
        onClose={() => toggleModal("stockMovement", false)} 
        selectedItem={currentProduct as any} 
      />
    </div>
  );
}