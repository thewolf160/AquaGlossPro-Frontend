import React, { useState, useMemo, useEffect } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import type { Product } from "../types/inventory.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import InventoryCards from "../components/inventory/InventoryCards";
import StockMovementModal from "../components/inventory/StockMovementModal";

import AddProductModal from "../components/inventory/AddProductModal";
import EditProductModal from "../components/inventory/EditProductModal";
import DeleteProductModal from "../components/inventory/DeleteProductModal";
import RestoreProductModal from "../components/inventory/RestoreClientModal"; 

import Alert from "../components/Alert";

import { useInventory } from "../hooks/useInventory";
import { useModals } from "../hooks/useModals";
import { InitialProduct, InitialNewProductForm, type InventoryCategory } from "../types/inventory.types";
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
    activeFilter,
    handleFilterChange,
    restoreProduct,
  } = useInventory();

  const { modals, toggleModal } = useModals();

  const [categories, setCategories] = useState<{categoryId: number, name: string}[]>([]);

 useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', {
          params: { active: "true", limit: "100" } 
        });
        
        const categoriesArray: InventoryCategory[] = response.data.data.data; 
        
        const productCategories = categoriesArray.filter((c) => c.type === 'P');
        
        setCategories(productCategories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const stats = useMemo(() => {
    if (!productsData.data || productsData.data.length === 0) {
      return { totalValue: 0, lowStock: 0, outOfStock: 0, totalItems: productsData.totalProducts || 0 };
    }

    const products = productsData.data as unknown as Product[];
    const totalValue = products.reduce((acc, item) => acc + (Number(item.currentStock) * Number(item.unitCostLiter)), 0);
    
    let lowStock = 0;
    let outOfStock = 0;

    if (activeFilter !== "INACTIVOS") {
      lowStock = products.filter((i) => Number(i.currentStock) > 0 && Number(i.currentStock) <= Number(i.minStock)).length;
      outOfStock = products.filter((i) => Number(i.currentStock) === 0).length;
    }
    
    return { totalValue, lowStock, outOfStock, totalItems: productsData.totalProducts || 0 };
  }, [productsData, activeFilter]);

  const filteredItems = useMemo(() => {
    let result = productsData.data as unknown as Product[];
    if (activeFilter === "CRITICOS") {
      result = result.filter((i) => Number(i.currentStock) > 0 && Number(i.currentStock) <= Number(i.minStock));
    } else if (activeFilter === "AGOTADOS") {
      result = result.filter((i) => Number(i.currentStock) === 0);
    }
    return result;
  }, [productsData.data, activeFilter]);

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

  const handleOpenRestore = (product: Product) => {
    setCurrentProduct(product);
    toggleModal("restore", true);
  };

  const handleRestoreConfirm = async (id: string) => {
    const success = await restoreProduct(id);
    if (success) {
      toggleModal("restore", false);
      setSuccessMessage("Producto reactivado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
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
    ...(activeFilter !== "INACTIVOS" ? [
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
                className="btn bg-blue-50 text-blue-600 h-9 px-3 cursor-pointer"
              >
                <i className="bi bi-arrow-left-right"></i>
              </button>
              <button onClick={() => handleOpenEdit(item)} className="btn bg-sky-50 text-sky-600 h-9 w-9 p-0 cursor-pointer">
                <i className="bi bi-pencil-square"></i>
              </button>
              <button onClick={() => handleOpenDelete(item)} className="btn bg-red-50 text-red-600 h-9 w-9 p-0 cursor-pointer">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          );
        }
      }
    ] : [
      {
        header: "Acciones",
        key: "restore",
        mobile: true,
        render: (item: Item) => (
          <button onClick={() => handleOpenRestore(item as unknown as Product)} className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer mx-auto">
            <i className="bi bi-arrow-clockwise"></i> Reactivar
          </button>
        )
      }
    ])
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
      
<InventoryCards stats={stats} activeFilter={activeFilter} />

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => handleFilterChange("ACTIVOS")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "ACTIVOS" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Activos</button>
            <button onClick={() => handleFilterChange("CRITICOS")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "CRITICOS" ? "bg-white text-yellow-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Críticos</button>
            <button onClick={() => handleFilterChange("AGOTADOS")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "AGOTADOS" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Agotados</button>
            <button onClick={() => handleFilterChange("INACTIVOS")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "INACTIVOS" ? "bg-white text-slate-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Inactivos</button>
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

      <AddProductModal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        formState={newProductForm}
        categories={categories}
        onChange={handleChange}
        onSubmit={handleRegister}
        isLoading={isSubmitting}
      />

      <EditProductModal
  isOpen={modals.edit}
  onClose={handleCloseEdit}
  editingProduct={editProductState}
  categories={categories}
  onChange={handleEditChange}  
  onSubmit={handleEditSubmit}  
  isLoading={isSubmitting}
/>

      <DeleteProductModal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deletingProduct={currentProduct}
        onDelete={handleDelete}
        isLoading={isSubmitting}
      />

      <RestoreProductModal
        isOpen={modals.restore || false}
        onClose={() => toggleModal("restore", false)}
        restoringProduct={currentProduct}
        onRestore={handleRestoreConfirm}
        isLoading={isSubmitting}
      />

      <StockMovementModal 
        isOpen={modals.stockMovement || false} 
        onClose={() => toggleModal("stockMovement", false)} 
        selectedItem={currentProduct} 
      />
    </div>
  );
}