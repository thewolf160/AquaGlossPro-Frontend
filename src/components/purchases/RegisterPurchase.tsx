import React, { useState, useEffect } from 'react';
import { usePurchases } from '../../hooks/usePurchases';
import type { PurchaseItemPayload } from '../../types/purchases.types';
import ActionButton from '../Modal/ActionButton';
import Alert from '../Alert';

const RegisterPurchase: React.FC = () => {
  const {
    suppliers,
    paymentMethods,
    products,
    registerPurchase,
    isSubmitting,
    isLoadingData,
    successMessage,
    setSuccessMessage,
    error,
    setError
  } = usePurchases();

  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [paymentMethodId, setPaymentMethodId] = useState<number | ''>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [items, setItems] = useState<PurchaseItemPayload[]>([]);
  
  const [currentItemProductId, setCurrentItemProductId] = useState<number | ''>('');
  const [currentItemQuantity, setCurrentItemQuantity] = useState<number | ''>('');
  const [currentItemPrice, setCurrentItemPrice] = useState<number | ''>('');

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        if (successMessage) setSuccessMessage(null);
        if (error) setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, setSuccessMessage, setError]);

  const handleAddItem = () => {
    if (currentItemProductId && currentItemQuantity && currentItemPrice) {
      const newItem: PurchaseItemPayload = {
        productId: Number(currentItemProductId),
        quantity: Number(currentItemQuantity),
        unitPrice: Number(currentItemPrice)
      };
      
      setItems([...items, newItem]);
      setCurrentItemProductId('');
      setCurrentItemQuantity('');
      setCurrentItemPrice('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierId || !paymentMethodId || !invoiceNumber || items.length === 0) {
      setError("Por favor, complete todos los campos obligatorios e incluya al menos un producto.");
      return;
    }

    const success = await registerPurchase({
      supplierId: Number(supplierId),
      paymentMethodId: Number(paymentMethodId),
      invoiceNumber,
      items
    });

    if (success) {
      setSupplierId('');
      setPaymentMethodId('');
      setInvoiceNumber('');
      setItems([]);
    }
  };

  const getProductName = (id: number) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : 'Producto desconocido';
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-gray-600 font-medium">Cargando datos necesarios para la compra...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nueva Compra</h2>

      {successMessage && <Alert message={successMessage} />}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <select 
              value={supplierId} 
              onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccione un proveedor...</option>
              {suppliers.map(s => (
                <option key={s.id ?? `s-${s.name}`} value={s.id ?? ""}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
            <select 
              value={paymentMethodId} 
              onChange={(e) => setPaymentMethodId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccione método de pago...</option>
              {paymentMethods.map(pm => (
                <option key={pm.id ?? `pm-${pm.name}`} value={pm.id ?? ""}>{pm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Factura</label>
            <input 
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: FAC-001"
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Productos</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <select 
                value={currentItemProductId} 
                onChange={(e) => setCurrentItemProductId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione producto...</option>
                {products.map(p => (
                  <option key={p.id ?? `p-${p.name}`} value={p.id ?? ""}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input 
                type="number"
                min="0.01" step="0.01"
                value={currentItemQuantity}
                onChange={(e) => setCurrentItemQuantity(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
              <input 
                type="number"
                min="0.01" step="0.01"
                value={currentItemPrice}
                onChange={(e) => setCurrentItemPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-4 flex justify-end mt-2">
              <button 
                type="button" 
                onClick={handleAddItem}
                disabled={!currentItemProductId || !currentItemQuantity || !currentItemPrice}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <i className="bi bi-plus-lg"></i> Agregar Producto
              </button>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProductName(item.productId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Eliminar producto"
                      >
                        <i className="bi bi-trash3-fill text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">Total:</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-right">
                    ${calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-200">
           <ActionButton 
            type="register" 
            isLoading={isSubmitting} 
          />
        </div>
      </form>
    </div>
  );
};

export default RegisterPurchase;