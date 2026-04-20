import { useState } from "react";
import { usePurchases } from "../../hooks/usePurchases";

interface PurchaseItemState {
  productId: number | "";
  quantity: number;
  unitPrice: number;
}

export default function RegisterPurchase() {
  const { 
    registerPurchase, isSubmitting, isLoadingData, error, 
    successMessage, suppliers, paymentMethods, products 
  } = usePurchases();

  const [formData, setFormData] = useState({
    supplierId: "" as number | "",
    paymentMethodId: "" as number | "",
    invoiceNumber: "",
  });

  const [items, setItems] = useState<PurchaseItemState[]>([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);

  const totalAmount = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "invoiceNumber" ? value : Number(value),
    }));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItemState, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value === "" ? "" : Number(value) } : item
    ));
  };

  const addItem = () => setItems(prev => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      supplierId: Number(formData.supplierId),
      paymentMethodId: Number(formData.paymentMethodId),
      invoiceNumber: formData.invoiceNumber,
      items: items.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    };

    const success = await registerPurchase(payload);
    if (success) {
      setFormData({ supplierId: "", paymentMethodId: "", invoiceNumber: "" });
      setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
    }
  };

  if (isLoadingData) return (
    <div className="flex justify-center p-20"><i className="bi bi-arrow-repeat animate-spin text-4xl text-blue-600"></i></div>
  );

  const inputWithIconClass = "w-full bg-white border border-gray-300 text-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all";
  const standardInputClass = "w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
      {/* Alertas */}
      {successMessage && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
        <i className="bi bi-check-circle-fill"></i> {successMessage}
      </div>}
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill"></i> {error}
      </div>}

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i className="bi bi-file-earmark-text text-blue-600"></i> Datos de la Factura
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Proveedor</label>
            <div className="relative">
              <i className="bi bi-shop absolute left-3 top-3 text-gray-400"></i>
              <select name="supplierId" value={formData.supplierId} onChange={handleFormChange} required className={inputWithIconClass}>
                <option value="">Seleccione...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Método de Pago</label>
            <div className="relative">
              <i className="bi bi-credit-card absolute left-3 top-3 text-gray-400"></i>
              <select name="paymentMethodId" value={formData.paymentMethodId} onChange={handleFormChange} required className={inputWithIconClass}>
                <option value="">Seleccione...</option>
                {paymentMethods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">N° de Factura</label>
            <div className="relative">
              <i className="bi bi-receipt absolute left-3 top-3 text-gray-400"></i>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleFormChange} required placeholder="Ej: FAC-2024-001" className={inputWithIconClass} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="bi bi-box-seam text-blue-600"></i> Detalle de Productos
          </h2>
          <button type="button" onClick={addItem} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold text-sm flex items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i> Agregar Producto
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 group">
              <div className="flex-1 w-full">
                <select value={item.productId} onChange={e => handleItemChange(index, "productId", e.target.value)} required className={standardInputClass}>
                  <option value="">Seleccione producto...</option>
                  {products.map(p => <option key={p.id} value={p.id ?? ""}>{p.name}</option>)}
                </select>
              </div>
              <div className="w-full md:w-28">
                <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, "quantity", e.target.value)} required className={`${standardInputClass} text-center`} placeholder="Cant." />
              </div>
              <div className="w-full md:w-32 relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input type="number" step="0.01" min="0" value={item.unitPrice} onChange={e => handleItemChange(index, "unitPrice", e.target.value)} required className={`${standardInputClass} pl-7 text-right`} />
              </div>
              <div className="w-full md:w-32 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg px-4 py-2.5 text-sm text-right">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </div>
              <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30">
                <i className="bi bi-trash text-lg"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-end items-center gap-6">
        <div className="flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-xl border border-blue-100 w-full md:w-auto">
          <span className="text-blue-800 font-bold uppercase text-xs tracking-wider">Total a Pagar</span>
          <span className="text-3xl font-black text-blue-900">${totalAmount.toFixed(2)}</span>
        </div>
        <button type="submit" disabled={isSubmitting} className={`w-full md:w-64 py-4 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isSubmitting ? <i className="bi bi-arrow-repeat animate-spin"></i> : <><i className="bi bi-check2-circle"></i> Procesar Compra</>}
        </button>
      </div>
    </form>
  );
}