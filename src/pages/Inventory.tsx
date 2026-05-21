import React, { useState, useEffect } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import type { Product } from "../types/inventory.types";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import InventoryCards from "../components/inventory/InventoryCards";

import AddProductModal from "../components/inventory/AddProductModal";
import EditProductModal from "../components/inventory/EditProductModal";
import DeleteProductModal from "../components/inventory/DeleteProductModal";
import RestoreProductModal from "../components/inventory/RestoreClientModal";
import ViewProductModal from "../components/inventory/ViewProductModal"; 
import DecreaseStockModal from "../components/inventory/DecreaseStockModal";

import Alert from "../components/Alert";

import { useInventory } from "../hooks/useInventory";
import { useModals } from "../hooks/useModals";
import { InitialProduct, InitialNewProductForm, type InventoryCategory } from "../types/inventory.types";
import api from "../config/api";
import { hasPermission } from "../utils/checkPermissions.utils";

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
    inventoryTotals,
    decreaseStock,
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
    if (success) {
      handleCloseDelete();
      setSuccessMessage("Producto eliminado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenDetails = (item: Item) => {
    setCurrentProduct(item as unknown as Product);
    toggleModal("details", true);
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

  const handleOpenDecreaseStock = (item: Item) => {
    setCurrentProduct(item as unknown as Product);
    toggleModal("decreaseStock", true);
  };

  const handleDecreaseStockConfirm = async (payload: { items: { productId: number; stock: number; unitType: string }[] }) => {
    const success = await decreaseStock(payload);
    if (success) {
      setSuccessMessage("Stock decrementado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
  };

  const actionProps = activeFilter !== "INACTIVOS"
    ? {
        ...(hasPermission("PRODUCTS", "R")&&{onView: handleOpenDetails}),
        ...(hasPermission("PRODUCTS", "U") && {
          onEdit: handleOpenEdit,
          onDecreaseStock: handleOpenDecreaseStock
        }),
        ...(hasPermission("PRODUCTS", "D") && {onDelete: handleOpenDelete}),
      }
    : {
        ...(hasPermission("PRODUCTS", "R")&&{onView: handleOpenDetails}),
        ...(hasPermission("PRODUCTS", "U") && {onRestore: (item: Item) => handleOpenRestore(item as unknown as Product)}),
      };

  const columns = [
    {
      header: "Producto",
      key: "name",
      mobile: true,
      render: (item: Item) => {
        const product = item as unknown as Product;
        return (
          <div className="text-left flex flex-col max-w-45 sm:max-w-none">
            <span className="font-bold text-gray-800 truncate">{product.name}</span>
            <span className="text-xs text-gray-500 truncate">{product.categoryName}</span>
          </div>
        );
      },
    },
    {
      header: "Stock",
      key: "currentStock",
      mobile: false, 
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
          <div className="w-full min-w-25 max-w-35 mx-auto flex flex-col gap-1.5">
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
      mobile: false, 
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
    }
  ];

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar producto o categoría..."
          buttonText={hasPermission("PRODUCTS", "C") ? "Agregar Producto" : undefined}
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>
      
      <div className="flex flex-col gap-6">
        
        <InventoryCards stats={inventoryTotals} activeFilter={activeFilter} />

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center bg-gray-100 p-1 rounded-lg gap-1 w-full sm:w-auto">
              <button onClick={() => handleFilterChange("ACTIVOS")} className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "ACTIVOS" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Activos</button>
              <button onClick={() => handleFilterChange("CRITICOS")} className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "CRITICOS" ? "bg-white text-yellow-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Críticos</button>
              <button onClick={() => handleFilterChange("AGOTADOS")} className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "AGOTADOS" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Agotados</button>
              <button onClick={() => handleFilterChange("INACTIVOS")} className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeFilter === "INACTIVOS" ? "bg-white text-slate-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Inactivos</button>
            </div>
          </div>

          <section className="shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-white px-6 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-xl tracking-tight">
                Gestión de Inventario
              </h2>
            </div>
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center p-10">
                  <span className="loading loading-spinner loading-xl"></span>
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={productsData.data as unknown as Item[]}
                  emptyMessage="No hay productos que coincidan con los criterios."
                  {...actionProps} 
                />
              )}
            </div>
            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Página <span className="font-bold">{currentPage}</span> de{" "}
                <span className="font-bold">{totalPages}</span>
              </p>
              <div className="join gap-2">
                <button
                  className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <i className="bi bi-arrow-left-short text-xl" /> Anterior
                </button>
                <button
                  className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Siguiente <i className="bi bi-arrow-right-short text-xl" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

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

      <ViewProductModal
        isOpen={modals.details}
        onClose={() => toggleModal("details", false)}
        product={currentProduct}
      />

      <DecreaseStockModal
        isOpen={modals.decreaseStock || false}
        onClose={() => toggleModal("decreaseStock", false)}
        product={currentProduct}
        onDecrease={handleDecreaseStockConfirm}
        isLoading={isSubmitting}
      />

    </>
  );
}